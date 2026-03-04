import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Bookmark, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useSearchStore } from '@/state/searchStore'
import { SearchSection } from './SearchSection'
import {
  SECTION_ORDER,
  DROPDOWN_LIMITS,
  flattenResults,
  getSectionResults,
  type FlattenedResult,
} from './search.utils'

interface SearchDropdownProps {
  isSearching: boolean
  activeIndex: number | null
  onSelect: (result: FlattenedResult) => void
}

const dropdownMotion = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.15 },
}

export function SearchDropdown({ isSearching, activeIndex, onSelect }: SearchDropdownProps) {
  const navigate = useNavigate()
  const query = useSearchStore((s) => s.query)
  const results = useSearchStore((s) => s.results)
  const recentSearches = useSearchStore((s) => s.recentSearches)
  const savedSearches = useSearchStore((s) => s.savedSearches)
  const setQuery = useSearchStore((s) => s.setQuery)
  const deleteSavedSearch = useSearchStore((s) => s.deleteSavedSearch)
  const clearRecentSearches = useSearchStore((s) => s.clearRecentSearches)

  const hasQuery = query.length >= 2
  const hasResults = results && hasQuery

  // Build flat list for index tracking
  const flatItems = hasResults ? flattenResults(results, DROPDOWN_LIMITS) : []

  // Count items per section for baseIndex calculation
  function getBaseIndex(sectionIdx: number): number {
    if (!hasResults) return 0
    let base = 0
    for (let i = 0; i < sectionIdx; i++) {
      const type = SECTION_ORDER[i]
      const sectionResults = getSectionResults(results, type)
      base += Math.min(sectionResults.length, DROPDOWN_LIMITS[type])
    }
    return base
  }

  function handleRecentClick(q: string) {
    setQuery(q)
  }

  function handleViewAll() {
    navigate(`/app/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <AnimatePresence>
      <motion.div
        {...dropdownMotion}
        className={cn(
          'absolute top-full left-0 right-0 mt-1 z-[60]',
          'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg',
          'shadow-lg max-h-[70vh] overflow-y-auto',
        )}
        role="listbox"
      >
        {/* Loading state */}
        {isSearching && !hasResults && (
          <div className="p-3">
            <LoadingSkeleton variant="list-row" count={3} />
          </div>
        )}

        {/* Recent + Saved (when no query) */}
        {!hasQuery && (
          <div>
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[var(--color-text-tertiary)]" />
                    <span className="data-label text-xs text-[var(--color-text-tertiary)]">
                      Recent
                    </span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((q, i) => (
                  <div
                    key={q}
                    role="option"
                    aria-selected={activeIndex === i}
                    onClick={() => handleRecentClick(q)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
                      'text-sm text-[var(--color-text-secondary)]',
                      activeIndex === i
                        ? 'bg-[var(--color-bg-hover)] border-l-2 border-l-[var(--color-accent)]'
                        : 'border-l-2 border-l-transparent',
                      'hover:bg-[var(--color-bg-hover)]',
                    )}
                  >
                    <Clock size={14} className="text-[var(--color-text-tertiary)] shrink-0" />
                    {q}
                  </div>
                ))}
              </div>
            )}

            {savedSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <Bookmark size={12} className="text-[var(--color-text-tertiary)]" />
                  <span className="data-label text-xs text-[var(--color-text-tertiary)]">
                    Saved
                  </span>
                </div>
                {savedSearches.map((saved) => (
                  <div
                    key={saved.id}
                    onClick={() => handleRecentClick(saved.query)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
                      'text-sm text-[var(--color-text-secondary)]',
                      'border-l-2 border-l-transparent',
                      'hover:bg-[var(--color-bg-hover)]',
                    )}
                  >
                    <Bookmark size={14} className="text-[var(--color-text-tertiary)] shrink-0" />
                    <span className="truncate">{saved.query}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSavedSearch(saved.id)
                      }}
                      className="ml-auto p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors shrink-0"
                      aria-label={`Delete saved search "${saved.query}"`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {recentSearches.length === 0 && savedSearches.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-[var(--color-text-tertiary)]">
                Start typing to search topics, markets, and sentiments
              </div>
            )}
          </div>
        )}

        {/* Results sections */}
        {hasResults && (
          <div>
            {SECTION_ORDER.map((type, sectionIdx) => {
              const sectionResults = getSectionResults(results, type).slice(
                0,
                DROPDOWN_LIMITS[type],
              )
              return (
                <SearchSection
                  key={type}
                  type={type}
                  results={sectionResults}
                  activeIndex={activeIndex}
                  baseIndex={getBaseIndex(sectionIdx)}
                  onSelect={onSelect}
                />
              )
            })}

            {/* View all footer */}
            {flatItems.length > 0 && (
              <div
                onClick={handleViewAll}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-3 py-2.5',
                  'text-xs text-[var(--color-accent)] cursor-pointer',
                  'border-t border-[var(--color-border)]',
                  'hover:bg-[var(--color-bg-hover)] transition-colors',
                  activeIndex === flatItems.length && 'bg-[var(--color-bg-hover)]',
                )}
              >
                View all results
                <ArrowRight size={12} />
              </div>
            )}

            {/* No results */}
            {flatItems.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-[var(--color-text-tertiary)]">
                No results for "{query}"
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
