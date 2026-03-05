import type { DataProvider } from './dataProvider';
import type { FeedParams, FeedItem, FeedCluster } from '../types/feed.types';
import type { SentimentParams, SentimentQuestion, SentimentDetail, PredictionBrief } from '../types/sentiment.types';
import type { Trend } from '../types/trend.types';
import type { MarketParams, MarketContract } from '../types/market.types';
import type { SearchQuery, SearchResults } from '../types/search.types';
import type { AlertConfig, Alert } from '../types/alert.types';
import type { GeoEvent, POI, GeoBounds, LayerType } from '../types/geo.types';
import type { PaginatedResponse } from '../types/api.types';
import { MarketGenerator } from '../mock-data/generators/marketGenerator';
import { TrendGenerator } from '../mock-data/generators/trendGenerator';
import { SentimentGenerator } from '../mock-data/generators/sentimentGenerator';
import { FeedGenerator } from '../mock-data/generators/feedGenerator';
import { wsEventEmitter } from './wsClient';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockProvider implements DataProvider {
  private marketsGen = new MarketGenerator();
  private trendsGen = new TrendGenerator();
  private sentimentsGen = new SentimentGenerator();
  private feedGen = new FeedGenerator();
  
  private feedItems: FeedItem[] = [];

  constructor() {
    // Start background background ticks
    setInterval(() => this.marketsGen.tick(), 5000);
    setInterval(() => this.trendsGen.tick(), 4000);
    setInterval(() => this.sentimentsGen.tick(), 6000);
    setInterval(() => {
      const newItems = this.feedGen.tick();
      if (newItems.length > 0) {
        // Prepend to top
        this.feedItems = [...newItems, ...this.feedItems];
        // Mock socket emission for real-time subscribers
        wsEventEmitter.emit('feed:new_items', newItems);
      }
    }, 2000);
  }

  // Feed
  async getFeed(params: FeedParams): Promise<PaginatedResponse<FeedItem>> {
    await delay(300);
    const limit = params.limit || 20;
    const page = params.page || 1;
    const items = this.feedItems.slice(0, limit); // Simplified
    return { data: items, page, limit, total: this.feedItems.length, hasMore: this.feedItems.length > limit };
  }

  async getFeedItem(id: string): Promise<FeedItem> {
    await delay(200);
    throw new Error('Not implemented yet in MockProvider');
  }

  async getFeedClusters(): Promise<FeedCluster[]> {
    await delay(200);
    return [];
  }

  // Sentiments
  async getSentiments(params: SentimentParams): Promise<SentimentQuestion[]> {
    await delay(300);
    return this.sentimentsGen.getQuestions();
  }

  async getSentimentDetail(id: string): Promise<SentimentDetail> {
    await delay(200);
    throw new Error('Not implemented yet in MockProvider');
  }

  async getPredictionBrief(questionId: string): Promise<PredictionBrief> {
    await delay(400); // Simulate LLM generation time
    throw new Error('Not implemented yet in MockProvider');
  }

  // Trends
  async getTrends(): Promise<Trend[]> {
    await delay(200);
    return this.trendsGen.getTrends();
  }

  // Markets
  async getMarkets(params: MarketParams): Promise<PaginatedResponse<MarketContract>> {
    await delay(300);
    const markets = this.marketsGen.getMarkets();
    return { data: markets, page: params.page || 1, limit: params.limit || 20, total: markets.length, hasMore: false };
  }

  async getMarketDetail(id: string): Promise<MarketContract> {
    await delay(200);
    throw new Error('Not implemented yet in MockProvider');
  }

  // Search
  async search(query: SearchQuery): Promise<SearchResults> {
    await delay(200);
    return { trends: [], markets: [], sentiments: [], feedItems: [], totalCount: 0 };
  }

  async autocomplete(q: string): Promise<string[]> {
    await delay(50); // Fast response for autocomplete
    return [];
  }

  // Alerts
  async getAlertConfigs(): Promise<AlertConfig[]> {
    await delay(200);
    return [];
  }

  async createAlertConfig(config: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertConfig> {
    await delay(300);
    throw new Error('Not implemented yet in MockProvider');
  }

  async deleteAlertConfig(id: string): Promise<void> {
    await delay(200);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    await delay(100);
    return [];
  }

  async dismissAlert(id: string): Promise<void> {
    await delay(100);
  }

  // Geo
  async getGeoEvents(bounds: GeoBounds, layers: LayerType[]): Promise<GeoEvent[]> {
    await delay(300);
    return [];
  }

  async getGeoPOIs(bounds: GeoBounds): Promise<POI[]> {
    await delay(300);
    return [];
  }
}
