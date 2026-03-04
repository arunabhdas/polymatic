import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDataProvider } from './useDataProvider'
import { useFeedStore } from '@/state/feedStore'
import { queryKeys } from '@/services/queryKeys'
import type { FeedItem } from '@/types'

// ─── useFeed ─────────────────────────────────────────────────

export function useFeed() {
  const provider = useDataProvider()
  const filters = useFeedStore((s) => s.filters)
  const addItems = useFeedStore((s) => s.addItems)

  const query = useInfiniteQuery({
    queryKey: [...queryKeys.feed.list(filters), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getFeedItems({
        page: pageParam as number,
        limit: 20,
        filters,
      })
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!provider,
    staleTime: 5_000,
    refetchInterval: 15_000,
  })

  // Subscribe to live feed updates
  useEffect(() => {
    if (!provider) return
    return provider.subscribeFeed((items: FeedItem[]) => {
      addItems(items)
    })
  }, [provider, addItems])

  const allItems = query.data?.pages.flatMap((p) => p.data) ?? []

  return {
    items: allItems,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  }
}

export function useFeedFilters() {
  const filters = useFeedStore((s) => s.filters)
  const updateFilters = useFeedStore((s) => s.updateFilters)
  const setTrendFilter = useFeedStore((s) => s.setTrendFilter)

  return { filters, updateFilters, setTrendFilter }
}
