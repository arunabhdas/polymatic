import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Category } from '@/types'

interface ChipProps {
  label: string
  category?: Category
  selected?: boolean
  removable?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

const categoryBorders: Record<Category, string> = {
  geopolitics: 'border-[var(--color-cat-geopolitics)]/40',
  economics: 'border-[var(--color-cat-economics)]/40',
  technology: 'border-[var(--color-cat-technology)]/40',
  sports: 'border-[var(--color-cat-sports)]/40',
  culture: 'border-[var(--color-cat-culture)]/40',
}

const categoryText: Record<Category, string> = {
  geopolitics: 'text-[var(--color-cat-geopolitics)]',
  economics: 'text-[var(--color-cat-economics)]',
  technology: 'text-[var(--color-cat-technology)]',
  sports: 'text-[var(--color-cat-sports)]',
  culture: 'text-[var(--color-cat-culture)]',
}

export function Chip({
  label,
  category,
  selected,
  removable,
  onClick,
  onRemove,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-xs font-medium border transition-all duration-150',
        'bg-[var(--color-bg-secondary)]',
        category ? categoryBorders[category] : 'border-[var(--color-border)]',
        category ? categoryText[category] : 'text-[var(--color-text-secondary)]',
        selected && 'bg-[var(--color-bg-hover)] border-[var(--color-accent)]',
        onClick && 'cursor-pointer hover:bg-[var(--color-bg-hover)]',
        className,
      )}
    >
      <span className="truncate">{label}</span>
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              e.preventDefault()
              onRemove?.()
            }
          }}
          className="hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X size={12} />
        </span>
      )}
    </button>
  )
}
