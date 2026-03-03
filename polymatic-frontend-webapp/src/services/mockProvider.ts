import { nanoid } from 'nanoid'
import type { DataProvider, Unsubscribe } from './dataProvider'
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
import { getMockEngine, type MockEngine } from '@/mock-data'

// ─── Mock Provider ───────────────────────────────────────────
// Full DataProvider implementation using mock generators.
// Simulates latency (100-300ms) for realistic loading states.

function delay(min = 100, max = 300): Promise<void> {
  return new Promise(resolve =>
    setTimeout(resolve, min + Math.random() * (max - min)),
  )
}

export class MockProvider implements DataProvider {
  private engine!: MockEngine
  private feedBuffer: FeedItem[] = []
  private feedUnsubscribe: (() => void) | null = null

  async initialize(): Promise<void> {
    this.engine = getMockEngine()
    this.engine.start()

    // Buffer feed items for pagination
    this.feedUnsubscribe = this.engine.subscribeFeed((items) => {
      this.feedBuffer = [...items, ...this.feedBuffer].slice(0, 500)
    })

    // Generate initial feed items
    this.feedBuffer = this.engine.feed.generate(50)
  }

  dispose(): void {
    this.feedUnsubscribe?.()
    this.engine.stop()
  }

  // ─── Feed ────────────────────────────────────────────────

  async getFeedItems(params: FeedParams): Promise<PaginatedResponse<FeedItem>> {
    await delay()

    let items = [...this.feedBuffer]

    // Apply filters
    const { filters } = params
    if (filters.categories.length > 0) {
      items = items.filter(i => filters.categories.includes(i.category))
    }
    if (filters.types.length > 0) {
      items = items.filter(i => filters.types.includes(i.type))
    }
    if (filters.sources.length > 0) {
      items = items.filter(i => filters.sources.includes(i.source))
    }
    if (filters.minSeverity) {
      const order = ['low', 'medium', 'high', 'critical']
      const minIdx = order.indexOf(filters.minSeverity)
      items = items.filter(i => order.indexOf(i.severity) >= minIdx)
    }
    if (filters.trendId) {
      items = items.filter(i => i.relatedTrendIds.includes(filters.trendId!))
    }
    if (filters.timeRange !== 'all') {
      const ranges: Record<string, number> = {
        '1h': 3_600_000,
        '6h': 21_600_000,
        '24h': 86_400_000,
        '7d': 604_800_000,
      }
      const cutoff = Date.now() - (ranges[filters.timeRange] ?? Infinity)
      items = items.filter(i => new Date(i.timestamp).getTime() > cutoff)
    }

    // Pagination
    const { page, limit } = params
    const start = (page - 1) * limit
    const paged = items.slice(start, start + limit)

    return {
      data: paged,
      page,
      limit,
      total: items.length,
      hasMore: start + limit < items.length,
    }
  }

  subscribeFeed(callback: (items: FeedItem[]) => void): Unsubscribe {
    return this.engine.subscribeFeed(callback)
  }

  // ─── Sentiments ──────────────────────────────────────────

  async getSentimentQuestions(_params: PaginationParams): Promise<SentimentQuestion[]> {
    await delay()
    return this.engine.sentiments.getAllQuestions()
  }

  async getSentimentDetail(questionId: string): Promise<SentimentDetail> {
    await delay(150, 400)
    const detail = this.engine.sentiments.getDetail(questionId)
    if (!detail) throw new Error(`Question not found: ${questionId}`)
    return detail
  }

  subscribeSentimentUpdates(
    questionId: string,
    callback: (question: SentimentQuestion) => void,
  ): Unsubscribe {
    return this.engine.subscribeSentiment(questionId, callback)
  }

  // ─── Trends ──────────────────────────────────────────────

  async getTrends(): Promise<Trend[]> {
    await delay()
    return this.engine.trends.getTrends()
  }

  subscribeTrendUpdates(callback: (trends: Trend[]) => void): Unsubscribe {
    return this.engine.subscribeTrends(callback)
  }

  // ─── Markets ─────────────────────────────────────────────

