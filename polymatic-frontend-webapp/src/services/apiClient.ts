import { useAuthStore } from '../state/authStore';
import type { ErrorResponse } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  status: number;
  data: ErrorResponse;

  constructor(status: number, data: ErrorResponse) {
    super(data.message || 'API Error');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { token } = useAuthStore.getState();

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
      }

      const errorData = await response.json().catch(() => ({
        status: 'error',
        code: 'UNKNOWN',
        message: 'An unknown API error occurred'
      }));

      throw new ApiError(response.status, errorData);
    }

    const json = await response.json();
    return json.data as T;
  },

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    const path = url.toString().replace(window.location.origin + API_BASE_URL, '');
    return this.request<T>(path);
  },

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  },
};
