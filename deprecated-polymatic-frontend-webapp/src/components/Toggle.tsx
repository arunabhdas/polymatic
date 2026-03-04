import { cn } from '@/lib/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
          checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full',
            'bg-white shadow-sm transform transition-transform duration-200',
            'mt-0.5',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </button>
      {label && <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>}
    </label>
  )
}
