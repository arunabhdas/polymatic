import type { Entity, SourceType, Timestamp, Severity, SortOrder } from './common.types';

export type FeedCategory = 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture';

export type FeedItemType = 'signal' | 'tweet' | 'market_move' | 'alert' | 'classification';

export type SentimentStance = 'supports_yes' | 'supports_no' | 'neutral' | 'ambiguous';

export interface GeoCoords {
  lat: number;
  lng: number;
}

export interface FeedMedia {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  summary?: string;
  content: string;
  category: FeedCategory;
  severity: Severity;
  velocity: number;
  timestamp: Timestamp;
  source: SourceType;
  sourceHandle: string;
  sourceDisplayName: string;
  sentimentStance?: SentimentStance;
  confidence?: number;
  clusterId?: string;
  geoCoords?: GeoCoords;
  entities: Entity[];
  relatedTrendIds: string[];
  relatedMarketIds: string[];
  media?: FeedMedia[];
}

export interface FeedCluster {
  id: string;
  leadItemId: string;
  itemIds: string[];
  title: string;
  category: FeedCategory;
  severity: Severity;
  eventCount: number;
  latestTimestamp: Timestamp;
}

export interface FeedFilters {
  categories?: FeedCategory[];
  types?: FeedItemType[];
  sources?: SourceType[];
  minSeverity?: Severity;
  timeRange?: '1h' | '6h' | '24h' | '7d' | 'all';
  trendId?: string;
}

export interface FeedParams extends FeedFilters {
  page?: number;
  limit?: number;
  sortBy?: 'timestamp' | 'severity' | 'velocity';
  sortOrder?: SortOrder;
}
