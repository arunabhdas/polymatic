import { Bookmark, Globe, Maximize2, Share2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { SeverityDot } from '@/components/SeverityDot'
import { Chip } from '@/components/Chip'
import { Timestamp } from '@/components/Timestamp'
import { VelocityIndicator } from '@/components/VelocityIndicator'
import type { FeedItem } from '@/types'

const sourceLabels: Record<string, string> = {
  twitter: '𝕏',
  reddit: 'Reddit',
  telegram: 'Telegram',
  news: 'News',
  structured: 'Intel',
  market_signal: 'Market',
}

const stanceLabels: Record<string, string> = {
  supports_yes: 'Yes',
  supports_no: 'No',
  neutral: 'Neutral',
}

interface FeedCardExpandedProps {
  item: FeedItem
  onClick?: () => void
  className?: string
}

export function FeedCardExpanded({ item, onClick, className }: FeedCardExpandedProps) {
  return (
    <Card variant="interactive" onClick={onClick} className={cn('p-0 overflow-hidden', className)}>
      <div className="p-4 space-y-3">
        {/* Header: source + author + timestamp */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-hover)] text-xs font-bold text-[var(--color-text-tertiary)] shrink-0">
            {sourceLabels[item.source]?.[0] ?? '?'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {item.sourceDisplayName}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              @{item.sourceHandle}
            </p>
          </div>
          <Timestamp date={item.timestamp} className="shrink-0" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
          {item.title}
        </h3>

        {/* Body */}
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
          {item.content}
        </p>

        {/* Media */}
        {item.media.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {item.media.slice(0, 3).map((m, i) => (
              <div key={i} className="relative shrink-0 rounded-md overflow-hidden">
                {m.type === 'image' ? (
                  <img
                    src={m.thumbnailUrl ?? m.url}
                    alt={m.caption ?? ''}
                    className="w-32 h-20 object-cover"
                    loading="lazy"
                  />
                ) : m.type === 'video' ? (
                  <div className="w-32 h-20 bg-[var(--color-bg-hover)] flex items-center justify-center">
                    <span className="text-[var(--color-text-tertiary)] text-xs">▶ Video</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityDot severity={item.severity} />
          <Badge variant="category" category={item.category} label={item.category} />
          <Badge variant="source" label={sourceLabels[item.source] ?? item.source} />
          {item.sentimentStance && (
            <Badge
              variant="custom"
              label={`Stance: ${stanceLabels[item.sentimentStance] ?? item.sentimentStance}`}
            />
          )}
          {item.velocity > 0 && <VelocityIndicator value={item.velocity / 100} />}
        </div>

        {/* Entity chips */}
        {item.entities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.entities.slice(0, 5).map((entity) => (
              <Chip
                key={entity.id}
                label={entity.name}
                className="!text-[10px] !px-2 !py-0"
              />
            ))}
            {item.entities.length > 5 && (
              <span className="text-[10px] text-[var(--color-text-tertiary)] self-center">
                +{item.entities.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-3 pt-1 border-t border-[var(--color-border)]/30">
          <ActionButton icon={Bookmark} label="Save" />
          {item.geoCoords && <ActionButton icon={Globe} label="View on map" />}
          <ActionButton icon={Maximize2} label="Expand" />
          <ActionButton icon={Share2} label="Share" />
        </div>
      </div>
    </Card>
  )
}

function ActionButton({ icon: Icon, label }: { icon: React.FC<{ size?: number; className?: string }>; label: string }) {
  return (
    <button
      type="button"
      className="p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors"
      title={label}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
    >
      <Icon size={14} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]" />
    </button>
  )
}
