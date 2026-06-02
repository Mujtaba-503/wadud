// Package service implements the auth-service business logic.
package service

import (
	"context"
	"errors"
	"log/slog"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/wadud/backend/services/auth-service/internal/domain"
	"github.com/wadud/backend/services/auth-service/internal/dto"
	"github.com/wadud/backend/services/auth-service/internal/repository"
	"github.com/wadud/backend/shared/auth"
	"github.com/wadud/backend/shared/events"
)

// Business errors surfaced to the handler layer.
var (
	ErrEmailTaken   = errors.New("email already registered")
	ErrInvalidCreds = errors.New("invalid credentials")
	ErrInactive     = errors.New("account inactive")
	ErrTokenInvalid = errors.New("refresh token invalid")
	ErrTokenReuse   = errors.New("refresh token reuse detected")
	ErrOTPInvalid   = errors.New("otp invalid or expired")
	ErrResetInvalid = errors.New("reset token invalid or expired")
	ErrValidation   = errors.New("validation error")
)

// Service holds dependencies for auth operations.
type Service struct {
	repo       Repo
	sessions   SessionStore
	pub        Publisher
	jwt        *auth.JWTManager
	log        *slog.Logger
	refreshTTL time.Duration
	otpTTL     time.Duration
}

// New constructs a Service.
func New(repo Repo, sessions SessionStore, pub Publisher, jwt *auth.JWTManager, log *slog.Logger, refreshTTL, otpTTL time.Duration) *Service {
	return &Service{repo: repo, sessions: sessions, pub: pub, jwt: jwt, log: log, refreshTTL: refreshTTL, otpTTL: otpTTL}
}

// AuditMeta carries request metadata for audit logging.
type AuditMeta struct {
	IP        string
	UserAgent string
}

// Signup registers a new user and returns an authenticated session.
func (s *Service) Signup(ctx context.Context, req dto.SignupRequest, am AuditMeta) (dto.Session, error) {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if err := validateSignup(req); err != nil {
		return dto.Session{}, err
	}
	exists, err := s.repo.EmailExists(ctx, req.Email)
	if err != nil {
		return dto.Session{}, err
	}
	if exists {
		return dto.Session{}, ErrEmailTaken
	}
	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		return dto.Session{}, err
	}
	role := req.Role
	if role == "" {
		role = domain.RolePatient
	}
	u, err := s.repo.CreateUserWithCredential(ctx, domain.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Phone:     req.Phone,
		Role:      role,
		Country:   orDefault(req.Country, "PK"),
		Language:  orDefault(req.Language, "en"),
	}, hash)
	if err != nil {
		return dto.Session{}, err
	}

	s.audit(ctx, &u.ID, "signup", am)
	_ = s.pub.Publish(events.SubjectUserRegistered, events.UserRegistered{
		UserID: u.ID, Role: u.Role, Email: u.Email, FirstName: u.FirstName, OccurredAt: time.Now(),
	})

	return s.issueSession(ctx, u)
}

// Login authenticates a user and returns a session.
func (s *Service) Login(ctx context.Context, req dto.LoginRequest, am AuditMeta) (dto.Session, error) {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	u, hash, err := s.repo.GetUserByEmail(ctx, req.Email)
	if errors.Is(err, repository.ErrNotFound) {
		s.audit(ctx, nil, "failed_login", am)
		return dto.Session{}, ErrInvalidCreds
	}
	if err != nil {
		return dto.Session{}, err
	}
	if !auth.CheckPassword(hash, req.Password) {
		s.audit(ctx, &u.ID, "failed_login", am)
		return dto.Session{}, ErrInvalidCreds
	}
	if !u.IsActive {
		return dto.Session{}, ErrInactive
	}
	s.audit(ctx, &u.ID, "login", am)
	return s.issueSession(ctx, u)
}

// Refresh rotates a refresh token and returns new tokens. Detects reuse of an
// already-rotated token and revokes the whole session family.
func (s *Service) Refresh(ctx context.Context, refreshToken string, am AuditMeta) (dto.Tokens, error) {
	if refreshToken == "" {
		return dto.Tokens{}, ErrTokenInvalid
	}
	rec, err := s.repo.GetRefreshByHash(ctx, hashToken(refreshToken))
	if errors.Is(err, repository.ErrNotFound) {
		return dto.Tokens{}, ErrTokenInvalid
	}
	if err != nil {
		return dto.Tokens{}, err
	}
	if rec.RevokedAt != nil {
		// Token was already rotated/revoked → reuse. Kill the session family.
		_ = s.repo.RevokeSession(ctx, rec.SessionID)
		_ = s.sessions.DeleteSession(ctx, rec.SessionID)
		s.audit(ctx, &rec.UserID, "token_reuse", am)
		return dto.Tokens{}, ErrTokenReuse
	}
	if time.Now().After(rec.ExpiresAt) {
		return dto.Tokens{}, ErrTokenInvalid
	}

	u, err := s.repo.GetUserByID(ctx, rec.UserID)
	if err != nil {
		return dto.Tokens{}, err
	}

	newRefresh, err := randomToken(32)
	if err != nil {
		return dto.Tokens{}, err
	}
	_, err = s.repo.RotateRefreshToken(ctx, rec.ID, hashToken(newRefresh), domain.RefreshToken{
		UserID:    rec.UserID,
		SessionID: rec.SessionID,
		ExpiresAt: time.Now().Add(s.refreshTTL),
	})
	if err != nil {
		return dto.Tokens{}, err
	}
	access, expiresAt, err := s.jwt.Generate(u.ID, u.Role, u.Email, rec.SessionID)
	if err != nil {
		return dto.Tokens{}, err
	}
	// Refresh the session TTL in Redis.
	_ = s.sessions.PutSession(ctx, rec.SessionID, u.ID, s.refreshTTL)
	return dto.Tokens{AccessToken: access, RefreshToken: newRefresh, ExpiresAt: expiresAt.UTC().Format(time.RFC3339)}, nil
}

