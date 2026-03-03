import { nanoid } from 'nanoid'
import type { Trend, TrendLifecycle, VelocityScore } from '@/types'
import { seedTrends, type SeedTrend } from '../seed/trends'
import { seedEntities } from '../seed/entities'

// ─── Trend Generator ─────────────────────────────────────────
// Velocity follows sigmoid curve. Lifecycle transitions at thresholds.

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface TrendState {
  seed: SeedTrend
  velocity: number
  velocityDelta: number
  peakVelocity: number
  lifecycle: TrendLifecycle
  velocityHistory: number[]
  eventCount: number
  age: number // ticks since creation
}

// Lifecycle thresholds
const EMERGING_TO_TRENDING = 35
const TRENDING_TO_PEAKING = 70
const PEAKING_DECAY_THRESHOLD = -2 // velocity delta below this → cooling
const COOLING_TO_DEAD = 8
const RE_ACCELERATION_CHANCE = 0.02

export class TrendGenerator {
  private trends = new Map<string, TrendState>()
  private tickCount = 0

  constructor() {
    this.initializeFromSeed()
  }

  private initializeFromSeed(): void {
    for (const seed of seedTrends) {
      this.trends.set(seed.id, {
        seed,
        velocity: seed.velocity,
        velocityDelta: seed.velocityDelta,
        peakVelocity: seed.velocity,
        lifecycle: seed.lifecycle,
        velocityHistory: this.generateInitialHistory(seed.velocity),
        eventCount: seed.eventCount,
        age: Math.floor(Math.random() * 100) + 10,
      })
    }
  }

  private generateInitialHistory(velocity: number): number[] {
    const history: number[] = []
    let v = velocity * 0.3
    for (let i = 0; i < 24; i++) {
      v = clamp(v + (velocity - v) * 0.1 + (Math.random() - 0.5) * 8, 0, 100)
      history.push(Math.round(v))
    }
    return history
  }

  tick(): void {
    this.tickCount++

    for (const [, state] of this.trends) {
      this.advanceVelocity(state)
      this.updateLifecycle(state)
      state.velocityHistory.push(Math.round(state.velocity))
      if (state.velocityHistory.length > 48) {
        state.velocityHistory.shift()
      }
      state.eventCount += Math.floor(Math.random() * 5)
      state.age++
    }

    // Remove dead trends
    for (const [trendId, state] of this.trends) {
      if (state.lifecycle === 'cooling' && state.velocity < COOLING_TO_DEAD && state.age > 200) {
        this.trends.delete(trendId)
      }
    }

    // Occasionally spawn new trend (every ~50 ticks ≈ 5 min at 6s interval)
    if (this.tickCount % 50 === 0 && this.trends.size < 15) {
      this.spawnNewTrend()
    }
  }

  private advanceVelocity(state: TrendState): void {
    const { lifecycle } = state

    let acceleration = 0

    switch (lifecycle) {
      case 'emerging':
        // Sigmoid growth: slow start accelerating
        acceleration = (0.5 + Math.random()) * 2
        break
      case 'trending':
        // Rapid growth
        acceleration = (0.3 + Math.random()) * 1.5
        break
      case 'peaking':
        // Plateau with slight decline
        acceleration = (Math.random() - 0.6) * 1.5
        break
      case 'cooling':
        // Decay, with small chance of re-acceleration
        if (Math.random() < RE_ACCELERATION_CHANCE) {
          acceleration = 5 + Math.random() * 10
          state.lifecycle = 'emerging'
        } else {
          acceleration = -(1 + Math.random() * 2)
        }
        break
    }

    const noise = (Math.random() - 0.5) * 3
    state.velocityDelta = acceleration + noise
    state.velocity = clamp(state.velocity + state.velocityDelta, 0, 100)
    state.peakVelocity = Math.max(state.peakVelocity, state.velocity)
  }

  private updateLifecycle(state: TrendState): void {
    const { velocity, lifecycle, velocityDelta } = state

    switch (lifecycle) {
      case 'emerging':
        if (velocity >= EMERGING_TO_TRENDING) {
          state.lifecycle = 'trending'
        }
        break
      case 'trending':
        if (velocity >= TRENDING_TO_PEAKING) {
          state.lifecycle = 'peaking'
        }
        break
      case 'peaking':
        if (velocityDelta < PEAKING_DECAY_THRESHOLD) {
          state.lifecycle = 'cooling'
        }
        break
      case 'cooling':
        // Can re-accelerate (handled in advanceVelocity)
        break
    }
  }

  private spawnNewTrend(): void {
    const categories = ['geopolitics', 'economics', 'technology', 'sports', 'culture'] as const
    const category = pick([...categories])
    const id = `trend-new-${nanoid(8)}`

    const hashtags: Record<string, string[]> = {
      geopolitics: ['#BreakingAlert', '#DiplomaticCrisis', '#SecurityThreat', '#MilitaryOps'],
      economics: ['#MarketCrash', '#RateDecision', '#TradeDeal', '#InflationWatch'],
      technology: ['#TechBreakthrough', '#AIUpdate', '#CryptoMove', '#ChipWars'],
      sports: ['#GameChanger', '#TransferAlert', '#UpsetAlert'],
      culture: ['#Trending', '#ViralMoment', '#PolicyShift'],
    }

    const hashtag = pick(hashtags[category])

    this.trends.set(id, {
      seed: {
        id,
        hashtag,
        name: hashtag.replace('#', '').replace(/([A-Z])/g, ' $1').trim(),
        category,
        lifecycle: 'emerging',
        velocity: 5 + Math.random() * 15,
        velocityDelta: 3 + Math.random() * 5,
        eventCount: Math.floor(Math.random() * 10),
        linkedMarketIds: [],
        topEntityIds: [],
      },
      velocity: 5 + Math.random() * 15,
      velocityDelta: 3 + Math.random() * 5,
      peakVelocity: 15,
      lifecycle: 'emerging',
      velocityHistory: [5, 8, 12],
      eventCount: Math.floor(Math.random() * 10),
      age: 0,
    })
  }

  getTrends(): Trend[] {
    return Array.from(this.trends.values())
      .map(state => this.toTrend(state))
      .sort((a, b) => b.velocity.current - a.velocity.current)
  }

  getTrend(id: string): Trend | null {
    const state = this.trends.get(id)
    return state ? this.toTrend(state) : null
  }

  private toTrend(state: TrendState): Trend {
    const entities = seedEntities.filter(e => state.seed.topEntityIds.includes(e.id))

    const velocity: VelocityScore = {
      current: Math.round(state.velocity * 10) / 10,
      delta: Math.round(state.velocityDelta * 10) / 10,
      peak: Math.round(state.peakVelocity * 10) / 10,
      history: [...state.velocityHistory],
    }

    return {
      id: state.seed.id,
      hashtag: state.seed.hashtag,
      name: state.seed.name,
      category: state.seed.category,
      lifecycle: state.lifecycle,
      velocity,
      eventCount: state.eventCount,
      linkedMarketIds: state.seed.linkedMarketIds,
      topEntities: entities,
      sparklineData: [...state.velocityHistory],
      createdAt: new Date(Date.now() - state.age * 60_000).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
