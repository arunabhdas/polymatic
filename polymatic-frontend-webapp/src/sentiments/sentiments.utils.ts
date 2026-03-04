import type { SentimentQuestion } from '@/types'

// ─── Sort Types ──────────────────────────────────────────────

export type SentimentSortBy = 'delta' | 'velocity' | 'volume' | 'watchlist'

// ─── Sort Functions ──────────────────────────────────────────

function sortByDelta(a: SentimentQuestion, b: SentimentQuestion): number {
  return Math.abs(b.marketDelta ?? 0) - Math.abs(a.marketDelta ?? 0)
}

function sortByVelocity(a: SentimentQuestion, b: SentimentQuestion): number {
  // Use sparkline trend: compare last vs first half average
  const velA = getVelocity(a.sparklineData)
  const velB = getVelocity(b.sparklineData)
  return Math.abs(velB) - Math.abs(velA)
}

function sortByVolume(a: SentimentQuestion, b: SentimentQuestion): number {
  return b.tweetVolume - a.tweetVolume
}

export function sortQuestions(
  questions: SentimentQuestion[],
  sortBy: SentimentSortBy,
  trackedIds: Set<string>,
): SentimentQuestion[] {
  const sorted = [...questions]

  switch (sortBy) {
    case 'delta':
      sorted.sort(sortByDelta)
      break
    case 'velocity':
      sorted.sort(sortByVelocity)
      break
    case 'volume':
      sorted.sort(sortByVolume)
      break
    case 'watchlist':
      sorted.sort((a, b) => {
        const aTracked = trackedIds.has(a.id) ? 1 : 0
        const bTracked = trackedIds.has(b.id) ? 1 : 0
        if (bTracked !== aTracked) return bTracked - aTracked
        return sortByDelta(a, b)
      })
      break
  }

  return sorted
}

// ─── Helpers ─────────────────────────────────────────────────

function getVelocity(sparkline: number[]): number {
  if (sparkline.length < 4) return 0
  const mid = Math.floor(sparkline.length / 2)
  const firstHalf = sparkline.slice(0, mid)
  const secondHalf = sparkline.slice(mid)
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  return avgSecond - avgFirst
}

export function getDeltaColor(delta: number | null): 'positive' | 'negative' | 'neutral' {
  if (delta === null) return 'neutral'
  if (delta > 10) return 'positive'
  if (delta < -10) return 'negative'
  return 'neutral'
}

export function getDeltaSeverity(delta: number | null): 'green' | 'amber' | 'red' | 'neutral' {
  if (delta === null) return 'neutral'
  const abs = Math.abs(delta)
  if (abs > 10) return delta > 0 ? 'green' : 'red'
  if (abs > 5) return 'amber'
  return 'neutral'
}

export function getStanceTotal(breakdown: { yes: number; no: number; neutral: number; ambiguous: number }): number {
  return breakdown.yes + breakdown.no + breakdown.neutral + breakdown.ambiguous
}

export function getStancePercent(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}
