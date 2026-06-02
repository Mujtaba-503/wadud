package service

import (
	"net/mail"
	"strings"

	"github.com/wadud/backend/services/auth-service/internal/domain"
	"github.com/wadud/backend/services/auth-service/internal/dto"
)

// FieldErrors maps field name -> validation messages (mirrors ApiError.details).
type FieldErrors map[string][]string

// ValidationError wraps field-level validation failures.
type ValidationError struct{ Fields FieldErrors }

func (e *ValidationError) Error() string { return "validation error" }

func validateSignup(req dto.SignupRequest) error {
	fe := FieldErrors{}
	if strings.TrimSpace(req.FirstName) == "" {
		fe["firstName"] = append(fe["firstName"], "first name is required")
	}
	if strings.TrimSpace(req.LastName) == "" {
		fe["lastName"] = append(fe["lastName"], "last name is required")
	}
	if _, err := mail.ParseAddress(req.Email); err != nil {
		fe["email"] = append(fe["email"], "a valid email is required")
	}
	if strings.TrimSpace(req.Phone) == "" {
		fe["phone"] = append(fe["phone"], "phone is required")
	}
	if len(req.Password) < 8 {
		fe["password"] = append(fe["password"], "password must be at least 8 characters")
	}
	if req.Role != "" && !domain.ValidRole(req.Role) {
		fe["role"] = append(fe["role"], "role must be patient, doctor, or admin")
	}
	if len(fe) > 0 {
		return &ValidationError{Fields: fe}
	}
	return nil
}
