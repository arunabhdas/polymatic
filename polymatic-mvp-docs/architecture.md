# PolyMatic System Architecture

## Overview
PolyMatic is a real-time spatial intelligence platform that aggregates global telemetry feeds and visualizes them on an interactive 3D globe.

## Components

1. **Frontend (web)**
   - **Framework**: React 18, TypeScript, Vite
   - **Renderer**: CesiumJS (via Resium) for WebGL-based massive geospatial rendering
   - **State Management**: Zustand for layer and entity state
   - **Realtime**: WebSocket client for live updates

2. **Backend (api)**
   - **Framework**: Node.js / Express (MVP implementation)
   - **Streaming**: WebSocket server for broadcasting telemetry
   - **Ingestion**: Mock data generators simulating ADS-B (aircraft), AIS (ships), and GDELT (events)

## Data Flow
1. **Ingestion**: External feeds (simulated) generate telemetry data.
2. **Normalization**: Data is converted to a common GeoJSON-like format.
3. **Broadcast**: The WebSocket server pushes updates to connected clients.
4. **Visualization**: The frontend receives updates, updates the Zustand store, and Cesium renders the entities.

## Optimization Strategies
- **Entity Pooling**: Reusing Cesium entities to minimize garbage collection.
- **Viewport Filtering**: Only rendering entities within the current camera view (future enhancement).
- **Level-of-Detail**: Simplifying geometry based on camera distance.
