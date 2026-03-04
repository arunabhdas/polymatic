import type { MarketContract, PricePoint, Category } from '@/types'
import { seedMarkets, type SeedMarket } from '../seed/markets'

// ─── Market Generator ────────────────────────────────────────
// Brownian motion with mean-reversion. Occasional jumps correlated with trends.

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

interface MarketState {
  seed: SeedMarket
  probability: number
  previousProbability: number
  priceHistory: PricePoint[]
  trueProb: number // mean-reversion target
  volatility: number
  volume: number
}

export class MarketGenerator {
  private markets = new Map<string, MarketState>()

  constructor() {
    this.initializeFromSeed()
  }

  private initializeFromSeed(): void {
    for (const seed of seedMarkets) {
      const history = this.generateInitialHistory(seed)

      this.markets.set(seed.id, {
        seed,
        probability: seed.probability,
        previousProbability: seed.probability24hAgo,
        priceHistory: history,
        trueProb: seed.probability,
        volatility: this.getVolatilityForCategory(seed.category),
        volume: seed.volume,
      })
    }
  }

  private getVolatilityForCategory(category: Category): number {
    switch (category) {
      case 'geopolitics': return 1.8
      case 'economics': return 1.2
      case 'technology': return 1.5
      case 'sports': return 1.0
      case 'culture': return 0.8
    }
  }

  private generateInitialHistory(seed: SeedMarket): PricePoint[] {
    const now = Date.now()
    const points = 48
    const interval = (24 * 60 * 60 * 1000) / points
    const history: PricePoint[] = []

    let prob = seed.probability24hAgo
    const target = seed.probability
    const drift = (target - prob) / points

    for (let i = 0; i < points; i++) {
      const noise = (Math.random() - 0.5) * 3
      prob = clamp(prob + drift + noise, 1, 99)

      history.push({
        timestamp: new Date(now - (points - i) * interval).toISOString(),
        probability: Math.round(prob * 10) / 10,
        volume: Math.round(seed.volume / points * (0.5 + Math.random())),
      })
    }

    return history
  }

  tick(): void {
    for (const [, state] of this.markets) {
      state.previousProbability = state.probability

      // Brownian motion with mean-reversion
      const meanReversion = (state.trueProb - state.probability) * 0.05
      const brownian = (Math.random() - 0.5) * state.volatility * 2
      const jump = Math.random() < 0.02 ? (Math.random() - 0.5) * 10 : 0

      state.probability = clamp(
        state.probability + meanReversion + brownian + jump,
        1,
        99,
      )

      // Occasional true probability drift
      if (Math.random() < 0.05) {
        state.trueProb = clamp(state.trueProb + (Math.random() - 0.5) * 3, 3, 97)
      }

      // Volume fluctuation
      state.volume = Math.round(
        state.seed.volume * (0.8 + Math.random() * 0.4) +
        Math.abs(jump) * 100_000 // Volume spikes on jumps
      )

      // Add to price history
      state.priceHistory.push({
        timestamp: new Date().toISOString(),
        probability: Math.round(state.probability * 10) / 10,
        volume: Math.round(state.volume / 48),
      })

      // Keep last 48 points
      if (state.priceHistory.length > 48) {
        state.priceHistory.shift()
      }
    }
  }

  // Apply correlated jump when a trend spikes
  applyTrendSpike(trendId: string, magnitude: number): void {
    for (const [, state] of this.markets) {
      if (state.seed.linkedTrendIds.includes(trendId)) {
        const jump = magnitude * (0.5 + Math.random() * 0.5) * (Math.random() > 0.3 ? 1 : -1)
        state.probability = clamp(state.probability + jump, 1, 99)
        state.volume = Math.round(state.volume * (1.5 + Math.random()))
      }
    }
  }

  getMarkets(): MarketContract[] {
    return Array.from(this.markets.values()).map(state => this.toContract(state))
  }

  getMarket(id: string): MarketContract | null {
    const state = this.markets.get(id)
    return state ? this.toContract(state) : null
  }

  getMarketsByFilter(filter: {
    platforms?: string[]
    categories?: string[]
    minVolume?: number
  }): MarketContract[] {
    return this.getMarkets().filter(m => {
      if (filter.platforms?.length && !filter.platforms.includes(m.platform)) return false
      if (filter.categories?.length && !filter.categories.includes(m.category)) return false
      if (filter.minVolume && m.volume < filter.minVolume) return false
      return true
    })
  }

  private toContract(state: MarketState): MarketContract {
    const firstProb = state.priceHistory[0]?.probability ?? state.seed.probability24hAgo
    const change24h = Math.round((state.probability - firstProb) * 10) / 10

    return {
      id: state.seed.id,
      questionText: state.seed.questionText,
      title: state.seed.title,
      platform: state.seed.platform,
      probability: Math.round(state.probability * 10) / 10,
      previousProbability: Math.round(state.previousProbability * 10) / 10,
      probability24hAgo: state.priceHistory[0]?.probability ?? state.seed.probability24hAgo,
      change24h,
      delta: change24h,
      volume: state.volume,
      category: state.seed.category,
      sentimentScore: null, // Set by orchestrator when sentiment data available
      sentimentDelta: null,
      linkedTrendIds: state.seed.linkedTrendIds,
      priceHistory: [...state.priceHistory],
      sparklineData: state.priceHistory.map(p => p.probability),
      expiresAt: state.seed.expiresAt,
      timestamp: new Date().toISOString(),
    }
  }
}
