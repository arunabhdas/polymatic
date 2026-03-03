import type { WSMessage, WSMessageType } from '@/types'

// ─── WebSocket Client ────────────────────────────────────────

type MessageHandler = (message: WSMessage) => void

interface WSClientOptions {
  url: string
  maxReconnectDelay?: number
  batchInterval?: number
  spikeThreshold?: number
  spikeBatchInterval?: number
}

export class WSClient {
  private ws: WebSocket | null = null
  private url: string
  private handlers = new Map<WSMessageType, Set<MessageHandler>>()
  private reconnectAttempts = 0
  private maxReconnectDelay: number
  private batchInterval: number
  private spikeThreshold: number
  private spikeBatchInterval: number
  private buffer: WSMessage[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private disposed = false

  constructor(options: WSClientOptions) {
    this.url = options.url
    this.maxReconnectDelay = options.maxReconnectDelay ?? 30_000
    this.batchInterval = options.batchInterval ?? 100
    this.spikeThreshold = options.spikeThreshold ?? 50
    this.spikeBatchInterval = options.spikeBatchInterval ?? 250
  }

  connect(): void {
    if (this.disposed) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startFlushTimer()
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as WSMessage
        this.buffer.push(message)
      } catch {
        console.warn('[WSClient] Failed to parse message')
      }
    }

    this.ws.onclose = () => {
      this.stopFlushTimer()
      if (!this.disposed) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  on(type: WSMessageType, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)

    return () => {
      this.handlers.get(type)?.delete(handler)
    }
  }

  send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  dispose(): void {
    this.disposed = true
    this.stopFlushTimer()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    this.ws?.close()
    this.ws = null
    this.handlers.clear()
    this.buffer = []
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => this.flush(), this.batchInterval)
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  private flush(): void {
    if (this.buffer.length === 0) return

    const isSpike = this.buffer.length > this.spikeThreshold

    if (isSpike) {
      // During spikes: use longer batch interval and drop low-severity items
      this.stopFlushTimer()
      this.flushTimer = setInterval(() => this.flush(), this.spikeBatchInterval)

      // Keep only higher-priority messages during spike
      const prioritized = this.buffer.filter((msg) => {
        if (msg.type === 'system:ping') return false
        return true
      })
      this.dispatchBatch(prioritized)
    } else {
      this.dispatchBatch(this.buffer)
    }

    this.buffer = []
  }

  private dispatchBatch(messages: WSMessage[]): void {
    for (const message of messages) {
      const handlers = this.handlers.get(message.type)
      if (handlers) {
        for (const handler of handlers) {
          try {
            handler(message)
          } catch (error) {
            console.error('[WSClient] Handler error:', error)
          }
        }
      }
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay,
    )
    this.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }
}

const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'
export const wsClient = new WSClient({ url: wsUrl })
