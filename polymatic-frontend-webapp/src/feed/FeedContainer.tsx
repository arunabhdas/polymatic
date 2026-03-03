import { useMemo, useEffect, useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFeed } from '@/hooks/useFeed'
import { useTrendsStore } from '@/state/trendsStore'
import { useFeedStore } from '@/state/feedStore'
import { clusterFeedItems, rankFeedItems } from './feed.utils'
import { FeedCard } from './FeedCard'
import { FeedCluster } from './FeedCluster'
import { FeedSkeleton } from './FeedSkeleton'
import { EmptyState } from '@/components/EmptyState'
import type { FeedItem, FeedCluster as FeedClusterType } from '@/types'

type FeedRow =
  | { kind: 'cluster'; cluster: FeedClusterType; items: FeedItem[] }
  | { kind: 'item'; item: FeedItem }

interface FeedContainerProps {
  className?: string
}

export function FeedContainer({ className }: FeedContainerProps) {
  const { items, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useFeed()
  const selectedTrendId = useTrendsStore((s) => s.selectedTrendId)
  const setTrendFilter = useFeedStore((s) => s.setTrendFilter)
  const updateFilters = useFeedStore((s) => s.updateFilters)

  // Step 12: Sync selectedTrendId → feedStore filter
  useEffect(() => {
    setTrendFilter(selectedTrendId)
    updateFilters({ trendId: selectedTrendId })
  }, [selectedTrendId, setTrendFilter, updateFilters])

  // Process items into ranked + clustered rows
  const rows = useMemo<FeedRow[]>(() => {
    if (items.length === 0) return []

    const ranked = rankFeedItems(items)
    const { clusters, unclustered } = clusterFeedItems(ranked)

    const result: FeedRow[] = []

    // Interleave clusters and unclustered items by timestamp
    const clustersByTime = clusters
      .map((c) => ({
        cluster: c,
        items: c.itemIds
          .map((id) => items.find((i) => i.id === id))
          .filter((i): i is FeedItem => i !== undefined),
        timestamp: new Date(c.latestTimestamp).getTime(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp)

    const unclusteredRanked = rankFeedItems(unclustered)

    let ci = 0
    let ui = 0

    while (ci < clustersByTime.length || ui < unclusteredRanked.length) {
      const clusterTime = ci < clustersByTime.length ? clustersByTime[ci].timestamp : -Infinity
      const itemTime =
        ui < unclusteredRanked.length
          ? new Date(unclusteredRanked[ui].timestamp).getTime()
          : -Infinity

      if (clusterTime >= itemTime && ci < clustersByTime.length) {
        const c = clustersByTime[ci]
        result.push({ kind: 'cluster', cluster: c.cluster, items: c.items })
        ci++
      } else if (ui < unclusteredRanked.length) {
        result.push({ kind: 'item', item: unclusteredRanked[ui] })
        ui++
      } else {
        break
      }
    }

    return result
  }, [items])

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const resetFilters = useCallback(() => {
    updateFilters({
      sources: [],
      categories: [],
      minSeverity: null,
      timeRange: 'all',
      trendId: null,
    })
  }, [updateFilters])

  // Loading state
  if (isLoading) {
    return <FeedSkeleton className={className} />
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <div className={cn('flex-1', className)}>
        <EmptyState
          icon={Radio}
          title="No signals matching your filters"
          description="Try adjusting your filters or time range to see more results."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      </div>
    )
  }

  return (
    <Virtuoso
      className={cn('flex-1', className)}
      data={rows}
      overscan={50}
      endReached={handleEndReached}
      itemContent={(_index, row) => {
        if (row.kind === 'cluster') {
          return (
            <div className="px-2 py-1">
              <FeedCluster cluster={row.cluster} items={row.items} />
            </div>
          )
        }
        return (
          <div className="px-2 py-1">
            <FeedCard item={row.item} />
          </div>
        )
      }}
      components={{
        Footer: () =>
          isFetchingNextPage ? (
            <div className="flex justify-center py-4">
              <span className="text-xs text-[var(--color-text-tertiary)]">Loading more...</span>
            </div>
          ) : null,
      }}
    />
  )
}
