import { useMemo } from 'react'
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCompact, formatDelta } from '@/lib/format'
import { useTrends } from '@/hooks/useTrends'
import { useMarkets } from '@/hooks/useMarkets'
import { Badge } from '@/components/Badge'
import { Chip } from '@/components/Chip'
import { Sparkline } from '@/components/Sparkline'
import { VelocityIndicator } from '@/components/VelocityIndicator'
import { TrendLifecycleBadge } from './TrendLifecycleBadge'
import type { MarketContract } from '@/types'

interface TrendDetailProps {
  trendId: string
  className?: string
}

export function TrendDetail({ trendId, className }: TrendDetailProps) {
  const { trends } = useTrends()
  const marketsQuery = useMarkets()

  const trend = trends.find((t) => t.id === trendId)
  const allMarkets = marketsQuery.data?.data ?? []

  // E04-S02-T01: Direct linked markets
  const linkedMarkets = useMemo(
    () => allMarkets.filter((m) => trend?.linkedMarketIds.includes(m.id)),
    [allMarkets, trend?.linkedMarketIds],
  )

  // E04-S02-T02: Entity-similarity fallback when no direct links
  const relatedMarkets = useMemo(() => {
    if (!trend || linkedMarkets.length > 0) return []

    const entityMarketIds = new Set<string>()
    for (const entity of trend.topEntities) {
      for (const mid of entity.linkedMarketIds) {
        entityMarketIds.add(mid)
      }
    }

    // Also find markets that share linkedTrendIds with related trends
    const categoryMarkets = allMarkets.filter(
      (m) =>
        !entityMarketIds.has(m.id) &&
        m.category === trend.category &&
        m.linkedTrendIds.some((tid) => tid !== trendId),
    )

    const entityMatches = allMarkets.filter((m) => entityMarketIds.has(m.id))
    // Deduplicate and limit
    const seen = new Set<string>()
    const result: MarketContract[] = []
    for (const m of [...entityMatches, ...categoryMarkets]) {
      if (!seen.has(m.id)) {
        seen.add(m.id)
        result.push(m)
      }
      if (result.length >= 5) break
    }
    return result
  }, [allMarkets, linkedMarkets, trend, trendId])

  if (!trend) {
    return (
      <div className={cn('p-4', className)}>
        <p className="text-sm text-[var(--color-text-tertiary)]">Trend not found</p>
      </div>
    )
  }

  const marketsToShow = linkedMarkets.length > 0 ? linkedMarkets : relatedMarkets
  const isRelated = linkedMarkets.length === 0 && relatedMarkets.length > 0

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Trend header */}
      <div className="px-4 py-4 border-b border-[var(--color-border)] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
              {trend.hashtag}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {trend.name}
            </p>
          </div>
          <TrendLifecycleBadge lifecycle={trend.lifecycle} size="md" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatBlock
            icon={TrendingUp}
            label="Velocity"
            value={
              <VelocityIndicator value={trend.velocity.delta} />
            }
          />
          <StatBlock
            icon={Users}
            label="Events"
            value={
              <span className="font-mono text-xs text-[var(--color-text-primary)]">
                {formatCompact(trend.eventCount)}
              </span>
            }
          />
          <StatBlock
            icon={BarChart3}
            label="Markets"
            value={
              <span className="font-mono text-xs text-[var(--color-text-primary)]">
                {trend.linkedMarketIds.length}
              </span>
            }
          />
        </div>

        {/* Velocity sparkline */}
        <div>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mb-1">24h velocity</p>
          <Sparkline data={trend.sparklineData} height={40} className="w-full" />
        </div>

        {/* Category + entities */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="category" category={trend.category} label={trend.category} />
          {trend.topEntities.slice(0, 4).map((e) => (
            <Chip key={e.id} label={e.name} className="!text-[10px] !px-2 !py-0" />
          ))}
        </div>
      </div>

      {/* Markets section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-medium text-[var(--color-text-secondary)]">
            {isRelated ? 'Related markets' : 'Linked markets'}
          </h3>
          <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
            {marketsToShow.length}
          </span>
        </div>

        {marketsToShow.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <MapPin size={24} className="text-[var(--color-text-tertiary)] mx-auto mb-2" />
            <p className="text-xs text-[var(--color-text-tertiary)]">
              No linked or related markets found
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {marketsToShow.map((market) => (
              <MarketMiniCard key={market.id} market={market} />
            ))}
          </div>
        )}
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

function MarketMiniCard({ market }: { market: MarketContract }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-3 hover:bg-[var(--color-bg-hover)] transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs text-[var(--color-text-primary)] leading-snug line-clamp-2">
          {market.questionText}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Probability */}
        <span className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
          {market.probability}%
        </span>

        {/* Delta */}
        <span
          className={cn(
            'font-mono text-xs',
            market.change24h > 0
              ? 'text-[var(--color-delta-positive)]'
              : market.change24h < 0
                ? 'text-[var(--color-delta-negative)]'
                : 'text-[var(--color-text-tertiary)]',
          )}
        >
          {formatDelta(market.change24h / 100)}
        </span>

        {/* Sentiment delta if present */}
        {market.sentimentDelta !== null && (
          <Badge
            variant="custom"
            label={`Δ ${formatDelta(market.sentimentDelta / 100)}`}
            className={cn(
              '!text-[10px]',
              Math.abs(market.sentimentDelta) > 10
                ? 'text-[var(--color-delta-positive)] bg-[var(--color-delta-positive)]/10'
                : '',
            )}
          />
        )}

        {/* Platform badge */}
        <Badge
          variant="source"
          label={market.platform === 'polymarket' ? 'PM' : 'KL'}
          className="!text-[9px] !px-1.5 ml-auto"
        />
      </div>

      {/* Sparkline */}
      {market.sparklineData.length > 0 && (
        <Sparkline data={market.sparklineData} height={24} className="w-full mt-2" />
      )}
    </div>
  )
}
