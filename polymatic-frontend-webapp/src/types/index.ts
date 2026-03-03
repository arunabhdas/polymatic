// ─── User & Auth ─────────────────────────────────────────────

export type UserTier = 'free' | 'pro' | 'quant'

export interface User {
  id: string
  email: string
  name: string
  tier: UserTier
  avatarUrl: string | null
  createdAt: string
}

// ─── Feed ────────────────────────────────────────────────────

export type FeedItemType = 'signal' | 'tweet' | 'market_move' | 'alert' | 'classification'

export type Category = 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface FeedItem {
  id: string
  type: FeedItemType
  title: string
  summary: string
  category: Category
  severity: Severity
  velocity: number
  timestamp: string
  source: string
  relatedTrendIds: string[]
  relatedMarketIds: string[]
  confidence: number
  expanded?: boolean
}

export interface FeedFilters {
  categories: Category[]
  types: FeedItemType[]
  minSeverity: Severity | null
  timeRange: '1h' | '6h' | '24h' | '7d' | 'all'
}

// ─── Trends ──────────────────────────────────────────────────

export interface Trend {
  id: string
  name: string
  category: Category
  velocity: number
  delta: number
  volume: number
  sparklineData: number[]
  timestamp: string
}

// ─── Sentiments ──────────────────────────────────────────────

export interface SentimentQuestion {
  id: string
  text: string
  category: Category
  yesCount: number
  noCount: number
  score: number // YES / (YES + NO)
  confidence: number
  trend: 'rising' | 'falling' | 'stable'
  relatedMarketIds: string[]
  sparklineData: number[]
  timestamp: string
}

// ─── Markets ─────────────────────────────────────────────────

export type Platform = 'polymarket' | 'kalshi'

export interface MarketContract {
  id: string
  title: string
  platform: Platform
  probability: number
  previousProbability: number
  delta: number
  volume: number
  category: Category
  sentimentScore: number | null
  sparklineData: number[]
  expiresAt: string
  timestamp: string
}

// ─── Search ──────────────────────────────────────────────────

export interface SearchResults {
  trends: Trend[]
  markets: MarketContract[]
  sentiments: SentimentQuestion[]
  feedItems: FeedItem[]
}

export interface SavedSearch {
  id: string
  query: string
  createdAt: string
}

// ─── Alerts ──────────────────────────────────────────────────

export type AlertTriggerType = 'threshold' | 'velocity' | 'sentiment_shift' | 'market_move'

export interface AlertConfig {
  id: string
  name: string
  triggerType: AlertTriggerType
  conditions: Record<string, unknown>
  enabled: boolean
  createdAt: string
}

export interface Alert {
  id: string
  configId: string
  title: string
  message: string
  severity: Severity
  read: boolean
  timestamp: string
}

// ─── Geo ─────────────────────────────────────────────────────

export interface CameraPosition {
  longitude: number
  latitude: number
  height: number
}

export type LayerType = 'events' | 'sentiment' | 'markets' | 'poi' | 'motion-trails'

export interface GeoRegion {
  id: string
  name: string
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

// ─── Layout ──────────────────────────────────────────────────

export type LayoutMode = 'tactical' | 'panoptic' | 'clean'

export type RightPanelContentType =
  | { kind: 'empty' }
  | { kind: 'feed-detail'; itemId: string }
  | { kind: 'market-detail'; marketId: string }
  | { kind: 'sentiment-detail'; questionId: string }
  | { kind: 'trend-detail'; trendId: string }

// ─── Feature Flags ───────────────────────────────────────────

export type FeatureFlag =
  | 'enableGeoView'
  | 'enableDetect'
  | 'enableWhaleTracking'
  | 'enableTimeline'
  | 'enableLightMode'
