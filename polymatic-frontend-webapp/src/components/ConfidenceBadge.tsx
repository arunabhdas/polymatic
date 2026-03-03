import { cn } from '@/lib/cn'

type ConfidenceLevel = 'low' | 'medium' | 'high'

interface ConfidenceBadgeProps {
  confidence: number
  className?: string
}

function getLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}

const levelConfig: Record<ConfidenceLevel, { label: string; opacity: string }> = {
  low: { label: 'Low', opacity: 'opacity-60' },
  medium: { label: 'Med', opacity: 'opacity-85' },
  high: { label: 'High', opacity: 'opacity-100' },
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const level = getLevel(confidence)
  const config = levelConfig[level]

  return (
    <span
      className={cn(
        'data-label px-1.5 py-0.5 rounded',
        'bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
        config.opacity,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
