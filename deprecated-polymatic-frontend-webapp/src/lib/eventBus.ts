import mitt from 'mitt'

type Events = {
  'feed:new-items': { count: number }
  'trend:selected': { trendId: string | null }
  'market:selected': { marketId: string | null }
  'sentiment:expanded': { questionId: string | null }
  'alert:triggered': { alertId: string }
  'layout:mode-changed': { mode: 'dashboard' | 'focus' | 'clean' }
  'theme:changed': { theme: 'dark' | 'light' }
  'search:query-changed': { query: string }
}

export const eventBus = mitt<Events>()
