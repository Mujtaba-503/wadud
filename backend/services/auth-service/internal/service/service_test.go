package service

import (
	"context"
	"io"
	"log/slog"
	"sync"
	"testing"
	"time"

	"github.com/wadud/backend/services/auth-service/internal/domain"
	"github.com/wadud/backend/services/auth-service/internal/dto"
	"github.com/wadud/backend/services/auth-service/internal/repository"
	"github.com/wadud/backend/shared/auth"
)

// --- in-memory fakes ---

type fakeRepo struct {
	mu      sync.Mutex
	users   map[string]domain.User // by id
	byEmail map[string]string      // email -> id
	hashes  map[string]string      // id -> password hash
	refresh map[string]domain.RefreshToken
	seq     int
	audits  int
}

func newFakeRepo() *fakeRepo {
	return &fakeRepo{
		users:   map[string]domain.User{},
		byEmail: map[string]string{},
		hashes:  map[string]string{},
		refresh: map[string]domain.RefreshToken{},
	}
}

func (f *fakeRepo) id() string {
	f.seq++
	return time.Now().Format("150405.000000") + "-" + itoa(f.seq)
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	digits := ""
	for n > 0 {
		digits = string(rune('0'+n%10)) + digits
		n /= 10
	}
	return digits
}

func (f *fakeRepo) CreateUserWithCredential(_ context.Context, u domain.User, hash string) (domain.User, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	u.ID = f.id()
	u.IsActive = true
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	f.users[u.ID] = u
	f.byEmail[u.Email] = u.ID
	f.hashes[u.ID] = hash
	return u, nil
}

func (f *fakeRepo) EmailExists(_ context.Context, email string) (bool, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	_, ok := f.byEmail[email]
	return ok, nil
}

func (f *fakeRepo) GetUserByEmail(_ context.Context, email string) (domain.User, string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	id, ok := f.byEmail[email]
	if !ok {
		return domain.User{}, "", repository.ErrNotFound
	}
	return f.users[id], f.hashes[id], nil
}

func (f *fakeRepo) GetUserByID(_ context.Context, id string) (domain.User, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	u, ok := f.users[id]
	if !ok {
		return domain.User{}, repository.ErrNotFound
	}
	return u, nil
}

func (f *fakeRepo) InsertRefreshToken(_ context.Context, t domain.RefreshToken) (string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	t.ID = f.id()
	t.CreatedAt = time.Now()
	f.refresh[t.TokenHash] = t
	return t.ID, nil
}

func (f *fakeRepo) GetRefreshByHash(_ context.Context, hash string) (domain.RefreshToken, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	t, ok := f.refresh[hash]
	if !ok {
		return domain.RefreshToken{}, repository.ErrNotFound
	}
	return t, nil
}

func (f *fakeRepo) RotateRefreshToken(_ context.Context, oldID, newHash string, nt domain.RefreshToken) (string, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	nt.ID = f.id()
	nt.TokenHash = newHash
	nt.CreatedAt = time.Now()
	f.refresh[newHash] = nt
	for h, t := range f.refresh {
		if t.ID == oldID {
			now := time.Now()
			t.RevokedAt = &now
			t.ReplacedBy = &nt.ID
			f.refresh[h] = t
		}
	}
	return nt.ID, nil
}

func (f *fakeRepo) RevokeSession(_ context.Context, sessionID string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	for h, t := range f.refresh {
		if t.SessionID == sessionID && t.RevokedAt == nil {
			now := time.Now()
			t.RevokedAt = &now
			f.refresh[h] = t
		}
	}
	return nil
}

func (f *fakeRepo) UpdatePassword(_ context.Context, userID, hash string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.hashes[userID] = hash
	return nil
}

func (f *fakeRepo) MarkVerified(_ context.Context, userID string) error { return nil }

func (f *fakeRepo) InsertAudit(_ context.Context, _ domain.AuditLog) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.audits++
	return nil
}

