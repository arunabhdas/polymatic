import { useQuery } from '@tanstack/react-query'
import { useDataProvider } from './useDataProvider'
import { useMarketsStore } from '@/state/marketsStore'
import { queryKeys } from '@/services/queryKeys'
import type { MarketFilters } from '@/types'

// ─── useMarkets ──────────────────────────────────────────────

export function useMarkets(filters?: Partial<MarketFilters>) {
  const provider = useDataProvider()
  const storeSort = useMarketsStore((s) => s.sortBy) as MarketFilters['sortBy']
  const platformFilter = useMarketsStore((s) => s.activePlatformFilter)

  const fullFilters: MarketFilters = {
    platforms: filters?.platforms ?? (platformFilter ? [platformFilter] : []),
    categories: filters?.categories ?? [],
    minVolume: filters?.minVolume ?? null,
    minDelta: filters?.minDelta ?? null,
    sortBy: filters?.sortBy ?? storeSort,
  }

  return useQuery({
    queryKey: queryKeys.markets.list(fullFilters),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getMarkets({
        page: 1,
        limit: 50,
        filters: fullFilters,
      })
    },
    enabled: !!provider,
    refetchInterval: 6_000,
    staleTime: 3_000,
  })
}

// ─── useMarketDetail ─────────────────────────────────────────

export function useMarketDetail(marketId: string | null) {
  const provider = useDataProvider()

  return useQuery({
    queryKey: queryKeys.markets.detail(marketId ?? ''),
    queryFn: async () => {
      if (!provider || !marketId) throw new Error('Provider not ready')
      return provider.getMarketDetail(marketId)
    },
    enabled: !!provider && !!marketId,
    refetchInterval: 5_000,
    staleTime: 3_000,
  })
}
