import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Input } from '@/components/Input'
import { useSearch } from '@/hooks/useSearch'
import { useSearchStore } from '@/state/searchStore'
import { SearchDropdown } from './SearchDropdown'
import {
  flattenResults,
  DROPDOWN_LIMITS,
  getNavigationTarget,
  type FlattenedResult,
} from './search.utils'

export function SearchBar() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const query = useSearchStore((s) => s.query)
  const isOpen = useSearchStore((s) => s.isOpen)
  const results = useSearchStore((s) => s.results)
  const recentSearches = useSearchStore((s) => s.recentSearches)
  const setQuery = useSearchStore((s) => s.setQuery)
  const openDropdown = useSearchStore((s) => s.openDropdown)
  const closeDropdown = useSearchStore((s) => s.closeDropdown)

  const { isSearching } = useSearch()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Compute total navigable items
  const flatItems = results && query.length >= 2 ? flattenResults(results, DROPDOWN_LIMITS) : []
  const hasViewAll = flatItems.length > 0
  // When no query, recent searches are navigable
  const recentCount = query.length < 2 ? recentSearches.length : 0
  const totalItems = query.length >= 2 ? flatItems.length + (hasViewAll ? 1 : 0) : recentCount

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(null)
  }, [results, query])

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        openDropdown()
      }
    }
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [openDropdown])

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return

    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown()
        setActiveIndex(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, closeDropdown])

  const handleSelect = useCallback(
    (result: FlattenedResult) => {
      navigate(getNavigationTarget(result))
      closeDropdown()
      setActiveIndex(null)
      inputRef.current?.blur()
    },
    [navigate, closeDropdown],
  )

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        if (totalItems === 0) return
        setActiveIndex((prev) => {
          if (prev === null) return 0
          return (prev + 1) % totalItems
        })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        if (totalItems === 0) return
        setActiveIndex((prev) => {
          if (prev === null) return totalItems - 1
          return (prev - 1 + totalItems) % totalItems
        })
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (activeIndex === null) {
          // Navigate to full search page
          if (query.length >= 2) {
            navigate(`/app/search?q=${encodeURIComponent(query)}`)
            closeDropdown()
            inputRef.current?.blur()
          }
          return
        }

        // Recent searches mode
        if (query.length < 2 && activeIndex < recentSearches.length) {
          setQuery(recentSearches[activeIndex])
          setActiveIndex(null)
          return
        }

        // "View all" is the last index
        if (hasViewAll && activeIndex === flatItems.length) {
          navigate(`/app/search?q=${encodeURIComponent(query)}`)
          closeDropdown()
          inputRef.current?.blur()
          return
        }

        // Normal result selection
        if (activeIndex < flatItems.length) {
          handleSelect(flatItems[activeIndex])
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        if (query.length > 0) {
          setQuery('')
          setActiveIndex(null)
        } else if (isOpen) {
          closeDropdown()
          setActiveIndex(null)
          inputRef.current?.blur()
        }
        break
      }
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          variant="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          onClear={() => setQuery('')}
          placeholder="Search topics, markets, entities..."
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {/* Cmd+K hint when empty and unfocused */}
        {!isOpen && query.length === 0 && (
          <kbd
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-[10px] font-mono px-1.5 py-0.5 rounded',
              'bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]',
              'border border-[var(--color-border)]',
              'pointer-events-none',
            )}
          >
            \u2318K
          </kbd>
        )}
      </div>

      {isOpen && (
        <SearchDropdown
          isSearching={isSearching}
          activeIndex={activeIndex}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
