// Package dto defines request/response payloads for the auth API. Shapes mirror
// the frontend types in packages/types/src/index.ts.
package dto

import "github.com/wadud/backend/services/auth-service/internal/domain"

// SignupRequest mirrors the frontend SignupPayload.
type SignupRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	Country   string `json:"country"`
	Language  string `json:"language"`
}

// LoginRequest mirrors the frontend LoginCredentials.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RefreshRequest carries the opaque refresh token.
type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

// LogoutRequest revokes a session by its refresh token.
type LogoutRequest struct {
	RefreshToken string `json:"refreshToken"`
}

// ForgotPasswordRequest starts a reset flow.
type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// ResetPasswordRequest completes a reset flow.
type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

// VerifyOTPRequest mirrors the frontend OTPVerification.
type VerifyOTPRequest struct {
	Phone string `json:"phone"`
	Code  string `json:"code"`
	Type  string `json:"type"`
}

// Tokens mirrors the frontend AuthTokens.
type Tokens struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresAt    string `json:"expiresAt"`
}

// Session mirrors the frontend AuthSession.
type Session struct {
	User   domain.User `json:"user"`
	Tokens Tokens      `json:"tokens"`
	Role   string      `json:"role"`
}
