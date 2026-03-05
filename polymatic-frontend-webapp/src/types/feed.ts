export type Severity = number // 0 to 100
export type Timestamp = number // Unix milliseconds

export interface Entity {
  id: string
  name: string
  type: "person" | "organization" | "location" | "concept" | "product"
}

export type SourceType = "twitter" | "reddit" | "telegram" | "news" | "structured" | "market_signal"

export interface FeedItem {
  id: string
  clusterId?: string
  source: SourceType
  author?: {
    name: string
    avatar?: string
    handle?: string
  }
  content: string
  timestamp: Timestamp
  entities: Entity[]
  trendIds: string[]
  sentimentStance?: "bullish" | "bearish" | "neutral"
  marketCorrelation?: number // 0 to 1
  media?: {
    type: "image" | "video" | "link"
    url: string
    thumbnail?: string
  }[]
  severity: Severity
  geoCoords?: {
    lat: number
    lng: number
  }
}

export interface FeedFilters {
  sources: SourceType[]
  minSeverity: number
  searchQuery: string
  activeTrendId: string | null
}
