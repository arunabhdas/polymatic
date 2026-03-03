import { nanoid } from 'nanoid'
import type { FeedItem, FeedItemType, SourceType, Category, Severity, Entity } from '@/types'
import { seedAccounts, type SeedAccount } from '../seed/accounts'
import { seedEntities } from '../seed/entities'
import { seedTrends, type SeedTrend } from '../seed/trends'

// ─── Feed Generator ──────────────────────────────────────────
// Simulates bursty event arrival: base rate 2/sec, burst rate 20/sec

const CONTENT_TEMPLATES: Record<Category, string[]> = {
  geopolitics: [
    'BREAKING: Naval activity detected near {location}. Multiple vessels repositioning.',
    'Satellite imagery shows troop movements in {location}. Estimated {count} vehicles.',
    '{entity} announces new sanctions package targeting {country}. Market reaction expected.',
    'Intelligence suggests {country} may escalate operations in {location} within 48 hours.',
    'Diplomatic talks between {entity} and {country} have stalled. Sources cite fundamental disagreements.',
    '{entity} spokesperson issues warning regarding {location} operations.',
    'Unconfirmed reports of military buildup near {location}. Monitoring situation.',
  ],
  economics: [
    '{entity} signals potential rate adjustment. Markets pricing in {probability}% chance of cut.',
    'Breaking: {entity} GDP data shows {delta}% deviation from consensus estimates.',
    'Trade deficit widens to ${volume} as tariff impacts materialize.',
    '{entity} warns of potential recession risk. Bond yields respond immediately.',
    'Inflation data: CPI comes in at {probability}%, {direction} market expectations.',
    'Currency markets volatile: {entity} intervention suspected after {delta}% move.',
    'Unemployment claims {direction}: {count}K new filings reported.',
  ],
  technology: [
    '{entity} announces breakthrough in {topic}. Industry reaction mixed.',
    'Leaked documents suggest {entity} preparing major product launch within weeks.',
    'Regulatory scrutiny intensifies for {entity}. SEC filing reveals new concerns.',
    'Stock price surges {delta}% after {entity} reports exceeding analyst estimates.',
    '{entity} confirms partnership with major defense contractor for AI applications.',
    'Chip shortage update: {entity} adjusts production timeline for next-gen nodes.',
    'Insider reports indicate {entity} restructuring following market pressure.',
  ],
  sports: [
    'Breaking: {entity} confirms major trade deal worth ${volume}M.',
    'Injury report: Key player sidelined, odds shifting on {entity} championship run.',
    'Olympic committee announces venue changes. Betting markets react immediately.',
    'Historical upset: {entity} defeats heavily favored opponent, market odds swing.',
  ],
  culture: [
    '{entity} user metrics show {delta}% decline in key demographic.',
    'New legislation proposed targeting {entity}. Industry lobbying intensifies.',
    'Viral content from {entity} reshapes public opinion on {topic}.',
    'Demographic data: {country} crosses significant population milestone.',
  ],
}

const SOURCE_TYPES: SourceType[] = ['twitter', 'reddit', 'telegram', 'news', 'structured', 'market_signal']
const FEED_TYPES: FeedItemType[] = ['signal', 'tweet', 'market_move', 'alert', 'classification']
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function severityFromVelocity(velocity: number): Severity {
  if (velocity > 75) return 'critical'
  if (velocity > 50) return 'high'
  if (velocity > 25) return 'medium'
  return 'low'
}

function fillTemplate(template: string, context: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => context[key] ?? key)
}

export class FeedGenerator {
  private baseRate = 2
  private burstRate = 15
  private burstProbability = 0.05
  private burstDuration = 30_000
  private burstStartedAt: number | null = null

  private activeTrends: SeedTrend[]

  constructor() {
    this.activeTrends = [...seedTrends]
  }

  setActiveTrends(trends: SeedTrend[]): void {
    this.activeTrends = trends
  }

