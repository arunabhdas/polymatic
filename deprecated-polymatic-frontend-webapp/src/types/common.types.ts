// ─── Shared Types ───────────────────────────────────────────

export type Timestamp = string // ISO 8601

export type SourceType = 'twitter' | 'reddit' | 'telegram' | 'news' | 'structured' | 'market_signal'

export type Category = 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type SortOrder = 'asc' | 'desc'

export interface Entity {
  id: string
  name: string
  type: 'person' | 'organization' | 'country' | 'location' | 'event' | 'commodity'
  linkedTrendIds: string[]
  linkedMarketIds: string[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: SortOrder
}
