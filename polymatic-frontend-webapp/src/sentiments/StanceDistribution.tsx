import { cn } from '@/lib/cn'
import { formatCompact } from '@/lib/format'
import type { StanceBreakdown } from '@/types'
import { getStanceTotal, getStancePercent } from './sentiments.utils'

interface StanceDistributionProps {
  breakdown: StanceBreakdown
  className?: string
}

export function StanceDistribution({ breakdown, className }: StanceDistributionProps) {
  const total = getStanceTotal(breakdown)
  const yesPct = getStancePercent(breakdown.yes, total)
  const noPct = getStancePercent(breakdown.no, total)
  const neutralPct = getStancePercent(breakdown.neutral, total)

  return (
    <div className={cn('space-y-2', className)}>
      {/* Segmented bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
        {yesPct > 0 && (
          <div
            className="bg-[var(--color-sentiment-yes)] transition-all duration-300"
            style={{ width: `${yesPct}%` }}
          />
        )}
        {neutralPct > 0 && (
          <div
            className="bg-[var(--color-sentiment-neutral)] transition-all duration-300"
            style={{ width: `${neutralPct}%` }}
          />
        )}
        {noPct > 0 && (
          <div
            className="bg-[var(--color-sentiment-no)] transition-all duration-300"
            style={{ width: `${noPct}%` }}
          />
        )}
      </div>

      {/* Labels */}
      <div className="flex items-center gap-3 text-xs">
        <StanceLabel color="var(--color-sentiment-yes)" label="YES" count={breakdown.yes} pct={yesPct} />
        <span className="text-[var(--color-text-tertiary)]">·</span>
        <StanceLabel color="var(--color-sentiment-no)" label="NO" count={breakdown.no} pct={noPct} />
        <span className="text-[var(--color-text-tertiary)]">·</span>
        <StanceLabel color="var(--color-sentiment-neutral)" label="Neutral" count={breakdown.neutral} pct={neutralPct} />
      </div>
    </div>
  )
}

function StanceLabel({
  color,
  label,
  count,
  pct,
}: {
  color: string
  label: string
  count: number
  pct: number
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[var(--color-text-secondary)]">{label}:</span>
      <span className="font-mono text-[var(--color-text-primary)]">
        {formatCompact(count)}
      </span>
      <span className="font-mono text-[var(--color-text-tertiary)]">({pct}%)</span>
    </span>
  )
}
