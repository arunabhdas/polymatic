import type { DataProvider } from './dataProvider'

// ─── RSDIP Provider (Future Backend) ─────────────────────────
// Stub implementation for future RSDIP WebSocket backend.
// Each method throws until the backend is ready.

function notImplemented(method: string): never {
  throw new Error(
    `[RSDIPProvider] ${method} not implemented — switch VITE_DATA_SOURCE_MODE to "mock"`,
  )
}

export class RSDIPProvider implements DataProvider {
  async initialize(): Promise<void> {
    notImplemented('initialize')
  }

  dispose(): void {
    // noop
  }

  async getFeedItems(): Promise<never> {
    notImplemented('getFeedItems')
  }
  subscribeFeed(): never {
    notImplemented('subscribeFeed')
  }

  async getSentimentQuestions(): Promise<never> {
    notImplemented('getSentimentQuestions')
  }
  async getSentimentDetail(): Promise<never> {
    notImplemented('getSentimentDetail')
  }
  subscribeSentimentUpdates(): never {
    notImplemented('subscribeSentimentUpdates')
  }

  async getTrends(): Promise<never> {
    notImplemented('getTrends')
  }
  subscribeTrendUpdates(): never {
    notImplemented('subscribeTrendUpdates')
  }

  async getMarkets(): Promise<never> {
    notImplemented('getMarkets')
  }
  async getMarketDetail(): Promise<never> {
    notImplemented('getMarketDetail')
  }
  subscribeMarketUpdates(): never {
    notImplemented('subscribeMarketUpdates')
  }

  async search(): Promise<never> {
    notImplemented('search')
  }

  async getAlertConfigs(): Promise<never> {
    notImplemented('getAlertConfigs')
  }
  async getActiveAlerts(): Promise<never> {
    notImplemented('getActiveAlerts')
  }
  async createAlertConfig(): Promise<never> {
    notImplemented('createAlertConfig')
  }
  async deleteAlertConfig(): Promise<never> {
    notImplemented('deleteAlertConfig')
  }
  async dismissAlert(): Promise<never> {
    notImplemented('dismissAlert')
  }

  async login(): Promise<never> {
    notImplemented('login')
  }
  async refreshToken(): Promise<never> {
    notImplemented('refreshToken')
  }

  async getGeoEvents(): Promise<never> {
    notImplemented('getGeoEvents')
  }
  subscribeGeoUpdates(): never {
    notImplemented('subscribeGeoUpdates')
  }
}
