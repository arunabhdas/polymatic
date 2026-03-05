import { create } from "zustand"
import type { FeedItem, FeedFilters } from "../types/feed"
import { mockFeedData } from "../mock-data/feedData"

interface FeedState {
  items: FeedItem[]
  filters: FeedFilters
  setFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void
  addItems: (items: FeedItem[]) => void
  filteredItems: () => FeedItem[]
}

export const useFeedStore = create<FeedState>((set, get) => ({
  items: mockFeedData, // Initialize with mock data for now
  filters: {
    sources: [],
    minSeverity: 0,
    searchQuery: "",
    activeTrendId: null,
  },
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),

  addItems: (newItems) => set((state) => ({
    items: [...newItems, ...state.items] // Prepend new items
  })),

  filteredItems: () => {
    const { items, filters } = get()
    
    return items.filter(item => {
      // Source filter
      if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
        return false
      }
      
      // Severity filter
      if (item.severity < filters.minSeverity) {
        return false
      }
      
      // Trend filter
      if (filters.activeTrendId && !item.trendIds.includes(filters.activeTrendId)) {
        return false
      }
      
      // Basic search query implementation
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchContent = item.content.toLowerCase().includes(query)
        const matchAuthor = item.author?.name.toLowerCase().includes(query)
        const matchEntities = item.entities.some(e => e.name.toLowerCase().includes(query))
        
        if (!matchContent && !matchAuthor && !matchEntities) {
          return false
        }
      }
      
      return true
    })
  }
}))
