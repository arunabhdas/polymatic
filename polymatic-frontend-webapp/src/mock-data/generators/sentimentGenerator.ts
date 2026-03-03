import { nanoid } from 'nanoid'
import type {
  SentimentQuestion,
  ClassifiedTweet,
  StanceType,
  SentimentDirection,
  ConfidenceLevel,
  StanceBreakdown,
  AggregateScore,
  SentimentDetail,
  PredictionBrief,
} from '@/types'
import { seedQuestions, type SeedQuestion } from '../seed/questions'
import { seedAccounts } from '../seed/accounts'

// ─── Sentiment Generator ─────────────────────────────────────
// Batch delivery every 5-10s. True sentiment drifts via Brownian motion.

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// Beta distribution approximation for confidence scores
function betaSample(alpha: number, beta: number): number {
  const u = Math.random()
  const v = Math.random()
  const x = Math.pow(u, 1 / alpha)
  const y = Math.pow(v, 1 / beta)
  return x / (x + y)
}

function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}

function getDirection(current: number, previous: number): SentimentDirection {
  const diff = current - previous
  if (diff > 2) return 'rising'
  if (diff < -2) return 'falling'
  return 'stable'
}

interface QuestionState {
  trueSentiment: number // 0-100
  driftVelocity: number
  previousScore: number
  scoreHistory: number[]
  totalTweets: number
  yesWeight: number
  noWeight: number
}

export class SentimentGenerator {
  private states = new Map<string, QuestionState>()
  private questions: SeedQuestion[]

  constructor() {
    this.questions = [...seedQuestions]
    this.initializeStates()
  }

  private initializeStates(): void {
    for (const q of this.questions) {
      // True sentiment starts near market probability with some divergence
      const divergence = (Math.random() - 0.5) * 20
      const trueSentiment = clamp(q.currentMarketProb + divergence, 5, 95)

      this.states.set(q.id, {
        trueSentiment,
        driftVelocity: (Math.random() - 0.5) * 2,
        previousScore: trueSentiment,
        scoreHistory: this.generateInitialHistory(trueSentiment),
        totalTweets: Math.floor(Math.random() * 500) + 100,
        yesWeight: trueSentiment,
        noWeight: 100 - trueSentiment,
      })
    }
  }

  private generateInitialHistory(baseSentiment: number): number[] {
    const history: number[] = []
    let val = baseSentiment
    for (let i = 0; i < 24; i++) {
      val = clamp(val + (Math.random() - 0.5) * 6, 5, 95)
      history.push(Math.round(val))
    }
    return history
  }

  tick(): void {
    for (const [, state] of this.states) {
      // Brownian motion with mean reversion
      const meanReversion = (50 - state.trueSentiment) * 0.02
      state.driftVelocity += (Math.random() - 0.5) * 1.5 + meanReversion
      state.driftVelocity = clamp(state.driftVelocity, -5, 5)
      state.previousScore = state.trueSentiment
      state.trueSentiment = clamp(state.trueSentiment + state.driftVelocity, 5, 95)
      state.scoreHistory.push(Math.round(state.trueSentiment))
      if (state.scoreHistory.length > 48) {
        state.scoreHistory.shift()
      }
    }
  }

  generateBatch(questionId: string, batchSize?: number): ClassifiedTweet[] {
    const state = this.states.get(questionId)
    if (!state) return []

    const count = batchSize ?? (Math.floor(Math.random() * 20) + 10)
    const tweets: ClassifiedTweet[] = []

    for (let i = 0; i < count; i++) {
      const account = pick(seedAccounts)
      const stance = this.sampleStance(state.trueSentiment)
      const confidenceScore = betaSample(5, 2) // Skewed toward higher confidence
      const credibility = account.credibility
      const engagement = 0.3 + Math.random() * 0.7
      const recency = 0.8 + Math.random() * 0.2
      const diversity = 0.6 + Math.random() * 0.4

      const weight = confidenceScore * credibility * engagement * recency * diversity

      if (stance === 'supports_yes') state.yesWeight += weight
      else if (stance === 'supports_no') state.noWeight += weight

      state.totalTweets++

      tweets.push({
        id: nanoid(),
        questionId,
        accountId: account.id,
        accountHandle: account.handle,
        accountDisplayName: account.displayName,
        accountAvatarUrl: account.avatarUrl,
        accountCredibility: credibility,
        content: this.generateTweetContent(stance, questionId),
        stance,
        confidenceScore: Math.round(confidenceScore * 100) / 100,
        engagementWeight: Math.round(engagement * 100) / 100,
        recencyDecay: Math.round(recency * 100) / 100,
        diversityFactor: Math.round(diversity * 100) / 100,
        timestamp: new Date(Date.now() - Math.random() * 30_000).toISOString(),
      })
    }

    return tweets
  }

