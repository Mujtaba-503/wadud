// Package auth provides password hashing and JWT signing/verification shared
// across services.
package auth

import "golang.org/x/crypto/bcrypt"

// DefaultBcryptCost is the work factor used for password hashing.
const DefaultBcryptCost = 12

// HashPassword returns a bcrypt hash of the plaintext password.
func HashPassword(plaintext string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(plaintext), DefaultBcryptCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// CheckPassword reports whether the plaintext matches the bcrypt hash.
func CheckPassword(hash, plaintext string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plaintext)) == nil
}
