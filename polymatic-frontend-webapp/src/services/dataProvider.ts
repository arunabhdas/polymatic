import type { FeedParams, FeedItem, FeedCluster } from '../types/feed.types';
import type { SentimentParams, SentimentQuestion, SentimentDetail, PredictionBrief } from '../types/sentiment.types';
import type { Trend } from '../types/trend.types';
import type { MarketParams, MarketContract } from '../types/market.types';
import type { SearchQuery, SearchResults } from '../types/search.types';
import type { AlertConfig, Alert } from '../types/alert.types';
import type { GeoEvent, POI, GeoBounds, LayerType } from '../types/geo.types';
import type { PaginatedResponse } from '../types/api.types';
import { useFlagsStore } from '../state/flagsStore';
import { MockProvider } from './mockProvider';
import { RSDIPProvider } from './rsdipProvider';

export interface DataProvider {
  // Feed
  getFeed(params: FeedParams): Promise<PaginatedResponse<FeedItem>>;
  getFeedItem(id: string): Promise<FeedItem>;
  getFeedClusters(): Promise<FeedCluster[]>;

  // Sentiments
  getSentiments(params: SentimentParams): Promise<SentimentQuestion[]>;
  getSentimentDetail(id: string): Promise<SentimentDetail>;
  getPredictionBrief(questionId: string): Promise<PredictionBrief>;

  // Trends
  getTrends(): Promise<Trend[]>;

  // Markets
  getMarkets(params: MarketParams): Promise<PaginatedResponse<MarketContract>>;
  getMarketDetail(id: string): Promise<MarketContract>;

  // Search
  search(query: SearchQuery): Promise<SearchResults>;
  autocomplete(q: string): Promise<string[]>;

  // Alerts
  getAlertConfigs(): Promise<AlertConfig[]>;
  createAlertConfig(config: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertConfig>;
  deleteAlertConfig(id: string): Promise<void>;
  getActiveAlerts(): Promise<Alert[]>;
  dismissAlert(id: string): Promise<void>;

  // Geo
  getGeoEvents(bounds: GeoBounds, layers: LayerType[]): Promise<GeoEvent[]>;
  getGeoPOIs(bounds: GeoBounds): Promise<POI[]>;
}

let providerInstance: DataProvider | null = null;

export const getDataProvider = (): DataProvider => {
  if (providerInstance) return providerInstance;

  const mode = useFlagsStore.getState().dataSourceMode;
  providerInstance = mode === 'rsdip' ? new RSDIPProvider() : new MockProvider();
  
  return providerInstance;
};
