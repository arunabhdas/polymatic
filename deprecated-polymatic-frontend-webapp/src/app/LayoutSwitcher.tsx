import { Layout, Maximize, Minimize } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLayout } from '@/hooks/useLayout'
import type { LayoutMode } from '@/types'

const modes: { mode: LayoutMode; icon: typeof Layout; label: string }[] = [
  { mode: 'dashboard', icon: Layout, label: 'Dashboard' },
  { mode: 'focus', icon: Maximize, label: 'Focus' },
  { mode: 'clean', icon: Minimize, label: 'Clean' },
]

interface LayoutSwitcherProps {
  collapsed: boolean
}

export function LayoutSwitcher({ collapsed }: LayoutSwitcherProps) {
  const { layoutMode, setLayoutMode } = useLayout()

  if (collapsed) {
    // Cycle through modes on click
    const currentIndex = modes.findIndex((m) => m.mode === layoutMode)
    const nextMode = modes[(currentIndex + 1) % modes.length].mode
    const CurrentIcon = modes[currentIndex].icon

    return (
      <button
        onClick={() => setLayoutMode(nextMode)}
        className={cn(
          'flex items-center justify-center w-full p-2 rounded-md',
          'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]',
          'hover:bg-[var(--color-bg-hover)] transition-colors',
        )}
        aria-label={`Layout: ${layoutMode}`}
      >
        <CurrentIcon size={18} />
      </button>
    )
  }

  return (
    <div className="flex gap-1">
      {modes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setLayoutMode(mode)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs flex-1',
            'transition-colors',
            layoutMode === mode
              ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
          )}
          aria-label={`${label} layout`}
        >
          <Icon size={14} />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  )
}
