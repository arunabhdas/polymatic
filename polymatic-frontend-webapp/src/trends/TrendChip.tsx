import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCompact } from '@/lib/format'
import { SeverityDot } from '@/components/SeverityDot'
import { VelocityIndicator } from '@/components/VelocityIndicator'
import { TrendLifecycleBadge } from './TrendLifecycleBadge'
import type { Trend } from '@/types'

interface TrendChipProps {
  trend: Trend
  selected?: boolean
  onSelect?: (id: string) => void
}

const categoryBg: Record<string, string> = {
  geopolitics: 'border-[var(--color-cat-geopolitics)]/30',
  economics: 'border-[var(--color-cat-economics)]/30',
  technology: 'border-[var(--color-cat-technology)]/30',
  sports: 'border-[var(--color-cat-sports)]/30',
  culture: 'border-[var(--color-cat-culture)]/30',
}

export function TrendChip({ trend, selected, onSelect }: TrendChipProps) {
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
          <ExternalLink
            size={11}
            className="text-[var(--color-text-tertiary)] shrink-0"
            aria-label="Linked markets"
          />
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
