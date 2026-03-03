import { cn } from '@/lib/cn'
import { formatTimestamp, formatAbsoluteUTC } from '@/lib/time'

interface TimestampProps {
  date: Date | number | string
  mode?: 'smart' | 'absolute'
  className?: string
}

export function Timestamp({ date, mode = 'smart', className }: TimestampProps) {
  const d = typeof date === 'string' ? new Date(date) : date
  const display = mode === 'absolute' ? formatAbsoluteUTC(d) : formatTimestamp(d)
  const title = formatAbsoluteUTC(d)

  return (
    <time
      dateTime={new Date(d).toISOString()}
      title={title}
      className={cn('font-mono text-xs text-[var(--color-text-tertiary)]', className)}
    >
      {display}
    </time>
  )
}
