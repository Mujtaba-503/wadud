package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Common JWT errors.
var (
	ErrTokenInvalid = errors.New("token invalid")
	ErrTokenExpired = errors.New("token expired")
)

// Claims is the JWT access-token payload.
type Claims struct {
	UserID    string `json:"sub"`
	Role      string `json:"role"`
	Email     string `json:"email"`
	SessionID string `json:"sid"`
	jwt.RegisteredClaims
}

// JWTManager signs and verifies access tokens (HS256).
type JWTManager struct {
	secret    []byte
	issuer    string
	accessTTL time.Duration
}

// NewJWTManager constructs a JWTManager.
func NewJWTManager(secret, issuer string, accessTTL time.Duration) *JWTManager {
	return &JWTManager{secret: []byte(secret), issuer: issuer, accessTTL: accessTTL}
}

// AccessTTL exposes the configured access-token lifetime.
func (m *JWTManager) AccessTTL() time.Duration { return m.accessTTL }

// Generate creates a signed access token for the given identity.
func (m *JWTManager) Generate(userID, role, email, sessionID string) (string, time.Time, error) {
	expiresAt := time.Now().Add(m.accessTTL)
	claims := Claims{
		UserID:    userID,
		Role:      role,
		Email:     email,
		SessionID: sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    m.issuer,
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(m.secret)
	return signed, expiresAt, err
}

// Verify parses and validates an access token, returning its claims.
func (m *JWTManager) Verify(tokenString string) (*Claims, error) {
	claims := &Claims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrTokenInvalid
		}
		return m.secret, nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrTokenExpired
		}
		return nil, ErrTokenInvalid
	}
	return claims, nil
}
