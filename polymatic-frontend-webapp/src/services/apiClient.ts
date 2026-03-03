import type { ApiResponse, ErrorResponse } from '@/types'

// ─── HTTP Client ─────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
}

class ApiClient {
  private baseUrl: string
  private tokenGetter: (() => string | null) | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setTokenGetter(getter: () => string | null): void {
    this.tokenGetter = getter
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, params, signal } = options

    const url = new URL(path, this.baseUrl)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      }
    }

    const token = this.tokenGetter?.()
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })

    if (response.status === 401) {
      // Token expired — dispatch refresh event
      window.dispatchEvent(new CustomEvent('auth:token-expired'))
      throw new ApiError('Unauthorized', 'AUTH_EXPIRED', 401)
    }

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as ErrorResponse | null
      throw new ApiError(
        errorBody?.message ?? `HTTP ${response.status}`,
        errorBody?.code ?? 'UNKNOWN',
        response.status,
      )
    }

    const json = (await response.json()) as ApiResponse<T>
    return json.data
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body })
  }

  put<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const apiClient = new ApiClient(apiBaseUrl)
