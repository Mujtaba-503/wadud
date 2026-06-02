# Wadud Backend — Requirement Specification (Phase 1)

> Status: Phase 1 (Auth-first). Frontend is the source of truth; mock data is replaced
> incrementally without breaking existing UI. Branch: `experimental/backend-auth`.

This document is the output of **Step 1 (analyze frontend)** of the agreed implementation
strategy. It derives the backend contract directly from the existing TypeScript domain
types in `packages/types/src/index.ts`, the Zustand stores, and the pages in
`apps/web`, `apps/doctor`, and `apps/admin`.

---

## 1. Feature Inventory (derived from the UI)

| Area | Frontend location | Backend owner (service) |
|------|-------------------|-------------------------|
| Login / Signup / Forgot / Reset / OTP | `apps/web/(auth)/*`, `apps/doctor/(auth)/login`, `apps/admin/(auth)/login` | auth-service |
| Onboarding (language/region/profile) | `apps/web/(onboarding)/*` | user-service |
| Patient dashboard / profile / records | `apps/web/(portal)/{dashboard,profile,records}` | user-service |
| Doctor discovery + filters | `apps/web/(portal)/doctors` | doctor-service |
| Doctor profile + reviews + availability | `apps/web/(portal)/doctors/[id]` | doctor-service |
| Booking flow | `apps/web/(portal)/book/[doctorId]` | booking-service |
| Consultation history | `apps/web/(portal)/consultations` | booking-service |
| Doctor portal: queue / availability / earnings / payouts / verification | `apps/doctor/(portal)/*` | doctor-service + booking-service |
| Admin: analytics / verification / users / doctors / consultations / payments / logs / moderation / notifications | `apps/admin/(admin)/*` | all services (read) + admin aggregations |
| Notifications center | `apps/web/(portal)/notifications`, `apps/doctor/(portal)/notifications` | notification-service |
| Chat | `apps/*/chat` | chat-service (architecture only in Phase 1) |
| Video | `apps/*/video/[id]` | webrtc-service (architecture only in Phase 1) |
| Payments / payouts | `apps/admin/payments`, `apps/doctor/{earnings,payouts}` | payment-service (architecture only in Phase 1) |

---

## 2. Services (Phase 1)

Implemented in Phase 1:
1. **auth-service** — signup, login, refresh, logout, forgot/reset password, OTP, RBAC, Redis sessions, audit log, `UserRegistered` event.
2. **user-service** — patient profile, medical info, preferences, consent, document metadata.
3. **doctor-service** — doctor profiles, qualifications, specialization, availability, verification status, ratings/earnings summary.
4. **booking-service** — appointment create/update/cancel/reschedule, statuses, lists.
5. **notification-service** — consumes NATS events → persists notifications, exposes list/read.
6. **api-gateway** — single ingress; routing, JWT verification, CORS, rate limiting, request tracing.

Architecture-only (designed, not fully implemented):
7. **payment-service** — payments + payouts (gateways: JazzCash/EasyPaisa/Stripe).
8. **chat-service** — conversations + messages (NATS + WS).
9. **webrtc-service** — signaling tokens / rooms.

---

## 3. Required API Endpoints (Phase 1)

Base path: `/api/v1`. All non-auth routes require `Authorization: Bearer <accessToken>`.

### auth-service
```
POST   /auth/signup            { firstName,lastName,email,phone,password,role,country,language } -> AuthSession
POST   /auth/login             { email, password } -> AuthSession
POST   /auth/refresh           { refreshToken } -> AuthTokens         (rotates refresh token)
POST   /auth/logout            { refreshToken } -> 204                (revokes session)
POST   /auth/forgot-password   { email } -> 202                       (issues reset token via OTP/email)
POST   /auth/reset-password    { token, newPassword } -> 204
POST   /auth/verify-otp        { phone, code, type } -> AuthSession | 204
GET    /auth/me                -> User                                (from access token)
```

