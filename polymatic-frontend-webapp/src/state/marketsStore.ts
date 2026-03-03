import { create } from 'zustand'
import type { MarketContract, Platform } from '@/types'

interface MarketsState {
  contracts: MarketContract[]
  activePlatformFilter: Platform | null
  sortBy: 'probability' | 'delta' | 'volume' | 'recent'
  selectedMarketId: string | null

  updateContracts: (contracts: MarketContract[]) => void
  setPlatformFilter: (platform: Platform | null) => void
  setSortBy: (sort: MarketsState['sortBy']) => void
  selectMarket: (id: string | null) => void
}

export const useMarketsStore = create<MarketsState>()((set) => ({
  contracts: [],
  activePlatformFilter: null,
  sortBy: 'probability',
  selectedMarketId: null,

  updateContracts: (contracts) => set({ contracts }),
  setPlatformFilter: (platform) => set({ activePlatformFilter: platform }),
  setSortBy: (sort) => set({ sortBy: sort }),
  selectMarket: (id) => set({ selectedMarketId: id }),
}))
