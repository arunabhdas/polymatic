import type { DataProvider } from './dataProvider';

export class RSDIPProvider implements DataProvider {
  private missing() {
    throw new Error('Not implemented — switch VITE_DATA_SOURCE_MODE to mock');
  }

  async getFeed() { return this.missing() as any; }
  async getFeedItem() { return this.missing() as any; }
  async getFeedClusters() { return this.missing() as any; }

  async getSentiments() { return this.missing() as any; }
  async getSentimentDetail() { return this.missing() as any; }
  async getPredictionBrief() { return this.missing() as any; }

  async getTrends() { return this.missing() as any; }

  async getMarkets() { return this.missing() as any; }
  async getMarketDetail() { return this.missing() as any; }

  async search() { return this.missing() as any; }
  async autocomplete() { return this.missing() as any; }

  async getAlertConfigs() { return this.missing() as any; }
  async createAlertConfig() { return this.missing() as any; }
  async deleteAlertConfig() { return this.missing() as any; }
  async getActiveAlerts() { return this.missing() as any; }
  async dismissAlert() { return this.missing() as any; }

  async getGeoEvents() { return this.missing() as any; }
  async getGeoPOIs() { return this.missing() as any; }
}
