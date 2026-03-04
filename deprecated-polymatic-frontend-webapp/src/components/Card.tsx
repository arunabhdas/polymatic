import { cn } from '@/lib/cn'
import { Card as ShadcnCard } from '@/components/ui/card'

type CardVariant = 'default' | 'interactive' | 'selected'

interface CardProps {
  variant?: CardVariant
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Card({ variant = 'default', className, children, onClick }: CardProps) {
  const isClickable = variant === 'interactive' || variant === 'selected' || !!onClick

  return (
    <ShadcnCard
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'gap-0 p-4 shadow-[var(--shadow-sm)]',
        variant === 'interactive' && [
          'cursor-pointer transition-all duration-150',
          'hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-accent)]/30',
        ],
        variant === 'selected' && [
          'cursor-pointer border-[var(--color-accent)]/50',
          'bg-[var(--color-bg-hover)]',
        ],
        className,
      )}
    >
      {children}
    </ShadcnCard>
  )
}
