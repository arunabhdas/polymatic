import type { Trend } from '../types/trend.types';
import { generateSparkline } from '../utils/mockUtils';

export const seedTrends: Trend[] = [
  {
    id: 't-hormuz-tension',
    hashtag: '#HormuzTension',
    name: 'Strait of Hormuz Security',
    category: 'geopolitics',
    lifecycle: 'trending',
    velocity: {
      current: 85,
      delta: 12,
      peak: 85,
      history: generateSparkline(24, 40, 90, 85),
    },
    eventCount: 1420,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    topEntities: [
      { id: 'e-iran', name: 'Iran', type: 'country' },
      { id: 'e-strait-of-hormuz', name: 'Strait of Hormuz', type: 'location' },
      { id: 'e-irgc', name: 'IRGC', type: 'organization' }
    ],
    linkedMarketIds: ['m-polymarket-hormuz'],
    sparklineData: generateSparkline(24, 40, 90, 85),
  },
  {
    id: 't-fed-pivot',
    hashtag: '#FedPivot',
    name: 'Federal Reserve Rate Cuts',
    category: 'economics',
    lifecycle: 'peaking',
    velocity: {
      current: 92,
      delta: 2,
      peak: 94,
      history: generateSparkline(24, 80, 95, 92),
    },
    eventCount: 3800,
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    topEntities: [
      { id: 'e-fed', name: 'Federal Reserve', type: 'organization' },
      { id: 'e-powell', name: 'Jerome Powell', type: 'person' }
    ],
    linkedMarketIds: ['m-kalshi-fed-q2'],
    sparklineData: generateSparkline(24, 80, 95, 92),
  },
  {
    id: 't-chip-supply',
    hashtag: '#ChipSupplyChain',
    name: 'Semiconductor Manufacturing',
    category: 'technology',
    lifecycle: 'cooling',
    velocity: {
      current: 45,
      delta: -8,
      peak: 75,
      history: generateSparkline(24, 30, 80, 45),
    },
    eventCount: 850,
    createdAt: new Date(Date.now() - 240 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    topEntities: [
      { id: 'e-tsmc', name: 'TSMC', type: 'organization' },
      { id: 'e-arizona-fab', name: 'Arizona Fab 2', type: 'location' }
    ],
    linkedMarketIds: ['m-polymarket-tsmc'],
    sparklineData: generateSparkline(24, 30, 80, 45),
  },
  {
    id: 't-agi-timeline',
    hashtag: '#AGITimeline',
    name: 'OpenAI Feature Releases',
    category: 'technology',
    lifecycle: 'emerging',
    velocity: {
      current: 65,
      delta: 18,
      peak: 65,
      history: generateSparkline(24, 20, 70, 65),
    },
    eventCount: 1240,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    topEntities: [
      { id: 'e-openai', name: 'OpenAI', type: 'organization' },
      { id: 'e-sam-altman', name: 'Sam Altman', type: 'person' },
      { id: 'e-gpt5', name: 'GPT-5', type: 'commodity' }
    ],
    linkedMarketIds: ['m-polymarket-gpt5'],
    sparklineData: generateSparkline(24, 20, 70, 65),
  },
  {
    id: 't-eu-trade-war',
    hashtag: '#EUTradeWar',
    name: 'US-EU Trump Tariffs',
    category: 'economics',
    lifecycle: 'emerging',
    velocity: {
      current: 55,
      delta: 22,
      peak: 55,
      history: generateSparkline(24, 10, 60, 55),
    },
    eventCount: 550,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    topEntities: [
      { id: 'e-eu', name: 'European Union', type: 'organization' },
      { id: 'e-trump', name: 'Donald Trump', type: 'person' }
    ],
    linkedMarketIds: [],
    sparklineData: generateSparkline(24, 10, 60, 55),
  }
];
