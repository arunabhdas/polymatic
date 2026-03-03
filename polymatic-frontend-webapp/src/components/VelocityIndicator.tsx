import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatPercent } from '@/lib/format'

interface VelocityIndicatorProps {
  value: number
  className?: string
}

export function VelocityIndicator({ value, className }: VelocityIndicatorProps) {
  const isPositive = value > 0
  const isNeutral = Math.abs(value) < 0.01

  const colorClass = isNeutral
    ? 'text-[var(--color-text-tertiary)]'
    : isPositive
      ? 'text-[var(--color-delta-positive)]'
      : 'text-[var(--color-delta-negative)]'

  const Icon = isNeutral ? ArrowRight : isPositive ? ArrowUp : ArrowDown

  return (
    <span className={cn('inline-flex items-center gap-0.5 font-mono text-xs', colorClass, className)}>
      <Icon size={12} />
      {formatPercent(Math.abs(value))}
    </span>
  )
}