type fakeStore struct {
	mu       sync.Mutex
	sessions map[string]string
	otps     map[string]string
}

func newFakeStore() *fakeStore {
	return &fakeStore{sessions: map[string]string{}, otps: map[string]string{}}
}

func (s *fakeStore) PutSession(_ context.Context, sid, userID string, _ time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessions[sid] = userID
	return nil
}
func (s *fakeStore) SessionValid(_ context.Context, sid string) (bool, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.sessions[sid]
	return ok, nil
}
func (s *fakeStore) DeleteSession(_ context.Context, sid string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.sessions, sid)
	return nil
}
func (s *fakeStore) PutOTP(_ context.Context, id, typ, hash string, _ time.Duration) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.otps[typ+":"+id] = hash
	return nil
}
func (s *fakeStore) GetOTP(_ context.Context, id, typ string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.otps[typ+":"+id], nil
}
func (s *fakeStore) DeleteOTP(_ context.Context, id, typ string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.otps, typ+":"+id)
	return nil
}

type fakePub struct{ count int }

func (p *fakePub) Publish(string, any) error { p.count++; return nil }

func newTestService() (*Service, *fakeRepo, *fakeStore, *fakePub) {
	repo := newFakeRepo()
	store := newFakeStore()
	pub := &fakePub{}
	jwt := auth.NewJWTManager("test-secret", "wadud-test", 15*time.Minute)
	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	svc := New(repo, store, pub, jwt, log, 7*24*time.Hour, 5*time.Minute)
	return svc, repo, store, pub
}

func validSignup() dto.SignupRequest {
	return dto.SignupRequest{
		FirstName: "Ada", LastName: "Lovelace", Email: "ada@example.com",
		Phone: "+10000000000", Password: "supersecret", Role: "patient",
		Country: "PK", Language: "en",
	}
}

// --- tests ---

func TestSignupIssuesSessionAndEmitsEvent(t *testing.T) {
	svc, _, _, pub := newTestService()
	sess, err := svc.Signup(context.Background(), validSignup(), AuditMeta{})
	if err != nil {
		t.Fatalf("signup: %v", err)
	}
	if sess.Tokens.AccessToken == "" || sess.Tokens.RefreshToken == "" {
		t.Fatal("expected tokens to be issued")
	}
	if sess.User.ID == "" || sess.Role != "patient" {
		t.Fatalf("unexpected session user: %+v", sess.User)
	}
	if pub.count != 1 {
		t.Fatalf("expected 1 UserRegistered event, got %d", pub.count)
	}
}

func TestSignupDuplicateEmail(t *testing.T) {
	svc, _, _, _ := newTestService()
	_, _ = svc.Signup(context.Background(), validSignup(), AuditMeta{})
	_, err := svc.Signup(context.Background(), validSignup(), AuditMeta{})
	if err != ErrEmailTaken {
		t.Fatalf("expected ErrEmailTaken, got %v", err)
	}
}

func TestSignupValidation(t *testing.T) {
	svc, _, _, _ := newTestService()
	req := validSignup()
	req.Email = "not-an-email"
	req.Password = "short"
	_, err := svc.Signup(context.Background(), req, AuditMeta{})
	var ve *ValidationError
	if err == nil {
		t.Fatal("expected validation error")
	}
	if !asValidation(err, &ve) {
		t.Fatalf("expected *ValidationError, got %T", err)
	}
	if len(ve.Fields["email"]) == 0 || len(ve.Fields["password"]) == 0 {
		t.Fatalf("expected field errors, got %+v", ve.Fields)
	}
}

