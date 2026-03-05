import type { Entity, Timestamp } from './common.types';

export type TrendLifecycle = 'emerging' | 'trending' | 'peaking' | 'cooling' | 'retired';

export type TrendCategory = 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture';

export interface VelocityScore {
  current: number;
  delta: number;
  peak: number;
  history: number[]; // Last 24h data points
}

export interface Trend {
  id: string;
  hashtag: string;
  name: string;
  category: TrendCategory;
  lifecycle: TrendLifecycle;
  velocity: VelocityScore;
  eventCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  topEntities: Entity[];
  linkedMarketIds: string[];
  sparklineData: number[];
}
