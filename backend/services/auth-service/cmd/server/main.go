// Command server is the auth-service entrypoint.
package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/wadud/backend/services/auth-service/internal/config"
	"github.com/wadud/backend/services/auth-service/internal/handler"
	"github.com/wadud/backend/services/auth-service/internal/migrate"
	"github.com/wadud/backend/services/auth-service/internal/redisstore"
	"github.com/wadud/backend/services/auth-service/internal/repository"
	"github.com/wadud/backend/services/auth-service/internal/service"
	"github.com/wadud/backend/shared/auth"
	"github.com/wadud/backend/shared/events"
	"github.com/wadud/backend/shared/logger"
	"github.com/wadud/backend/shared/middleware"
)

func main() {
	log := logger.New("auth-service")
	cfg := config.Load()
	ctx := context.Background()

	pool, err := repository.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Error("postgres connect failed", "error", err)
		os.Exit(1)
	}
	defer pool.Close()

	if err := migrate.Run(ctx, pool); err != nil {
		log.Error("migrations failed", "error", err)
		os.Exit(1)
	}
	log.Info("migrations applied")

	rstore, err := redisstore.Connect(ctx, cfg.RedisURL)
	if err != nil {
		log.Error("redis connect failed", "error", err)
		os.Exit(1)
	}

	bus, err := events.Connect(cfg.NATSURL, "auth-service")
	if err != nil {
		// NATS is non-fatal for auth; log and continue with a no-op publisher.
		log.Warn("nats connect failed; events disabled", "error", err)
		bus = nil
	}
	var pub service.Publisher = noopPublisher{}
	if bus != nil {
		pub = bus
		defer bus.Close()
	}

	jwtMgr := auth.NewJWTManager(cfg.JWTSecret, cfg.JWTIssuer, cfg.AccessTokenTTL)
	repo := repository.New(pool)
	svc := service.New(repo, rstore, pub, jwtMgr, log, cfg.RefreshTokenTTL, cfg.OTPTTL)
	authn := middleware.NewAuthenticator(jwtMgr)
	h := handler.New(svc, authn)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Recover)
	r.Use(middleware.SecurityHeaders)
	r.Use(middleware.CORS(cfg.CORSOrigins...))

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})
	r.Get("/readyz", func(w http.ResponseWriter, req *http.Request) {
		c, cancel := context.WithTimeout(req.Context(), 2*time.Second)
		defer cancel()
		if err := pool.Ping(c); err != nil {
			http.Error(w, `{"status":"not ready"}`, http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ready"}`))
	})
	r.Handle("/metrics", promhttp.Handler())
	h.Routes(r)

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Info("auth-service listening", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	log.Info("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}

// noopPublisher is used when NATS is unavailable so auth still works.
type noopPublisher struct{}

func (noopPublisher) Publish(string, any) error { return nil }
