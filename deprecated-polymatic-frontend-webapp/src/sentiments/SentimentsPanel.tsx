import { useMemo } from 'react'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSentimentQuestions, useTrackQuestion } from '@/hooks/useSentiments'
import { useSentimentsStore } from '@/state/sentimentsStore'
import { useUIStore } from '@/state/uiStore'
import { sortQuestions, type SentimentSortBy } from './sentiments.utils'
import { QuestionCard } from './QuestionCard'
import { QuestionCardExpanded } from './QuestionCardExpanded'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { EmptyState } from '@/components/EmptyState'

interface SentimentsPanelProps {
  className?: string
}

const SORT_OPTIONS: Array<{ value: SentimentSortBy; label: string }> = [
  { value: 'delta', label: 'Market delta' },
  { value: 'velocity', label: 'Velocity' },
  { value: 'volume', label: 'Volume' },
  { value: 'watchlist', label: 'Watchlist' },
]

export function SentimentsPanel({ className }: SentimentsPanelProps) {
  const { data: questions, isLoading, isError } = useSentimentQuestions()
  const sortBy = useSentimentsStore((s) => s.sortBy)
  const setSortBy = useSentimentsStore((s) => s.setSortBy)
  const expandedQuestionId = useSentimentsStore((s) => s.expandedQuestionId)
  const expandQuestion = useSentimentsStore((s) => s.expandQuestion)
  const setRightPanelContent = useUIStore((s) => s.setRightPanelContent)
  const { trackedIds } = useTrackQuestion()

  const sorted = useMemo(() => {
    if (!questions) return []
    return sortQuestions(questions, sortBy, trackedIds)
  }, [questions, sortBy, trackedIds])

  const handleSelect = (questionId: string) => {
    const nextExpanded = expandedQuestionId === questionId ? null : questionId
    expandQuestion(nextExpanded)
    if (nextExpanded) {
      setRightPanelContent({ kind: 'sentiment-detail', questionId })
    }
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    )
  }

  if (isError || !questions) {
    return (
      <EmptyState
        icon={Activity}
        title="Failed to load sentiment data"
        description="Check your connection and try again"
      />
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Sort controls */}
      <div className="flex items-center gap-1 px-1 pb-3">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSortBy(option.value)}
            className={cn(
              'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-100',
              sortBy === option.value
                ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="space-y-2 overflow-y-auto flex-1">
        {sorted.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No sentiment questions"
            description="Questions will appear as the engine starts processing"
          />
        ) : (
          sorted.map((question) => (
            <div key={question.id}>
              <QuestionCard
                question={question}
                isExpanded={expandedQuestionId === question.id}
                onSelect={() => handleSelect(question.id)}
              />
              <QuestionCardExpanded
                questionId={question.id}
                isVisible={expandedQuestionId === question.id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
