import { cn } from '@/lib/cn'
import { Badge as ShadcnBadge } from '@/components/ui/badge'
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
  low: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-transparent',
  medium: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-transparent',
  high: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-transparent',
  critical: 'bg-[var(--color-danger)]/25 text-[var(--color-danger)] border-transparent font-bold',
}

const categoryColors: Record<Category, string> = {
  geopolitics: 'bg-[var(--color-cat-geopolitics)]/15 text-[var(--color-cat-geopolitics)] border-transparent',
  economics: 'bg-[var(--color-cat-economics)]/15 text-[var(--color-cat-economics)] border-transparent',
  technology: 'bg-[var(--color-cat-technology)]/15 text-[var(--color-cat-technology)] border-transparent',
  sports: 'bg-[var(--color-cat-sports)]/15 text-[var(--color-cat-sports)] border-transparent',
  culture: 'bg-[var(--color-cat-culture)]/15 text-[var(--color-cat-culture)] border-transparent',
}

export function Badge({ variant = 'custom', severity, category, label, className }: BadgeProps) {
  const colorClass =
    variant === 'severity' && severity
      ? severityColors[severity]
      : variant === 'category' && category
        ? categoryColors[category]
        : variant === 'source'
          ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-transparent'
          : 'bg-secondary text-secondary-foreground border-transparent'

  return (
    <ShadcnBadge
      variant="secondary"
      className={cn(
        'data-label',
        colorClass,
        className,
      )}
    >
      {label}
    </ShadcnBadge>
  )
}
