import type { FeedItem } from "../types/feed"

const now = Date.now()
const hourInMs = 60 * 60 * 1000

export const mockFeedData: FeedItem[] = [
  {
    id: "evt-001",
    source: "market_signal",
    timestamp: now - (5 * 60 * 1000), // 5 mins ago
    severity: 85,
    content: "Polymarket contract for 'Fed Rates Nov 2026' experienced a sudden 12% probability drop following manufacturing CPI data release.",
    trendIds: ["trn-fed-rates"],
    entities: [
      { id: "ent-1", name: "Federal Reserve", type: "organization" },
      { id: "ent-2", name: "CPI", type: "concept" }
    ],
    marketCorrelation: 0.95,
  },
  {
    id: "evt-002",
    source: "twitter",
    author: {
      name: "MacroAlpha",
      handle: "@macro_alpha",
    },
    timestamp: now - (42 * 60 * 1000), // 42 mins ago
    severity: 45,
    content: "Seeing unusual options activity in semiconductor space ahead of the earnings call tomorrow. Market pricing in significant volatility.",
    trendIds: ["trn-semi-earnings"],
    entities: [
      { id: "ent-3", name: "Semiconductors", type: "concept" }
    ],
    sentimentStance: "bearish"
  },
  {
    id: "evt-003",
    source: "news",
    author: {
      name: "Financial Times"
    },
    timestamp: now - (2 * hourInMs), // 2 hours ago
    severity: 72,
    content: "OPEC+ signals potential delay in planned production increases, citing weaker demand forecasts from Asian refining hubs.",
    trendIds: ["trn-oil-supply"],
    entities: [
      { id: "ent-4", name: "OPEC+", type: "organization" },
      { id: "ent-5", name: "Crude Oil", type: "product" }
    ],
    marketCorrelation: 0.82,
    geoCoords: { lat: 48.2082, lng: 16.3738 } // Vienna
  },
  {
    id: "evt-004",
    source: "reddit",
    author: { name: "u/YieldFarmer2024" },
    timestamp: now - (3.5 * hourInMs),
    severity: 25,
    content: "The new governance proposal on Lido finance looks suspect. Why is the timeline so compressed?",
    trendIds: ["trn-defi-gov"],
    entities: [
      { id: "ent-6", name: "Lido Finance", type: "organization" }
    ],
    sentimentStance: "bearish"
  },
  {
    id: "evt-005",
    source: "structured",
    author: { name: "PolyMatic On-Chain" },
    timestamp: now - (5 * hourInMs),
    severity: 92,
    content: "Large stablecoin outflow detected from Binance cold wallets. $450m transferred in the last 10 minutes.",
    trendIds: ["trn-crypto-vol"],
    entities: [
      { id: "ent-7", name: "Binance", type: "organization" },
      { id: "ent-8", name: "Tether", type: "product" }
    ],
    marketCorrelation: 0.65
  }
]
