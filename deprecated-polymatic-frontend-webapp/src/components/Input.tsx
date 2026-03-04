import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Input as ShadcnInput } from '@/components/ui/input'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search'
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', onClear, className, value, ...props }, ref) => {
    const hasValue = typeof value === 'string' ? value.length > 0 : !!value

    if (variant === 'search') {
      return (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <ShadcnInput
            ref={ref}
            value={value}
            className={cn('pl-9 pr-8', className)}
            {...props}
          />
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )
    }

    return <ShadcnInput ref={ref} value={value} className={className} {...props} />
  },
)

Input.displayName = 'Input'
