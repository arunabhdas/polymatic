import { useMemo } from 'react'
import { Filter } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Chip } from '@/components/Chip'
import { useFeedFilters } from '@/hooks/useFeed'
import type { SourceType, Category, Severity } from '@/types'

const SOURCE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: 'twitter', label: '𝕏 Twitter' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'news', label: 'News' },
  { value: 'structured', label: 'Structured' },
]

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'geopolitics', label: 'Geopolitics' },
  { value: 'economics', label: 'Economics' },
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'culture', label: 'Culture' },
]

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

const TIME_OPTIONS: { value: string; label: string }[] = [
  { value: '1h', label: '1h' },
  { value: '6h', label: '6h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: 'all', label: 'All' },
]

interface FeedFiltersProps {
  className?: string
}

export function FeedFilters({ className }: FeedFiltersProps) {
  const { filters, updateFilters } = useFeedFilters()

  const activeCount = useMemo(() => {
    let count = 0
    if (filters.sources.length > 0) count += filters.sources.length
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.minSeverity) count += 1
    if (filters.timeRange !== 'all') count += 1
    return count
  }, [filters])

  const toggleSource = (source: SourceType) => {
    const next = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source]
    updateFilters({ sources: next })
  }

  const toggleCategory = (category: Category) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    updateFilters({ categories: next })
  }

  const setSeverity = (severity: Severity) => {
    updateFilters({
      minSeverity: filters.minSeverity === severity ? null : severity,
    })
  }

  const setTimeRange = (range: string) => {
    updateFilters({ timeRange: range as typeof filters.timeRange })
  }

  const clearAll = () => {
    updateFilters({
      sources: [],
      categories: [],
      minSeverity: null,
      timeRange: 'all',
    })
  }

  return (
    <div className={cn('flex items-center gap-3 px-2 py-2 overflow-x-auto no-scrollbar', className)}>
      {/* Filter icon + count */}
      <div className="flex items-center gap-1 shrink-0">
        <Filter size={14} className="text-[var(--color-text-tertiary)]" />
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--color-border)] shrink-0" />

      {/* Sources */}
      <div className="flex items-center gap-1 shrink-0">
        {SOURCE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={filters.sources.includes(opt.value)}
            onClick={() => toggleSource(opt.value)}
            className="!text-[10px] !px-2 !py-0.5"
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--color-border)] shrink-0" />

      {/* Categories */}
      <div className="flex items-center gap-1 shrink-0">
        {CATEGORY_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            category={opt.value}
            selected={filters.categories.includes(opt.value)}
            onClick={() => toggleCategory(opt.value)}
            className="!text-[10px] !px-2 !py-0.5"
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--color-border)] shrink-0" />

      {/* Severity */}
      <div className="flex items-center gap-1 shrink-0">
        {SEVERITY_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={filters.minSeverity === opt.value}
            onClick={() => setSeverity(opt.value)}
            className="!text-[10px] !px-2 !py-0.5"
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--color-border)] shrink-0" />

      {/* Time range */}
      <div className="flex items-center gap-1 shrink-0">
        {TIME_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={filters.timeRange === opt.value}
            onClick={() => setTimeRange(opt.value)}
            className="!text-[10px] !px-2 !py-0.5"
          />
        ))}
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <>
          <div className="w-px h-5 bg-[var(--color-border)] shrink-0" />
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium shrink-0 transition-colors"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  )
}
