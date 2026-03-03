import { create } from 'zustand'
import type { Trend } from '@/types'

interface TrendsState {
  trends: Trend[]
  selectedTrendId: string | null

  updateTrends: (trends: Trend[]) => void
  selectTrend: (id: string | null) => void
}

export const useTrendsStore = create<TrendsState>()((set) => ({
  trends: [],
  selectedTrendId: null,

  updateTrends: (trends) => set({ trends }),
  selectTrend: (id) => set({ selectedTrendId: id }),
}))
