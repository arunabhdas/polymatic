import type { Category } from '@/types'

export interface SeedQuestion {
  id: string
  text: string
  category: Category
  currentMarketProb: number
  linkedTrendIds: string[]
  linkedMarketIds: string[]
}

export const seedQuestions: SeedQuestion[] = [
  // ─── Geopolitics ───────────────────────────────────────
  {
    id: 'q-001',
    text: 'Will Iran close the Strait of Hormuz before July 2026?',
    category: 'geopolitics',
    currentMarketProb: 12,
    linkedTrendIds: ['trend-001'],
    linkedMarketIds: ['mkt-001', 'mkt-002'],
  },
  {
    id: 'q-002',
    text: 'Will Russia and Ukraine reach a ceasefire agreement before October 2026?',
    category: 'geopolitics',
    currentMarketProb: 18,
    linkedTrendIds: ['trend-006'],
    linkedMarketIds: ['mkt-009', 'mkt-010'],
  },
  {
    id: 'q-003',
    text: 'Will China conduct military exercises within 12nm of Taiwan in 2026?',
    category: 'geopolitics',
    currentMarketProb: 34,
    linkedTrendIds: ['trend-005'],
    linkedMarketIds: ['mkt-008'],
  },
  {
    id: 'q-004',
    text: 'Will North Korea test an ICBM before June 2026?',
    category: 'geopolitics',
    currentMarketProb: 42,
    linkedTrendIds: ['trend-013'],
    linkedMarketIds: ['mkt-019'],
  },
  {
    id: 'q-005',
    text: 'Will a NATO member invoke Article 5 in 2026?',
    category: 'geopolitics',
    currentMarketProb: 4,
    linkedTrendIds: ['trend-006'],
    linkedMarketIds: ['mkt-020'],
  },

  // ─── Economics ─────────────────────────────────────────
  {
    id: 'q-006',
    text: 'Will the Federal Reserve cut rates before Q3 2026?',
    category: 'economics',
    currentMarketProb: 62,
    linkedTrendIds: ['trend-003'],
    linkedMarketIds: ['mkt-005', 'mkt-006'],
  },
  {
    id: 'q-007',
    text: 'Will Trump impose >25% tariffs on EU goods by June 2026?',
    category: 'economics',
    currentMarketProb: 38,
    linkedTrendIds: ['trend-002', 'trend-012'],
    linkedMarketIds: ['mkt-003', 'mkt-022'],
  },
  {
    id: 'q-008',
    text: 'Will US CPI exceed 4% in any month of Q2 2026?',
    category: 'economics',
    currentMarketProb: 22,
    linkedTrendIds: ['trend-003'],
    linkedMarketIds: ['mkt-016'],
  },
  {
    id: 'q-009',
    text: 'Will the ECB cut rates below 2% before September 2026?',
    category: 'economics',
    currentMarketProb: 45,
    linkedTrendIds: ['trend-009'],
    linkedMarketIds: ['mkt-014'],
  },
  {
    id: 'q-010',
    text: 'Will China devalue the yuan by >5% against USD in 2026?',
    category: 'economics',
    currentMarketProb: 15,
    linkedTrendIds: ['trend-004'],
    linkedMarketIds: ['mkt-007'],
  },

  // ─── Technology ────────────────────────────────────────
  {
    id: 'q-011',
    text: 'Will OpenAI release GPT-5 before July 2026?',
    category: 'technology',
    currentMarketProb: 55,
    linkedTrendIds: ['trend-008'],
    linkedMarketIds: ['mkt-013'],
  },
  {
    id: 'q-012',
    text: 'Will the SEC approve a spot Ethereum ETF with staking by Q3 2026?',
    category: 'technology',
    currentMarketProb: 30,
    linkedTrendIds: ['trend-011'],
    linkedMarketIds: ['mkt-012'],
  },
  {
    id: 'q-013',
    text: 'Will Tesla stock exceed $400 before June 2026?',
    category: 'technology',
    currentMarketProb: 28,
    linkedTrendIds: ['trend-007'],
    linkedMarketIds: ['mkt-011'],
  },
  {
    id: 'q-014',
    text: 'Will TSMC begin 2nm chip mass production in 2026?',
    category: 'technology',
    currentMarketProb: 68,
    linkedTrendIds: ['trend-005'],
    linkedMarketIds: ['mkt-017'],
  },

  // ─── Sports ────────────────────────────────────────────
  {
    id: 'q-015',
    text: 'Will the US win the most gold medals at the 2026 Winter Olympics?',
    category: 'sports',
    currentMarketProb: 20,
    linkedTrendIds: ['trend-014'],
    linkedMarketIds: ['mkt-018'],
  },
  {
    id: 'q-016',
    text: 'Will a Premier League team win the Champions League in 2026?',
    category: 'sports',
    currentMarketProb: 48,
    linkedTrendIds: ['trend-015'],
    linkedMarketIds: ['mkt-021'],
  },

  // ─── Culture ───────────────────────────────────────────
  {
    id: 'q-017',
    text: 'Will US TikTok monthly active users drop below 100M in 2026?',
    category: 'culture',
    currentMarketProb: 25,
    linkedTrendIds: ['trend-004'],
    linkedMarketIds: ['mkt-023'],
  },
  {
    id: 'q-018',
    text: 'Will AI-generated content be labeled mandatory by US law in 2026?',
    category: 'culture',
    currentMarketProb: 12,
    linkedTrendIds: ['trend-008'],
    linkedMarketIds: ['mkt-024'],
  },
  {
    id: 'q-019',
    text: 'Will India surpass China in population growth rate in 2026?',
    category: 'culture',
    currentMarketProb: 72,
    linkedTrendIds: ['trend-010'],
    linkedMarketIds: ['mkt-015'],
  },
  {
    id: 'q-020',
    text: 'Will Brent crude exceed $100/barrel in 2026?',
    category: 'geopolitics',
    currentMarketProb: 35,
    linkedTrendIds: ['trend-001'],
    linkedMarketIds: ['mkt-025'],
  },
]
