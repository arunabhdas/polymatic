export interface SeedAccount {
  id: string;
  handle: string;
  displayName: string;
  credibility: number; // 0-1
  followers: number;
  tags: string[];
}

export const seedAccounts: SeedAccount[] = [
  {
    id: 'acc-aurora',
    handle: '@AuroraIntel',
    displayName: 'Aurora Intel',
    credibility: 0.95,
    followers: 435000,
    tags: ['osint', 'geopolitics', 'military'],
  },
  {
    id: 'acc-bno',
    handle: '@BNONews',
    displayName: 'BNO News',
    credibility: 0.92,
    followers: 2100000,
    tags: ['news', 'breaking'],
  },
  {
    id: 'acc-sentdefender',
    handle: '@sentdefender',
    displayName: 'OSINTdefender',
    credibility: 0.88,
    followers: 1200000,
    tags: ['osint', 'geopolitics', 'conflict'],
  },
  {
    id: 'acc-bellingcat',
    handle: '@bellingcat',
    displayName: 'Bellingcat',
    credibility: 0.98,
    followers: 850000,
    tags: ['investigative', 'osint', 'geopolitics'],
  },
  {
    id: 'acc-nicktimiraos',
    handle: '@NickTimiraos',
    displayName: 'Nick Timiraos',
    credibility: 0.97,
    followers: 340000,
    tags: ['fed', 'economics', 'wsj'],
  },
  {
    id: 'acc-natsec',
    handle: '@NatSecDaily',
    displayName: 'National Security Daily',
    credibility: 0.90,
    followers: 125000,
    tags: ['policy', 'geopolitics'],
  },
  {
    id: 'acc-macroalf',
    handle: '@MacroAlf',
    displayName: 'Alfonso Peccatiello',
    credibility: 0.85,
    followers: 275000,
    tags: ['macro', 'economics', 'markets'],
  },
  {
    id: 'acc-kuocg',
    handle: '@mingchikuo',
    displayName: 'Ming-Chi Kuo',
    credibility: 0.94,
    followers: 185000,
    tags: ['supply-chain', 'apple', 'tech'],
  },
  {
    id: 'acc-inteldoge',
    handle: '@IntelDoge',
    displayName: 'Intel Doge',
    credibility: 0.86,
    followers: 140000,
    tags: ['osint', 'military'],
  },
  {
    id: 'acc-unusualwhales',
    handle: '@unusual_whales',
    displayName: 'Unusual Whales',
    credibility: 0.82,
    followers: 1500000,
    tags: ['options', 'markets', 'politics'],
  }
];