### user-service
```
GET    /users/me               -> Patient
PATCH  /users/me               -> Patient            (personal/medical/preferences)
GET    /users/:id              -> User               (admin)
GET    /users                  -> Paginated<User>    (admin)
POST   /users/me/documents     -> MedicalRecord meta (presigned MinIO upload)
GET    /users/me/records       -> MedicalRecord[]
```

### doctor-service
```
GET    /doctors                -> Paginated<Doctor>  (filters: specialization, language, country, gender, minRating, maxFee, isAvailable, search, sortBy)
GET    /doctors/:id            -> Doctor
GET    /doctors/:id/reviews    -> Paginated<Review>
GET    /doctors/:id/availability?date= -> TimeSlot[]
GET    /doctors/me             -> Doctor             (doctor portal)
PATCH  /doctors/me             -> Doctor
PUT    /doctors/me/availability -> DoctorAvailability[]
GET    /doctors/me/earnings    -> DoctorEarningsSummary
GET    /admin/verifications    -> Paginated<DoctorVerificationApplication> (admin)
POST   /admin/verifications/:id/decision { status, reviewNotes } -> application (admin)
```

### booking-service
```
POST   /bookings               { doctorId, consultationType, scheduledAt, symptoms } -> Booking
GET    /bookings               -> Paginated<Booking>  (patient: own; doctor: assigned; admin: all)
GET    /bookings/:id           -> Booking
PUT    /bookings/:id           { status | scheduledAt } -> Booking   (accept/complete/reschedule)
DELETE /bookings/:id           -> Booking (status=cancelled)
```

### notification-service
```
GET    /notifications          -> Paginated<Notification>
POST   /notifications/:id/read -> 204
POST   /notifications/read-all -> 204
```

---

## 4. Database Tables (PostgreSQL)

One schema per service (DB-per-service ready; single Postgres instance in dev).

**auth**: `users`, `credentials`, `refresh_tokens`, `otp_codes`, `password_resets`, `audit_logs`
**user**: `patients`, `patient_documents`, `consents`
**doctor**: `doctors`, `qualifications`, `doctor_availability`, `verification_applications`, `verification_documents`, `reviews`
**booking**: `bookings`, `consultations`, `prescriptions`
**notification**: `notifications`

Key columns mirror the TS types. Highlights:
- `users(id uuid pk, first_name, last_name, email unique, phone, avatar, role, is_verified, is_active, country, language, created_at, updated_at)`
- `credentials(user_id fk, password_hash)` — bcrypt; **never** plaintext.
- `refresh_tokens(id, user_id, token_hash, expires_at, revoked_at, replaced_by)` — rotation + reuse detection.
- `otp_codes(id, identifier, code_hash, type, expires_at, consumed_at)` — short-lived; also cached in Redis.
- `bookings(... patient_id, doctor_id, consultation_type, status, scheduled_at, duration, consultation_fee, currency, payment_status ...)`.

Indexes: `users(email)`, `doctors(specialization, is_available, rating)`, `bookings(patient_id)`, `bookings(doctor_id, scheduled_at)`, `refresh_tokens(user_id)`, `notifications(user_id, is_read)`.
Constraints: FKs across same-service tables; enums enforced via CHECK or Postgres enum types; `NOT NULL` on required fields.

---

## 5. Entities & Relationships (ERD summary)

```
User 1───1 Credentials
User 1───* RefreshToken
User 1───1 Patient            (role=patient)
User 1───1 Doctor             (role=doctor)
Doctor 1───* Qualification
Doctor 1───* DoctorAvailability
Doctor 1───* Review
Doctor 1───1 VerificationApplication 1───* VerificationDocument
Patient 1───* Booking *───1 Doctor
Booking 1───0..1 Consultation 1───0..1 Prescription
Booking 1───0..1 Payment      (payment-service, later)
User 1───* Notification
```

