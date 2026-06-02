// Package config loads auth-service configuration from the environment.
package config

import (
	"time"

	sharedconfig "github.com/wadud/backend/shared/config"
)

// Config holds all auth-service settings.
type Config struct {
	Port            string
	DatabaseURL     string
	RedisURL        string
	NATSURL         string
	JWTSecret       string
	JWTIssuer       string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	OTPTTL          time.Duration
	CORSOrigins     []string
}

// Load reads configuration with sane local-dev defaults.
func Load() Config {
	return Config{
		Port:            sharedconfig.Getenv("PORT", "8081"),
		DatabaseURL:     sharedconfig.Getenv("DATABASE_URL", "postgres://wadud:wadud@localhost:5432/wadud_auth?sslmode=disable"),
		RedisURL:        sharedconfig.Getenv("REDIS_URL", "redis://localhost:6379/0"),
		NATSURL:         sharedconfig.Getenv("NATS_URL", "nats://localhost:4222"),
		JWTSecret:       sharedconfig.Getenv("JWT_SECRET", "dev-insecure-secret-change-me"),
		JWTIssuer:       sharedconfig.Getenv("JWT_ISSUER", "wadud-auth"),
		AccessTokenTTL:  sharedconfig.GetenvDuration("ACCESS_TOKEN_TTL", 15*time.Minute),
		RefreshTokenTTL: sharedconfig.GetenvDuration("REFRESH_TOKEN_TTL", 7*24*time.Hour),
		OTPTTL:          sharedconfig.GetenvDuration("OTP_TTL", 5*time.Minute),
		CORSOrigins: []string{
			sharedconfig.Getenv("WEB_ORIGIN", "http://localhost:3000"),
			sharedconfig.Getenv("ADMIN_ORIGIN", "http://localhost:3001"),
			sharedconfig.Getenv("DOCTOR_ORIGIN", "http://localhost:3002"),
		},
	}
}
