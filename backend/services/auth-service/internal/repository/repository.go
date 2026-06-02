// Package repository implements PostgreSQL persistence for the auth-service.
package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/wadud/backend/services/auth-service/internal/domain"
)

// ErrNotFound is returned when a row does not exist.
var ErrNotFound = errors.New("not found")

// Repository wraps a pgx pool.
type Repository struct {
	pool *pgxpool.Pool
}

// New constructs a Repository.
func New(pool *pgxpool.Pool) *Repository { return &Repository{pool: pool} }

// CreateUserWithCredential inserts a user + bcrypt credential in one tx.
func (r *Repository) CreateUserWithCredential(ctx context.Context, u domain.User, passwordHash string) (domain.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return domain.User{}, err
	}
	defer tx.Rollback(ctx)

	var out domain.User
	err = tx.QueryRow(ctx, `
		INSERT INTO users (first_name,last_name,email,phone,role,country,language)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING id,first_name,last_name,email,phone,avatar,role,is_verified,is_active,country,language,created_at,updated_at`,
		u.FirstName, u.LastName, u.Email, u.Phone, u.Role, u.Country, u.Language,
	).Scan(&out.ID, &out.FirstName, &out.LastName, &out.Email, &out.Phone, &out.Avatar,
		&out.Role, &out.IsVerified, &out.IsActive, &out.Country, &out.Language, &out.CreatedAt, &out.UpdatedAt)
	if err != nil {
		return domain.User{}, err
	}
	if _, err := tx.Exec(ctx, `INSERT INTO credentials (user_id,password_hash) VALUES ($1,$2)`, out.ID, passwordHash); err != nil {
		return domain.User{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.User{}, err
	}
	return out, nil
}

// EmailExists reports whether an email is already registered.
func (r *Repository) EmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`, email).Scan(&exists)
	return exists, err
}

// GetUserByEmail returns a user and its password hash by email.
func (r *Repository) GetUserByEmail(ctx context.Context, email string) (domain.User, string, error) {
	var u domain.User
	var hash string
	err := r.pool.QueryRow(ctx, `
		SELECT u.id,u.first_name,u.last_name,u.email,u.phone,u.avatar,u.role,u.is_verified,u.is_active,u.country,u.language,u.created_at,u.updated_at,c.password_hash
		FROM users u JOIN credentials c ON c.user_id=u.id
		WHERE u.email=$1`, email,
	).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Phone, &u.Avatar, &u.Role,
		&u.IsVerified, &u.IsActive, &u.Country, &u.Language, &u.CreatedAt, &u.UpdatedAt, &hash)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.User{}, "", ErrNotFound
	}
	return u, hash, err
}

// GetUserByID returns a user by id.
func (r *Repository) GetUserByID(ctx context.Context, id string) (domain.User, error) {
	var u domain.User
	err := r.pool.QueryRow(ctx, `
		SELECT id,first_name,last_name,email,phone,avatar,role,is_verified,is_active,country,language,created_at,updated_at
		FROM users WHERE id=$1`, id,
	).Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Phone, &u.Avatar, &u.Role,
		&u.IsVerified, &u.IsActive, &u.Country, &u.Language, &u.CreatedAt, &u.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.User{}, ErrNotFound
	}
	return u, err
}

// InsertRefreshToken persists a refresh-token record.
func (r *Repository) InsertRefreshToken(ctx context.Context, t domain.RefreshToken) (string, error) {
	var id string
	err := r.pool.QueryRow(ctx, `
		INSERT INTO refresh_tokens (user_id,session_id,token_hash,expires_at)
		VALUES ($1,$2,$3,$4) RETURNING id`,
		t.UserID, t.SessionID, t.TokenHash, t.ExpiresAt,
	).Scan(&id)
	return id, err
}

// GetRefreshByHash looks up a refresh token by its hash.
func (r *Repository) GetRefreshByHash(ctx context.Context, hash string) (domain.RefreshToken, error) {
	var t domain.RefreshToken
	err := r.pool.QueryRow(ctx, `
		SELECT id,user_id,session_id,token_hash,expires_at,revoked_at,replaced_by,created_at
		FROM refresh_tokens WHERE token_hash=$1`, hash,
	).Scan(&t.ID, &t.UserID, &t.SessionID, &t.TokenHash, &t.ExpiresAt, &t.RevokedAt, &t.ReplacedBy, &t.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.RefreshToken{}, ErrNotFound
	}
	return t, err
}

// RotateRefreshToken revokes an old token and links it to its replacement.
func (r *Repository) RotateRefreshToken(ctx context.Context, oldID, newHash string, newToken domain.RefreshToken) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var newID string
	err = tx.QueryRow(ctx, `
		INSERT INTO refresh_tokens (user_id,session_id,token_hash,expires_at)
		VALUES ($1,$2,$3,$4) RETURNING id`,
		newToken.UserID, newToken.SessionID, newHash, newToken.ExpiresAt,
	).Scan(&newID)
	if err != nil {
		return "", err
	}
	now := time.Now()
	if _, err := tx.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=$1, replaced_by=$2 WHERE id=$3`, now, newID, oldID); err != nil {
		return "", err
	}
	if err := tx.Commit(ctx); err != nil {
		return "", err
	}
	return newID, nil
}

// RevokeSession revokes all refresh tokens for a session id.
func (r *Repository) RevokeSession(ctx context.Context, sessionID string) error {
	_, err := r.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE session_id=$1 AND revoked_at IS NULL`, sessionID)
	return err
}

// UpdatePassword sets a new bcrypt hash for a user.
func (r *Repository) UpdatePassword(ctx context.Context, userID, hash string) error {
	_, err := r.pool.Exec(ctx, `UPDATE credentials SET password_hash=$1, updated_at=now() WHERE user_id=$2`, hash, userID)
	return err
}

// MarkVerified flips a user's is_verified flag to true.
func (r *Repository) MarkVerified(ctx context.Context, userID string) error {
	_, err := r.pool.Exec(ctx, `UPDATE users SET is_verified=TRUE, updated_at=now() WHERE id=$1`, userID)
	return err
}

// InsertAudit appends an audit-log row.
func (r *Repository) InsertAudit(ctx context.Context, a domain.AuditLog) error {
	_, err := r.pool.Exec(ctx, `
		INSERT INTO audit_logs (user_id,action,ip,user_agent,meta)
		VALUES ($1,$2,$3,$4,$5)`,
		a.UserID, a.Action, a.IP, a.UserAgent, nullableJSON(a.Meta))
	return err
}

func nullableJSON(s string) any {
	if s == "" {
		return nil
	}
	return s
}
