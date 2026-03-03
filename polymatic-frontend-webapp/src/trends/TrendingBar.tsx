import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useTrends, useSelectedTrend } from '@/hooks/useTrends'
import { useMarkets } from '@/hooks/useMarkets'
import { useFeedStore } from '@/state/feedStore'
import { useUIStore } from '@/state/uiStore'
import { TrendChip } from './TrendChip'

function TrendChipSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] min-w-[220px] shrink-0 animate-pulse">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-bg-hover)]" />
        <div className="h-3 w-20 rounded bg-[var(--color-bg-hover)]" />
        <div className="h-3 w-10 rounded bg-[var(--color-bg-hover)] ml-auto" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-14 rounded bg-[var(--color-bg-hover)]" />
        <div className="h-3 w-12 rounded bg-[var(--color-bg-hover)] ml-auto" />
      </div>
    </div>
  )
}

interface TrendingBarProps {
  onViewAll?: () => void
  className?: string
}

export function TrendingBar({ onViewAll, className }: TrendingBarProps) {
  const { trends, isLoading } = useTrends()
  const { selectedTrendId, selectTrend } = useSelectedTrend()
  const setTrendFilter = useFeedStore((s) => s.setTrendFilter)
  const setRightPanelContent = useUIStore((s) => s.setRightPanelContent)
  const marketsQuery = useMarkets()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Build a map of trendId → top market question text for tooltips
  const topMarketQuestions = useMemo(() => {
    const allMarkets = marketsQuery.data?.data ?? []
    const map = new Map<string, string>()
    for (const trend of trends) {
      if (trend.linkedMarketIds.length > 0) {
        const topMarket = allMarkets.find((m) => m.id === trend.linkedMarketIds[0])
        if (topMarket) {
          map.set(trend.id, topMarket.questionText)
        }
      }
    }
    return map
  }, [trends, marketsQuery.data])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      ro.disconnect()
    }
  }, [checkScroll, trends])

  const scroll = useCallback((direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    })
  }, [])

  const handleSelect = useCallback(
    (id: string) => {
      const next = selectedTrendId === id ? null : id
      selectTrend(next)
      setTrendFilter(next)

      // Show trend detail in right panel when selected, clear when deselected
      if (next) {
        setRightPanelContent({ kind: 'trend-detail', trendId: next })
      } else {
        setRightPanelContent({ kind: 'empty' })
      }
    },
    [selectedTrendId, selectTrend, setTrendFilter, setRightPanelContent],
  )

  return (
    <div className={cn('relative group h-16 shrink-0', className)}>
      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-0 bottom-0 z-10 w-8',
            'flex items-center justify-center',
            'bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="text-[var(--color-text-secondary)]" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-0 bottom-0 z-10 w-8',
            'flex items-center justify-center',
            'bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          )}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 h-full px-2 overflow-x-auto scroll-smooth no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {isLoading ? (
          Array.from({ length: 6 }, (_, i) => <TrendChipSkeleton key={i} />)
        ) : (
          <AnimatePresence initial={false}>
            {trends.map((trend) => (
              <motion.div
                key={trend.id}
                layoutId={`trend-chip-${trend.id}`}
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <TrendChip
                  trend={trend}
                  selected={selectedTrendId === trend.id}
                  onSelect={handleSelect}
                  topMarketQuestion={topMarketQuestions.get(trend.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* View All button */}
        {!isLoading && trends.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg border shrink-0',
              'border-[var(--color-border)] bg-[var(--color-bg-card)]',
              'text-xs text-[var(--color-text-secondary)] font-medium',
              'hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
              'transition-colors duration-150 cursor-pointer',
            )}
          >
            <TrendingUp size={14} />
            View all
          </button>
        )}
      </div>
    </div>
  )
}
