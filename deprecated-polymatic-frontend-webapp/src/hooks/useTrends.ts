import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDataProvider } from './useDataProvider'
import { useTrendsStore } from '@/state/trendsStore'
import { queryKeys } from '@/services/queryKeys'
import type { Trend } from '@/types'

// ─── useTrends ───────────────────────────────────────────────

export function useTrends() {
  const provider = useDataProvider()
  const updateTrends = useTrendsStore((s) => s.updateTrends)

  const query = useQuery({
    queryKey: queryKeys.trends.list(),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getTrends()
    },
    enabled: !!provider,
    refetchInterval: 6_000,
    staleTime: 3_000,
  })

  // Subscribe to live trend updates
  useEffect(() => {
    if (!provider) return
    return provider.subscribeTrendUpdates((trends: Trend[]) => {
      updateTrends(trends)
    })
  }, [provider, updateTrends])

  return {
    trends: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}

// ─── useSelectedTrend ────────────────────────────────────────

export function useSelectedTrend() {
  const selectedTrendId = useTrendsStore((s) => s.selectedTrendId)
  const selectTrend = useTrendsStore((s) => s.selectTrend)

  return { selectedTrendId, selectTrend }
}
