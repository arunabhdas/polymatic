export interface SeedAccount {
  id: string
  handle: string
  displayName: string
  avatarUrl: string | null
  credibility: number // 0-1
  followers: number
  domainExpertise: string[]
  sourceType: 'analyst' | 'journalist' | 'institution' | 'aggregator' | 'insider'
}

export const seedAccounts: SeedAccount[] = [
  // ─── OSINT / Intel Analysts ────────────────────────────
  { id: 'acc-001', handle: '@AuroraIntel', displayName: 'Aurora Intel', avatarUrl: null, credibility: 0.88, followers: 520_000, domainExpertise: ['geopolitics', 'military', 'adsb'], sourceType: 'analyst' },
  { id: 'acc-002', handle: '@BNONews', displayName: 'BNO News', avatarUrl: null, credibility: 0.92, followers: 1_800_000, domainExpertise: ['breaking', 'geopolitics'], sourceType: 'aggregator' },
  { id: 'acc-003', handle: '@sentdefender', displayName: 'Sentdefender', avatarUrl: null, credibility: 0.82, followers: 450_000, domainExpertise: ['geopolitics', 'conflict'], sourceType: 'analyst' },
  { id: 'acc-004', handle: '@bellingcat', displayName: 'Bellingcat', avatarUrl: null, credibility: 0.95, followers: 980_000, domainExpertise: ['osint', 'verification', 'conflict'], sourceType: 'institution' },
  { id: 'acc-005', handle: '@IntelDoge', displayName: 'Intel Doge', avatarUrl: null, credibility: 0.75, followers: 280_000, domainExpertise: ['geopolitics', 'military'], sourceType: 'analyst' },
  { id: 'acc-006', handle: '@NOELreports', displayName: 'NOEL Reports', avatarUrl: null, credibility: 0.80, followers: 320_000, domainExpertise: ['ukraine', 'conflict', 'military'], sourceType: 'analyst' },
  { id: 'acc-007', handle: '@Faytuks', displayName: 'Faytuks News', avatarUrl: null, credibility: 0.72, followers: 190_000, domainExpertise: ['middle-east', 'conflict'], sourceType: 'analyst' },
  { id: 'acc-008', handle: '@OSINTdefender', displayName: 'OSINT Defender', avatarUrl: null, credibility: 0.78, followers: 350_000, domainExpertise: ['osint', 'geopolitics'], sourceType: 'analyst' },

  // ─── Journalists ───────────────────────────────────────
  { id: 'acc-009', handle: '@naborbaum', displayName: 'Natasha Bertrand', avatarUrl: null, credibility: 0.90, followers: 650_000, domainExpertise: ['national-security', 'intelligence'], sourceType: 'journalist' },
  { id: 'acc-010', handle: '@jiaborbaum', displayName: 'Jim Sciutto', avatarUrl: null, credibility: 0.85, followers: 1_200_000, domainExpertise: ['national-security', 'foreign-policy'], sourceType: 'journalist' },
  { id: 'acc-011', handle: '@KyivIndependent', displayName: 'Kyiv Independent', avatarUrl: null, credibility: 0.87, followers: 2_100_000, domainExpertise: ['ukraine', 'conflict', 'politics'], sourceType: 'institution' },
  { id: 'acc-012', handle: '@haaborbaum', displayName: 'Haaretz', avatarUrl: null, credibility: 0.86, followers: 800_000, domainExpertise: ['middle-east', 'israel', 'politics'], sourceType: 'institution' },

  // ─── Financial / Markets ───────────────────────────────
  { id: 'acc-013', handle: '@zaborbaum', displayName: 'ZeroHedge', avatarUrl: null, credibility: 0.55, followers: 1_500_000, domainExpertise: ['finance', 'markets', 'macro'], sourceType: 'aggregator' },
  { id: 'acc-014', handle: '@DeItaone', displayName: 'Walter Bloomberg', avatarUrl: null, credibility: 0.88, followers: 900_000, domainExpertise: ['breaking', 'finance', 'macro'], sourceType: 'aggregator' },
  { id: 'acc-015', handle: '@federalreserve', displayName: 'Federal Reserve', avatarUrl: null, credibility: 0.99, followers: 1_300_000, domainExpertise: ['monetary-policy', 'economics'], sourceType: 'institution' },
  { id: 'acc-016', handle: '@NickTimiraos', displayName: 'Nick Timiraos', avatarUrl: null, credibility: 0.93, followers: 700_000, domainExpertise: ['fed', 'monetary-policy', 'economics'], sourceType: 'journalist' },
  { id: 'acc-017', handle: '@financialjuice', displayName: 'Financial Juice', avatarUrl: null, credibility: 0.78, followers: 420_000, domainExpertise: ['macro', 'markets', 'breaking'], sourceType: 'aggregator' },
  { id: 'acc-018', handle: '@WSJ', displayName: 'Wall Street Journal', avatarUrl: null, credibility: 0.94, followers: 6_000_000, domainExpertise: ['finance', 'politics', 'tech'], sourceType: 'institution' },

  // ─── Tech ──────────────────────────────────────────────
  { id: 'acc-019', handle: '@elaborbaum', displayName: 'Elon Musk', avatarUrl: null, credibility: 0.60, followers: 180_000_000, domainExpertise: ['tesla', 'spacex', 'ai', 'crypto'], sourceType: 'insider' },
  { id: 'acc-020', handle: '@saaborbaum', displayName: 'Sam Altman', avatarUrl: null, credibility: 0.82, followers: 3_200_000, domainExpertise: ['ai', 'openai', 'tech'], sourceType: 'insider' },
  { id: 'acc-021', handle: '@EliaborbarauSchwartz', displayName: 'Eric Schmidt', avatarUrl: null, credibility: 0.80, followers: 450_000, domainExpertise: ['ai', 'tech-policy', 'geopolitics'], sourceType: 'insider' },

  // ─── Prediction Markets ────────────────────────────────
  { id: 'acc-022', handle: '@ElectionWiz', displayName: 'Election Wizard', avatarUrl: null, credibility: 0.70, followers: 380_000, domainExpertise: ['prediction-markets', 'elections'], sourceType: 'analyst' },
  { id: 'acc-023', handle: '@Polymarket', displayName: 'Polymarket', avatarUrl: null, credibility: 0.85, followers: 520_000, domainExpertise: ['prediction-markets', 'crypto'], sourceType: 'institution' },
  { id: 'acc-024', handle: '@Kalshi', displayName: 'Kalshi', avatarUrl: null, credibility: 0.84, followers: 180_000, domainExpertise: ['prediction-markets', 'regulated'], sourceType: 'institution' },
  { id: 'acc-025', handle: '@StarSpangledGamblers', displayName: 'Star Spangled Gamblers', avatarUrl: null, credibility: 0.72, followers: 95_000, domainExpertise: ['prediction-markets', 'politics'], sourceType: 'analyst' },

  // ─── Regional Experts ──────────────────────────────────
  { id: 'acc-026', handle: '@ChinaConflicts', displayName: 'China Conflicts', avatarUrl: null, credibility: 0.76, followers: 210_000, domainExpertise: ['china', 'taiwan', 'south-china-sea'], sourceType: 'analyst' },
  { id: 'acc-027', handle: '@Iran_Watcher', displayName: 'Iran Watcher', avatarUrl: null, credibility: 0.74, followers: 165_000, domainExpertise: ['iran', 'middle-east', 'nuclear'], sourceType: 'analyst' },
  { id: 'acc-028', handle: '@NKWatcher', displayName: 'NK Watcher', avatarUrl: null, credibility: 0.78, followers: 140_000, domainExpertise: ['north-korea', 'missiles', 'sanctions'], sourceType: 'analyst' },
  { id: 'acc-029', handle: '@IndoPacific_Intel', displayName: 'Indo-Pacific Intel', avatarUrl: null, credibility: 0.73, followers: 88_000, domainExpertise: ['asia', 'military', 'maritime'], sourceType: 'analyst' },
  { id: 'acc-030', handle: '@EuroIntel', displayName: 'Euro Intel', avatarUrl: null, credibility: 0.71, followers: 72_000, domainExpertise: ['europe', 'eu', 'nato'], sourceType: 'analyst' },
]
