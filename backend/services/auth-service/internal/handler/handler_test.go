package handler_test

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/wadud/backend/services/auth-service/internal/domain"
	"github.com/wadud/backend/services/auth-service/internal/handler"
	"github.com/wadud/backend/services/auth-service/internal/repository"
	"github.com/wadud/backend/services/auth-service/internal/service"
	"github.com/wadud/backend/shared/auth"
	"github.com/wadud/backend/shared/middleware"
)

// Minimal in-memory fakes (handler-level smoke coverage).

type repo struct {
	mu      sync.Mutex
	users   map[string]domain.User
	byEmail map[string]string
	hashes  map[string]string
	refresh map[string]domain.RefreshToken
	n       int
}

func newRepo() *repo {
	return &repo{users: map[string]domain.User{}, byEmail: map[string]string{}, hashes: map[string]string{}, refresh: map[string]domain.RefreshToken{}}
}
func (r *repo) CreateUserWithCredential(_ context.Context, u domain.User, h string) (domain.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.n++
	u.ID = "u" + time.Now().Format("150405.000000")
	u.IsActive = true
	r.users[u.ID] = u
	r.byEmail[u.Email] = u.ID
	r.hashes[u.ID] = h
	return u, nil
}
func (r *repo) EmailExists(_ context.Context, e string) (bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	_, ok := r.byEmail[e]
	return ok, nil
}
func (r *repo) GetUserByEmail(_ context.Context, e string) (domain.User, string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	id, ok := r.byEmail[e]
	if !ok {
		return domain.User{}, "", repository.ErrNotFound
	}
	return r.users[id], r.hashes[id], nil
}
func (r *repo) GetUserByID(_ context.Context, id string) (domain.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	u, ok := r.users[id]
	if !ok {
		return domain.User{}, repository.ErrNotFound
	}
	return u, nil
}
func (r *repo) InsertRefreshToken(_ context.Context, t domain.RefreshToken) (string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	t.ID = "r" + time.Now().Format("150405.000000")
	r.refresh[t.TokenHash] = t
	return t.ID, nil
}
func (r *repo) GetRefreshByHash(_ context.Context, h string) (domain.RefreshToken, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	t, ok := r.refresh[h]
	if !ok {
		return domain.RefreshToken{}, repository.ErrNotFound
	}
	return t, nil
}
func (r *repo) RotateRefreshToken(_ context.Context, _, newHash string, t domain.RefreshToken) (string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	t.ID = "r2"
	r.refresh[newHash] = t
	return t.ID, nil
}
func (r *repo) RevokeSession(_ context.Context, _ string) error        { return nil }
func (r *repo) UpdatePassword(_ context.Context, _, _ string) error    { return nil }
func (r *repo) MarkVerified(_ context.Context, _ string) error         { return nil }
func (r *repo) InsertAudit(_ context.Context, _ domain.AuditLog) error { return nil }

type store struct{ m map[string]string }

func newStore() *store { return &store{m: map[string]string{}} }
func (s *store) PutSession(_ context.Context, sid, uid string, _ time.Duration) error {
	s.m[sid] = uid
	return nil
}
func (s *store) SessionValid(_ context.Context, sid string) (bool, error) {
	_, ok := s.m[sid]
	return ok, nil
}
func (s *store) DeleteSession(_ context.Context, sid string) error               { delete(s.m, sid); return nil }
func (s *store) PutOTP(_ context.Context, _, _, _ string, _ time.Duration) error { return nil }
func (s *store) GetOTP(_ context.Context, _, _ string) (string, error)           { return "", nil }
func (s *store) DeleteOTP(_ context.Context, _, _ string) error                  { return nil }

type pub struct{}

func (pub) Publish(string, any) error { return nil }

func newServer() http.Handler {
	jwt := auth.NewJWTManager("secret", "test", 15*time.Minute)
	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	svc := service.New(newRepo(), newStore(), pub{}, jwt, log, time.Hour, time.Minute)
	h := handler.New(svc, middleware.NewAuthenticator(jwt))
	r := chi.NewRouter()
	h.Routes(r)
	return r
}

func TestSignupRouteReturns201(t *testing.T) {
	srv := newServer()
	body := `{"firstName":"Ada","lastName":"L","email":"ada@example.com","phone":"+1","password":"supersecret","role":"patient"}`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/signup", strings.NewReader(body))
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("want 201, got %d: %s", rec.Code, rec.Body.String())
	}
	var env struct {
		Data    map[string]any `json:"data"`
		Success bool           `json:"success"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &env); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if !env.Success || env.Data["tokens"] == nil {
		t.Fatalf("unexpected envelope: %s", rec.Body.String())
	}
}

func TestSignupInvalidJSONReturns400(t *testing.T) {
	srv := newServer()
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/signup", strings.NewReader("{not-json"))
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("want 400, got %d", rec.Code)
	}
}

func TestMeWithoutTokenReturns401(t *testing.T) {
	srv := newServer()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("want 401, got %d", rec.Code)
	}
}

func TestSignupValidationReturns422(t *testing.T) {
	srv := newServer()
	body := `{"firstName":"","lastName":"","email":"bad","phone":"","password":"x"}`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/signup", strings.NewReader(body))
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d: %s", rec.Code, rec.Body.String())
	}
}
