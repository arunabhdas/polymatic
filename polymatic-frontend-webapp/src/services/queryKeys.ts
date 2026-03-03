import type { FeedFilters, MarketFilters } from '@/types'

// ─── TanStack Query Key Factory ──────────────────────────────

export const queryKeys = {
  feed: {
    all: ['feed'] as const,
    list: (filters: FeedFilters) => ['feed', 'list', filters] as const,
    detail: (id: string) => ['feed', 'detail', id] as const,
  },

  sentiments: {
    all: ['sentiments'] as const,
    list: () => ['sentiments', 'list'] as const,
    detail: (id: string) => ['sentiments', 'detail', id] as const,
    tweets: (id: string) => ['sentiments', 'tweets', id] as const,
  },

  trends: {
    all: ['trends'] as const,
    list: () => ['trends', 'list'] as const,
    detail: (id: string) => ['trends', 'detail', id] as const,
  },

  markets: {
    all: ['markets'] as const,
    list: (filters?: MarketFilters) => ['markets', 'list', filters] as const,
    detail: (id: string) => ['markets', 'detail', id] as const,
  },

  search: {
    results: (query: string) => ['search', query] as const,
  },

  alerts: {
    configs: () => ['alerts', 'configs'] as const,
    active: () => ['alerts', 'active'] as const,
  },

  geo: {
    events: (bounds: string) => ['geo', 'events', bounds] as const,
  },
} as const
