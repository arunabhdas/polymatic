// Re-export all domain types from a single entry point
// Import from '@/types' or from specific files like '@/types/feed.types'

export type {
  Timestamp,
  SourceType,
  Category,
  Severity,
  SortOrder,
  Entity,
  Pagination,
  PaginationParams,
} from './common.types'

export type {
  FeedItemType,
  FeedItem,
  FeedMedia,
  FeedCluster,
  FeedFilters,
  FeedParams,
} from './feed.types'

export type {
  StanceType,
  SentimentDirection,
  ConfidenceLevel,
  SentimentQuestion,
  StanceBreakdown,
  ClassifiedTweet,
  AggregateScore,
  SentimentDetail,
  PredictionBrief,
} from './sentiment.types'

export type {
  TrendLifecycle,
  TrendCategory,
  VelocityScore,
  Trend,
} from './trend.types'

export type {
  Platform,
  PricePoint,
  MarketContract,
  MarketFilters,
  MarketParams,
} from './market.types'

export type {
  SearchQuery,
  SearchOptions,
  SearchResults,
  SavedSearch,
} from './search.types'

export type {
  AlertType,
  AlertTriggerType,
  AlertChannel,
  AlertConfig,
  Alert,
} from './alert.types'

export type {
  GeoEventType,
  LayerType,
  GeoCoords,
  GeoBounds,
  GeoEvent,
  GeoLayer,
  POI,
  MotionTrack,
  CameraPosition,
  GeoRegion,
} from './geo.types'

export type {
  UserTier,
  User,
  UserPreferences,
  AuthState,
  LoginCredentials,
  AuthResponse,
} from './auth.types'

export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  WSMessageType,
  WSMessage,
} from './api.types'

// ─── Layout (UI-only, no domain file needed) ────────────────

export type LayoutMode = 'dashboard' | 'focus' | 'clean'

export type RightPanelContentType =
  | { kind: 'empty' }
  | { kind: 'feed-detail'; itemId: string }
  | { kind: 'market-detail'; marketId: string }
  | { kind: 'sentiment-detail'; questionId: string }
  | { kind: 'trend-detail'; trendId: string }
  | { kind: 'trends-list' }

// ─── Feature Flags ──────────────────────────────────────────

export type FeatureFlag =
  | 'enableGeoView'
  | 'enableDetect'
  | 'enableWhaleTracking'
  | 'enableTimeline'
  | 'enableLightMode'
