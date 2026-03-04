import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDelta } from '@/lib/format'
import { getDeltaSeverity } from './sentiments.utils'

interface MarketDeltaBadgeProps {
  delta: number | null
  className?: string
}

const severityStyles = {
  green: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  amber: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
  red: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
  neutral: 'bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]',
}

export function MarketDeltaBadge({ delta, className }: MarketDeltaBadgeProps) {
  if (delta === null) return null

  const severity = getDeltaSeverity(delta)
  const iconSize = 12

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-medium',
        severityStyles[severity],
        className,
      )}
    >
      {delta > 0 ? (
        <TrendingUp size={iconSize} />
      ) : delta < 0 ? (
        <TrendingDown size={iconSize} />
      ) : (
        <Minus size={iconSize} />
      )}
      {formatDelta(delta)}
    </span>
  )
}