func TestLoginSuccessAndFailure(t *testing.T) {
	svc, _, _, _ := newTestService()
	_, _ = svc.Signup(context.Background(), validSignup(), AuditMeta{})

	_, err := svc.Login(context.Background(), dto.LoginRequest{Email: "ada@example.com", Password: "supersecret"}, AuditMeta{})
	if err != nil {
		t.Fatalf("login should succeed: %v", err)
	}
	_, err = svc.Login(context.Background(), dto.LoginRequest{Email: "ada@example.com", Password: "wrong"}, AuditMeta{})
	if err != ErrInvalidCreds {
		t.Fatalf("expected ErrInvalidCreds, got %v", err)
	}
	_, err = svc.Login(context.Background(), dto.LoginRequest{Email: "nobody@example.com", Password: "x"}, AuditMeta{})
	if err != ErrInvalidCreds {
		t.Fatalf("expected ErrInvalidCreds for unknown user, got %v", err)
	}
}

func TestRefreshRotationAndReuseDetection(t *testing.T) {
	svc, _, _, _ := newTestService()
	sess, _ := svc.Signup(context.Background(), validSignup(), AuditMeta{})
	original := sess.Tokens.RefreshToken

	rotated, err := svc.Refresh(context.Background(), original, AuditMeta{})
	if err != nil {
		t.Fatalf("refresh: %v", err)
	}
	if rotated.RefreshToken == original {
		t.Fatal("refresh token should rotate")
	}
	if rotated.AccessToken == "" {
		t.Fatal("expected new access token")
	}

	// Reusing the original (now revoked) token must be detected.
	_, err = svc.Refresh(context.Background(), original, AuditMeta{})
	if err != ErrTokenReuse {
		t.Fatalf("expected ErrTokenReuse, got %v", err)
	}

	// And the reuse should have revoked the whole family, so the rotated token
	// is now invalid too.
	_, err = svc.Refresh(context.Background(), rotated.RefreshToken, AuditMeta{})
	if err != ErrTokenReuse && err != ErrTokenInvalid {
		t.Fatalf("expected family revocation, got %v", err)
	}
}

func TestLogoutRevokesSession(t *testing.T) {
	svc, _, store, _ := newTestService()
	sess, _ := svc.Signup(context.Background(), validSignup(), AuditMeta{})
	if err := svc.Logout(context.Background(), sess.Tokens.RefreshToken, AuditMeta{}); err != nil {
		t.Fatalf("logout: %v", err)
	}
	if len(store.sessions) != 0 {
		t.Fatalf("expected session removed, got %d", len(store.sessions))
	}
	_, err := svc.Refresh(context.Background(), sess.Tokens.RefreshToken, AuditMeta{})
	if err == nil {
		t.Fatal("refresh after logout must fail")
	}
}

func TestForgotAndResetPassword(t *testing.T) {
	svc, _, _, _ := newTestService()
	_, _ = svc.Signup(context.Background(), validSignup(), AuditMeta{})

	code, err := svc.ForgotPassword(context.Background(), "ada@example.com", AuditMeta{})
	if err != nil || code == "" {
		t.Fatalf("forgot: code=%q err=%v", code, err)
	}
	// Wrong code rejected.
	if err := svc.ResetPassword(context.Background(), "ada@example.com:000000", "newpassword1", AuditMeta{}); err == nil {
		t.Fatal("expected reset to fail with wrong code")
	}
	// Correct code accepted.
	if err := svc.ResetPassword(context.Background(), "ada@example.com:"+code, "newpassword1", AuditMeta{}); err != nil {
		t.Fatalf("reset: %v", err)
	}
	// New password works.
	if _, err := svc.Login(context.Background(), dto.LoginRequest{Email: "ada@example.com", Password: "newpassword1"}, AuditMeta{}); err != nil {
		t.Fatalf("login with new password: %v", err)
	}
}

func TestForgotPasswordUnknownEmailNoLeak(t *testing.T) {
	svc, _, _, _ := newTestService()
	code, err := svc.ForgotPassword(context.Background(), "ghost@example.com", AuditMeta{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if code != "" {
		t.Fatal("must not issue a code for unknown email")
	}
}

func asValidation(err error, target **ValidationError) bool {
	if ve, ok := err.(*ValidationError); ok {
		*target = ve
		return true
	}
	return false
}
