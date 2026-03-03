import type { Timestamp, Category } from './common.types'

// ─── Sentiments ──────────────────────────────────────────────

export type StanceType = 'supports_yes' | 'supports_no' | 'neutral' | 'ambiguous'

export type SentimentDirection = 'rising' | 'falling' | 'stable'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface SentimentQuestion {
  id: string
  text: string
  category: Category
  yesCount: number
  noCount: number
  score: number // YES / (YES + NO) weighted ratio
  confidence: number // 0-1
  confidenceLevel: ConfidenceLevel
  direction: SentimentDirection
  marketProbability: number | null
  marketDelta: number | null
  relatedMarketIds: string[]
  relatedTrendIds: string[]
  tweetVolume: number
  stanceBreakdown: StanceBreakdown
  sparklineData: number[]
  timestamp: Timestamp
  updatedAt: Timestamp
}

export interface StanceBreakdown {
  yes: number
  no: number
  neutral: number
  ambiguous: number
}

export interface ClassifiedTweet {
  id: string
  questionId: string
  accountId: string
  accountHandle: string
  accountDisplayName: string
  accountAvatarUrl: string | null
  accountCredibility: number // 0-1
  content: string
  stance: StanceType
  confidenceScore: number // 0-1
  engagementWeight: number // 0-1
  recencyDecay: number // 0-1
  diversityFactor: number // 0-1
  timestamp: Timestamp
}

export interface AggregateScore {
  questionId: string
  score: number // 0-100
  sampleSize: number
  confidence: number
  timestamp: Timestamp
}

export interface SentimentDetail {
  question: SentimentQuestion
  recentTweets: ClassifiedTweet[]
  scoreHistory: AggregateScore[]
}

export interface PredictionBrief {
  questionId: string
  headline: string
  summary: string
  keySignals: string[]
  sentimentScore: number
  marketProbability: number | null
  confidence: ConfidenceLevel
  generatedAt: Timestamp
}
