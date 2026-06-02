package httpx

// Machine-readable error codes returned in ApiError.code.
const (
	CodeValidation     = "VALIDATION_ERROR"
	CodeUnauthorized   = "UNAUTHORIZED"
	CodeForbidden      = "FORBIDDEN"
	CodeNotFound       = "NOT_FOUND"
	CodeConflict       = "CONFLICT"
	CodeInvalidCreds   = "INVALID_CREDENTIALS"
	CodeTokenExpired   = "TOKEN_EXPIRED"
	CodeTokenInvalid   = "TOKEN_INVALID"
	CodeTokenReuse     = "TOKEN_REUSE_DETECTED"
	CodeRateLimited    = "RATE_LIMITED"
	CodeOTPInvalid     = "OTP_INVALID"
	CodeOTPExpired     = "OTP_EXPIRED"
	CodeInternal       = "INTERNAL_ERROR"
	CodeServiceUnavail = "SERVICE_UNAVAILABLE"
	CodeEmailTaken     = "EMAIL_ALREADY_REGISTERED"
)
