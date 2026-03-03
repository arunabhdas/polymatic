/**
 * Format a number with compact notation: 1234567 → "1.2M"
 */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

/**
 * Format a percentage: 0.73 → "73%"
 */
export function formatPercent(value: number, decimals = 0): string {
  const pct = value <= 1 && value >= -1 ? value * 100 : value
  return `${pct.toFixed(decimals)}%`
}

/**
 * Format a delta with sign: 0.124 → "+12.4%"
 */
export function formatDelta(value: number, decimals = 1): string {
  const pct = value <= 1 && value >= -1 ? value * 100 : value
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(decimals)}%`
}

/**
 * Format currency: 1234567 → "$1.2M"
 */
export function formatCurrency(value: number): string {
  return `$${formatCompact(value)}`
}
