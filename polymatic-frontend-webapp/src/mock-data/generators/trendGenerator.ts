import { seedTrends } from '../seed/trends';
import type { Trend } from '../../types/trend.types';
import { randomBetween } from '../../utils/mockUtils';

export class TrendGenerator {
  private trends: Map<string, Trend> = new Map();
  
  constructor() {
    seedTrends.forEach(t => this.trends.set(t.id, { ...t }));
  }

  public getTrends(): Trend[] {
    // Sort by velocity descending
    return Array.from(this.trends.values()).sort((a, b) => b.velocity.current - a.velocity.current);
  }

  // Ticked every ~3-5 seconds
  public tick() {
    this.trends.forEach((trend) => {
      // Lifecycle state machine logic
      if (trend.lifecycle === 'emerging') {
        trend.velocity.current += Math.floor(randomBetween(1, 8));
        if (trend.velocity.current > 75) trend.lifecycle = 'trending';
      } else if (trend.lifecycle === 'trending') {
        trend.velocity.current += Math.floor(randomBetween(-5, 12));
        if (trend.velocity.current > 90) trend.lifecycle = 'peaking';
      } else if (trend.lifecycle === 'peaking') {
        trend.velocity.current += Math.floor(randomBetween(-10, 2));
        if (trend.velocity.current < 60) trend.lifecycle = 'cooling';
      } else if (trend.lifecycle === 'cooling') {
        trend.velocity.current -= Math.floor(randomBetween(2, 12));
        if (trend.velocity.current < 10) trend.lifecycle = 'retired';
      }

      // Clamp velocity 0-100
      trend.velocity.current = Math.max(0, Math.min(100, trend.velocity.current));
      
      // Update history and stats
      trend.velocity.peak = Math.max(trend.velocity.peak, trend.velocity.current);
      trend.velocity.delta = trend.velocity.current - trend.velocity.history[trend.velocity.history.length - 1]; // Compare to last tick
      
      trend.velocity.history.push(trend.velocity.current);
      if (trend.velocity.history.length > 24) {
        trend.velocity.history.shift();
      }
      
      // Simulate organic event accumulation
      if (Math.random() > 0.4) {
        trend.eventCount += Math.floor(randomBetween(1, 5) * (trend.velocity.current / 10)); // Higher velocity = more events
      }
      
      trend.updatedAt = new Date().toISOString();
    });
  }
}
