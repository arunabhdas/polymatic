import { Bell, Moon, Sun, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/useTheme'
import { useAlertsStore } from '@/state/alertsStore'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const unreadCount = useAlertsStore((s) => s.unreadCount)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-[var(--topbar-height)] px-4',
        'flex items-center justify-between',
        'bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]',
      )}
    >
      {/* Left: spacer for sidebar alignment */}
      <div className="w-48" />

      {/* Center: search placeholder */}
      <div className="flex-1 max-w-xl mx-auto">
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
            'text-[var(--color-text-tertiary)] text-sm cursor-pointer',
            'hover:border-[var(--color-accent)] transition-colors',
          )}
        >
          <Search size={16} />
          <span>Search topics, markets, entities...</span>
          <kbd className="ml-auto text-xs font-mono opacity-50">⌘K</kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 w-48 justify-end">
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-md transition-colors',
            'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            'hover:bg-[var(--color-bg-hover)]',
          )}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className={cn(
            'relative p-2 rounded-md transition-colors',
            'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            'hover:bg-[var(--color-bg-hover)]',
          )}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]',
                'flex items-center justify-center',
                'text-[10px] font-bold text-white',
                'bg-[var(--color-danger)] rounded-full px-1',
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
