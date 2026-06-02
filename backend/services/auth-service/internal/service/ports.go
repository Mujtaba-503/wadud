package service

import (
	"context"
	"time"

	"github.com/wadud/backend/services/auth-service/internal/domain"
)

// Repo is the persistence port used by the auth service.
type Repo interface {
	CreateUserWithCredential(ctx context.Context, u domain.User, passwordHash string) (domain.User, error)
	EmailExists(ctx context.Context, email string) (bool, error)
	GetUserByEmail(ctx context.Context, email string) (domain.User, string, error)
	GetUserByID(ctx context.Context, id string) (domain.User, error)
	InsertRefreshToken(ctx context.Context, t domain.RefreshToken) (string, error)
	GetRefreshByHash(ctx context.Context, hash string) (domain.RefreshToken, error)
	RotateRefreshToken(ctx context.Context, oldID, newHash string, newToken domain.RefreshToken) (string, error)
	RevokeSession(ctx context.Context, sessionID string) error
	UpdatePassword(ctx context.Context, userID, hash string) error
	MarkVerified(ctx context.Context, userID string) error
	InsertAudit(ctx context.Context, a domain.AuditLog) error
}

// SessionStore is the Redis port for sessions/OTP/rate-limiting.
type SessionStore interface {
	PutSession(ctx context.Context, sid, userID string, ttl time.Duration) error
	SessionValid(ctx context.Context, sid string) (bool, error)
	DeleteSession(ctx context.Context, sid string) error
	PutOTP(ctx context.Context, identifier, typ, codeHash string, ttl time.Duration) error
	GetOTP(ctx context.Context, identifier, typ string) (string, error)
	DeleteOTP(ctx context.Context, identifier, typ string) error
}

// Publisher is the event port (NATS).
type Publisher interface {
	Publish(subject string, payload any) error
}
