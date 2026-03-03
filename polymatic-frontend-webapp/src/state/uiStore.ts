import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LayoutMode, RightPanelContentType } from '@/types'
import { eventBus } from '@/lib/eventBus'

interface UIState {
  layoutMode: LayoutMode
  sidebarCollapsed: boolean
  theme: 'dark' | 'light'
  rightPanelContent: RightPanelContentType
  viewportWidth: number

  setLayoutMode: (mode: LayoutMode) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
  setRightPanelContent: (content: RightPanelContentType) => void
  setViewportWidth: (width: number) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      layoutMode: 'dashboard',
      sidebarCollapsed: false,
      theme: 'dark',
      rightPanelContent: { kind: 'empty' },
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1440,

      setLayoutMode: (mode) => {
        set({ layoutMode: mode })
        eventBus.emit('layout:mode-changed', { mode })
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.setAttribute('data-theme', next)
        eventBus.emit('theme:changed', { theme: next })
      },

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
        eventBus.emit('theme:changed', { theme })
      },

      setRightPanelContent: (content) => set({ rightPanelContent: content }),

      setViewportWidth: (width) => set({ viewportWidth: width }),
    }),
    {
      name: 'polymatic-ui',
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        theme: state.theme,
      }),
    },
  ),
)
