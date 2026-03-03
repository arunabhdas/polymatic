import type { Timestamp, Category } from './common.types'
import type { FeedItem } from './feed.types'
import type { Trend } from './trend.types'
import type { MarketContract } from './market.types'
import type { SentimentQuestion } from './sentiment.types'

// ─── Search ──────────────────────────────────────────────────

export interface SearchQuery {
  text: string
  category?: Category
  timeRange?: '1h' | '6h' | '24h' | '7d' | 'all'
}

export interface SearchOptions {
  limit?: number
  categories?: Category[]
  includeExpired?: boolean
}

export interface SearchResults {
  trends: Trend[]
  markets: MarketContract[]
  sentiments: SentimentQuestion[]
  feedItems: FeedItem[]
  totalCount: number
}

export interface SavedSearch {
  id: string
  query: string
  category?: Category
  createdAt: Timestamp
  lastRunAt: Timestamp
}
