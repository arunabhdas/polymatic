import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useSentimentDetail } from '@/hooks/useSentiments'
import { StanceDistribution } from './StanceDistribution'
import { SentimentTimeline } from './SentimentTimeline'
import { KeyVoices } from './KeyVoices'
import { PredictionBriefCard } from './PredictionBrief'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

interface QuestionCardExpandedProps {
  questionId: string
  isVisible: boolean
  className?: string
}

export function QuestionCardExpanded({ questionId, isVisible, className }: QuestionCardExpandedProps) {
  const { data: detail, isLoading } = useSentimentDetail(isVisible ? questionId : null)

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={cn('overflow-hidden', className)}
        >
          <div className="px-3 pb-3 pt-1 space-y-4 border-t border-[var(--color-border)]/30">
            {isLoading || !detail ? (
              <LoadingSkeleton variant="chart" count={1} />
            ) : (
              <>
                {/* Stance breakdown */}
                <div>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mb-2">
                    Stance distribution
                  </p>
                  <StanceDistribution breakdown={detail.question.stanceBreakdown} />
                </div>

                {/* 24h timeline */}
                <div>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mb-2">
                    24h sentiment
                  </p>
                  <SentimentTimeline scoreHistory={detail.scoreHistory} height={100} />
                </div>

                {/* Key voices */}
                <KeyVoices tweets={detail.recentTweets} />

                {/* AI Brief */}
                <PredictionBriefCard questionId={questionId} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
