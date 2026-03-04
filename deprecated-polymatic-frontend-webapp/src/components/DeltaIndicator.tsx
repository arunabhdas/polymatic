import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDelta } from '@/lib/format'

interface DeltaIndicatorProps {
  value: number
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export function DeltaIndicator({
  value,
  className,
  showIcon = true,
  size = 'md',
}: DeltaIndicatorProps) {
  const isPositive = value > 0
  const isNeutral = value === 0
  const iconSize = size === 'sm' ? 12 : 14
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  const colorClass = isNeutral
    ? 'text-[var(--color-text-tertiary)]'
    : isPositive
      ? 'text-[var(--color-delta-positive)]'
      : 'text-[var(--color-delta-negative)]'

  return (
    <span className={cn('inline-flex items-center gap-0.5 font-mono font-medium', textSize, colorClass, className)}>
      {showIcon &&
        (isNeutral ? (
          <Minus size={iconSize} />
        ) : isPositive ? (
          <TrendingUp size={iconSize} />
        ) : (
          <TrendingDown size={iconSize} />
        ))}
      {formatDelta(value)}
    </span>
  )
}
