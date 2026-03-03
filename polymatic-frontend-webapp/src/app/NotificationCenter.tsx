import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAlertsStore } from '@/state/alertsStore'

export function NotificationCenter() {
  const activeAlerts = useAlertsStore((s) => s.activeAlerts)
  const dismissAlert = useAlertsStore((s) => s.dismissAlert)
  const unread = activeAlerts.filter((a) => !a.read).slice(0, 5)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence mode="popLayout">
        {unread.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg',
              'bg-[var(--color-bg-card)] border border-[var(--color-border)]',
              'shadow-lg',
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="data-label text-[var(--color-text-tertiary)] mb-1">
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </p>
              <p className="text-sm text-[var(--color-text-primary)] truncate">{alert.title}</p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
