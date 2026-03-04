import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { TrendLifecycle } from '@/types'

interface TrendLifecycleBadgeProps {
  lifecycle: TrendLifecycle
  size?: 'sm' | 'md'
}

const lifecycleConfig: Record<
  TrendLifecycle,
  { label: string; className: string }
> = {
  emerging: {
    label: 'Emerging',
    className:
      'bg-transparent border-[var(--color-accent)]/50 text-[var(--color-accent)]',
  },
  trending: {
    label: 'Trending',
    className:
      'bg-[var(--color-accent)]/15 border-[var(--color-accent)]/30 text-[var(--color-accent)]',
  },
  peaking: {
    label: 'Peaking',
    className:
      'bg-[var(--color-warning)]/15 border-[var(--color-warning)]/30 text-[var(--color-warning)]',
  },
  cooling: {
    label: 'Cooling',
    className:
      'bg-[var(--color-bg-hover)] border-[var(--color-border)] text-[var(--color-text-tertiary)] opacity-50',
  },
}

const pulsingBorder = {
  animate: {
    borderColor: [
      'rgba(var(--accent-rgb, 99, 102, 241), 0.3)',
      'rgba(var(--accent-rgb, 99, 102, 241), 0.8)',
      'rgba(var(--accent-rgb, 99, 102, 241), 0.3)',
    ],
  },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
}

const glowEffect = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(var(--warning-rgb, 234, 179, 8), 0)',
      '0 0 6px rgba(var(--warning-rgb, 234, 179, 8), 0.3)',
      '0 0 0px rgba(var(--warning-rgb, 234, 179, 8), 0)',
    ],
  },
  transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
}

export function TrendLifecycleBadge({ lifecycle, size = 'sm' }: TrendLifecycleBadgeProps) {
  const config = lifecycleConfig[lifecycle]
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'

  const motionProps =
    lifecycle === 'emerging'
      ? pulsingBorder
      : lifecycle === 'peaking'
        ? glowEffect
        : {}

  return (
    <motion.span
      {...motionProps}
      className={cn(
        'inline-flex items-center rounded border font-medium leading-tight',
        'transition-all duration-200',
        sizeClass,
        config.className,
      )}
    >
      {config.label}
    </motion.span>
  )
}
