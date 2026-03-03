import { create } from 'zustand'
import type { SearchResults, SavedSearch } from '@/types'

interface SearchState {
  query: string
  isOpen: boolean
  results: SearchResults | null
  recentSearches: string[]
  savedSearches: SavedSearch[]

  setQuery: (query: string) => void
  setResults: (results: SearchResults | null) => void
  openDropdown: () => void
  closeDropdown: () => void
  saveSearch: (query: string) => void
  addRecentSearch: (query: string) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: '',
  isOpen: false,
  results: null,
  recentSearches: [],
  savedSearches: [],

  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  openDropdown: () => set({ isOpen: true }),
  closeDropdown: () => set({ isOpen: false }),
  saveSearch: (query) =>
    set((s) => ({
      savedSearches: [
        ...s.savedSearches,
        {
          id: crypto.randomUUID(),
          query,
          createdAt: new Date().toISOString(),
          lastRunAt: new Date().toISOString(),
        },
      ],
    })),
  addRecentSearch: (query) =>
    set((s) => ({
      recentSearches: [query, ...s.recentSearches.filter((q) => q !== query)].slice(0, 10),
    })),
}))
