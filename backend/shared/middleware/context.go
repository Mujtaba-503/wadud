// Package middleware provides shared HTTP middleware: auth, RBAC, CORS,
// request-id, recovery, and rate limiting.
package middleware

import "context"

type ctxKey string

const (
	ctxUserID    ctxKey = "userID"
	ctxUserRole  ctxKey = "userRole"
	ctxUserEmail ctxKey = "userEmail"
	ctxSessionID ctxKey = "sessionID"
	ctxRequestID ctxKey = "requestID"
)

// WithIdentity stores the authenticated identity in the context.
func WithIdentity(ctx context.Context, userID, role, email, sessionID string) context.Context {
	ctx = context.WithValue(ctx, ctxUserID, userID)
	ctx = context.WithValue(ctx, ctxUserRole, role)
	ctx = context.WithValue(ctx, ctxUserEmail, email)
	ctx = context.WithValue(ctx, ctxSessionID, sessionID)
	return ctx
}

// UserID returns the authenticated user id, or "".
func UserID(ctx context.Context) string { return str(ctx, ctxUserID) }

// UserRole returns the authenticated user role, or "".
func UserRole(ctx context.Context) string { return str(ctx, ctxUserRole) }

// UserEmail returns the authenticated user email, or "".
func UserEmail(ctx context.Context) string { return str(ctx, ctxUserEmail) }

// SessionID returns the session id from the access token, or "".
func SessionID(ctx context.Context) string { return str(ctx, ctxSessionID) }

func withRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, ctxRequestID, id)
}

// GetRequestID returns the request id from context, or "".
func GetRequestID(ctx context.Context) string { return str(ctx, ctxRequestID) }

func str(ctx context.Context, k ctxKey) string {
	if v, ok := ctx.Value(k).(string); ok {
		return v
	}
	return ""
}
