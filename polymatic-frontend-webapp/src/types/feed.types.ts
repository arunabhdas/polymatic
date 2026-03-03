import type { Timestamp, Category, Severity, SourceType, Entity, PaginationParams } from './common.types'

// ─── Feed ────────────────────────────────────────────────────

export type FeedItemType = 'signal' | 'tweet' | 'market_move' | 'alert' | 'classification'

export interface FeedItem {
  id: string
  type: FeedItemType
  title: string
  summary: string
  content: string
  category: Category
  severity: Severity
  velocity: number
  timestamp: Timestamp
  source: SourceType
  sourceHandle: string
  sourceDisplayName: string
  entities: Entity[]
  relatedTrendIds: string[]
  relatedMarketIds: string[]
  sentimentStance: 'supports_yes' | 'supports_no' | 'neutral' | null
  confidence: number
  clusterId: string | null
  geoCoords: { lat: number; lng: number } | null
  media: FeedMedia[]
  expanded?: boolean
}

export interface FeedMedia {
  type: 'image' | 'video' | 'link'
  url: string
  thumbnailUrl?: string
  caption?: string
}

export interface FeedCluster {
  id: string
  leadItemId: string
  itemIds: string[]
  title: string
  category: Category
  severity: Severity
  eventCount: number
  latestTimestamp: Timestamp
}

export interface FeedFilters {
  categories: Category[]
  types: FeedItemType[]
  sources: SourceType[]
  minSeverity: Severity | null
  timeRange: '1h' | '6h' | '24h' | '7d' | 'all'
  trendId: string | null
}

export interface FeedParams extends PaginationParams {
  filters: FeedFilters
}
