# PolyMatic Intelligence Overlay Engine

## Overview
The Intelligence Overlay Engine is a modular architecture designed to ingest, process, and visualize diverse geospatial intelligence datasets. It supports real-time streaming, historical playback, and interactive filtering.

## Architecture

### 1. Data Source Adapters
Each overlay has a dedicated adapter that connects to external APIs or datasets (e.g., OpenSky Network, AIS, NASA FIRMS). These adapters handle authentication, rate limiting, and data retrieval.

### 2. Backend Ingestion Workers
Ingestion workers run as background processes, continuously fetching data from the adapters. They are responsible for:
- Polling or subscribing to data streams.
- Normalizing the raw data into a standard geospatial schema.
- Storing historical events in PostGIS for analysis and playback.

### 3. Normalized Geospatial Schema
All ingested data is transformed into a standard `Entity` schema:
```typescript
interface Entity {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  heading: number;
  metadata: Record<string, any>; // Flexible metadata specific to the overlay
}
```

### 4. WebSocket Streaming Channel
The backend broadcasts normalized entity updates to connected clients via WebSockets. The payload includes the layer identifier and the updated data:
```json
{
  "type": "ENTITY_UPDATE",
  "layer": "aircraft",
  "data": [...]
}
```

### 5. Frontend Visualization Layer
The React frontend uses Zustand for state management and CesiumJS (via Resium) for 3D visualization.
- **Store (`useStore.ts`)**: Maintains the state of all layers and their respective entities.
- **Globe (`Globe.tsx`)**: Renders the entities using Cesium `Entity` and `PointGraphics` components.
- **Sidebar (`Sidebar.tsx`)**: Provides UI toggles for each layer, grouped by category.

## Implemented Overlays

### Aviation & Maritime
- **Global Aircraft Tracking**: Live positions, flight paths, and military highlighting (Source: OpenSky/ADS-B).
- **Global Ship Tracking**: Vessel positions and classification (Source: AIS).
- **Dark Ships**: Detection of vessels without AIS (Correlated with SAR imagery).
- **Airspace Restrictions**: NOTAMs and closed airspace.

### Space & Weather
- **Satellite Orbit Tracker**: Live orbits and ground tracks (Source: CelesTrak).
- **Global Weather Systems**: Storms and cyclones (Source: NOAA).
- **Satellite Imagery**: Multispectral imagery (Source: NASA/Sentinel).

### Natural Disasters
- **Wildfire Detection**: Real-time thermal anomalies (Source: NASA FIRMS).
- **Earthquake Detection**: Seismic activity and magnitude (Source: USGS).
- **Volcanic Activity**: Active alerts and history (Source: Smithsonian).
- **Flood Monitoring**: Risk areas and recent events (Source: NASA).

### Infrastructure & Energy
- **Oil & Gas Infrastructure**: Wells, refineries, pipelines.
- **Power Grid**: Plants, substations, transmission lines.
- **Global Ports**: Major maritime terminals.
- **Mining Operations**: Major extraction zones.
- **Pipeline Network**: Oil and gas pipelines.
- **Internet Infrastructure**: Submarine cables and data centers.

### Geopolitics & Conflict
- **Strategic Chokepoints**: Major waterways (e.g., Strait of Hormuz, Suez Canal).
- **Military Bases**: Air, naval, and missile sites.
- **Conflict Incidents**: Geolocated protests and violence (Source: GDELT).
- **Political Map**: Country boundaries and names.

### Market Intelligence
- **Global Commodity Price Heatmap**: Real-time commodity price heatmap, top gainers/losers, and price volatility indicators.
- **Precious Metals Market Intelligence**: Real-time price chart, mine locations, and refinery infrastructure for gold, silver, platinum, etc.
- **Industrial Metals Supply Chain**: Global mines, smelters, and refineries for copper, aluminum, nickel, zinc, steel.
- **Rare Earth Elements Intelligence**: Rare earth mines, processing plants, and battery supply chain tracking.
- **Global Agricultural Commodities Dashboard**: Crop price heatmap and harvest season indicators for wheat, corn, soybeans, etc.
- **Crop Yield Monitoring**: Crop health monitoring and NDVI vegetation indices using Sentinel satellite imagery.
- **Global Food Supply Chain Monitor**: Grain storage facilities, export terminals, and food shipping routes.
- **Energy Commodity Intelligence**: Price chart overlays, production regions, and pipeline infrastructure for crude oil, natural gas, etc.
- **Global Mineral Export Flows**: Bulk cargo shipments and trade flow analysis for iron ore, copper concentrate, coal.
- **Commodity Price Shock Detection**: AI layer detecting sudden commodity price spikes combining market data, geopolitical events, and supply disruptions.

## Future Analytics Layers
- Shipping congestion detection.
- Oil tanker clustering.
- Satellite pass prediction.
- Wildfire growth analysis.
- Conflict escalation signals.
