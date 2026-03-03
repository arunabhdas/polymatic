import { describe, it, expect } from 'vitest'
import {
  calculateSignalScore,
  isHighSignal,
  clusterFeedItems,
  rankFeedItems,
} from '../feed.utils'
import type { FeedItem } from '@/types'

function makeFeedItem(overrides: Partial<FeedItem> = {}): FeedItem {
  return {
    id: 'item-1',
    type: 'signal',
    title: 'Test Signal',
    summary: 'Summary',
    content: 'Full content here.',
    category: 'geopolitics',
    severity: 'medium',
    velocity: 40,
    timestamp: new Date().toISOString(),
    source: 'twitter',
    sourceHandle: 'test',
    sourceDisplayName: 'Test User',
    entities: [],
    relatedTrendIds: [],
    relatedMarketIds: [],
    sentimentStance: null,
    confidence: 0.7,
    clusterId: null,
    geoCoords: null,
    media: [],
    ...overrides,
  }
}

describe('calculateSignalScore', () => {
  it('returns higher score for higher severity', () => {
    const low = calculateSignalScore(makeFeedItem({ severity: 'low', velocity: 20 }))
    const high = calculateSignalScore(makeFeedItem({ severity: 'high', velocity: 20 }))
    expect(high).toBeGreaterThan(low)
  })

  it('applies market linkage bonus', () => {
    const noMarket = calculateSignalScore(makeFeedItem({ relatedMarketIds: [] }))
    const withMarket = calculateSignalScore(makeFeedItem({ relatedMarketIds: ['m1'] }))
    expect(withMarket).toBeGreaterThan(noMarket)
    expect(withMarket / noMarket).toBeCloseTo(1.5, 1)
  })

  it('scales with velocity', () => {
    const slow = calculateSignalScore(makeFeedItem({ velocity: 10 }))
    const fast = calculateSignalScore(makeFeedItem({ velocity: 80 }))
    expect(fast).toBeGreaterThan(slow)
  })
})

describe('isHighSignal', () => {
  it('returns true for high severity', () => {
    expect(isHighSignal(makeFeedItem({ severity: 'high' }))).toBe(true)
  })

  it('returns true for critical severity', () => {
    expect(isHighSignal(makeFeedItem({ severity: 'critical' }))).toBe(true)
  })

  it('returns true for high velocity', () => {
    expect(isHighSignal(makeFeedItem({ severity: 'low', velocity: 80 }))).toBe(true)
  })

  it('returns true when market-linked', () => {
    expect(
      isHighSignal(makeFeedItem({ severity: 'low', velocity: 10, relatedMarketIds: ['m1'] })),
    ).toBe(true)
  })

  it('returns false for low-signal items', () => {
    expect(
      isHighSignal(makeFeedItem({ severity: 'low', velocity: 10, relatedMarketIds: [] })),
    ).toBe(false)
  })
})

describe('clusterFeedItems', () => {
  it('groups items by clusterId', () => {
    const items = [
      makeFeedItem({ id: 'a', clusterId: 'c1' }),
      makeFeedItem({ id: 'b', clusterId: 'c1' }),
      makeFeedItem({ id: 'c', clusterId: null }),
    ]
    const { clusters, unclustered } = clusterFeedItems(items)
    expect(clusters).toHaveLength(1)
    expect(clusters[0].itemIds).toHaveLength(2)
    expect(unclustered).toHaveLength(1)
    expect(unclustered[0].id).toBe('c')
  })

  it('selects highest signal score as lead item', () => {
    const items = [
      makeFeedItem({ id: 'low', clusterId: 'c1', severity: 'low', velocity: 10 }),
      makeFeedItem({ id: 'high', clusterId: 'c1', severity: 'critical', velocity: 80 }),
    ]
    const { clusters } = clusterFeedItems(items)
    expect(clusters[0].leadItemId).toBe('high')
  })

  it('handles empty input', () => {
    const { clusters, unclustered } = clusterFeedItems([])
    expect(clusters).toHaveLength(0)
    expect(unclustered).toHaveLength(0)
  })
})

describe('rankFeedItems', () => {
  it('ranks by 70% velocity + 30% recency', () => {
    const now = Date.now()
    const items = [
      makeFeedItem({ id: 'slow-new', velocity: 10, timestamp: new Date(now - 1000).toISOString() }),
      makeFeedItem({ id: 'fast-old', velocity: 90, timestamp: new Date(now - 86400000).toISOString() }),
    ]
    const ranked = rankFeedItems(items)
    // High velocity item should rank first despite being older
    expect(ranked[0].id).toBe('fast-old')
  })

  it('does not mutate input array', () => {
    const items = [
      makeFeedItem({ id: 'a', velocity: 10 }),
      makeFeedItem({ id: 'b', velocity: 90 }),
    ]
    const original = [...items]
    rankFeedItems(items)
    expect(items[0].id).toBe(original[0].id)
    expect(items[1].id).toBe(original[1].id)
  })
})
