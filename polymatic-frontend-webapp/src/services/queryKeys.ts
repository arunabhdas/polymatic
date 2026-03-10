export const queryKeys = {
  feed: {
    all: ['feed'] as const,
    list: (filters: object) => ['feed', 'list', filters] as const,
    detail: (id: string) => ['feed', 'detail', id] as const,
    clusters: () => ['feed', 'clusters'] as const,
  },
  sentiments: {
    all: ['sentiments'] as const,
    list: (filters: object) => ['sentiments', 'list', filters] as const,
    detail: (id: string) => ['sentiments', 'detail', id] as const,
    prediction: (id: string) => ['sentiments', 'prediction', id] as const,
  },
  trends: {
    all: ['trends'] as const,
    list: () => ['trends', 'list'] as const,
  },
  markets: {
    all: ['markets'] as const,
    list: (filters: object) => ['markets', 'list', filters] as const,
    detail: (id: string) => ['markets', 'detail', id] as const,
  },
  search: {
    all: ['search'] as const,
    query: (q: string) => ['search', 'query', q] as const,
    autocomplete: (q: string) => ['search', 'autocomplete', q] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    configs: () => ['alerts', 'configs'] as const,
    active: () => ['alerts', 'active'] as const,
  },
  geo: {
    all: ['geo'] as const,
    events: (bounds: object, layers: string[]) => ['geo', 'events', bounds, layers] as const,
    pois: (bounds: object) => ['geo', 'pois', bounds] as const,
  },
};
