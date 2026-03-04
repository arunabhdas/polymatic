import type { Timestamp, Category, PaginationParams } from './common.types'

// ─── Markets ─────────────────────────────────────────────────

export type Platform = 'polymarket' | 'kalshi'

export interface PricePoint {
  timestamp: Timestamp
  probability: number
  volume: number
}

export interface MarketContract {
  id: string
  questionText: string
  title: string
  platform: Platform
  probability: number
  previousProbability: number
  probability24hAgo: number
  change24h: number
  delta: number
  volume: number
  category: Category
  sentimentScore: number | null
  sentimentDelta: number | null
  linkedTrendIds: string[]
  priceHistory: PricePoint[]
  sparklineData: number[]
  expiresAt: Timestamp
  timestamp: Timestamp
}

export interface MarketFilters {
  platforms: Platform[]
  categories: Category[]
  minVolume: number | null
  minDelta: number | null
  sortBy: 'probability' | 'volume' | 'delta' | 'recent'
}

export interface MarketParams extends PaginationParams {
  filters: MarketFilters
}
