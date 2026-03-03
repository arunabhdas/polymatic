import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDataProvider } from './useDataProvider'
import { useSearchStore } from '@/state/searchStore'
import { queryKeys } from '@/services/queryKeys'

// ─── useSearch ───────────────────────────────────────────────
// 200ms debounce, fires when query length >= 2.

export function useSearch() {
  const provider = useDataProvider()
  const query = useSearchStore((s) => s.query)
  const setResults = useSearchStore((s) => s.setResults)
  const addRecentSearch = useSearchStore((s) => s.addRecentSearch)

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // 200ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  const searchQuery = useQuery({
    queryKey: queryKeys.search.results(debouncedQuery),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.search(debouncedQuery)
    },
    enabled: !!provider && debouncedQuery.length >= 2,
    staleTime: 10_000,
  })

  // Sync results to store
  useEffect(() => {
    if (searchQuery.data) {
      setResults(searchQuery.data)
      if (debouncedQuery.length >= 2) {
        addRecentSearch(debouncedQuery)
      }
    }
  }, [searchQuery.data, setResults, addRecentSearch, debouncedQuery])

  return {
    results: searchQuery.data ?? null,
    isLoading: searchQuery.isLoading,
    isSearching: searchQuery.isFetching && debouncedQuery.length >= 2,
    error: searchQuery.error,
  }
}
