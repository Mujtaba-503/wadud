package middleware

import (
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/wadud/backend/shared/auth"
	"github.com/wadud/backend/shared/httpx"
)

// RequestID assigns/propagates an X-Request-Id and stores it in context.
func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-Id")
		if id == "" {
			id = uuid.NewString()
		}
		w.Header().Set("X-Request-Id", id)
		ctx := r.Context()
		ctx = withRequestID(ctx, id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Recover converts panics into 500 responses instead of crashing the server.
func Recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				httpx.Error(w, http.StatusInternalServerError, httpx.CodeInternal, "internal server error", nil)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

// SecurityHeaders sets common hardening headers.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "no-referrer")
		next.ServeHTTP(w, r)
	})
}

// CORS returns a middleware allowing the given origins (exact match) with
// credentials. Use "*" to allow any origin (without credentials).
func CORS(allowed ...string) func(http.Handler) http.Handler {
	allowAll := len(allowed) == 1 && allowed[0] == "*"
	set := map[string]bool{}
	for _, o := range allowed {
		set[o] = true
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			switch {
			case allowAll:
				w.Header().Set("Access-Control-Allow-Origin", "*")
			case origin != "" && set[origin]:
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Add("Vary", "Origin")
			}
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization,Content-Type,X-Request-Id")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// Authenticator verifies bearer access tokens and injects identity into context.
type Authenticator struct {
	jwt *auth.JWTManager
}

// NewAuthenticator constructs an Authenticator.
func NewAuthenticator(jwt *auth.JWTManager) *Authenticator { return &Authenticator{jwt: jwt} }

// RequireAuth rejects requests without a valid access token.
func (a *Authenticator) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		raw := bearer(r)
		if raw == "" {
			httpx.Error(w, http.StatusUnauthorized, httpx.CodeUnauthorized, "missing bearer token", nil)
			return
		}
		claims, err := a.jwt.Verify(raw)
		if err != nil {
			code := httpx.CodeTokenInvalid
			if err == auth.ErrTokenExpired {
				code = httpx.CodeTokenExpired
			}
			httpx.Error(w, http.StatusUnauthorized, code, err.Error(), nil)
			return
		}
		ctx := WithIdentity(r.Context(), claims.UserID, claims.Role, claims.Email, claims.SessionID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireRole enforces that the authenticated user has one of the given roles.
func RequireRole(roles ...string) func(http.Handler) http.Handler {
	allowed := map[string]bool{}
	for _, role := range roles {
		allowed[role] = true
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !allowed[UserRole(r.Context())] {
				httpx.Error(w, http.StatusForbidden, httpx.CodeForbidden, "insufficient role", nil)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func bearer(r *http.Request) string {
	h := r.Header.Get("Authorization")
	if h == "" {
		return ""
	}
	parts := strings.SplitN(h, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return strings.TrimSpace(parts[1])
}
