import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search'
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', onClear, className, value, ...props }, ref) => {
    const hasValue = typeof value === 'string' ? value.length > 0 : !!value

    return (
      <div className="relative">
        {variant === 'search' && (
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
          />
        )}
        <input
          ref={ref}
          value={value}
          className={cn(
            'w-full rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
            'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
            'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
            variant === 'search' ? 'pl-9 pr-8 py-2' : 'px-3 py-2',
            className,
          )}
          {...props}
        />
        {variant === 'search' && hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
