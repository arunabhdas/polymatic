import { nanoid } from 'nanoid'
import type { Alert, AlertConfig, Severity } from '@/types'
import type { SentimentGenerator } from './sentimentGenerator'
import type { TrendGenerator } from './trendGenerator'
import type { MarketGenerator } from './marketGenerator'

// ─── Alert Generator ─────────────────────────────────────────
// Evaluates alert configs against mock data streams.

function severityFromMagnitude(magnitude: number): Severity {
  if (magnitude > 15) return 'critical'
  if (magnitude > 8) return 'high'
  if (magnitude > 3) return 'medium'
  return 'low'
}

export class AlertGenerator {
  private configs: AlertConfig[] = []
  private alerts: Alert[] = []
  private sentiments: SentimentGenerator | null = null
  private trends: TrendGenerator | null = null
  private markets: MarketGenerator | null = null

  setGenerators(
    sentiments: SentimentGenerator,
    trends: TrendGenerator,
    markets: MarketGenerator,
  ): void {
    this.sentiments = sentiments
    this.trends = trends
    this.markets = markets
  }

  addConfig(config: AlertConfig): void {
    this.configs.push(config)
  }

  removeConfig(configId: string): void {
    this.configs = this.configs.filter(c => c.id !== configId)
  }

  getConfigs(): AlertConfig[] {
    return [...this.configs]
  }

  getAlerts(): Alert[] {
    return [...this.alerts].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }

  dismissAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) alert.read = true
  }

  tick(): void {
    // Even without configs, generate some baseline alerts from data changes
    this.generateDataDrivenAlerts()

    // Evaluate configured alert conditions
    for (const config of this.configs) {
      if (!config.enabled) continue
      this.evaluateConfig(config)
    }

    // Cap alerts at 100
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }
  }

  private generateDataDrivenAlerts(): void {
    if (!this.trends || !this.markets) return

    // Check for velocity spikes in trends
    const trends = this.trends.getTrends()
    for (const trend of trends) {
      if (trend.velocity.delta > 10) {
        // Only alert if we haven't recently alerted for this trend
        const recentAlert = this.alerts.find(
          a => a.message.includes(trend.hashtag) &&
            Date.now() - new Date(a.timestamp).getTime() < 300_000,
        )
        if (!recentAlert) {
          this.alerts.unshift({
            id: nanoid(),
            configId: 'auto',
            title: `Velocity spike: ${trend.hashtag}`,
            message: `${trend.hashtag} velocity surged ${trend.velocity.delta > 0 ? '+' : ''}${trend.velocity.delta.toFixed(1)}% — now at ${trend.velocity.current.toFixed(0)}`,
            severity: severityFromMagnitude(trend.velocity.delta),
            read: false,
            triggeredAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
          })
        }
      }
    }

    // Check for large market moves
    const markets = this.markets.getMarkets()
    for (const market of markets) {
      if (Math.abs(market.delta) > 5) {
        const recentAlert = this.alerts.find(
          a => a.message.includes(market.title) &&
            Date.now() - new Date(a.timestamp).getTime() < 300_000,
        )
        if (!recentAlert) {
          this.alerts.unshift({
            id: nanoid(),
            configId: 'auto',
            title: `Market move: ${market.title}`,
            message: `${market.title} moved ${market.delta > 0 ? '+' : ''}${market.delta.toFixed(1)}% to ${market.probability.toFixed(0)}%`,
            severity: severityFromMagnitude(Math.abs(market.delta)),
            read: false,
            triggeredAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
          })
        }
      }
    }
  }

  private evaluateConfig(config: AlertConfig): void {
    const { triggerType, conditions, targetId } = config

    switch (triggerType) {
      case 'velocity': {
        if (!this.trends || !targetId) break
        const trend = this.trends.getTrend(targetId)
        const threshold = (conditions['threshold'] as number) ?? 50
        if (trend && trend.velocity.current > threshold) {
          this.fireAlert(config, `${trend.hashtag} velocity exceeded ${threshold}`, trend.velocity.current)
        }
        break
      }
      case 'market_move': {
        if (!this.markets || !targetId) break
        const market = this.markets.getMarket(targetId)
        const threshold = (conditions['threshold'] as number) ?? 5
        if (market && Math.abs(market.delta) > threshold) {
          this.fireAlert(config, `${market.title} delta exceeded ${threshold}%`, Math.abs(market.delta))
        }
        break
      }
      case 'sentiment_shift': {
        if (!this.sentiments || !targetId) break
        const question = this.sentiments.getQuestion(targetId)
        const threshold = (conditions['threshold'] as number) ?? 10
        if (question && question.marketDelta !== null && Math.abs(question.marketDelta) > threshold) {
          this.fireAlert(config, `Sentiment-market divergence on "${question.text.slice(0, 50)}..."`, Math.abs(question.marketDelta))
        }
        break
      }
      case 'threshold': {
        if (!this.markets || !targetId) break
        const market = this.markets.getMarket(targetId)
        const threshold = (conditions['threshold'] as number) ?? 50
        const direction = (conditions['direction'] as 'above' | 'below') ?? 'above'
        if (market) {
          const triggered = direction === 'above'
            ? market.probability > threshold
            : market.probability < threshold
          if (triggered) {
            this.fireAlert(config, `${market.title} ${direction} ${threshold}%`, market.probability)
          }
        }
        break
      }
    }
  }

  private fireAlert(config: AlertConfig, message: string, magnitude: number): void {
    // Dedup: don't fire same config within 5 minutes
    const recent = this.alerts.find(
      a => a.configId === config.id &&
        Date.now() - new Date(a.timestamp).getTime() < 300_000,
    )
    if (recent) return

    this.alerts.unshift({
      id: nanoid(),
      configId: config.id,
      title: config.name,
      message,
      severity: severityFromMagnitude(magnitude),
      read: false,
      triggeredAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    })
  }
}
