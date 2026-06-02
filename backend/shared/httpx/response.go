// Package httpx provides a standard response envelope and error codes that
// mirror the frontend's ApiResponse<T> / PaginatedResponse<T> / ApiError shapes
// in packages/types/src/index.ts.
package httpx

import (
	"encoding/json"
	"net/http"
	"time"
)

// Envelope mirrors ApiResponse<T> on the frontend.
type Envelope struct {
	Data      any    `json:"data"`
	Message   string `json:"message"`
	Success   bool   `json:"success"`
	Timestamp string `json:"timestamp"`
}

// PageMeta mirrors PaginatedResponse<T>.meta on the frontend.
type PageMeta struct {
	Page        int   `json:"page"`
	Limit       int   `json:"limit"`
	Total       int64 `json:"total"`
	TotalPages  int   `json:"totalPages"`
	HasNextPage bool  `json:"hasNextPage"`
	HasPrevPage bool  `json:"hasPrevPage"`
}

// Paginated mirrors PaginatedResponse<T> on the frontend.
type Paginated struct {
	Data    any      `json:"data"`
	Meta    PageMeta `json:"meta"`
	Message string   `json:"message"`
	Success bool     `json:"success"`
}

// ErrorBody mirrors ApiError on the frontend.
type ErrorBody struct {
	Code      string              `json:"code"`
	Message   string              `json:"message"`
	Details   map[string][]string `json:"details,omitempty"`
	Timestamp string              `json:"timestamp"`
}

func now() string { return time.Now().UTC().Format(time.RFC3339) }

// JSON writes a success envelope.
func JSON(w http.ResponseWriter, status int, data any, message string) {
	write(w, status, Envelope{Data: data, Message: message, Success: true, Timestamp: now()})
}

// Page writes a paginated envelope.
func Page(w http.ResponseWriter, status int, data any, meta PageMeta, message string) {
	write(w, status, Paginated{Data: data, Meta: meta, Message: message, Success: true})
}

// Error writes an error envelope with a machine-readable code.
func Error(w http.ResponseWriter, status int, code, message string, details map[string][]string) {
	write(w, status, ErrorBody{Code: code, Message: message, Details: details, Timestamp: now()})
}

// NewPageMeta computes pagination metadata.
func NewPageMeta(page, limit int, total int64) PageMeta {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	totalPages := int((total + int64(limit) - 1) / int64(limit))
	return PageMeta{
		Page:        page,
		Limit:       limit,
		Total:       total,
		TotalPages:  totalPages,
		HasNextPage: page < totalPages,
		HasPrevPage: page > 1,
	}
}

func write(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}
