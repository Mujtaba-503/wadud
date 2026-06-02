// Package domain holds the auth-service core entities.
package domain

import "time"

// Role values mirror the frontend UserRole union.
const (
	RolePatient = "patient"
	RoleDoctor  = "doctor"
	RoleAdmin   = "admin"
)

// ValidRole reports whether r is an allowed role.
func ValidRole(r string) bool {
	return r == RolePatient || r == RoleDoctor || r == RoleAdmin
}

// User mirrors the frontend User type.
type User struct {
	ID         string    `json:"id"`
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	Avatar     *string   `json:"avatar,omitempty"`
	Role       string    `json:"role"`
	IsVerified bool      `json:"isVerified"`
	IsActive   bool      `json:"isActive"`
	Country    string    `json:"country"`
	Language   string    `json:"language"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

// RefreshToken is a persisted refresh-token record (token stored hashed).
type RefreshToken struct {
	ID         string
	UserID     string
	SessionID  string
	TokenHash  string
	ExpiresAt  time.Time
	RevokedAt  *time.Time
	ReplacedBy *string
	CreatedAt  time.Time
}

// OTPType enumerates OTP purposes.
const (
	OTPRegistration  = "registration"
	OTPLogin         = "login"
	OTPPasswordReset = "password_reset"
)

// AuditLog records a security-relevant event.
type AuditLog struct {
	ID        string
	UserID    *string
	Action    string
	IP        string
	UserAgent string
	Meta      string
	CreatedAt time.Time
}
