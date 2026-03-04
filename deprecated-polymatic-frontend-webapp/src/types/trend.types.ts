import type { Timestamp, Category, Entity } from './common.types'

// ─── Trends ──────────────────────────────────────────────────

export type TrendLifecycle = 'emerging' | 'trending' | 'peaking' | 'cooling'

export type TrendCategory = Category

export interface VelocityScore {
  current: number
  delta: number // change since last tick
  peak: number
  history: number[] // last 24h velocity points
}

export interface Trend {
  id: string
  hashtag: string
  name: string
  category: TrendCategory
  lifecycle: TrendLifecycle
  velocity: VelocityScore
  eventCount: number
  linkedMarketIds: string[]
  topEntities: Entity[]
  sparklineData: number[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
