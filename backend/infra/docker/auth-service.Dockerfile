# Build context must be the backend/ directory (uses the Go workspace).
FROM golang:1.25-alpine AS build
WORKDIR /src

# Copy workspace + modules needed to build auth-service.
COPY go.work go.work.sum* ./
COPY shared/ ./shared/
COPY services/auth-service/ ./services/auth-service/

# Restrict the workspace to the modules present in this image.
RUN go work use ./shared ./services/auth-service
WORKDIR /src/services/auth-service
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/auth-service ./cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates && adduser -D -u 10001 app
USER app
COPY --from=build /out/auth-service /usr/local/bin/auth-service
EXPOSE 8081
ENTRYPOINT ["auth-service"]
