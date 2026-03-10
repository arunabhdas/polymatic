import { nanoid } from 'nanoid';
import type { FeedItem, SentimentStance } from '../../types/feed.types';
import type { SourceType, Severity } from '../../types/common.types';
import { seedAccounts } from '../seed/accounts';
import { seedTrends } from '../seed/trends';
import { getRandomEntities } from '../seed/entities';
import { randomBetween } from '../../utils/mockUtils';

export class FeedGenerator {
  private activeBurst: boolean = false;
  private burstEndTime: number = 0;

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
      { title: `Breaking developments regarding ${entities[0]}`, content: `New reports indicate significant movement on the ${topic} front involving ${entities.join(' and ')}. Situation developing.` },
      { title: `Market reaction to ${topic}`, content: `Traders are actively pricing in the latest news from ${entities[0]}. Volatility expected to continue through the session.` },
      { title: `Official statement from ${entities[0] || 'authorities'}`, content: `A formal announcement has clarified the position on ${topic}. Policy implications are being evaluated.` },
      { title: `OSINT Update: ${topic}`, content: `Satellite imagery and local sources confirm unusual activity near key facilities. We are monitoring ${entities.join(', ')}.` },
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private getRandomStance(): SentimentStance | undefined {
    const r = Math.random();
    if (r > 0.4) return undefined;
    if (r > 0.25) return 'supports_yes';
    if (r > 0.1) return 'supports_no';
    if (r > 0.05) return 'neutral';
    return 'ambiguous';
  }

  public tick(): FeedItem[] {
    const now = Date.now();

    if (!this.activeBurst && Math.random() < 0.02) {
      this.activeBurst = true;
      this.burstEndTime = now + 30000;
    }

    if (this.activeBurst && now > this.burstEndTime) {
      this.activeBurst = false;
    }

    const generateChance = this.activeBurst ? 0.8 : 0.1;

    if (Math.random() > generateChance) {
      return [];
    }

    const source = this.getRandomSource();
    const account = seedAccounts[Math.floor(Math.random() * seedAccounts.length)];
    const trend = seedTrends[Math.floor(Math.random() * seedTrends.length)];
    const entities = getRandomEntities(1, 3);
    const mockContent = this.getMockContent(trend.name, entities.map(e => e.name));

    const severity = Math.floor(randomBetween(10, this.activeBurst ? 95 : 60)) as Severity;
    const isMarketCorrelated = Math.random() > 0.7 && trend.linkedMarketIds.length > 0;

    const item: FeedItem = {
      id: `f-${nanoid(8)}`,
      type: isMarketCorrelated ? 'market_move' : 'signal',
      title: mockContent.title,
      content: mockContent.content,
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
