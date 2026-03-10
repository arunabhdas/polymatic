import { create } from "zustand"

interface AuthState {
  token: string | null
  user: { id: string; email: string; plan: string } | null
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  logout: () => set({ token: null, user: null }),
}))
