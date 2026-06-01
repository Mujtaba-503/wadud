import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole, AuthSession } from "@wadud/types";
import { MOCK_PATIENTS } from "@wadud/mocks";

/**
 * @api POST /api/v1/auth/login
 * @api POST /api/v1/auth/signup
 * @api POST /api/v1/auth/logout
 * @api POST /api/v1/auth/refresh
 * @api POST /api/v1/auth/verify-otp
 * Replace mock session with real JWT flow from Go auth-service
 */

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: Partial<AuthSession>) => Promise<void>;
  logout: () => void;
  setSession: (session: AuthSession) => void;
  clearError: () => void;
  switchRole: (role: UserRole) => void; // Dev utility
}

// Mock session for development
const MOCK_SESSION: AuthSession = {
  user: {
    id: MOCK_PATIENTS[0].id,
    firstName: MOCK_PATIENTS[0].firstName,
    lastName: MOCK_PATIENTS[0].lastName,
    email: MOCK_PATIENTS[0].email,
    phone: MOCK_PATIENTS[0].phone,
    avatar: MOCK_PATIENTS[0].avatar,
    role: "patient",
    isVerified: true,
    isActive: true,
    country: "PK",
    language: "en",
    createdAt: MOCK_PATIENTS[0].createdAt,
    updatedAt: MOCK_PATIENTS[0].updatedAt,
  },
  tokens: {
    accessToken: "mock-access-token-xyz",
    refreshToken: "mock-refresh-token-xyz",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  role: "patient",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: MOCK_SESSION, // Pre-authenticated for development
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        // TODO: Replace with real API call
        // const res = await fetch("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
        await new Promise((r) => setTimeout(r, 1200)); // Simulate network
        set({ session: MOCK_SESSION, isAuthenticated: true, isLoading: false });
      },

      signup: async (_payload) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1500));
        set({ session: MOCK_SESSION, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        // TODO: Call POST /api/v1/auth/logout to invalidate refresh token
        set({ session: null, isAuthenticated: false, error: null });
      },

      setSession: (session) => set({ session, isAuthenticated: true }),

      clearError: () => set({ error: null }),

      switchRole: (role) => {
        const { session } = get();
        if (!session) return;
        set({ session: { ...session, role, user: { ...session.user, role } } });
      },
    }),
    {
      name: "wadud-auth",
      partialize: (state) => ({ session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);
