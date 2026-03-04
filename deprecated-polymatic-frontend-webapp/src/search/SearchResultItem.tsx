import { cn } from '@/lib/cn'
import { VelocityIndicator } from '@/components/VelocityIndicator'
import { ProbabilityDisplay } from '@/components/ProbabilityDisplay'
import { DeltaIndicator } from '@/components/DeltaIndicator'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { Badge } from '@/components/Badge'
import { Timestamp as TimestampDisplay } from '@/components/Timestamp'
import { TrendLifecycleBadge } from '@/trends/TrendLifecycleBadge'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import type { FlattenedResult } from './search.utils'
import type { Trend, MarketContract, SentimentQuestion, FeedItem, SourceType } from '@/types'

interface SearchResultItemProps {
  result: FlattenedResult
  isActive: boolean
  onClick: () => void
}

const sourceLabels: Record<SourceType, string> = {
  twitter: '\ud835\udd4f',
  reddit: 'R',
  telegram: 'T',
  news: 'N',
  structured: 'S',
  market_signal: 'M',
}

function TrendRow({ data }: { data: Trend }) {
  return (
    <>
      <span className="text-[var(--color-text-secondary)] text-sm truncate">
        {data.hashtag}
      </span>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <VelocityIndicator value={data.velocity.current} />
        <TrendLifecycleBadge lifecycle={data.lifecycle} size="sm" />
      </div>
    </>
  )
}

function MarketRow({ data }: { data: MarketContract }) {
  return (
    <>
      <span className="text-[var(--color-text-secondary)] text-sm truncate">
        {data.questionText}
      </span>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <ProbabilityDisplay value={data.probability} size="sm" />
        <DeltaIndicator value={data.delta} size="sm" />
        <Badge label={data.platform} variant="source" />
      </div>
    </>
  )
}

function SentimentRow({ data }: { data: SentimentQuestion }) {
  const DirectionIcon =
    data.direction === 'rising' ? ArrowUp : data.direction === 'falling' ? ArrowDown : Minus

  return (
    <>
      <span className="text-[var(--color-text-secondary)] text-sm truncate">
        {data.text}
      </span>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        <span className="font-mono text-xs text-[var(--color-text-primary)]">
          {Math.round(data.score * 100)}%
        </span>
        <ConfidenceBadge confidence={data.confidence} />
        <DirectionIcon
          size={12}
          className={cn(
            data.direction === 'rising' && 'text-[var(--color-success)]',
            data.direction === 'falling' && 'text-[var(--color-danger)]',
            data.direction === 'stable' && 'text-[var(--color-text-tertiary)]',
          )}
        />
      </div>
    </>
  )
}

function EventRow({ data }: { data: FeedItem }) {
  return (
    <>
      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] truncate">
        <span className="shrink-0 w-4 h-4 rounded bg-[var(--color-bg-hover)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-tertiary)]">
          {sourceLabels[data.source]}
        </span>
        {data.title}
      </span>
      <div className="ml-auto shrink-0">
        <TimestampDisplay date={data.timestamp} className="text-xs text-[var(--color-text-tertiary)]" />
      </div>
    </>
  )
}

export function SearchResultItem({ result, isActive, onClick }: SearchResultItemProps) {
  return (
    <div
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
        isActive
          ? 'bg-[var(--color-bg-hover)] border-l-2 border-l-[var(--color-accent)]'
          : 'border-l-2 border-l-transparent',
        'hover:bg-[var(--color-bg-hover)]',
      )}
    >
      {result.type === 'trend' && <TrendRow data={result.data} />}
      {result.type === 'market' && <MarketRow data={result.data} />}
      {result.type === 'sentiment' && <SentimentRow data={result.data} />}
      {result.type === 'event' && <EventRow data={result.data} />}
    </div>
  )
}
