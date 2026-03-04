import { create } from 'zustand'
import type { AlertConfig, Alert } from '@/types'

interface AlertsState {
  configs: AlertConfig[]
  activeAlerts: Alert[]
  unreadCount: number

  addConfig: (config: AlertConfig) => void
  removeConfig: (id: string) => void
  addAlert: (alert: Alert) => void
  dismissAlert: (id: string) => void
  markAllRead: () => void
}

export const useAlertsStore = create<AlertsState>()((set) => ({
  configs: [],
  activeAlerts: [],
  unreadCount: 0,

  addConfig: (config) => set((s) => ({ configs: [...s.configs, config] })),
  removeConfig: (id) => set((s) => ({ configs: s.configs.filter((c) => c.id !== id) })),
  addAlert: (alert) =>
    set((s) => ({
      activeAlerts: [alert, ...s.activeAlerts],
      unreadCount: s.unreadCount + 1,
    })),
  dismissAlert: (id) =>
    set((s) => ({
      activeAlerts: s.activeAlerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({
      activeAlerts: s.activeAlerts.map((a) => ({ ...a, read: true })),
      unreadCount: 0,
    })),
}))