  async getMarkets(params: MarketParams): Promise<PaginatedResponse<MarketContract>> {
    await delay()

    let contracts = this.engine.markets.getMarkets()

    // Apply filters
    const { filters } = params
    if (filters.platforms.length > 0) {
      contracts = contracts.filter(c => filters.platforms.includes(c.platform))
    }
    if (filters.categories.length > 0) {
      contracts = contracts.filter(c => filters.categories.includes(c.category))
    }
    if (filters.minVolume) {
      contracts = contracts.filter(c => c.volume >= filters.minVolume!)
    }
    if (filters.minDelta) {
      contracts = contracts.filter(c => Math.abs(c.delta) >= filters.minDelta!)
    }

    // Sort
    switch (filters.sortBy) {
      case 'volume':
        contracts.sort((a, b) => b.volume - a.volume)
        break
      case 'delta':
        contracts.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        break
      case 'recent':
        contracts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      default:
        contracts.sort((a, b) => b.probability - a.probability)
    }

    // Enrich with sentiment scores
    const questions = this.engine.sentiments.getAllQuestions()
    contracts = contracts.map(c => {
      const question = questions.find(q => q.relatedMarketIds.includes(c.id))
      return {
        ...c,
        sentimentScore: question?.score ?? null,
        sentimentDelta: question?.marketDelta ?? null,
      }
    })

    const { page, limit } = params
    const start = (page - 1) * limit
    const paged = contracts.slice(start, start + limit)

    return {
      data: paged,
      page,
      limit,
      total: contracts.length,
      hasMore: start + limit < contracts.length,
    }
  }

  async getMarketDetail(marketId: string): Promise<MarketContract> {
    await delay()
    const contract = this.engine.markets.getMarket(marketId)
    if (!contract) throw new Error(`Market not found: ${marketId}`)

    // Enrich with sentiment
    const questions = this.engine.sentiments.getAllQuestions()
    const question = questions.find(q => q.relatedMarketIds.includes(marketId))

    return {
      ...contract,
      sentimentScore: question?.score ?? null,
      sentimentDelta: question?.marketDelta ?? null,
    }
  }

  subscribeMarketUpdates(callback: (contracts: MarketContract[]) => void): Unsubscribe {
    return this.engine.subscribeMarkets(callback)
  }

  // ─── Search ──────────────────────────────────────────────

  async search(query: string, _options?: SearchOptions): Promise<SearchResults> {
    await delay(200, 500)

    const q = query.toLowerCase()

    const trends = this.engine.trends.getTrends().filter(t =>
      t.hashtag.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q),
    )

    const markets = this.engine.markets.getMarkets().filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.questionText.toLowerCase().includes(q),
    )

    const sentiments = this.engine.sentiments.getAllQuestions().filter(s =>
      s.text.toLowerCase().includes(q),
    )

    const feedItems = this.feedBuffer.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.content.toLowerCase().includes(q),
    ).slice(0, 20)

    return {
      trends: trends.slice(0, 10),
      markets: markets.slice(0, 10),
      sentiments: sentiments.slice(0, 10),
      feedItems,
      totalCount: trends.length + markets.length + sentiments.length + feedItems.length,
    }
  }

  // ─── Alerts ──────────────────────────────────────────────

  async getAlertConfigs(): Promise<AlertConfig[]> {
    await delay()
    return this.engine.alerts.getConfigs()
  }

  async getActiveAlerts(): Promise<Alert[]> {
    await delay()
    return this.engine.alerts.getAlerts()
  }

  async createAlertConfig(
    config: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AlertConfig> {
    await delay()
    const now = new Date().toISOString()
    const full: AlertConfig = {
      ...config,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    }
    this.engine.alerts.addConfig(full)
    return full
  }

  async deleteAlertConfig(configId: string): Promise<void> {
    await delay()
    this.engine.alerts.removeConfig(configId)
  }

  async dismissAlert(alertId: string): Promise<void> {
    await delay()
    this.engine.alerts.dismissAlert(alertId)
  }

  // ─── Auth ────────────────────────────────────────────────

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(300, 600)
    return {
      user: {
        id: 'dev-user-1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        tier: 'quant',
        avatarUrl: null,
        onboardingComplete: true,
        preferences: {
          theme: 'dark',
          defaultLayout: 'dashboard',
          feedDensity: 'comfortable',
          notificationsEnabled: true,
        },
        createdAt: new Date().toISOString(),
      },
      token: `mock-jwt-${nanoid()}`,
      refreshToken: `mock-refresh-${nanoid()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  async refreshToken(_token: string): Promise<AuthResponse> {
    await delay()
    return this.login({ email: 'dev@polymatic.app', password: '' })
  }

  // ─── Geo ─────────────────────────────────────────────────

  async getGeoEvents(bounds: GeoBounds, _layers: LayerType[]): Promise<GeoEvent[]> {
    await delay()
    return this.engine.geo.getEvents(bounds)
  }

  subscribeGeoUpdates(
    _bounds: GeoBounds,
    callback: (events: GeoEvent[]) => void,
  ): Unsubscribe {
    return this.engine.subscribeGeo(callback)
  }
}
