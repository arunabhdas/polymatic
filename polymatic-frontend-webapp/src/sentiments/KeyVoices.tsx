import { Lock, Download, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { useAuthStore } from '@/state/authStore'
import { formatCompact } from '@/lib/format'
import type { ClassifiedTweet, UserTier } from '@/types'

interface KeyVoicesProps {
  tweets: ClassifiedTweet[]
  className?: string
}

function filterByTier(tweets: ClassifiedTweet[], tier: UserTier): ClassifiedTweet[] {
  if (tier === 'quant') return tweets
  if (tier === 'pro') {
    // Top 5 per stance by credibility
    const yes = tweets
      .filter((t) => t.stance === 'supports_yes')
      .sort((a, b) => b.accountCredibility - a.accountCredibility)
      .slice(0, 5)
    const no = tweets
      .filter((t) => t.stance === 'supports_no')
      .sort((a, b) => b.accountCredibility - a.accountCredibility)
      .slice(0, 5)
    return [...yes, ...no]
  }
  return []
}

export function KeyVoices({ tweets, className }: KeyVoicesProps) {
  const tier = useAuthStore((s) => s.tier)

  if (tier === 'free') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-6 text-center', className)}>
        <Lock size={20} className="text-[var(--color-text-tertiary)] mb-2" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Upgrade to Pro to see key voices
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Pro shows top 5 influential accounts per stance
        </p>
      </div>
    )
  }

  const filtered = filterByTier(tweets, tier)
  const yesTweets = filtered.filter((t) => t.stance === 'supports_yes')
  const noTweets = filtered.filter((t) => t.stance === 'supports_no')

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-text-secondary)]">Key voices</p>
        {tier === 'quant' && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[10px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            <Download size={10} />
            Export
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <VoiceColumn label="Driving YES" color="var(--color-sentiment-yes)" tweets={yesTweets} />
        <VoiceColumn label="Driving NO" color="var(--color-sentiment-no)" tweets={noTweets} />
      </div>
    </div>
  )
}

function VoiceColumn({
  label,
  color,
  tweets,
}: {
  label: string
  color: string
  tweets: ClassifiedTweet[]
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-medium text-[var(--color-text-tertiary)]">{label}</span>
      </div>
      {tweets.length === 0 ? (
        <p className="text-xs text-[var(--color-text-tertiary)] italic">No voices yet</p>
      ) : (
        <div className="space-y-1.5">
          {tweets.map((tweet) => (
            <VoiceEntry key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  )
}

function VoiceEntry({ tweet }: { tweet: ClassifiedTweet }) {
  const stanceLabel = tweet.stance === 'supports_yes' ? 'YES' : 'NO'
  const stanceColor =
    tweet.stance === 'supports_yes' ? 'var(--color-sentiment-yes)' : 'var(--color-sentiment-no)'

  return (
    <div className="rounded-md border border-[var(--color-border)] p-2 space-y-1.5">
      {/* Account header */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[var(--color-bg-hover)] flex items-center justify-center shrink-0">
          <User size={10} className="text-[var(--color-text-tertiary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-[var(--color-text-primary)] truncate">
            {tweet.accountDisplayName}
          </p>
          <p className="font-mono text-[9px] text-[var(--color-text-tertiary)]">
            @{tweet.accountHandle}
          </p>
        </div>
      </div>

      {/* Tweet content */}
      <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
        {tweet.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center px-1 py-0 rounded font-medium data-label"
          style={{ fontSize: '9px', color: stanceColor, backgroundColor: `${stanceColor}20` }}
        >
          {stanceLabel}
        </span>
        <ConfidenceBadge confidence={tweet.confidenceScore} className="!text-[9px] !px-1 !py-0" />
        <span className="font-mono text-[9px] text-[var(--color-text-tertiary)] ml-auto">
          {formatCompact(Math.round(tweet.engagementWeight * 1000))} eng
        </span>
      </div>
    </div>
  )
}
