import type { Trend, MarketContract, SentimentQuestion, FeedItem, SearchResults } from '@/types'
import { Hash, BarChart3, MessageSquare, Rss, type LucideIcon } from 'lucide-react'

// ─── Result Types ───────────────────────────────────────────

export type SearchResultType = 'trend' | 'market' | 'sentiment' | 'event'

export type FlattenedResult =
  | { type: 'trend'; id: string; data: Trend }
  | { type: 'market'; id: string; data: MarketContract }
  | { type: 'sentiment'; id: string; data: SentimentQuestion }
  | { type: 'event'; id: string; data: FeedItem }

// ─── Limits ─────────────────────────────────────────────────

export const DROPDOWN_LIMITS: Record<SearchResultType, number> = {
  trend: 3,
  market: 3,
  sentiment: 3,
  event: 5,
}

export const FULL_PAGE_LIMITS: Record<SearchResultType, number> = {
  trend: 20,
  market: 20,
  sentiment: 20,
  event: 50,
}

// ─── Flattening ─────────────────────────────────────────────

export function flattenResults(
  results: SearchResults,
  limits: Record<SearchResultType, number> = DROPDOWN_LIMITS,
): FlattenedResult[] {
  const flat: FlattenedResult[] = []

  for (const trend of results.trends.slice(0, limits.trend)) {
    flat.push({ type: 'trend', id: trend.id, data: trend })
  }
  for (const market of results.markets.slice(0, limits.market)) {
    flat.push({ type: 'market', id: market.id, data: market })
  }
  for (const sentiment of results.sentiments.slice(0, limits.sentiment)) {
    flat.push({ type: 'sentiment', id: sentiment.id, data: sentiment })
  }
  for (const event of results.feedItems.slice(0, limits.event)) {
    flat.push({ type: 'event', id: event.id, data: event })
  }

  return flat
}

// ─── Section Helpers ────────────────────────────────────────

export function getSectionLabel(type: SearchResultType): string {
  const labels: Record<SearchResultType, string> = {
    trend: 'Trends',
    market: 'Markets',
    sentiment: 'Sentiments',
    event: 'Events',
  }
  return labels[type]
}

export function getSectionIcon(type: SearchResultType): LucideIcon {
  const icons: Record<SearchResultType, LucideIcon> = {
    trend: Hash,
    market: BarChart3,
    sentiment: MessageSquare,
    event: Rss,
  }
  return icons[type]
}

export function getSectionEmptyMessage(type: SearchResultType): string {
  const messages: Record<SearchResultType, string> = {
    trend: 'No matching trends',
    market: 'No matching markets',
    sentiment: 'No matching sentiments',
    event: 'No matching events',
  }
  return messages[type]
}

// ─── Navigation ─────────────────────────────────────────────

export function getNavigationTarget(result: FlattenedResult): string {
  switch (result.type) {
    case 'trend':
      return `/app/topic/${result.id}`
    case 'market':
      return `/app/markets/${result.id}`
    case 'sentiment':
      return `/app/sentiments/${result.id}`
    case 'event':
      return `/app/home`
  }
}

// ─── Section Order ──────────────────────────────────────────

export const SECTION_ORDER: SearchResultType[] = ['trend', 'market', 'sentiment', 'event']

export function getSectionResults(
  results: SearchResults,
  type: SearchResultType,
): FlattenedResult[] {
  switch (type) {
    case 'trend':
      return results.trends.map((t) => ({ type: 'trend' as const, id: t.id, data: t }))
    case 'market':
      return results.markets.map((m) => ({ type: 'market' as const, id: m.id, data: m }))
    case 'sentiment':
      return results.sentiments.map((s) => ({ type: 'sentiment' as const, id: s.id, data: s }))
    case 'event':
      return results.feedItems.map((e) => ({ type: 'event' as const, id: e.id, data: e }))
  }
}
