import { Bookmark, BookmarkCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Card } from '@/components/Card'
import { ProbabilityDisplay } from '@/components/ProbabilityDisplay'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { Sparkline } from '@/components/Sparkline'
import { Badge } from '@/components/Badge'
import { MarketDeltaBadge } from './MarketDeltaBadge'
import { useTrackQuestion } from '@/hooks/useSentiments'
import { formatCompact } from '@/lib/format'
import type { SentimentQuestion } from '@/types'

interface QuestionCardProps {
  question: SentimentQuestion
  isExpanded: boolean
  onSelect: () => void
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

export function QuestionCard({ question, isExpanded, onSelect, className }: QuestionCardProps) {
  const { isTracked, track, untrack } = useTrackQuestion()
  const tracked = isTracked(question.id)
  const DirectionIcon = directionIcons[question.direction]

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (tracked) {
      untrack(question.id)
    } else {
      track(question.id)
    }
  }

  return (
    <motion.div layout layoutId={`question-${question.id}`} transition={{ duration: 0.2, ease: 'easeOut' }}>
      <Card
        variant={isExpanded ? 'selected' : 'interactive'}
        onClick={onSelect}
        className={cn('p-0 overflow-hidden', className)}
      >
        <div className="p-3 space-y-2.5">
          {/* Question text */}
          <div className="flex items-start gap-2">
            <p className="text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2 flex-1">
              {question.text}
            </p>
            <button
              type="button"
              onClick={handleTrackClick}
              className={cn(
                'shrink-0 p-1 rounded transition-colors duration-100',
                tracked
                  ? 'text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
              )}
              aria-label={tracked ? 'Untrack question' : 'Track question'}
            >
              {tracked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-3">
            {/* Sentiment score */}
            <div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mb-0.5">Sentiment</p>
              <ProbabilityDisplay value={question.score} size="sm" />
            </div>

            {/* Market probability */}
            {question.marketProbability !== null && (
              <div>
                <p className="text-[10px] text-[var(--color-text-tertiary)] mb-0.5">Market</p>
                <ProbabilityDisplay value={question.marketProbability} size="sm" />
              </div>
            )}

            {/* Delta badge */}
            <MarketDeltaBadge delta={question.marketDelta} />

            {/* Direction */}
            <DirectionIcon
              size={14}
              className={cn(directionColors[question.direction])}
            />

            {/* Confidence */}
            <ConfidenceBadge confidence={question.confidence} />
          </div>

          {/* Bottom row: sparkline + volume + category */}
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Sparkline data={question.sparklineData} height={24} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
                {formatCompact(question.tweetVolume)} tweets
              </span>
              <Badge variant="category" category={question.category} label={question.category} className="!text-[9px] !px-1.5 !py-0" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
