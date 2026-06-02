// Package redisstore provides Redis-backed session storage, OTP storage and
// rate limiting for the auth-service.
package redisstore

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Store wraps a Redis client.
type Store struct {
	rdb *redis.Client
}

// Connect parses a redis URL and verifies connectivity.
func Connect(ctx context.Context, url string) (*Store, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	rdb := redis.NewClient(opt)
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := rdb.Ping(pingCtx).Err(); err != nil {
		return nil, err
	}
	return &Store{rdb: rdb}, nil
}

// Raw exposes the client for health checks.
func (s *Store) Raw() *redis.Client { return s.rdb }

// --- Sessions ---

func sessionKey(sid string) string { return "session:" + sid }

// PutSession stores a session marker with TTL (enables server-side revocation).
func (s *Store) PutSession(ctx context.Context, sid, userID string, ttl time.Duration) error {
	return s.rdb.Set(ctx, sessionKey(sid), userID, ttl).Err()
}

// SessionValid reports whether a session id is still active.
func (s *Store) SessionValid(ctx context.Context, sid string) (bool, error) {
	n, err := s.rdb.Exists(ctx, sessionKey(sid)).Result()
	return n == 1, err
}

// DeleteSession removes a session (logout).
func (s *Store) DeleteSession(ctx context.Context, sid string) error {
	return s.rdb.Del(ctx, sessionKey(sid)).Err()
}

// --- OTP ---

func otpKey(identifier, typ string) string { return fmt.Sprintf("otp:%s:%s", typ, identifier) }

// PutOTP stores a hashed OTP with TTL.
func (s *Store) PutOTP(ctx context.Context, identifier, typ, codeHash string, ttl time.Duration) error {
	return s.rdb.Set(ctx, otpKey(identifier, typ), codeHash, ttl).Err()
}

// GetOTP returns the stored hashed OTP (redis.Nil if absent/expired).
func (s *Store) GetOTP(ctx context.Context, identifier, typ string) (string, error) {
	return s.rdb.Get(ctx, otpKey(identifier, typ)).Result()
}

// DeleteOTP consumes an OTP.
func (s *Store) DeleteOTP(ctx context.Context, identifier, typ string) error {
	return s.rdb.Del(ctx, otpKey(identifier, typ)).Err()
}

// --- Rate limiting (fixed window) ---

// Allow increments a counter for key within window and reports whether the
// request is under the limit.
func (s *Store) Allow(ctx context.Context, key string, limit int, window time.Duration) (bool, error) {
	full := "ratelimit:" + key
	n, err := s.rdb.Incr(ctx, full).Result()
	if err != nil {
		return false, err
	}
	if n == 1 {
		_ = s.rdb.Expire(ctx, full, window).Err()
	}
	return n <= int64(limit), nil
}
