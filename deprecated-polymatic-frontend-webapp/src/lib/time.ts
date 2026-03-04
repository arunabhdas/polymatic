import { formatDistanceToNowStrict, format } from 'date-fns'

const RECENT_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Smart timestamp: relative when recent ("2m ago"), absolute when older ("Mar 2, 14:23 UTC").
 */
export function formatTimestamp(date: Date | number): string {
  const d = date instanceof Date ? date : new Date(date)
  const now = Date.now()
  const diff = now - d.getTime()

  if (diff < RECENT_THRESHOLD_MS) {
    return formatDistanceToNowStrict(d, { addSuffix: true })
  }

  return format(d, "MMM d, HH:mm 'UTC'")
}

/**
 * Always returns absolute UTC format.
 */
export function formatAbsoluteUTC(date: Date | number): string {
  const d = date instanceof Date ? date : new Date(date)
  return format(d, "MMM d, yyyy HH:mm 'UTC'")
}
