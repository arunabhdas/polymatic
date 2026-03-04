import type { FeedItem, FeedCluster, Severity } from '@/types'

// ─── Severity Weights ────────────────────────────────────────

const SEVERITY_WEIGHT: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

const MARKET_LINKAGE_BONUS = 1.5
const HIGH_SIGNAL_THRESHOLD_SCORE = 6
const HIGH_SIGNAL_VELOCITY = 60

// ─── Signal Scoring ──────────────────────────────────────────

export function calculateSignalScore(item: FeedItem): number {
  const severityFactor = SEVERITY_WEIGHT[item.severity]
  const velocityFactor = Math.max(1, item.velocity / 20)
  const marketBonus = item.relatedMarketIds.length > 0 ? MARKET_LINKAGE_BONUS : 1
  return severityFactor * velocityFactor * marketBonus
}

export function isHighSignal(item: FeedItem): boolean {
  if (item.severity === 'high' || item.severity === 'critical') return true
  if (item.velocity > HIGH_SIGNAL_VELOCITY) return true
  if (item.relatedMarketIds.length > 0) return true
  return calculateSignalScore(item) > HIGH_SIGNAL_THRESHOLD_SCORE
}

// ─── Clustering ──────────────────────────────────────────────

export function clusterFeedItems(items: FeedItem[]): {
  clusters: FeedCluster[]
  unclustered: FeedItem[]
} {
  const clusterMap = new Map<string, FeedItem[]>()
  const unclustered: FeedItem[] = []

  for (const item of items) {
    if (item.clusterId) {
      const existing = clusterMap.get(item.clusterId)
      if (existing) {
        existing.push(item)
      } else {
        clusterMap.set(item.clusterId, [item])
      }
    } else {
      unclustered.push(item)
    }
  }

  const clusters: FeedCluster[] = []

  for (const [clusterId, clusterItems] of clusterMap) {
    // Sort by signal score descending — lead item is first
    clusterItems.sort((a, b) => calculateSignalScore(b) - calculateSignalScore(a))
    const lead = clusterItems[0]

    clusters.push({
      id: clusterId,
      leadItemId: lead.id,
      itemIds: clusterItems.map((i) => i.id),
      title: lead.title,
      category: lead.category,
      severity: lead.severity,
      eventCount: clusterItems.length,
      latestTimestamp: clusterItems.reduce(
        (latest, i) => (i.timestamp > latest ? i.timestamp : latest),
        clusterItems[0].timestamp,
      ),
    })
  }

  return { clusters, unclustered }
}

// ─── Ranking ─────────────────────────────────────────────────

/**
 * "For You" ranking: 70% velocity + 30% recency.
 * Returns a new sorted array (does not mutate input).
 */
export function rankFeedItems(items: FeedItem[]): FeedItem[] {
  const now = Date.now()
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

  return [...items].sort((a, b) => {
    const ageA = Math.min(now - new Date(a.timestamp).getTime(), maxAge) / maxAge
    const ageB = Math.min(now - new Date(b.timestamp).getTime(), maxAge) / maxAge

    const recencyA = 1 - ageA // 1 = newest, 0 = oldest
    const recencyB = 1 - ageB

    // Normalize velocity (0–100 range)
    const velA = Math.min(a.velocity / 100, 1)
    const velB = Math.min(b.velocity / 100, 1)

    const scoreA = 0.7 * velA + 0.3 * recencyA
    const scoreB = 0.7 * velB + 0.3 * recencyB

    return scoreB - scoreA
  })
}
