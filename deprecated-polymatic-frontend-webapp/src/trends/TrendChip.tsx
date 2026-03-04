import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCompact } from '@/lib/format'
import { SeverityDot } from '@/components/SeverityDot'
import { VelocityIndicator } from '@/components/VelocityIndicator'
import { Tooltip } from '@/components/Tooltip'
import { TrendLifecycleBadge } from './TrendLifecycleBadge'
import type { Trend } from '@/types'

interface TrendChipProps {
  trend: Trend
  selected?: boolean
  onSelect?: (id: string) => void
  /** Top linked market question text for tooltip */
  topMarketQuestion?: string
}

const categoryBg: Record<string, string> = {
  geopolitics: 'border-[var(--color-cat-geopolitics)]/30',
  economics: 'border-[var(--color-cat-economics)]/30',
  technology: 'border-[var(--color-cat-technology)]/30',
  sports: 'border-[var(--color-cat-sports)]/30',
  culture: 'border-[var(--color-cat-culture)]/30',
}

export function TrendChip({ trend, selected, onSelect, topMarketQuestion }: TrendChipProps) {
  const hasMarkets = trend.linkedMarketIds.length > 0

  return (
    <button
      type="button"
      onClick={() => onSelect?.(trend.id)}
      className={cn(
        'flex flex-col gap-1 px-3 py-2 rounded-lg border min-w-[220px] shrink-0',
        'bg-[var(--color-bg-card)] transition-all duration-150',
        'cursor-pointer hover:bg-[var(--color-bg-hover)]',
        categoryBg[trend.category] ?? 'border-[var(--color-border)]',
        selected && [
          'border-[var(--color-accent)] bg-[var(--color-bg-hover)]',
          'ring-1 ring-[var(--color-accent)]/20',
        ],
      )}
    >
      {/* Line 1: dot + hashtag + velocity + market icon */}
      <div className="flex items-center gap-1.5 w-full">
        <SeverityDot severity={trend.category === 'geopolitics' ? 'high' : 'medium'} size="sm" />
        <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
          {trend.hashtag}
        </span>
        <VelocityIndicator value={trend.velocity.delta} className="ml-auto" />
        {hasMarkets && (
          <Tooltip
            content={
              <div className="max-w-[200px] space-y-1">
                <p className="font-medium">{trend.linkedMarketIds.length} linked market{trend.linkedMarketIds.length !== 1 ? 's' : ''}</p>
                {topMarketQuestion && (
                  <p className="text-[var(--color-text-secondary)] line-clamp-2">{topMarketQuestion}</p>
                )}
              </div>
            }
            side="bottom"
          >
            <span
              className="shrink-0 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <BarChart3
                size={11}
                className="text-[var(--color-text-tertiary)]"
                aria-label="Linked markets"
              />
            </span>
          </Tooltip>
        )}
      </div>

      {/* Line 2: lifecycle badge + event count */}
      <div className="flex items-center gap-1.5 w-full">
        <TrendLifecycleBadge lifecycle={trend.lifecycle} size="sm" />
        <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] ml-auto">
          {formatCompact(trend.eventCount)} events
        </span>
      </div>
    </button>
  )
}
