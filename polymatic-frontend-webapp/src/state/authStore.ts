import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserTier } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tier: UserTier
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      tier: 'free',
      isAuthenticated: false,
      isLoading: false,

      login: async (_email, _password) => {
        set({ isLoading: true })
        // Stub: will be implemented in Epic 10 (Auth)
        // For development, auto-authenticate with mock user
        const mockUser: User = {
          id: 'dev-user-1',
          email: _email,
          name: 'Dev User',
          tier: 'quant',
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        }
        set({
          user: mockUser,
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          tier: mockUser.tier,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          tier: 'free',
          isAuthenticated: false,
        })
      },

      refreshAuth: async () => {
        // Stub: will be implemented in Epic 10
      },

      setUser: (user) => set({ user, tier: user.tier }),
    }),
    {
      name: 'polymatic-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        tier: state.tier,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
