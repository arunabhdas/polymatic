import { seedMarkets } from '../seed/markets';
import type { MarketContract } from '../../types/market.types';
import { randomBetween } from '../../utils/mockUtils';

export class MarketGenerator {
  private markets: Map<string, MarketContract> = new Map();
  
  constructor() {
    // Initialize state from seeds
    seedMarkets.forEach(m => {
      this.markets.set(m.id, { ...m });
    });
  }

  public getMarkets(): MarketContract[] {
    return Array.from(this.markets.values());
  }

  // Ticked every ~5-10 seconds to simulate CLOB price action
  public tick() {
    this.markets.forEach((market) => {
      // Mean reverting random walk
      const trendTo50 = 50 - market.probability;
      const meanReversionPull = trendTo50 * 0.05; 
      
      // Add brownian noise (-1.5 to +1.5 prob shift max)
      const noise = randomBetween(-1.5, 1.5);
      
      // 5% chance of a sudden "trade" jump
      const spike = Math.random() > 0.95 ? randomBetween(-5, 5) : 0;
      
      let newProb = market.probability + meanReversionPull + noise + spike;
      
      // Clamp 1-99
      newProb = Math.max(1, Math.min(99, newProb));
      
      market.change24h = newProb - market.probability24hAgo;
      market.delta = newProb - market.probability;
      market.probability = newProb;
      
      // Simulate volume increase
      if (Math.random() > 0.5) {
        market.volume += Math.floor(randomBetween(100, 5000));
      }

      // Add to tiny sparkline buffer
      market.sparklineData.push(newProb);
      if (market.sparklineData.length > 48) {
        market.sparklineData.shift();
      }
      
      market.timestamp = new Date().toISOString();
    });
  }
}
