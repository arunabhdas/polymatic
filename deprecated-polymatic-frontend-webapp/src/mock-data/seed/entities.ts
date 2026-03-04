import type { Entity } from '@/types'

export const seedEntities: Entity[] = [
  // ─── People ────────────────────────────────────────────
  { id: 'ent-001', name: 'Donald Trump', type: 'person', linkedTrendIds: ['trend-002', 'trend-004', 'trend-012'], linkedMarketIds: ['mkt-003', 'mkt-004', 'mkt-022'] },
  { id: 'ent-002', name: 'Jerome Powell', type: 'person', linkedTrendIds: ['trend-003'], linkedMarketIds: ['mkt-005', 'mkt-006'] },
  { id: 'ent-003', name: 'Xi Jinping', type: 'person', linkedTrendIds: ['trend-004', 'trend-005'], linkedMarketIds: ['mkt-007', 'mkt-008'] },
  { id: 'ent-004', name: 'Volodymyr Zelenskyy', type: 'person', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009', 'mkt-010'] },
  { id: 'ent-005', name: 'Vladimir Putin', type: 'person', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009', 'mkt-010'] },
  { id: 'ent-006', name: 'Ali Khamenei', type: 'person', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001', 'mkt-002'] },
  { id: 'ent-007', name: 'Elon Musk', type: 'person', linkedTrendIds: ['trend-007'], linkedMarketIds: ['mkt-011', 'mkt-012'] },
  { id: 'ent-008', name: 'Sam Altman', type: 'person', linkedTrendIds: ['trend-008'], linkedMarketIds: ['mkt-013'] },
  { id: 'ent-009', name: 'Christine Lagarde', type: 'person', linkedTrendIds: ['trend-009'], linkedMarketIds: ['mkt-014'] },
  { id: 'ent-010', name: 'Narendra Modi', type: 'person', linkedTrendIds: ['trend-010'], linkedMarketIds: ['mkt-015'] },

  // ─── Organizations ─────────────────────────────────────
  { id: 'ent-011', name: 'IRGC', type: 'organization', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001'] },
  { id: 'ent-012', name: 'Federal Reserve', type: 'organization', linkedTrendIds: ['trend-003'], linkedMarketIds: ['mkt-005', 'mkt-006'] },
  { id: 'ent-013', name: 'NATO', type: 'organization', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009'] },
  { id: 'ent-014', name: 'European Central Bank', type: 'organization', linkedTrendIds: ['trend-009'], linkedMarketIds: ['mkt-014'] },
  { id: 'ent-015', name: 'OpenAI', type: 'organization', linkedTrendIds: ['trend-008'], linkedMarketIds: ['mkt-013'] },
  { id: 'ent-016', name: 'Polymarket', type: 'organization', linkedTrendIds: ['trend-011'], linkedMarketIds: [] },
  { id: 'ent-017', name: 'Kalshi', type: 'organization', linkedTrendIds: ['trend-011'], linkedMarketIds: [] },
  { id: 'ent-018', name: 'Hezbollah', type: 'organization', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001'] },
  { id: 'ent-019', name: 'Pentagon', type: 'organization', linkedTrendIds: ['trend-006', 'trend-001'], linkedMarketIds: ['mkt-009', 'mkt-001'] },
  { id: 'ent-020', name: 'SEC', type: 'organization', linkedTrendIds: ['trend-011'], linkedMarketIds: ['mkt-012'] },

  // ─── Countries ─────────────────────────────────────────
  { id: 'ent-021', name: 'Iran', type: 'country', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001', 'mkt-002'] },
  { id: 'ent-022', name: 'China', type: 'country', linkedTrendIds: ['trend-004', 'trend-005'], linkedMarketIds: ['mkt-007', 'mkt-008'] },
  { id: 'ent-023', name: 'Russia', type: 'country', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009', 'mkt-010'] },
  { id: 'ent-024', name: 'Ukraine', type: 'country', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009', 'mkt-010'] },
  { id: 'ent-025', name: 'United States', type: 'country', linkedTrendIds: ['trend-002', 'trend-003', 'trend-004'], linkedMarketIds: ['mkt-003', 'mkt-005'] },
  { id: 'ent-026', name: 'Taiwan', type: 'country', linkedTrendIds: ['trend-005'], linkedMarketIds: ['mkt-008'] },
  { id: 'ent-027', name: 'India', type: 'country', linkedTrendIds: ['trend-010'], linkedMarketIds: ['mkt-015'] },
  { id: 'ent-028', name: 'Israel', type: 'country', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001'] },
  { id: 'ent-029', name: 'North Korea', type: 'country', linkedTrendIds: ['trend-013'], linkedMarketIds: ['mkt-019'] },
  { id: 'ent-030', name: 'EU', type: 'country', linkedTrendIds: ['trend-009', 'trend-012'], linkedMarketIds: ['mkt-014', 'mkt-022'] },

  // ─── Locations ─────────────────────────────────────────
  { id: 'ent-031', name: 'Strait of Hormuz', type: 'location', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001'] },
  { id: 'ent-032', name: 'Taiwan Strait', type: 'location', linkedTrendIds: ['trend-005'], linkedMarketIds: ['mkt-008'] },
  { id: 'ent-033', name: 'Donbas', type: 'location', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009'] },
  { id: 'ent-034', name: 'South China Sea', type: 'location', linkedTrendIds: ['trend-005'], linkedMarketIds: ['mkt-008'] },
  { id: 'ent-035', name: 'Wall Street', type: 'location', linkedTrendIds: ['trend-003'], linkedMarketIds: ['mkt-005'] },
  { id: 'ent-036', name: 'Silicon Valley', type: 'location', linkedTrendIds: ['trend-008'], linkedMarketIds: ['mkt-013'] },
  { id: 'ent-037', name: 'Geneva', type: 'location', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-010'] },
  { id: 'ent-038', name: 'Brussels', type: 'location', linkedTrendIds: ['trend-009', 'trend-012'], linkedMarketIds: ['mkt-014', 'mkt-022'] },
  { id: 'ent-039', name: 'Natanz', type: 'location', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-002'] },
  { id: 'ent-040', name: 'Crimea', type: 'location', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009'] },

  // ─── Commodities / Events ──────────────────────────────
  { id: 'ent-041', name: 'Brent Crude', type: 'commodity', linkedTrendIds: ['trend-001'], linkedMarketIds: ['mkt-001'] },
  { id: 'ent-042', name: 'Gold', type: 'commodity', linkedTrendIds: ['trend-003'], linkedMarketIds: ['mkt-005'] },
  { id: 'ent-043', name: 'Bitcoin', type: 'commodity', linkedTrendIds: ['trend-011'], linkedMarketIds: ['mkt-012'] },
  { id: 'ent-044', name: 'S&P 500', type: 'commodity', linkedTrendIds: ['trend-003'], linkedMarketIds: ['mkt-005'] },
  { id: 'ent-045', name: 'Natural Gas', type: 'commodity', linkedTrendIds: ['trend-006'], linkedMarketIds: ['mkt-009'] },
  { id: 'ent-046', name: 'Semiconductors', type: 'commodity', linkedTrendIds: ['trend-005'], linkedMarketIds: ['mkt-008'] },
  { id: 'ent-047', name: 'US Dollar', type: 'commodity', linkedTrendIds: ['trend-003', 'trend-004'], linkedMarketIds: ['mkt-005'] },
  { id: 'ent-048', name: 'Euro', type: 'commodity', linkedTrendIds: ['trend-009'], linkedMarketIds: ['mkt-014'] },
  { id: 'ent-049', name: 'Rare Earth Minerals', type: 'commodity', linkedTrendIds: ['trend-004'], linkedMarketIds: ['mkt-007'] },
  { id: 'ent-050', name: 'Lithium', type: 'commodity', linkedTrendIds: ['trend-007'], linkedMarketIds: ['mkt-011'] },
]
