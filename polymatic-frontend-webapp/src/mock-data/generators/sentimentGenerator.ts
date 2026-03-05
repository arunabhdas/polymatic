import { seedQuestions } from '../seed/questions';
import type { SentimentQuestion } from '../../types/sentiment.types';
import { randomBetween } from '../../utils/mockUtils';

export class SentimentGenerator {
  private questions: Map<string, SentimentQuestion> = new Map();

  constructor() {
    seedQuestions.forEach(q => this.questions.set(q.id, { ...q }));
  }

  public getQuestions(): SentimentQuestion[] {
    return Array.from(this.questions.values());
  }

  // Ticked every ~5-10 seconds to simulate real-time AI classification ingestion
  public tick() {
    this.questions.forEach((q) => {
      // 30% chance of receiving a new batch of classified tweets
      if (Math.random() > 0.3) {
        
        // Add 5-50 new random classifications based on its market momentum 
        const newClassifications = Math.floor(randomBetween(5, 50));
        q.tweetVolume += newClassifications;
        
        // Shift stance according to its existing direction
        if (q.direction === 'rising') {
          q.stanceBreakdown.yes += Math.floor(newClassifications * 0.7);
          q.stanceBreakdown.no += Math.floor(newClassifications * 0.1);
        } else if (q.direction === 'falling') {
          q.stanceBreakdown.yes += Math.floor(newClassifications * 0.1);
          q.stanceBreakdown.no += Math.floor(newClassifications * 0.7);
        } else {
          // Stable/Ambiguous splits
          q.stanceBreakdown.yes += Math.floor(newClassifications * 0.4);
          q.stanceBreakdown.no += Math.floor(newClassifications * 0.4);
        }
        
        q.stanceBreakdown.neutral += Math.floor(newClassifications * 0.1);
        q.stanceBreakdown.ambiguous += Math.floor(newClassifications * 0.1);

        // Calculate new score based on active breakdown
        const totalSentiments = q.stanceBreakdown.yes + q.stanceBreakdown.no;
        if (totalSentiments > 0) {
          const ratio = q.stanceBreakdown.yes / totalSentiments;
          // Slowly drift the overall core toward the current ratio
          q.score = q.score * 0.95 + (ratio * 100) * 0.05; 
        }

        // Add to sparkline buffer
        q.sparklineData.push(q.score);
        if (q.sparklineData.length > 48) {
          q.sparklineData.shift();
        }

        q.updatedAt = new Date().toISOString();
      }
    });
  }
}
