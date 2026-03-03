import type {
  FeedItem,
  FeedParams,
  SentimentQuestion,
  SentimentDetail,
  Trend,
  MarketContract,
  MarketParams,
  SearchResults,
  SearchOptions,
  AlertConfig,
  Alert,
  GeoEvent,
  GeoBounds,
  LayerType,
  LoginCredentials,
  AuthResponse,
  PaginationParams,
  PaginatedResponse,
} from '@/types'

// ─── DataProvider Interface ──────────────────────────────────

export type Unsubscribe = () => void

export interface DataProvider {
  // Feed
  getFeedItems(params: FeedParams): Promise<PaginatedResponse<FeedItem>>
  subscribeFeed(callback: (items: FeedItem[]) => void): Unsubscribe

  // Sentiments
  getSentimentQuestions(params: PaginationParams): Promise<SentimentQuestion[]>
  getSentimentDetail(questionId: string): Promise<SentimentDetail>
  subscribeSentimentUpdates(
    questionId: string,
    callback: (question: SentimentQuestion) => void,
  ): Unsubscribe

  // Trends
  getTrends(): Promise<Trend[]>
  subscribeTrendUpdates(callback: (trends: Trend[]) => void): Unsubscribe

  // Markets
  getMarkets(params: MarketParams): Promise<PaginatedResponse<MarketContract>>
  getMarketDetail(marketId: string): Promise<MarketContract>
  subscribeMarketUpdates(callback: (contracts: MarketContract[]) => void): Unsubscribe

  // Search
  search(query: string, options?: SearchOptions): Promise<SearchResults>

  // Alerts
  getAlertConfigs(): Promise<AlertConfig[]>
  getActiveAlerts(): Promise<Alert[]>
  createAlertConfig(config: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertConfig>
  deleteAlertConfig(configId: string): Promise<void>
  dismissAlert(alertId: string): Promise<void>

  // Auth
  login(credentials: LoginCredentials): Promise<AuthResponse>
  refreshToken(token: string): Promise<AuthResponse>

  // Geo (P1)
  getGeoEvents(bounds: GeoBounds, layers: LayerType[]): Promise<GeoEvent[]>
  subscribeGeoUpdates(
    bounds: GeoBounds,
    callback: (events: GeoEvent[]) => void,
  ): Unsubscribe

  // Lifecycle
  initialize(): Promise<void>
  dispose(): void
}

// ─── Factory ─────────────────────────────────────────────────

let providerInstance: DataProvider | null = null

export async function getDataProvider(): Promise<DataProvider> {
  if (providerInstance) return providerInstance

  const mode = import.meta.env.VITE_DATA_SOURCE_MODE || 'mock'

  if (mode === 'mock') {
    const { MockProvider } = await import('./mockProvider')
    providerInstance = new MockProvider()
  } else if (mode === 'rsdip') {
    const { RSDIPProvider } = await import('./rsdipProvider')
    providerInstance = new RSDIPProvider()
  } else {
    throw new Error(`Unknown data source mode: ${mode}`)
  }

  await providerInstance.initialize()
  return providerInstance
}

export function resetDataProvider(): void {
  if (providerInstance) {
    providerInstance.dispose()
    providerInstance = null
  }
}
