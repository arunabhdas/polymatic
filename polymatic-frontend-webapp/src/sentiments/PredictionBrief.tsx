import { Brain, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDelta, formatPercent } from '@/lib/format'
import { useAuthStore } from '@/state/authStore'
import { usePredictionBrief } from '@/hooks/useSentiments'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'

interface PredictionBriefProps {
  questionId: string
  className?: string
}

const confidenceValues: Record<string, number> = {
  low: 0.3,
  medium: 0.65,
  high: 0.9,
}

export function PredictionBriefCard({ questionId, className }: PredictionBriefProps) {
  const tier = useAuthStore((s) => s.tier)
  const { data: brief, isLoading } = usePredictionBrief(questionId)

  if (tier === 'free') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-6 text-center', className)}>
        <Lock size={20} className="text-[var(--color-text-tertiary)] mb-2" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Upgrade to see AI analysis
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Pro and Quant tiers include AI-generated prediction briefs
        </p>
      </div>
    )
  }

  if (isLoading || !brief) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-24 rounded bg-[var(--color-bg-hover)]" />
          <div className="h-3 w-full rounded bg-[var(--color-bg-hover)]" />
          <div className="h-3 w-5/6 rounded bg-[var(--color-bg-hover)]" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] p-4 space-y-3',
        'border-l-2 border-l-[var(--color-accent)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain size={14} className="text-[var(--color-accent)] shrink-0" />
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          AI Assessment
        </span>
        <ConfidenceBadge
          confidence={confidenceValues[brief.confidence] ?? 0.5}
          className="ml-auto"
        />
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
        {brief.summary}
      </p>

      {/* Key signals */}
      <div className="space-y-1.5">
        {brief.keySignals.map((signal, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{signal}</p>
          </div>
        ))}
      </div>

      {/* Market delta + score */}
      <div className="flex items-center gap-4 pt-2 border-t border-[var(--color-border)]/50">
        <div>
          <p className="text-[10px] text-[var(--color-text-tertiary)]">Sentiment</p>
          <p className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
            {formatPercent(brief.sentimentScore)}
          </p>
        </div>
        {brief.marketProbability !== null && (
          <div>
            <p className="text-[10px] text-[var(--color-text-tertiary)]">Market</p>
            <p className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
              {formatPercent(brief.marketProbability)}
            </p>
          </div>
        )}
        {brief.marketProbability !== null && (
          <div>
            <p className="text-[10px] text-[var(--color-text-tertiary)]">Delta</p>
            <p className="font-mono text-sm font-medium text-[var(--color-accent)]">
              {formatDelta(brief.sentimentScore - brief.marketProbability)}
            </p>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <p className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
        Generated {new Date(brief.generatedAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        })} UTC
      </p>
    </div>
  )
}