  getQuestion(questionId: string): SentimentQuestion | null {
    const seed = this.questions.find(q => q.id === questionId)
    const state = this.states.get(questionId)
    if (!seed || !state) return null

    const score = this.calculateScore(state)
    const confidence = this.calculateConfidence(state)

    return {
      id: seed.id,
      text: seed.text,
      category: seed.category,
      yesCount: Math.round(state.yesWeight),
      noCount: Math.round(state.noWeight),
      score,
      confidence,
      confidenceLevel: getConfidenceLevel(confidence),
      direction: getDirection(state.trueSentiment, state.previousScore),
      marketProbability: seed.currentMarketProb,
      marketDelta: Math.round((score - seed.currentMarketProb) * 10) / 10,
      relatedMarketIds: seed.linkedMarketIds,
      relatedTrendIds: seed.linkedTrendIds,
      tweetVolume: state.totalTweets,
      stanceBreakdown: this.getBreakdown(state),
      sparklineData: [...state.scoreHistory],
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  getAllQuestions(): SentimentQuestion[] {
    return this.questions
      .map(q => this.getQuestion(q.id))
      .filter((q): q is SentimentQuestion => q !== null)
  }

  getDetail(questionId: string): SentimentDetail | null {
    const question = this.getQuestion(questionId)
    if (!question) return null

    const state = this.states.get(questionId)!
    const recentTweets = this.generateBatch(questionId, 15)

    const scoreHistory: AggregateScore[] = state.scoreHistory.map((score, i) => ({
      questionId,
      score,
      sampleSize: Math.floor(state.totalTweets / state.scoreHistory.length),
      confidence: 0.6 + Math.random() * 0.35,
      timestamp: new Date(Date.now() - (state.scoreHistory.length - i) * 30 * 60_000).toISOString(),
    }))

    return { question, recentTweets, scoreHistory }
  }

  getBrief(questionId: string): PredictionBrief | null {
    const question = this.getQuestion(questionId)
    if (!question) return null

    const signals = [
      `Sentiment score at ${question.score}%, ${question.direction} trend`,
      `${question.tweetVolume} tweets analyzed with ${question.confidenceLevel} confidence`,
      question.marketDelta !== null
        ? `Market delta: ${question.marketDelta > 0 ? '+' : ''}${question.marketDelta}%`
        : 'No linked market data',
    ]

    return {
      questionId,
      headline: question.text,
      summary: `Analysis of ${question.tweetVolume} social signals indicates ${question.score}% probability with ${question.confidenceLevel} confidence. ${question.direction === 'rising' ? 'Momentum is building.' : question.direction === 'falling' ? 'Sentiment is declining.' : 'Signals are stable.'}`,
      keySignals: signals,
      sentimentScore: question.score,
      marketProbability: question.marketProbability,
      confidence: question.confidenceLevel,
      generatedAt: new Date().toISOString(),
    }
  }

  private sampleStance(trueSentiment: number): StanceType {
    const r = Math.random() * 100
    const noise = (Math.random() - 0.5) * 15
    const threshold = trueSentiment + noise

    if (r < 8) return 'ambiguous'
    if (r < 15) return 'neutral'
    return r < threshold ? 'supports_yes' : 'supports_no'
  }

  private calculateScore(state: QuestionState): number {
    const total = state.yesWeight + state.noWeight
    if (total === 0) return 50
    return Math.round((state.yesWeight / total) * 100)
  }

  private calculateConfidence(state: QuestionState): number {
    // Higher sample size → higher confidence, with diminishing returns
    const sampleFactor = Math.min(1, state.totalTweets / 500)
    const spreadFactor = Math.abs(state.yesWeight - state.noWeight) / (state.yesWeight + state.noWeight + 1)
    return Math.round((0.4 + sampleFactor * 0.3 + spreadFactor * 0.3) * 100) / 100
  }

  private getBreakdown(state: QuestionState): StanceBreakdown {
    const total = state.totalTweets || 1
    const yesRatio = state.yesWeight / (state.yesWeight + state.noWeight + 1)
    return {
      yes: Math.round(yesRatio * total * 0.85),
      no: Math.round((1 - yesRatio) * total * 0.85),
      neutral: Math.round(total * 0.1),
      ambiguous: Math.round(total * 0.05),
    }
  }

  private generateTweetContent(stance: StanceType, questionId: string): string {
    const question = this.questions.find(q => q.id === questionId)
    const topic = question?.text.slice(0, 60) ?? 'this event'

    const yesTemplates = [
      `This is looking increasingly likely. All signals point to yes on "${topic}"`,
      `Market is underpricing this. Sentiment data strongly suggests it happens.`,
      `Multiple sources confirming movement. I'm betting YES here.`,
      `The probability should be higher. Key indicators are aligning.`,
    ]

    const noTemplates = [
      `Overblown. The fundamentals don't support this outcome.`,
      `Market is overreacting. This is noise, not signal.`,
      `Strongly disagree with the current odds. Taking the NO side.`,
      `Historical precedent says this won't materialize. Fading the consensus.`,
    ]

    const neutralTemplates = [
      `Interesting development on "${topic}". Too early to call.`,
      `Watching this closely. Could go either way from here.`,
      `The data is mixed. Need more information before taking a position.`,
    ]

    if (stance === 'supports_yes') return pick(yesTemplates)
    if (stance === 'supports_no') return pick(noTemplates)
    return pick(neutralTemplates)
  }
}
