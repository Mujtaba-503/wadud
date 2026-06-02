import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession } from "@wadud/types";
import { MOCK_DOCTORS } from "@wadud/mocks";

/**
 * Doctor portal auth store (mock).
 * @api POST /api/v1/auth/login        — doctor login
 * @api POST /api/v1/auth/logout
 * @api POST /api/v1/auth/refresh
 * Replace mock session with real JWT flow from the Go auth-service.
 * The logged-in doctor is represented by MOCK_DOCTORS[0].
 */

export const CURRENT_DOCTOR = MOCK_DOCTORS[0];

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const MOCK_SESSION: AuthSession = {
  user: {
    id: CURRENT_DOCTOR.id,
    firstName: CURRENT_DOCTOR.firstName,
    lastName: CURRENT_DOCTOR.lastName,
    email: CURRENT_DOCTOR.email,
    phone: CURRENT_DOCTOR.phone,
    avatar: CURRENT_DOCTOR.avatar,
    role: "doctor",
    isVerified: true,
    isActive: true,
    country: CURRENT_DOCTOR.country,
    language: "en",
    createdAt: CURRENT_DOCTOR.createdAt,
    updatedAt: CURRENT_DOCTOR.updatedAt,
  },
  tokens: {
    accessToken: "mock-doctor-access-token",
    refreshToken: "mock-doctor-refresh-token",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  role: "doctor",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: MOCK_SESSION,
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (_email: string, _password: string) => {
        set({ isLoading: true, error: null });
        // TODO: const res = await fetch("/api/v1/auth/login", { method: "POST", ... })
        await new Promise((r) => setTimeout(r, 1200));
        set({ session: MOCK_SESSION, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        // TODO: POST /api/v1/auth/logout to invalidate refresh token
        set({ session: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "wadud-doctor-auth",
      partialize: (state) => ({ session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);