  generate(count?: number): FeedItem[] {
    const now = Date.now()
    const isBurst = this.isInBurst(now) || Math.random() < this.burstProbability

    if (isBurst && !this.burstStartedAt) {
      this.burstStartedAt = now
    }

    if (this.burstStartedAt && now - this.burstStartedAt > this.burstDuration) {
      this.burstStartedAt = null
    }

    const itemCount = count ?? (isBurst ? this.burstRate : this.baseRate)
    return Array.from({ length: itemCount }, () => this.createItem(isBurst))
  }

  private isInBurst(now: number): boolean {
    return this.burstStartedAt !== null && now - this.burstStartedAt < this.burstDuration
  }

  private createItem(isBurst: boolean): FeedItem {
    const trend = pick(this.activeTrends)
    const account = pick(seedAccounts)
    const category = trend.category
    const templates = CONTENT_TEMPLATES[category]
    const template = pick(templates)
    const entities = this.getRelatedEntities(trend)

    const velocity = trend.velocity + (Math.random() - 0.5) * 20
    const severity = isBurst ? pick(['high', 'critical'] as Severity[]) : severityFromVelocity(velocity)

    const context: Record<string, string> = {
      entity: entities[0]?.name ?? 'Unknown',
      location: entities.find(e => e.type === 'location')?.name ?? 'the region',
      country: entities.find(e => e.type === 'country')?.name ?? 'the country',
      count: String(Math.floor(Math.random() * 200) + 10),
      probability: String(Math.floor(Math.random() * 40) + 30),
      delta: (Math.random() * 8 - 2).toFixed(1),
      volume: (Math.random() * 50 + 5).toFixed(0),
      direction: pick(['above', 'below']),
      topic: trend.name,
    }

    const content = fillTemplate(template, context)
    const title = content.split('.')[0]

    return {
      id: nanoid(),
      type: this.pickType(account),
      title,
      summary: content,
      content,
      category,
      severity,
      velocity: Math.round(velocity),
      timestamp: new Date(Date.now() - Math.random() * 60_000).toISOString(),
      source: this.pickSource(account),
      sourceHandle: account.handle,
      sourceDisplayName: account.displayName,
      entities: entities.slice(0, 3),
      relatedTrendIds: [trend.id],
      relatedMarketIds: trend.linkedMarketIds.slice(0, 2),
      sentimentStance: Math.random() > 0.6 ? pick(['supports_yes', 'supports_no', 'neutral'] as const) : null,
      confidence: Math.round((0.5 + Math.random() * 0.45) * 100) / 100,
      clusterId: Math.random() > 0.7 ? `cluster-${trend.id}` : null,
      geoCoords: Math.random() > 0.6 ? this.randomCoords(trend) : null,
      media: [],
      expanded: severity === 'critical' || severity === 'high',
    }
  }

  private getRelatedEntities(trend: SeedTrend): Entity[] {
    return seedEntities.filter(e => trend.topEntityIds.includes(e.id))
  }

  private pickType(account: SeedAccount): FeedItemType {
    if (account.sourceType === 'institution') return pick(['signal', 'market_move'])
    if (account.sourceType === 'journalist') return 'tweet'
    if (account.sourceType === 'aggregator') return pick(['signal', 'tweet'])
    return pick(FEED_TYPES)
  }

  private pickSource(account: SeedAccount): SourceType {
    if (account.sourceType === 'institution') return pick(['news', 'structured'])
    return pick(SOURCE_TYPES.filter(s => s !== 'market_signal'))
  }

  private randomCoords(trend: SeedTrend): { lat: number; lng: number } {
    // Rough coordinates based on trend category
    const regions: Record<string, [number, number]> = {
      'trend-001': [27.0, 56.5], // Strait of Hormuz
      'trend-005': [24.0, 121.0], // Taiwan Strait
      'trend-006': [48.5, 37.5], // Donbas
      'trend-013': [39.0, 125.7], // Pyongyang
    }
    const base = regions[trend.id] ?? [40 + (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 180]
    return {
      lat: base[0] + (Math.random() - 0.5) * 5,
      lng: base[1] + (Math.random() - 0.5) * 5,
    }
  }
}