// Logout revokes the session associated with the given refresh token.
func (s *Service) Logout(ctx context.Context, refreshToken string, am AuditMeta) error {
	if refreshToken == "" {
		return nil
	}
	rec, err := s.repo.GetRefreshByHash(ctx, hashToken(refreshToken))
	if errors.Is(err, repository.ErrNotFound) {
		return nil
	}
	if err != nil {
		return err
	}
	_ = s.repo.RevokeSession(ctx, rec.SessionID)
	_ = s.sessions.DeleteSession(ctx, rec.SessionID)
	s.audit(ctx, &rec.UserID, "logout", am)
	return nil
}

// Me returns the user for an authenticated id.
func (s *Service) Me(ctx context.Context, userID string) (domain.User, error) {
	return s.repo.GetUserByID(ctx, userID)
}

// ForgotPassword issues a reset OTP (stored hashed in Redis). The code is
// returned for dev/testing when no delivery channel is configured.
func (s *Service) ForgotPassword(ctx context.Context, email string, am AuditMeta) (devCode string, err error) {
	email = strings.ToLower(strings.TrimSpace(email))
	u, _, err := s.repo.GetUserByEmail(ctx, email)
	if errors.Is(err, repository.ErrNotFound) {
		// Do not reveal whether the email exists.
		return "", nil
	}
	if err != nil {
		return "", err
	}
	code, err := randomOTP(6)
	if err != nil {
		return "", err
	}
	if err := s.sessions.PutOTP(ctx, email, domain.OTPPasswordReset, hashToken(code), s.otpTTL); err != nil {
		return "", err
	}
	s.audit(ctx, &u.ID, "password_reset_requested", am)
	return code, nil
}

// ResetPassword verifies the reset code (token = "email:code") and sets a new password.
func (s *Service) ResetPassword(ctx context.Context, token, newPassword string, am AuditMeta) error {
	parts := strings.SplitN(token, ":", 2)
	if len(parts) != 2 {
		return ErrResetInvalid
	}
	email := strings.ToLower(strings.TrimSpace(parts[0]))
	code := parts[1]
	if len(newPassword) < 8 {
		return ErrValidation
	}
	stored, err := s.sessions.GetOTP(ctx, email, domain.OTPPasswordReset)
	if err != nil || stored == "" || stored != hashToken(code) {
		return ErrResetInvalid
	}
	u, _, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return ErrResetInvalid
	}
	hash, err := auth.HashPassword(newPassword)
	if err != nil {
		return err
	}
	if err := s.repo.UpdatePassword(ctx, u.ID, hash); err != nil {
		return err
	}
	_ = s.sessions.DeleteOTP(ctx, email, domain.OTPPasswordReset)
	// Revoke all sessions on password change is handled per-session; audit it.
	s.audit(ctx, &u.ID, "password_reset", am)
	return nil
}

// VerifyOTP validates a generic OTP for an identifier (phone) and type.
func (s *Service) VerifyOTP(ctx context.Context, req dto.VerifyOTPRequest) error {
	stored, err := s.sessions.GetOTP(ctx, req.Phone, req.Type)
	if err != nil || stored == "" || stored != hashToken(req.Code) {
		return ErrOTPInvalid
	}
	_ = s.sessions.DeleteOTP(ctx, req.Phone, req.Type)
	return nil
}

// --- helpers ---

func (s *Service) issueSession(ctx context.Context, u domain.User) (dto.Session, error) {
	sessionID := uuid.NewString()
	access, expiresAt, err := s.jwt.Generate(u.ID, u.Role, u.Email, sessionID)
	if err != nil {
		return dto.Session{}, err
	}
	refresh, err := randomToken(32)
	if err != nil {
		return dto.Session{}, err
	}
	if _, err := s.repo.InsertRefreshToken(ctx, domain.RefreshToken{
		UserID:    u.ID,
		SessionID: sessionID,
		TokenHash: hashToken(refresh),
		ExpiresAt: time.Now().Add(s.refreshTTL),
	}); err != nil {
		return dto.Session{}, err
	}
	if err := s.sessions.PutSession(ctx, sessionID, u.ID, s.refreshTTL); err != nil {
		return dto.Session{}, err
	}
	return dto.Session{
		User: u,
		Role: u.Role,
		Tokens: dto.Tokens{
			AccessToken:  access,
			RefreshToken: refresh,
			ExpiresAt:    expiresAt.UTC().Format(time.RFC3339),
		},
	}, nil
}

func (s *Service) audit(ctx context.Context, userID *string, action string, am AuditMeta) {
	if err := s.repo.InsertAudit(ctx, domain.AuditLog{
		UserID:    userID,
		Action:    action,
		IP:        am.IP,
		UserAgent: am.UserAgent,
	}); err != nil {
		s.log.WarnContext(ctx, "audit insert failed", "action", action, "error", err)
	}
}

func orDefault(v, def string) string {
	if strings.TrimSpace(v) == "" {
		return def
	}
	return v
}
