import type { Timestamp } from './common.types'

// ─── Auth ────────────────────────────────────────────────────

export type UserTier = 'free' | 'pro' | 'quant'

export interface User {
  id: string
  email: string
  name: string
  tier: UserTier
  avatarUrl: string | null
  onboardingComplete: boolean
  preferences: UserPreferences
  createdAt: Timestamp
}

export interface UserPreferences {
  theme: 'dark' | 'light'
  defaultLayout: 'dashboard' | 'focus' | 'clean'
  feedDensity: 'compact' | 'comfortable'
  notificationsEnabled: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  refreshToken: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: Timestamp
}
