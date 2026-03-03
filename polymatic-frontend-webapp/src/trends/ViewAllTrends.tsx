import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCompact } from '@/lib/format'
import { useTrends, useSelectedTrend } from '@/hooks/useTrends'
import { useFeedStore } from '@/state/feedStore'
import { Badge } from '@/components/Badge'
import { Chip } from '@/components/Chip'
import { Sparkline } from '@/components/Sparkline'
import { TrendLifecycleBadge } from './TrendLifecycleBadge'
import type { Trend, TrendLifecycle } from '@/types'

type SortKey = 'velocity' | 'events' | 'markets' | 'name'

const LIFECYCLE_OPTIONS: TrendLifecycle[] = ['emerging', 'trending', 'peaking', 'cooling']

const lifecycleSparklineColor: Record<TrendLifecycle, string> = {
  emerging: 'var(--color-accent)',
  trending: 'var(--color-accent)',
  peaking: 'var(--color-warning)',
  cooling: 'var(--color-text-tertiary)',
}

interface ViewAllTrendsProps {
  className?: string
}

export function ViewAllTrends({ className }: ViewAllTrendsProps) {
  const { trends, isLoading } = useTrends()
  const { selectedTrendId, selectTrend } = useSelectedTrend()
  const setTrendFilter = useFeedStore((s) => s.setTrendFilter)
  const [sortKey, setSortKey] = useState<SortKey>('velocity')
  const [sortDesc, setSortDesc] = useState(true)
  const [lifecycleFilter, setLifecycleFilter] = useState<TrendLifecycle | null>(null)

  const sorted = useMemo(() => {
    let filtered = lifecycleFilter
      ? trends.filter((t) => t.lifecycle === lifecycleFilter)
      : trends

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
    const result = [...filtered].sort(compare)
    return sortDesc ? result.reverse() : result
  }, [trends, sortKey, sortDesc, lifecycleFilter])

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

      {/* Lifecycle filter */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--color-border)]/50">
        <Chip
          label="All"
          selected={lifecycleFilter === null}
          onClick={() => setLifecycleFilter(null)}
          className="!text-[10px] !px-2 !py-0.5"
        />
        {LIFECYCLE_OPTIONS.map((lc) => (
          <Chip
            key={lc}
            label={lc.charAt(0).toUpperCase() + lc.slice(1)}
            selected={lifecycleFilter === lc}
            onClick={() => setLifecycleFilter(lifecycleFilter === lc ? null : lc)}
            className="!text-[10px] !px-2 !py-0.5"
          />
        ))}
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

            {/* Velocity sparkline — color matches lifecycle */}
            <Sparkline
              data={trend.sparklineData}
              color={lifecycleSparklineColor[trend.lifecycle]}
              height={24}
              className="w-16"
            />

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
