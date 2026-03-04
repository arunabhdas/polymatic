import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Bookmark, SearchX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSearch } from '@/hooks/useSearch'
import { useSearchStore } from '@/state/searchStore'
import { SearchSection } from '@/search/SearchSection'
import {
  SECTION_ORDER,
  FULL_PAGE_LIMITS,
  getSectionResults,
  getNavigationTarget,
  type FlattenedResult,
} from '@/search/search.utils'

export default function SearchResultsView() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const urlQuery = searchParams.get('q') ?? ''

  const query = useSearchStore((s) => s.query)
  const results = useSearchStore((s) => s.results)
  const savedSearches = useSearchStore((s) => s.savedSearches)
  const setQuery = useSearchStore((s) => s.setQuery)
  const saveSearch = useSearchStore((s) => s.saveSearch)

  const { isSearching } = useSearch()

  // Sync URL query to store on mount / URL change
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery)
    }
  }, [urlQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalCount = results?.totalCount ?? 0
  const isAlreadySaved = savedSearches.some((s) => s.query === query)

  function handleSelect(result: FlattenedResult) {
    navigate(getNavigationTarget(result))
  }

  function handleSave() {
    if (query.length >= 2 && !isAlreadySaved) {
      saveSearch(query)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
            {query ? (
              <>
                Results for{' '}
                <span className="text-[var(--color-accent)]">"{query}"</span>
              </>
            ) : (
              'Search'
            )}
          </h1>
          {results && query.length >= 2 && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
              <span className="font-mono">{totalCount}</span> results found
            </p>
          )}
        </div>

        {query.length >= 2 && (
          <button
            onClick={handleSave}
            disabled={isAlreadySaved}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
              isAlreadySaved
                ? 'text-[var(--color-text-tertiary)] cursor-default'
                : 'text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] cursor-pointer',
            )}
          >
            <Bookmark size={14} className={isAlreadySaved ? 'fill-current' : ''} />
            {isAlreadySaved ? 'Saved' : 'Save this search'}
          </button>
        )}
      </div>

      {/* Loading */}
      {isSearching && !results && (
        <div className="text-sm text-[var(--color-text-tertiary)]">Searching...</div>
      )}

      {/* Results sections */}
      {results && query.length >= 2 && (
        <div className="space-y-4">
          {SECTION_ORDER.map((type, sectionIdx) => {
            const sectionResults = getSectionResults(results, type).slice(
              0,
              FULL_PAGE_LIMITS[type],
            )

            // Calculate base index for this section
            let baseIndex = 0
            for (let i = 0; i < sectionIdx; i++) {
              const prevType = SECTION_ORDER[i]
              baseIndex += Math.min(
                getSectionResults(results, prevType).length,
                FULL_PAGE_LIMITS[prevType],
              )
            }

            return (
              <SearchSection
                key={type}
                type={type}
                results={sectionResults}
                activeIndex={null}
                baseIndex={baseIndex}
                onSelect={handleSelect}
                showEmpty
              />
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {results && query.length >= 2 && totalCount === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX size={32} className="text-[var(--color-text-tertiary)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            No results match "{query}"
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Try different keywords or broaden your search
          </p>
        </div>
      )}
    </div>
  )
}
