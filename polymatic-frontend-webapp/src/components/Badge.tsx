import { cn } from '@/lib/cn'
import type { Severity, Category } from '@/types'

type BadgeVariant = 'severity' | 'category' | 'source' | 'custom'

interface BadgeProps {
  variant?: BadgeVariant
  severity?: Severity
  category?: Category
  label: string
  className?: string
}

const severityColors: Record<Severity, string> = {
  low: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  medium: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
  high: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
  critical: 'bg-[var(--color-danger)]/25 text-[var(--color-danger)] font-bold',
}

const categoryColors: Record<Category, string> = {
  geopolitics: 'bg-[var(--color-cat-geopolitics)]/15 text-[var(--color-cat-geopolitics)]',
  economics: 'bg-[var(--color-cat-economics)]/15 text-[var(--color-cat-economics)]',
  technology: 'bg-[var(--color-cat-technology)]/15 text-[var(--color-cat-technology)]',
  sports: 'bg-[var(--color-cat-sports)]/15 text-[var(--color-cat-sports)]',
  culture: 'bg-[var(--color-cat-culture)]/15 text-[var(--color-cat-culture)]',
}

export function Badge({ variant = 'custom', severity, category, label, className }: BadgeProps) {
  const variantClass =
    variant === 'severity' && severity
      ? severityColors[severity]
      : variant === 'category' && category
        ? categoryColors[category]
        : variant === 'source'
          ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
          : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        'data-label',
        variantClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
