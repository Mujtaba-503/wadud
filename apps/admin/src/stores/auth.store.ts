import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, UserRole } from "@wadud/types";
import { MOCK_DOCTORS } from "@wadud/mocks";

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setSession: (session: AuthSession) => void;
}

// Default session is Dr. Ahmad Al-Rashidi
const DEFAULT_SESSION: AuthSession = {
  user: {
    id: MOCK_DOCTORS[0].id,
    firstName: MOCK_DOCTORS[0].firstName,
    lastName: MOCK_DOCTORS[0].lastName,
    email: MOCK_DOCTORS[0].email,
    phone: MOCK_DOCTORS[0].phone || "+971501234567",
    avatar: MOCK_DOCTORS[0].avatar,
    role: "doctor",
    isVerified: true,
    isActive: true,
    country: MOCK_DOCTORS[0].country,
    language: "en",
    createdAt: MOCK_DOCTORS[0].createdAt,
    updatedAt: MOCK_DOCTORS[0].updatedAt,
  },
  tokens: {
    accessToken: "admin-access-token-xyz",
    refreshToken: "admin-refresh-token-xyz",
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  role: "doctor",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: DEFAULT_SESSION,
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (email: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1000));
        
        let userPayload = DEFAULT_SESSION.user;
        if (role === "admin") {
          userPayload = {
            id: "admin-uuid-1111",
            firstName: "System",
            lastName: "Administrator",
            email: email,
            phone: "+92 300 0000000",
            avatar: "https://api.dicebear.com/9.x/personas/svg?seed=AdminSystem",
            role: "admin",
            isVerified: true,
            isActive: true,
            country: "PK",
            language: "en",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        set({
          session: {
            user: userPayload,
            tokens: DEFAULT_SESSION.tokens,
            role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ session: null, isAuthenticated: false, error: null });
      },

      setSession: (session) => set({ session, isAuthenticated: true }),
    }),
    {
      name: "wadud-admin-auth",
      partialize: (state) => ({ session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);
