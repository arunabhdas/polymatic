import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <Icon size={40} className="text-[var(--color-text-tertiary)] mb-4" strokeWidth={1.5} />
      <p className="data-label text-[var(--color-text-secondary)] mb-1">{title}</p>
      {description && (
        <p className="text-sm text-[var(--color-text-tertiary)] max-w-xs mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
