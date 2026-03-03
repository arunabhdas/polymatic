import { cn } from '@/lib/cn'
import type { Severity } from '@/types'

interface SeverityDotProps {
  severity: Severity
  size?: 'sm' | 'md'
  className?: string
}

const severityColors: Record<Severity, string> = {
  low: 'bg-[var(--color-success)]',
  medium: 'bg-[var(--color-warning)]',
  high: 'bg-[var(--color-danger)]',
  critical: 'bg-[var(--color-danger)]',
}

export function SeverityDot({ severity, size = 'md', className }: SeverityDotProps) {
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'

  return (
    <span
      className={cn('inline-block rounded-full shrink-0', sizeClass, severityColors[severity], className)}
      aria-label={`Severity: ${severity}`}
    />
  )
}
