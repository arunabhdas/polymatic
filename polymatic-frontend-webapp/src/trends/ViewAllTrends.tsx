import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCompact } from '@/lib/format'
import { useTrends, useSelectedTrend } from '@/hooks/useTrends'
import { useFeedStore } from '@/state/feedStore'
import { Badge } from '@/components/Badge'
import { Sparkline } from '@/components/Sparkline'
import { TrendLifecycleBadge } from './TrendLifecycleBadge'
import type { Trend } from '@/types'

type SortKey = 'velocity' | 'events' | 'markets' | 'name'

interface ViewAllTrendsProps {
  className?: string
}

export function ViewAllTrends({ className }: ViewAllTrendsProps) {
  const { trends, isLoading } = useTrends()
  const { selectedTrendId, selectTrend } = useSelectedTrend()
  const setTrendFilter = useFeedStore((s) => s.setTrendFilter)
  const [sortKey, setSortKey] = useState<SortKey>('velocity')
  const [sortDesc, setSortDesc] = useState(true)

  const sorted = useMemo(() => {
    const compare = (a: Trend, b: Trend): number => {
      switch (sortKey) {
        case 'velocity':
          return a.velocity.current - b.velocity.current
        case 'events':
          return a.eventCount - b.eventCount
        case 'markets':
          return a.linkedMarketIds.length - b.linkedMarketIds.length
        case 'name':
          return a.hashtag.localeCompare(b.hashtag)
        default:
          return 0
      }
    }
    const result = [...trends].sort(compare)
    return sortDesc ? result.reverse() : result
  }, [trends, sortKey, sortDesc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc((v) => !v)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  const handleSelect = (id: string) => {
    const next = selectedTrendId === id ? null : id
    selectTrend(next)
    setTrendFilter(next)
  }

  if (isLoading) {
    return (
      <div className={cn('p-4 space-y-3', className)}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse h-10 rounded bg-[var(--color-bg-hover)]" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
          All trends
        </h2>
        <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
          {trends.length}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2 border-b border-[var(--color-border)]/50 text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">
        <SortableHeader label="Trend" sortKey="name" active={sortKey} desc={sortDesc} onClick={handleSort} />
        <SortableHeader label="Lifecycle" sortKey="velocity" active={sortKey} desc={sortDesc} onClick={handleSort} />
        <SortableHeader label="Velocity" sortKey="velocity" active={sortKey} desc={sortDesc} onClick={handleSort} />
        <SortableHeader label="Events" sortKey="events" active={sortKey} desc={sortDesc} onClick={handleSort} />
        <SortableHeader label="Markets" sortKey="markets" active={sortKey} desc={sortDesc} onClick={handleSort} />
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {sorted.map((trend) => (
          <button
            type="button"
            key={trend.id}
            onClick={() => handleSelect(trend.id)}
            className={cn(
              'grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center w-full px-4 py-2.5',
              'text-left hover:bg-[var(--color-bg-hover)] transition-colors duration-100',
              'border-b border-[var(--color-border)]/20',
              selectedTrendId === trend.id && 'bg-[var(--color-bg-hover)] border-l-2 border-l-[var(--color-accent)]',
            )}
          >
            {/* Trend name + category */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                {trend.hashtag}
              </p>
              <Badge
                variant="category"
                category={trend.category}
                label={trend.category}
                className="mt-0.5 !text-[9px] !px-1.5"
              />
            </div>

            {/* Lifecycle */}
            <TrendLifecycleBadge lifecycle={trend.lifecycle} size="sm" />

            {/* Velocity sparkline */}
            <Sparkline data={trend.sparklineData} height={24} className="w-16" />

            {/* Event count */}
            <span className="font-mono text-xs text-[var(--color-text-secondary)] tabular-nums">
              {formatCompact(trend.eventCount)}
            </span>

            {/* Linked markets */}
            <span className="font-mono text-xs text-[var(--color-text-tertiary)] tabular-nums">
              {trend.linkedMarketIds.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SortableHeader({
  label,
  sortKey,
  active,
  desc,
  onClick,
}: {
  label: string
  sortKey: SortKey
  active: SortKey
  desc: boolean
  onClick: (key: SortKey) => void
}) {
  const isActive = active === sortKey
  return (
    <button
      type="button"
      onClick={() => onClick(sortKey)}
      className={cn(
        'flex items-center gap-0.5 hover:text-[var(--color-text-secondary)] transition-colors',
        isActive && 'text-[var(--color-text-secondary)]',
      )}
    >
      {label}
      {isActive && (
        <ArrowUpDown size={10} className={cn(!desc && 'rotate-180', 'transition-transform')} />
      )}
    </button>
  )
}
