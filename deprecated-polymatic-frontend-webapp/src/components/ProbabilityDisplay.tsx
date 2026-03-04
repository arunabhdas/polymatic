import { cn } from '@/lib/cn'
import { formatPercent } from '@/lib/format'

interface ProbabilityDisplayProps {
  value: number
  previousValue?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProbabilityDisplay({
  value,
  previousValue,
  className,
  size = 'md',
}: ProbabilityDisplayProps) {
  const direction = previousValue !== undefined ? (value > previousValue ? 'up' : value < previousValue ? 'down' : 'flat') : 'flat'

  const colorClass =
    direction === 'up'
      ? 'text-[var(--color-delta-positive)]'
      : direction === 'down'
        ? 'text-[var(--color-delta-negative)]'
        : 'text-[var(--color-text-primary)]'

  const sizeClass =
    size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'

  return (
    <span className={cn('font-mono font-bold', sizeClass, colorClass, className)}>
      {formatPercent(value)}
    </span>
  )
}
