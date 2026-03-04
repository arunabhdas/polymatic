import { cn } from '@/lib/cn'
import { SeverityDot } from '@/components/SeverityDot'
import { Timestamp } from '@/components/Timestamp'
import { Chip } from '@/components/Chip'
import type { FeedItem } from '@/types'

const sourceIcons: Record<string, string> = {
  twitter: '𝕏',
  reddit: 'R',
  telegram: 'T',
  news: 'N',
  structured: 'S',
  market_signal: 'M',
}

interface FeedCardCompactProps {
  item: FeedItem
  onClick?: () => void
  className?: string
}

export function FeedCardCompact({ item, onClick, className }: FeedCardCompactProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5',
        'border-b border-[var(--color-border)]/40',
        'hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors duration-100',
        className,
      )}
    >
      {/* Source icon */}
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-bg-hover)] text-[10px] font-bold text-[var(--color-text-tertiary)] shrink-0">
        {sourceIcons[item.source] ?? '?'}
      </span>

      {/* Title + badges */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-text-primary)] truncate leading-snug">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <SeverityDot severity={item.severity} size="sm" />
          {item.sentimentStance && (
            <span
              className={cn(
                'inline-block w-1.5 h-1.5 rounded-full shrink-0',
                item.sentimentStance === 'supports_yes' && 'bg-[var(--color-sentiment-yes)]',
                item.sentimentStance === 'supports_no' && 'bg-[var(--color-sentiment-no)]',
                item.sentimentStance === 'neutral' && 'bg-[var(--color-sentiment-neutral)]',
              )}
              title={item.sentimentStance === 'supports_yes' ? 'YES stance' : item.sentimentStance === 'supports_no' ? 'NO stance' : 'Neutral'}
            />
          )}
          {item.relatedTrendIds.length > 0 && (
            <Chip
              label={`#${item.relatedTrendIds[0].slice(0, 8)}`}
              category={item.category}
              className="!px-1.5 !py-0 !text-[10px]"
            />
          )}
        </div>
      </div>

      {/* Timestamp */}
      <Timestamp date={item.timestamp} className="shrink-0" />
    </div>
  )
}
