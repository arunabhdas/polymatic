import { FeedGenerator } from './generators/feedGenerator'
import { SentimentGenerator } from './generators/sentimentGenerator'
import { TrendGenerator } from './generators/trendGenerator'
import { MarketGenerator } from './generators/marketGenerator'
import { AlertGenerator } from './generators/alertGenerator'
import { GeoGenerator } from './generators/geoGenerator'

// ─── Mock Engine ─────────────────────────────────────────────
// Orchestrates all generators, ticks on interval, handles cross-domain correlations.

export interface MockEngineOptions {
  tickInterval?: number // ms between generator ticks (default: 6000)
  feedInterval?: number // ms between feed generation (default: 3000)
  sentimentBatchInterval?: number // ms between sentiment batches (default: 8000)
}

export class MockEngine {
  readonly feed: FeedGenerator
  readonly sentiments: SentimentGenerator
  readonly trends: TrendGenerator
  readonly markets: MarketGenerator
  readonly alerts: AlertGenerator
  readonly geo: GeoGenerator

  private tickTimer: ReturnType<typeof setInterval> | null = null
  private feedTimer: ReturnType<typeof setInterval> | null = null
  private sentimentTimer: ReturnType<typeof setInterval> | null = null
  private options: Required<MockEngineOptions>
  private feedSubscribers = new Set<(items: import('@/types').FeedItem[]) => void>()
  private trendSubscribers = new Set<(trends: import('@/types').Trend[]) => void>()
  private marketSubscribers = new Set<(contracts: import('@/types').MarketContract[]) => void>()
  private sentimentSubscribers = new Map<string, Set<(q: import('@/types').SentimentQuestion) => void>>()
  private geoSubscribers = new Set<(events: import('@/types').GeoEvent[]) => void>()

  constructor(options: MockEngineOptions = {}) {
    this.options = {
      tickInterval: options.tickInterval ?? 6_000,
      feedInterval: options.feedInterval ?? 3_000,
      sentimentBatchInterval: options.sentimentBatchInterval ?? 8_000,
    }

    this.feed = new FeedGenerator()
    this.sentiments = new SentimentGenerator()
    this.trends = new TrendGenerator()
    this.markets = new MarketGenerator()
    this.alerts = new AlertGenerator()
    this.geo = new GeoGenerator()

    // Wire alert generator to other generators
    this.alerts.setGenerators(this.sentiments, this.trends, this.markets)
  }

  start(): void {
    if (this.tickTimer) return

    // Main tick: trends, markets, alerts, geo
    this.tickTimer = setInterval(() => {
      this.trends.tick()
      this.markets.tick()
      this.alerts.tick()
      this.geo.tick()

      // Cross-domain: trend spikes → market jumps
      const trends = this.trends.getTrends()
      for (const trend of trends) {
        if (trend.velocity.delta > 8) {
          this.markets.applyTrendSpike(trend.id, trend.velocity.delta * 0.5)
        }
      }

      // Notify subscribers
      this.trendSubscribers.forEach(cb => cb(this.trends.getTrends()))
      this.marketSubscribers.forEach(cb => cb(this.markets.getMarkets()))
      this.geoSubscribers.forEach(cb => cb(this.geo.getEvents()))
    }, this.options.tickInterval)

    // Feed tick: more frequent
    this.feedTimer = setInterval(() => {
      const items = this.feed.generate()
      this.feedSubscribers.forEach(cb => cb(items))
    }, this.options.feedInterval)

    // Sentiment batch tick: 5-10s
    this.sentimentTimer = setInterval(() => {
      this.sentiments.tick()

      // Generate batches for each tracked question
      const questions = this.sentiments.getAllQuestions()
      for (const q of questions) {
        this.sentiments.generateBatch(q.id, 5 + Math.floor(Math.random() * 15))

        // Notify per-question subscribers
        const subs = this.sentimentSubscribers.get(q.id)
        if (subs) {
          const updated = this.sentiments.getQuestion(q.id)
          if (updated) subs.forEach(cb => cb(updated))
        }
      }

      // Cross-domain: update market sentimentScore from sentiment data
      const markets = this.markets.getMarkets()
      for (const market of markets) {
        const question = questions.find(q => q.relatedMarketIds.includes(market.id))
        if (question) {
          // This is read-only from the market generator's perspective
          // The sentimentScore will be computed in getMarkets/toContract
        }
      }
    }, this.options.sentimentBatchInterval)
  }

  stop(): void {
    if (this.tickTimer) {
      clearInterval(this.tickTimer)
      this.tickTimer = null
    }
    if (this.feedTimer) {
      clearInterval(this.feedTimer)
      this.feedTimer = null
    }
    if (this.sentimentTimer) {
      clearInterval(this.sentimentTimer)
      this.sentimentTimer = null
    }
  }

  // ─── Subscriptions ─────────────────────────────────────────

  subscribeFeed(callback: (items: import('@/types').FeedItem[]) => void): () => void {
    this.feedSubscribers.add(callback)
    return () => this.feedSubscribers.delete(callback)
  }

  subscribeTrends(callback: (trends: import('@/types').Trend[]) => void): () => void {
    this.trendSubscribers.add(callback)
    return () => this.trendSubscribers.delete(callback)
  }

  subscribeMarkets(callback: (contracts: import('@/types').MarketContract[]) => void): () => void {
    this.marketSubscribers.add(callback)
    return () => this.marketSubscribers.delete(callback)
  }

  subscribeSentiment(
    questionId: string,
    callback: (question: import('@/types').SentimentQuestion) => void,
  ): () => void {
    if (!this.sentimentSubscribers.has(questionId)) {
      this.sentimentSubscribers.set(questionId, new Set())
    }
    this.sentimentSubscribers.get(questionId)!.add(callback)
    return () => this.sentimentSubscribers.get(questionId)?.delete(callback)
  }

  subscribeGeo(callback: (events: import('@/types').GeoEvent[]) => void): () => void {
    this.geoSubscribers.add(callback)
    return () => this.geoSubscribers.delete(callback)
  }
}

// ─── Singleton ───────────────────────────────────────────────

let instance: MockEngine | null = null

export function getMockEngine(): MockEngine {
  if (!instance) {
    instance = new MockEngine()
  }
  return instance
}

export function resetMockEngine(): void {
  if (instance) {
    instance.stop()
    instance = null
  }
}
