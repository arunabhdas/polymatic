import mitt from 'mitt';
import { useAuthStore } from '../state/authStore';
import type { WSMessage, WSMessageType } from '../types/api.types';

type Events = {
  [K in WSMessageType]: any;
};

export const wsEventEmitter = mitt<Events>();

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseBackoff = 1000;
  private isIntentionalClose = false;

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isIntentionalClose = false;
    const token = useAuthStore.getState().token;
    const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.host}/ws`;
    
    // Pass auth either via QS or first message
    const url = token ? `${WS_URL}?token=${token}` : WS_URL;
    
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage;
        // Dispatch the message via mitt so any component can subscribe
        wsEventEmitter.emit(message.type, message.payload);
      } catch (e) {
        console.error('[WS] Failed to parse message', e);
      }
    };

    this.ws.onclose = (event) => {
      console.log('[WS] Disconnected', event.code);
      this.ws = null;
      
      if (!this.isIntentionalClose) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('[WS] Error', error);
      // onclose will handle the reconnect
    };
  }

  public disconnect() {
    this.isIntentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getStatus() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnect attempts reached');
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
    const delay = this.baseBackoff * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();
