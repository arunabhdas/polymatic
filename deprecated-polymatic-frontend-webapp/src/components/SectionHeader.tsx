import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  title: string
  icon?: LucideIcon
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, icon: Icon, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon size={16} className="shrink-0 text-muted-foreground" />}
        <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>
        {subtitle && (
          <span className="text-xs text-muted-foreground shrink-0">{subtitle}</span>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
