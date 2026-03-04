// ─── API ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export interface ErrorResponse {
  status: 'error'
  code: string
  message: string
  details?: Record<string, unknown>
}

export type WSMessageType =
  | 'feed:new_items'
  | 'feed:update'
  | 'sentiment:batch'
  | 'trend:update'
  | 'market:price_update'
  | 'alert:triggered'
  | 'geo:event'
  | 'system:ping'
  | 'system:error'

export interface WSMessage<T = unknown> {
  type: WSMessageType
  payload: T
  timestamp: string
  sequenceId: number
}
