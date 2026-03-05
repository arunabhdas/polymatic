import type { FeedItem } from './feed.types';
import type { Trend } from './trend.types';
import type { MarketContract } from './market.types';
import type { SentimentQuestion } from './sentiment.types';
import type { Timestamp } from './common.types';

export interface SearchQuery {
  q: string;
  limit?: number;
  categories?: string[];
  includeExpired?: boolean;
}

export interface SearchResults {
  trends: Trend[];
  markets: MarketContract[];
  sentiments: SentimentQuestion[];
  feedItems: FeedItem[];
  totalCount: number;
}

export interface SearchOptions {
  debounceMs?: number;
  minChars?: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  query: string;
  categoryFilter?: string[];
  createdAt: Timestamp;
}