---

## 6. Authentication Requirements

- **Password hashing**: bcrypt (cost ≥ 12).
- **JWT access token**: short-lived (15 min), HS256/RS256, claims `{ sub, role, email, sid }`.
- **Refresh token**: opaque, hashed at rest, 7-day TTL, **rotation** on each refresh, **reuse detection** revokes the session family.
- **Sessions**: Redis-backed (`session:<sid>`), allows server-side logout/blacklist.
- **RBAC**: roles `patient | doctor | admin`; gateway + per-service middleware enforce role on protected routes.
- **OTP**: 6-digit, Redis TTL (5 min), max attempts; types `registration | login | password_reset`.
- **Audit logging**: auth events (`login`, `logout`, `failed_login`, `password_reset`, `token_reuse`) → `audit_logs` + structured logs.
- **Transport/security**: CORS allow-list per app origin, secure cookies (if cookie mode), security headers, rate limiting (Redis) on `/auth/*`.

---

## 7. Event Architecture (NATS)

Subjects (JSON contracts in `shared/events`):
```
user.registered          { userId, role, email, occurredAt }
doctor.created           { doctorId, userId, specialization }
doctor.verified          { doctorId, status, reviewedBy }
booking.created          { bookingId, patientId, doctorId, scheduledAt }
booking.cancelled        { bookingId, cancelledBy, reason }
consultation.started     { bookingId, startedAt }
consultation.completed   { bookingId, endedAt }
notification.triggered   { userId, type, title, body, data }
```
notification-service subscribes to all of the above and creates `Notification` rows.

---

## 8. Missing Backend Requirements (not represented in the frontend yet)

These are needed by a real backend but have no UI counterpart; called out so they're explicit:
- **Refresh-token storage & rotation** (UI only holds tokens in localStorage via Zustand `persist`).
- **Server-side session revocation / logout-all-devices**.
- **OTP delivery channel** (SMS/email provider) — abstracted behind an interface; dev uses log/Redis stub.
- **Email delivery** for password reset — same abstraction.
- **Rate limiting & audit log** — no UI, backend-only.
- **MinIO object storage** for document/photo uploads — UI shows file metadata only.
- **Idempotency keys** for booking/payment creation.
- **Pagination metadata** — UI expects `PaginatedResponse<T>.meta` shape already.

---

## 9. Monorepo Layout (backend)

```
backend/
  go.work                       # Go workspace tying modules together
  services/
    auth-service/
    user-service/
    doctor-service/
    booking-service/
    notification-service/
    api-gateway/
  shared/
    contracts/                  # request/response DTOs shared across services
    events/                     # NATS event contracts
    middleware/                 # JWT, RBAC, CORS, rate-limit, recovery, tracing
    logger/                     # structured logging (slog)
    auth/                       # JWT signing/verification, password hashing
    config/                     # env config loader
    httpx/                      # response envelope, error codes
  infra/
    docker/                     # Dockerfiles per service
    docker-compose.yml          # postgres, redis, nats, minio + services
    postgres/                   # init + migrations
    redis/
    nats/
```

Each service uses **Clean Architecture**: `handler → service → repository`, DTOs at the edge,
dependency injection via constructors, config layer per service.

---

## 10. Phase 1 Build Order (no steps skipped)

1. Requirement spec (this doc) ✅
2. Architecture + monorepo skeleton + shared packages
3. DB schema + migrations
4. **auth-service** (first fully working + tests + OpenAPI)
5. user-service
6. doctor-service
7. booking-service
8. notification-service
9. api-gateway
10. Wire frontend stores to real APIs (feature-flagged: `NEXT_PUBLIC_API_BASE_URL`), starting with auth.

Observability (structured logs, `/healthz`, `/readyz`, Prometheus `/metrics`, OTel traces) and
Docker are delivered alongside the auth-service so the stack is runnable end-to-end early.
