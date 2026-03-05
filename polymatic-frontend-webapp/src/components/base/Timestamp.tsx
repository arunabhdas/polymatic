import { formatDistanceToNow, format } from "date-fns"

interface TimestampProps {
  date: Date | string | number
  formatStr?: string
  relative?: boolean
  className?: string
}

export function Timestamp({ date, formatStr = "MMM d, h:mm a", relative = true, className = "" }: TimestampProps) {
  const d = new Date(date)
  return (
    <span className={`text-[11px] text-muted-foreground font-mono tabular-nums ${className}`} title={format(d, "PPpp")}>
      {relative ? formatDistanceToNow(d, { addSuffix: true }) : format(d, formatStr)}
    </span>
  )
}
