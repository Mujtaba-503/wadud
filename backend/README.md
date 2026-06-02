# Wadud Backend

Production-grade, event-driven Go backend for the Wadud telemedicine platform.
The frontend (apps/web, apps/doctor, apps/admin) is the source of truth; mock data
is replaced incrementally without breaking the UI.

See `docs/backend/BACKEND_REQUIREMENTS.md` for the full Phase-1 requirement spec.

## Stack

- Go 1.24+ (workspace of independent modules)
- PostgreSQL · Redis · NATS · MinIO
- JWT access tokens + rotating refresh tokens, Redis-backed sessions, RBAC
- OpenAPI/Swagger per service · Docker Compose · Prometheus `/metrics`

## Layout

```
backend/
  go.work
  shared/                 # config, logger, httpx, auth (jwt+bcrypt), middleware, events
  services/
    auth-service/         # Phase 1 — implemented
    user-service/         # planned
    doctor-service/       # planned
    booking-service/      # planned
    notification-service/ # planned
    api-gateway/          # planned
  infra/
    docker-compose.yml    # postgres, redis, nats, minio + services
    docker/               # per-service Dockerfiles
```

Each service uses Clean Architecture: `handler → service → repository`, DTOs at the
edge, dependency injection via constructors, config from env.

## Quick start

Bring up datastores + auth-service:

```bash
cd backend/infra
docker compose up -d            # postgres, redis, nats, minio, auth-service
```

Or run the auth-service locally against dockerized datastores:

```bash
cd backend/infra && docker compose up -d postgres redis nats minio
cd ../services/auth-service
DATABASE_URL="postgres://wadud:wadud@localhost:5432/wadud_auth?sslmode=disable" \
REDIS_URL="redis://localhost:6379/0" \
NATS_URL="nats://localhost:4222" \
JWT_SECRET="dev-secret" \
go run ./cmd/server                 # listens on :8081
```

### Smoke test

```bash
curl localhost:8081/healthz
curl -X POST localhost:8081/api/v1/auth/signup -H 'Content-Type: application/json' \
  -d '{"firstName":"Ada","lastName":"L","email":"ada@example.com","phone":"+10","password":"supersecret","role":"patient"}'
```

## Tests

```bash
cd backend/services/auth-service && go test ./...
```

## Auth Service — endpoints

`POST /api/v1/auth/{signup,login,refresh,logout,forgot-password,reset-password,verify-otp}`,
`GET /api/v1/auth/me`. Full contract in `services/auth-service/openapi/openapi.yaml`.

Security: bcrypt (cost 12) hashing, HS256 JWT (15m) + opaque refresh (7d) with
**rotation + reuse detection**, Redis sessions for server-side logout, OTP in Redis,
audit logging of auth events, CORS allow-list, security headers.
