import type { Timestamp, SortOrder } from './common.types';

export type Platform = 'polymarket' | 'kalshi';

export interface PricePoint {
  id: string;
  marketId: string;
  timestamp: Timestamp;
  probability: number;
  volume: number;
}

export interface MarketContract {
  id: string;
  questionText: string;
  title: string;
  platform: Platform;
  probability: number;
  probability24hAgo: number;
  change24h: number;
  delta: number;
  volume: number;
  category: string;
  sentimentScore: number | null;
  sentimentDelta: number | null;
  expiresAt: Timestamp;
  timestamp: Timestamp;
  linkedTrendIds: string[];
  priceHistory: PricePoint[];
  sparklineData: number[];
}

export interface MarketFilters {
  platforms?: Platform[];
  categories?: string[];
  minVolume?: number;
  minDelta?: number;
}

export interface MarketParams extends MarketFilters {
  page?: number;
  limit?: number;
  sortBy?: 'volume' | 'delta' | 'probability';
  sortOrder?: SortOrder;
}
