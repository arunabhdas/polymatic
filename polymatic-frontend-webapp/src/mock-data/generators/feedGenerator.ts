import { nanoid } from 'nanoid';
import type { FeedItem, FeedItemType, SourceType, SentimentStance } from '../../types/feed.types';
import type { Severity } from '../../types/common.types';
import { seedAccounts } from '../seed/accounts';
import { seedTrends } from '../seed/trends';
import { seedMarkets } from '../seed/markets';
import { seedEntities, getRandomEntities } from '../seed/entities';
import { randomBetween } from '../../utils/mockUtils';

export class FeedGenerator {
  private activeBurst: boolean = false;
  private burstEndTime: number = 0;
  
  // Weights for different sources
  private sourceWeights: Record<SourceType, number> = {
    twitter: 0.60,
    telegram: 0.15,
    news: 0.10,
    reddit: 0.05,
    structured: 0.05,
    market_signal: 0.05
  };

  private getRandomSource(): SourceType {
    const r = Math.random();
    let sum = 0;
    for (const [source, weight] of Object.entries(this.sourceWeights)) {
      sum += weight;
      if (r <= sum) return source as SourceType;
    }
    return 'twitter';
  }

  private getMockContent(topic: string, entities: string[]): { title: string, content: string } {
    const templates = [
      { t: `Breaking developments regarding ${entities[0]}`, c: `New reports indicate significant movement on the ${topic} front involving ${entities.join(' and ')}. Situation developing.` },
      { t: `Market reaction to ${topic}`, c: `Traders are actively pricing in the latest news from ${entities[0]}. Volatility expected to continue through the session.` },
      { t: `Official statement from ${entities[0] || 'authorities'}`, c: `A formal announcement has clarified the position on ${topic}. Policy implications are being evaluated.` },
      { t: `OSINT Update: ${topic}`, c: `Satellite imagery and local sources confirm unusual activity near key facilities. We are monitoring ${entities.join(', ')}.` },
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private getRandomStance(): SentimentStance | undefined {
    const r = Math.random();
    if (r > 0.4) return undefined; // Non-sentiment event
    if (r > 0.25) return 'supports_yes';
    if (r > 0.1) return 'supports_no';
    if (r > 0.05) return 'neutral';
    return 'ambiguous';
  }

  // Called periodically (e.g., every 1-2 seconds)
  public tick(): FeedItem[] {
    const now = Date.now();
    
    // 2% chance to trigger a 30s burst of breaking news
    if (!this.activeBurst && Math.random() < 0.02) {
      this.activeBurst = true;
      this.burstEndTime = now + 30000;
      console.log('💥 Breaking News Burst Initiated');
    }

    if (this.activeBurst && now > this.burstEndTime) {
      this.activeBurst = false;
    }

    // Base rate: 10% chance per tick to generate an item
    // Burst rate: 80% chance per tick to generate an item
    const generateChance = this.activeBurst ? 0.8 : 0.1;
    
    if (Math.random() > generateChance) {
      return [];
    }
    
    // We are generating an item
    const source = this.getRandomSource();
    const account = seedAccounts[Math.floor(Math.random() * seedAccounts.length)];
    const trend = seedTrends[Math.floor(Math.random() * seedTrends.length)];
    const entities = getRandomEntities(1, 3);
    const content = this.getMockContent(trend.name, entities.map(e => e.name));
    
    const severity = Math.floor(randomBetween(10, this.activeBurst ? 95 : 60)) as Severity;
    const isMarketCorrelated = Math.random() > 0.7 && trend.linkedMarketIds.length > 0;
    
    const item: FeedItem = {
      id: `f-${nanoid(8)}`,
      type: isMarketCorrelated ? 'market_move' : 'signal',
      title: content.title,
      content: content.c,
      category: trend.category,
      severity,
      velocity: Math.floor(randomBetween(1, 100)),
      timestamp: new Date().toISOString(),
      source,
      sourceHandle: account.handle,
      sourceDisplayName: account.displayName,
      sentimentStance: this.getRandomStance(),
      confidence: randomBetween(0.5, 0.99),
      entities,
      relatedTrendIds: [trend.id],
      relatedMarketIds: isMarketCorrelated ? trend.linkedMarketIds : [],
    };
    
    return [item];
  }
}
