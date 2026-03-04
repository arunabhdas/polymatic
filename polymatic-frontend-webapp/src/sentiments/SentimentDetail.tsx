import { Bookmark, BookmarkCheck, TrendingUp, TrendingDown, Minus, BarChart3, Users, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSentimentDetail, useTrackQuestion } from '@/hooks/useSentiments'
import { ProbabilityDisplay } from '@/components/ProbabilityDisplay'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { Badge } from '@/components/Badge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { MarketDeltaBadge } from './MarketDeltaBadge'
import { StanceDistribution } from './StanceDistribution'
import { SentimentTimeline } from './SentimentTimeline'
import { KeyVoices } from './KeyVoices'
import { PredictionBriefCard } from './PredictionBrief'
import { formatCompact } from '@/lib/format'

interface SentimentDetailProps {
  questionId: string
  className?: string
}

const directionIcons = {
  rising: TrendingUp,
  falling: TrendingDown,
  stable: Minus,
}

const directionColors = {
  rising: 'text-[var(--color-delta-positive)]',
  falling: 'text-[var(--color-delta-negative)]',
  stable: 'text-[var(--color-text-tertiary)]',
}

export function SentimentDetail({ questionId, className }: SentimentDetailProps) {
  const { data: detail, isLoading } = useSentimentDetail(questionId)
  const { isTracked, track, untrack } = useTrackQuestion()
  const tracked = isTracked(questionId)

  if (isLoading || !detail) {
    return (
      <div className={cn('p-4 space-y-3', className)}>
        <LoadingSkeleton variant="text-block" />
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="card" count={2} />
      </div>
    )
  }

  const { question, recentTweets, scoreHistory } = detail
  const DirectionIcon = directionIcons[question.direction]

  const handleTrackClick = () => {
    if (tracked) untrack(questionId)
    else track(questionId)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--color-border)] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
            {question.text}
          </h2>
          <button
            type="button"
            onClick={handleTrackClick}
            className={cn(
              'shrink-0 p-1.5 rounded transition-colors duration-100',
              tracked
                ? 'text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
            )}
            aria-label={tracked ? 'Untrack question' : 'Track question'}
          >
            {tracked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatBlock
            icon={BarChart3}
            label="Sentiment"
            value={<ProbabilityDisplay value={question.score} size="sm" />}
          />
          <StatBlock
            icon={TrendingUp}
            label="Market"
            value={
              question.marketProbability !== null ? (
                <ProbabilityDisplay value={question.marketProbability} size="sm" />
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">—</span>
              )
            }
          />
          <StatBlock
            icon={Users}
            label="Volume"
            value={
              <span className="font-mono text-xs text-[var(--color-text-primary)]">
                {formatCompact(question.tweetVolume)}
              </span>
            }
          />
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <MarketDeltaBadge delta={question.marketDelta} />
          <ConfidenceBadge confidence={question.confidence} />
          <DirectionIcon size={14} className={cn(directionColors[question.direction])} />
          <Badge variant="category" category={question.category} label={question.category} className="!text-[9px] !px-1.5 !py-0" />
          <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] ml-auto">
            <MessageSquare size={10} className="inline mr-0.5" />
            {formatCompact(question.tweetVolume)}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Stance distribution */}
        <section>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Stance distribution
          </p>
          <StanceDistribution breakdown={question.stanceBreakdown} />
        </section>

        {/* 24h timeline */}
        <section>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            24h sentiment
          </p>
          <SentimentTimeline scoreHistory={scoreHistory} height={140} />
        </section>

        {/* Key voices */}
        <section>
          <KeyVoices tweets={recentTweets} />
        </section>

        {/* AI Assessment */}
        <section>
          <PredictionBriefCard questionId={questionId} />
        </section>
      </div>
    </div>
  )
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ size?: number; className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[var(--color-text-tertiary)]">
        <Icon size={11} />
        <span className="text-[10px]">{label}</span>
      </div>
      {value}
    </div>
  )
}
