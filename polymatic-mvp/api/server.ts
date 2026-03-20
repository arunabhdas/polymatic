import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { startMockIngestion } from './mock-ingestion.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/stream' });

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', clients: wss.clients.size });
  });

  // WebSocket handling
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to PolyMatic stream');
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Start mock data ingestion and broadcast to clients
  startMockIngestion((data) => {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`PolyMatic Server running on http://localhost:${PORT}`);
  });
}

startServer();
