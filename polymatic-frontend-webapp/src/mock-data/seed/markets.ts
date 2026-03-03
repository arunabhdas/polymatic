import type { Platform, Category, PricePoint } from '@/types'

export interface SeedMarket {
  id: string
  questionId: string
  questionText: string
  title: string
  platform: Platform
  probability: number
  probability24hAgo: number
  change24h: number
  volume: number
  category: Category
  linkedTrendIds: string[]
  expiresAt: string
}

function dayAgo(prob: number, delta: number): number {
  return Math.max(1, Math.min(99, prob - delta))
}

export const seedMarkets: SeedMarket[] = [
  // ─── Geopolitics Markets ───────────────────────────────
  { id: 'mkt-001', questionId: 'q-001', questionText: 'Will Iran close the Strait of Hormuz before July 2026?', title: 'Iran Strait of Hormuz Closure', platform: 'polymarket', probability: 12, probability24hAgo: dayAgo(12, 2.3), change24h: 2.3, volume: 4_200_000, category: 'geopolitics', linkedTrendIds: ['trend-001'], expiresAt: '2026-07-01T00:00:00Z' },
  { id: 'mkt-002', questionId: 'q-001', questionText: 'Will Iran close the Strait of Hormuz before July 2026?', title: 'Iran Strait Closure (Kalshi)', platform: 'kalshi', probability: 14, probability24hAgo: dayAgo(14, 1.8), change24h: 1.8, volume: 1_800_000, category: 'geopolitics', linkedTrendIds: ['trend-001'], expiresAt: '2026-07-01T00:00:00Z' },
  { id: 'mkt-003', questionId: 'q-007', questionText: 'Will Trump impose >25% tariffs on EU goods by June 2026?', title: 'Trump EU Tariffs >25%', platform: 'polymarket', probability: 38, probability24hAgo: dayAgo(38, -3.1), change24h: -3.1, volume: 8_500_000, category: 'economics', linkedTrendIds: ['trend-002', 'trend-012'], expiresAt: '2026-06-30T00:00:00Z' },
  { id: 'mkt-004', questionId: 'q-007', questionText: 'Will Trump impose >25% tariffs on EU goods by June 2026?', title: 'Trump EU Tariffs (Kalshi)', platform: 'kalshi', probability: 36, probability24hAgo: dayAgo(36, -2.5), change24h: -2.5, volume: 3_200_000, category: 'economics', linkedTrendIds: ['trend-002', 'trend-012'], expiresAt: '2026-06-30T00:00:00Z' },

  // ─── Economics Markets ─────────────────────────────────
  { id: 'mkt-005', questionId: 'q-006', questionText: 'Will the Federal Reserve cut rates before Q3 2026?', title: 'Fed Rate Cut Before Q3', platform: 'polymarket', probability: 62, probability24hAgo: dayAgo(62, 4.2), change24h: 4.2, volume: 15_600_000, category: 'economics', linkedTrendIds: ['trend-003'], expiresAt: '2026-07-01T00:00:00Z' },
  { id: 'mkt-006', questionId: 'q-006', questionText: 'Will the Federal Reserve cut rates before Q3 2026?', title: 'Fed Rate Cut (Kalshi)', platform: 'kalshi', probability: 60, probability24hAgo: dayAgo(60, 3.8), change24h: 3.8, volume: 7_100_000, category: 'economics', linkedTrendIds: ['trend-003'], expiresAt: '2026-07-01T00:00:00Z' },
  { id: 'mkt-007', questionId: 'q-010', questionText: 'Will China devalue the yuan by >5% against USD in 2026?', title: 'China Yuan Devaluation >5%', platform: 'polymarket', probability: 15, probability24hAgo: dayAgo(15, 1.2), change24h: 1.2, volume: 3_400_000, category: 'economics', linkedTrendIds: ['trend-004'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-008', questionId: 'q-003', questionText: 'Will China conduct military exercises within 12nm of Taiwan in 2026?', title: 'China-Taiwan 12nm Exercises', platform: 'polymarket', probability: 34, probability24hAgo: dayAgo(34, -1.5), change24h: -1.5, volume: 6_200_000, category: 'geopolitics', linkedTrendIds: ['trend-005'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-009', questionId: 'q-002', questionText: 'Will Russia and Ukraine reach a ceasefire before October 2026?', title: 'Russia-Ukraine Ceasefire', platform: 'polymarket', probability: 18, probability24hAgo: dayAgo(18, -0.8), change24h: -0.8, volume: 12_300_000, category: 'geopolitics', linkedTrendIds: ['trend-006'], expiresAt: '2026-10-01T00:00:00Z' },
  { id: 'mkt-010', questionId: 'q-002', questionText: 'Will Russia and Ukraine reach a ceasefire before October 2026?', title: 'Ukraine Ceasefire (Kalshi)', platform: 'kalshi', probability: 16, probability24hAgo: dayAgo(16, -0.5), change24h: -0.5, volume: 5_800_000, category: 'geopolitics', linkedTrendIds: ['trend-006'], expiresAt: '2026-10-01T00:00:00Z' },

  // ─── Technology Markets ────────────────────────────────
  { id: 'mkt-011', questionId: 'q-013', questionText: 'Will Tesla stock exceed $400 before June 2026?', title: 'Tesla $400+ Before June', platform: 'kalshi', probability: 28, probability24hAgo: dayAgo(28, 5.1), change24h: 5.1, volume: 9_800_000, category: 'technology', linkedTrendIds: ['trend-007'], expiresAt: '2026-06-01T00:00:00Z' },
  { id: 'mkt-012', questionId: 'q-012', questionText: 'Will the SEC approve a spot Ethereum ETF with staking by Q3 2026?', title: 'Spot ETH ETF w/ Staking', platform: 'polymarket', probability: 30, probability24hAgo: dayAgo(30, 2.4), change24h: 2.4, volume: 7_400_000, category: 'technology', linkedTrendIds: ['trend-011'], expiresAt: '2026-09-30T00:00:00Z' },
  { id: 'mkt-013', questionId: 'q-011', questionText: 'Will OpenAI release GPT-5 before July 2026?', title: 'GPT-5 Release Before July', platform: 'polymarket', probability: 55, probability24hAgo: dayAgo(55, -2.1), change24h: -2.1, volume: 5_600_000, category: 'technology', linkedTrendIds: ['trend-008'], expiresAt: '2026-07-01T00:00:00Z' },
  { id: 'mkt-014', questionId: 'q-009', questionText: 'Will the ECB cut rates below 2% before September 2026?', title: 'ECB Rate <2% Before Sept', platform: 'kalshi', probability: 45, probability24hAgo: dayAgo(45, 1.6), change24h: 1.6, volume: 4_100_000, category: 'economics', linkedTrendIds: ['trend-009'], expiresAt: '2026-09-01T00:00:00Z' },
  { id: 'mkt-015', questionId: 'q-019', questionText: 'Will India surpass China in population growth rate in 2026?', title: 'India Pop Growth > China', platform: 'polymarket', probability: 72, probability24hAgo: dayAgo(72, 0.3), change24h: 0.3, volume: 1_200_000, category: 'culture', linkedTrendIds: ['trend-010'], expiresAt: '2026-12-31T00:00:00Z' },

  // ─── Additional Markets ────────────────────────────────
  { id: 'mkt-016', questionId: 'q-008', questionText: 'Will US CPI exceed 4% in any month of Q2 2026?', title: 'US CPI >4% in Q2', platform: 'kalshi', probability: 22, probability24hAgo: dayAgo(22, -1.2), change24h: -1.2, volume: 6_300_000, category: 'economics', linkedTrendIds: ['trend-003'], expiresAt: '2026-06-30T00:00:00Z' },
  { id: 'mkt-017', questionId: 'q-014', questionText: 'Will TSMC begin 2nm chip mass production in 2026?', title: 'TSMC 2nm Mass Prod', platform: 'polymarket', probability: 68, probability24hAgo: dayAgo(68, 0.8), change24h: 0.8, volume: 2_900_000, category: 'technology', linkedTrendIds: ['trend-005'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-018', questionId: 'q-015', questionText: 'Will the US win the most gold medals at the 2026 Winter Olympics?', title: 'US Most Golds 2026 Olympics', platform: 'polymarket', probability: 20, probability24hAgo: dayAgo(20, -0.4), change24h: -0.4, volume: 980_000, category: 'sports', linkedTrendIds: ['trend-014'], expiresAt: '2026-03-01T00:00:00Z' },
  { id: 'mkt-019', questionId: 'q-004', questionText: 'Will North Korea test an ICBM before June 2026?', title: 'NK ICBM Test Before June', platform: 'kalshi', probability: 42, probability24hAgo: dayAgo(42, 3.5), change24h: 3.5, volume: 2_100_000, category: 'geopolitics', linkedTrendIds: ['trend-013'], expiresAt: '2026-06-01T00:00:00Z' },
  { id: 'mkt-020', questionId: 'q-005', questionText: 'Will a NATO member invoke Article 5 in 2026?', title: 'NATO Article 5 Invocation', platform: 'polymarket', probability: 4, probability24hAgo: dayAgo(4, 0.2), change24h: 0.2, volume: 3_800_000, category: 'geopolitics', linkedTrendIds: ['trend-006'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-021', questionId: 'q-016', questionText: 'Will a Premier League team win the Champions League in 2026?', title: 'PL Team Wins UCL', platform: 'polymarket', probability: 48, probability24hAgo: dayAgo(48, 1.1), change24h: 1.1, volume: 4_500_000, category: 'sports', linkedTrendIds: ['trend-015'], expiresAt: '2026-06-15T00:00:00Z' },
  { id: 'mkt-022', questionId: 'q-007', questionText: 'Will Trump impose >25% tariffs on EU goods by June 2026?', title: 'EU Tariffs (Polymarket Alt)', platform: 'polymarket', probability: 40, probability24hAgo: dayAgo(40, -2.8), change24h: -2.8, volume: 2_600_000, category: 'economics', linkedTrendIds: ['trend-012'], expiresAt: '2026-06-30T00:00:00Z' },
  { id: 'mkt-023', questionId: 'q-017', questionText: 'Will US TikTok monthly active users drop below 100M in 2026?', title: 'TikTok MAU <100M', platform: 'kalshi', probability: 25, probability24hAgo: dayAgo(25, 0.9), change24h: 0.9, volume: 1_800_000, category: 'culture', linkedTrendIds: ['trend-004'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-024', questionId: 'q-018', questionText: 'Will AI-generated content be labeled mandatory by US law in 2026?', title: 'Mandatory AI Content Labels', platform: 'polymarket', probability: 12, probability24hAgo: dayAgo(12, -0.3), change24h: -0.3, volume: 890_000, category: 'culture', linkedTrendIds: ['trend-008'], expiresAt: '2026-12-31T00:00:00Z' },
  { id: 'mkt-025', questionId: 'q-020', questionText: 'Will Brent crude exceed $100/barrel in 2026?', title: 'Brent Crude $100+', platform: 'kalshi', probability: 35, probability24hAgo: dayAgo(35, 4.2), change24h: 4.2, volume: 5_400_000, category: 'geopolitics', linkedTrendIds: ['trend-001'], expiresAt: '2026-12-31T00:00:00Z' },
]

// Generate a 24h price history for sparklines
export function generatePriceHistory(market: SeedMarket, points: number = 48): PricePoint[] {
  const now = Date.now()
  const interval = (24 * 60 * 60 * 1000) / points
  const history: PricePoint[] = []

  let prob = market.probability24hAgo
  const target = market.probability
  const drift = (target - prob) / points

  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * 3
    prob = Math.max(1, Math.min(99, prob + drift + noise))

    history.push({
      timestamp: new Date(now - (points - i) * interval).toISOString(),
      probability: Math.round(prob * 10) / 10,
      volume: Math.round(market.volume / points * (0.5 + Math.random())),
    })
  }

  return history
}
