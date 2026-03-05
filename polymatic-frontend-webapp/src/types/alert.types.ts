import type { Timestamp, Severity } from './common.types';

export type AlertType = 'sentiment_reversal' | 'velocity_spike' | 'market_delta' | 'poi_severity' | 'new_trend' | 'price_threshold';

export type AlertTriggerType = 'threshold' | 'velocity' | 'sentiment_shift' | 'market_move';

export type AlertChannel = 'in_app' | 'email' | 'webhook';

export interface AlertConditions {
  category?: string;
  webhookUrl?: string;
  deliveryMode?: 'realtime' | 'hourly' | 'daily';
}

export interface AlertConfig {
  id: string;
  userId: string;
  name: string;
  type: AlertType;
  triggerType: AlertTriggerType;
  targetId: string | null;
  threshold: number;
  channel: AlertChannel;
  conditions: AlertConditions;
  enabled: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Alert {
  id: string;
  configId: string;
  title: string;
  message: string;
  severity: Severity;
  read: boolean;
  triggeredAt: Timestamp;
  timestamp: Timestamp;
}
