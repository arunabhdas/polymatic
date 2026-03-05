import type { Timestamp } from './common.types';

export type UserTier = 'free' | 'pro' | 'quant';

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultLayout: 'dashboard' | 'focus' | 'clean';
  feedDensity: 'compact' | 'expanded' | 'mixed';
  notificationsEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  preferences: UserPreferences;
  createdAt: Timestamp;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string; // Optional if implementing magic links
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Timestamp;
}
