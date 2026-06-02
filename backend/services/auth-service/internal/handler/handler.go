// Package handler exposes the auth-service HTTP API.
package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/wadud/backend/services/auth-service/internal/dto"
	"github.com/wadud/backend/services/auth-service/internal/repository"
	"github.com/wadud/backend/services/auth-service/internal/service"
	"github.com/wadud/backend/shared/httpx"
	"github.com/wadud/backend/shared/middleware"
)

// Handler wires the service into HTTP routes.
type Handler struct {
	svc  *service.Service
	auth *middleware.Authenticator
}

// New constructs a Handler.
func New(svc *service.Service, auth *middleware.Authenticator) *Handler {
	return &Handler{svc: svc, auth: auth}
}

// Routes mounts auth routes under /api/v1/auth.
func (h *Handler) Routes(r chi.Router) {
	r.Route("/api/v1/auth", func(r chi.Router) {
		r.Post("/signup", h.signup)
		r.Post("/login", h.login)
		r.Post("/refresh", h.refresh)
		r.Post("/logout", h.logout)
		r.Post("/forgot-password", h.forgotPassword)
		r.Post("/reset-password", h.resetPassword)
		r.Post("/verify-otp", h.verifyOTP)

		r.Group(func(pr chi.Router) {
			pr.Use(h.auth.RequireAuth)
			pr.Get("/me", h.me)
		})
	})
}

func (h *Handler) signup(w http.ResponseWriter, r *http.Request) {
	var req dto.SignupRequest
	if !decode(w, r, &req) {
		return
	}
	sess, err := h.svc.Signup(r.Context(), req, auditMeta(r))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	httpx.JSON(w, http.StatusCreated, sess, "account created")
}

func (h *Handler) login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if !decode(w, r, &req) {
		return
	}
	sess, err := h.svc.Login(r.Context(), req, auditMeta(r))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, sess, "logged in")
}

func (h *Handler) refresh(w http.ResponseWriter, r *http.Request) {
	var req dto.RefreshRequest
	if !decode(w, r, &req) {
		return
	}
	tokens, err := h.svc.Refresh(r.Context(), req.RefreshToken, auditMeta(r))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, tokens, "token refreshed")
}

func (h *Handler) logout(w http.ResponseWriter, r *http.Request) {
	var req dto.LogoutRequest
	if !decode(w, r, &req) {
		return
	}
	if err := h.svc.Logout(r.Context(), req.RefreshToken, auditMeta(r)); err != nil {
		writeServiceError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) forgotPassword(w http.ResponseWriter, r *http.Request) {
	var req dto.ForgotPasswordRequest
	if !decode(w, r, &req) {
		return
	}
	devCode, err := h.svc.ForgotPassword(r.Context(), req.Email, auditMeta(r))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	// Always 202 to avoid user enumeration. devCode is included only when set
	// (no delivery channel configured) to aid local testing.
	resp := map[string]string{}
	if devCode != "" {
		resp["devCode"] = devCode
	}
	httpx.JSON(w, http.StatusAccepted, resp, "if the email exists, a reset code was sent")
}

func (h *Handler) resetPassword(w http.ResponseWriter, r *http.Request) {
	var req dto.ResetPasswordRequest
	if !decode(w, r, &req) {
		return
	}
	if err := h.svc.ResetPassword(r.Context(), req.Token, req.NewPassword, auditMeta(r)); err != nil {
		writeServiceError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) verifyOTP(w http.ResponseWriter, r *http.Request) {
	var req dto.VerifyOTPRequest
	if !decode(w, r, &req) {
		return
	}
	if err := h.svc.VerifyOTP(r.Context(), req); err != nil {
		writeServiceError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
	u, err := h.svc.Me(r.Context(), middleware.UserID(r.Context()))
	if err != nil {
		writeServiceError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, u, "ok")
}

// --- helpers ---

func decode(w http.ResponseWriter, r *http.Request, dst any) bool {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		httpx.Error(w, http.StatusBadRequest, httpx.CodeValidation, "invalid JSON body", nil)
		return false
	}
	return true
}

func auditMeta(r *http.Request) service.AuditMeta {
	return service.AuditMeta{IP: clientIP(r), UserAgent: r.UserAgent()}
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		return xff
	}
	return r.RemoteAddr
}

func writeServiceError(w http.ResponseWriter, err error) {
	var ve *service.ValidationError
	if errors.As(err, &ve) {
		httpx.Error(w, http.StatusUnprocessableEntity, httpx.CodeValidation, "validation error", ve.Fields)
		return
	}
	switch {
	case errors.Is(err, service.ErrEmailTaken):
		httpx.Error(w, http.StatusConflict, httpx.CodeEmailTaken, err.Error(), nil)
	case errors.Is(err, service.ErrInvalidCreds):
		httpx.Error(w, http.StatusUnauthorized, httpx.CodeInvalidCreds, "invalid email or password", nil)
	case errors.Is(err, service.ErrInactive):
		httpx.Error(w, http.StatusForbidden, httpx.CodeForbidden, "account is inactive", nil)
	case errors.Is(err, service.ErrTokenReuse):
		httpx.Error(w, http.StatusUnauthorized, httpx.CodeTokenReuse, "refresh token reuse detected; session revoked", nil)
	case errors.Is(err, service.ErrTokenInvalid):
		httpx.Error(w, http.StatusUnauthorized, httpx.CodeTokenInvalid, "refresh token invalid or expired", nil)
	case errors.Is(err, service.ErrOTPInvalid):
		httpx.Error(w, http.StatusUnauthorized, httpx.CodeOTPInvalid, "otp invalid or expired", nil)
	case errors.Is(err, service.ErrResetInvalid):
		httpx.Error(w, http.StatusUnauthorized, httpx.CodeTokenInvalid, "reset token invalid or expired", nil)
	case errors.Is(err, service.ErrValidation):
		httpx.Error(w, http.StatusUnprocessableEntity, httpx.CodeValidation, "validation error", nil)
	case errors.Is(err, repository.ErrNotFound):
		httpx.Error(w, http.StatusNotFound, httpx.CodeNotFound, "not found", nil)
	default:
		httpx.Error(w, http.StatusInternalServerError, httpx.CodeInternal, "internal server error", nil)
	}
}
