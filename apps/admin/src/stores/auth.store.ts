import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession } from "@wadud/types";

/**
 * Admin portal auth store (mock).
 * @api POST /api/v1/auth/login   — admin login
 * @api POST /api/v1/auth/logout
 * Replace mock session with real JWT flow from the Go auth-service.
 */

export const CURRENT_ADMIN = {
  id: "admin-0001",
  firstName: "Sana",
  lastName: "Iqbal",
  email: "sana.iqbal@wadud.app",
  avatar: undefined as string | undefined,
};

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
    id: CURRENT_ADMIN.id,
    firstName: CURRENT_ADMIN.firstName,
    lastName: CURRENT_ADMIN.lastName,
    email: CURRENT_ADMIN.email,
    phone: "+923001234567",
    avatar: CURRENT_ADMIN.avatar,
    role: "admin",
    isVerified: true,
    isActive: true,
    country: "PK",
    language: "en",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  tokens: {
    accessToken: "mock-admin-access-token",
    refreshToken: "mock-admin-refresh-token",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  role: "admin",
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
        // TODO: POST /api/v1/auth/logout
        set({ session: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "wadud-admin-auth",
      partialize: (state) => ({ session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);
