import { useState, useMemo, useCallback } from 'react'
import { Plus, Search, X, Lock, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useTrackQuestion, useSentimentQuestions } from '@/hooks/useSentiments'
import { useAuthStore } from '@/state/authStore'
import type { SentimentQuestion } from '@/types'

interface AddQuestionFlowProps {
  className?: string
}

const FREE_TIER_LIMIT = 3

export function AddQuestionFlow({ className }: AddQuestionFlowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const tier = useAuthStore((s) => s.tier)
  const { trackedIds, track, isTracked } = useTrackQuestion()
  const { data: questions } = useSentimentQuestions()

  const atLimit = tier === 'free' && trackedIds.size >= FREE_TIER_LIMIT

  const untrackedQuestions = useMemo(() => {
    if (!questions) return []
    return questions.filter((q) => !isTracked(q.id))
  }, [questions, isTracked])

  // Suggestions: top by absolute delta
  const suggestions = useMemo(() => {
    return [...untrackedQuestions]
      .sort((a, b) => Math.abs(b.marketDelta ?? 0) - Math.abs(a.marketDelta ?? 0))
      .slice(0, 5)
  }, [untrackedQuestions])

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase()
    return untrackedQuestions
      .filter((question) => question.text.toLowerCase().includes(q))
      .slice(0, 8)
  }, [searchQuery, untrackedQuestions])

  const handleTrack = useCallback(
    (question: SentimentQuestion) => {
      if (atLimit) return
      track(question.id)
    },
    [track, atLimit],
  )

  const displayItems = searchQuery.length >= 2 ? searchResults : suggestions
  const displayLabel = searchQuery.length >= 2 ? 'Search results' : 'Suggested questions'

  return (
    <div className={className}>
      {!isOpen ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center gap-1.5"
        >
          <Plus size={14} />
          Add question
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)]">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Track a question
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  className="p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search input */}
              <div className="relative px-3 py-2 border-b border-[var(--color-border)]/50">
                <Search
                  size={14}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className={cn(
                    'w-full pl-7 pr-2 py-1.5 text-sm rounded-md',
                    'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]',
                    'placeholder:text-[var(--color-text-tertiary)]',
                    'border border-[var(--color-border)] focus:border-[var(--color-accent)]/50',
                    'outline-none transition-colors',
                  )}
                />
              </div>

              {/* Tier limit warning */}
              {atLimit && (
                <div className="px-3 py-2 flex items-center gap-2 bg-[var(--color-warning)]/10 border-b border-[var(--color-border)]/50">
                  <Lock size={12} className="text-[var(--color-warning)] shrink-0" />
                  <p className="text-xs text-[var(--color-warning)]">
                    Free tier limited to {FREE_TIER_LIMIT} tracked questions. Upgrade to track more.
                  </p>
                </div>
              )}

              {/* Results */}
              <div className="max-h-64 overflow-y-auto">
                <p className="px-3 py-1.5 text-[10px] text-[var(--color-text-tertiary)] font-medium">
                  {displayLabel}
                </p>

                {displayItems.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-[var(--color-text-tertiary)] text-center">
                    {searchQuery.length >= 2 ? 'No matching questions' : 'No suggestions available'}
                  </p>
                ) : (
                  displayItems.map((question) => (
                    <SuggestionRow
                      key={question.id}
                      question={question}
                      onTrack={() => handleTrack(question)}
                      disabled={atLimit}
                    />
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

function SuggestionRow({
  question,
  onTrack,
  disabled,
}: {
  question: SentimentQuestion
  onTrack: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onTrack}
      disabled={disabled}
      className={cn(
        'w-full text-left px-3 py-2 flex items-center gap-2',
        'hover:bg-[var(--color-bg-hover)] transition-colors duration-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      )}
    >
      <TrendingUp size={12} className="text-[var(--color-text-tertiary)] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-text-primary)] truncate">{question.text}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
            {question.score}%
          </span>
          <Badge
            variant="category"
            category={question.category}
            label={question.category}
            className="!text-[9px] !px-1 !py-0"
          />
        </div>
      </div>
      <Plus size={14} className="text-[var(--color-accent)] shrink-0" />
    </button>
  )
}
