import { create } from 'zustand'
import type { FeedItem, FeedFilters } from '@/types'

interface FeedState {
  items: FeedItem[]
  filters: FeedFilters
  selectedItemId: string | null
  activeTrendFilter: string | null

  addItems: (items: FeedItem[]) => void
  updateFilters: (filters: Partial<FeedFilters>) => void
  selectItem: (id: string | null) => void
  setTrendFilter: (trendId: string | null) => void
}

export const useFeedStore = create<FeedState>()((set) => ({
  items: [],
  filters: {
    categories: [],
    types: [],
    sources: [],
    minSeverity: null,
    timeRange: 'all',
    trendId: null,
  },
  selectedItemId: null,
  activeTrendFilter: null,

  addItems: (items) => set((s) => ({ items: [...items, ...s.items] })),
  updateFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  selectItem: (id) => set({ selectedItemId: id }),
  setTrendFilter: (trendId) => set({ activeTrendFilter: trendId }),
}))
