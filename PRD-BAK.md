PolyMatic.App PRD

AI-Powered Geospatial OSINT + Prediction Market Intelligence Platform
Frontend Webapp Specification (v1.0)
1. Product Overview

PolyMatic.App is a real-time geospatial intelligence dashboard that aggregates OSINT data streams to create predictions intelligence for users who would like to use those signals to capitalize on prediction markets. This will have a dynamic 3D world interface in the dashboard and aggregated feeds in the other sections.

It enables users to:

View live global intelligence events

Identify emerging conflict POIs

Correlate events with trending prediction market questions

Switch immersive visual modes (Normal, CRT, NVG, FLIR, Noir)

Scrub time and replay historical intelligence states

View motion layers (aircraft, satellites, maritime)

Detect anomalies in selected regions

2. System Architecture (High-Level)

Frontend:
polymatic-app-frontend-webapp

Backend (future integration):
polymatic-app-backend-fastapi

⚠️ REQUIRED REMINDER:
As part of polymatic-app-backend-fastapi, implement:

Structured Realtime Data Ingestion Pipeline (RSDIP)

Feed ingestion

Normalization

Enrichment

Fusion

POI clustering

Market correlation engine

WebSocket streaming layer

Frontend must support:

DATA_SOURCE_MODE = "mock" | "rsdip"

Initially:

DATA_SOURCE_MODE = "mock"

Later:

DATA_SOURCE_MODE = "rsdip"

Switch controlled by feature flag.

3. Core Feature Requirements
3.1 3D World Engine

Renderer options:

Preferred: CesiumJS

Alternative: Three.js + react-three-fiber

Capabilities:

Global 3D Earth

City-level zoom

Smooth camera flyTo

Layer stacking

Tile switching

Custom shader support

3.2 Visual Modes Engine

Modes:

Mode	Description
Normal	Clean analyst view
CRT	Scanlines + distortion + jitter
NVG	Night Vision
FLIR	Thermal palette
Noir	High-contrast grayscale
Tactical Layout	Dense telemetry
Panoptic Layout	Minimalist

Mode affects:

Postprocessing effects

HUD density

Label visibility

Layer highlight rules

3.3 Left Sidebar Structure
Sections:

POI (Places of Interest)

Data Layers

Markets

Scenes

Filters

3.4 POI (Places of Interest)

Auto-generated from backend (mocked initially).

Each POI contains:

Name

Severity score

Velocity score

Event count (24h)

Linked markets

Confidence level

Clicking POI:

Zoom camera

Highlight cluster

Show detail panel

Enable relevant layers

3.5 Data Layers

Toggleable:

Aircraft (ADS-B)

Satellites (TLE)

Earthquakes

Conflict incidents

Maritime AIS

Weather radar

Cyber incidents

Economic releases

News clusters

Each layer:

Has independent rendering component

Subscribes to event stream

Supports styling overrides from mode engine

3.6 Markets Panel

Displays:

Trending prediction markets

Probability change

Volume

Correlated POI

Entity tags

Markets are linked to geospatial entities.

Clicking market:

Highlights related POI

Shows probability history overlay

3.7 Timeline + Replay

Features:

Live mode

Time scrub (1h / 24h / 7d)

Event playback animation

Probability timeline overlay

3.8 Detect Button

When activated:

Region selected

Runs anomaly detection

Returns:

Cluster spikes

Market probability deltas

Unusual motion signals

Mock logic initially.

3.9 UI/UX Tone

Brand personality:

Intelligence-grade

Minimalist

Cinematic

High-end

Slightly tactical but not gimmicky

Typography:

Clean sans-serif for UI

Mono for telemetry

Color:

Dark base

Cyan accent

Mode-based color override

4. Frontend Architecture Requirements
4.1 Tech Stack

React 18+

TypeScript strict mode

Zustand or Jotai for state

React Query for data layer

Postprocessing pipeline

WebSocket client abstraction

Feature flag system

Clean modular folder structure

4.2 Project Structure
polymatic-app-frontend-webapp/
  src/
    app/
    engine/
    layers/
    modes/
    components/
    sidebar/
    panels/
    state/
    mock-data/
    services/
    hooks/
4.3 Data Abstraction Layer

Create:

DataProvider.ts

Implements:

if (DATA_SOURCE_MODE === "mock") {
   return mockData;
}
if (DATA_SOURCE_MODE === "rsdip") {
   return websocketStream;
}

Mock data must simulate:

Event bursts

Market probability changes

POI clustering

Aircraft movement

5. Performance Requirements

60fps globe interaction

Efficient instancing for markers

GPU-based postprocessing

Lazy layer mounting

Debounced state updates

6. Accessibility & Usability

Keyboard navigable

High-contrast fallback

Reduced motion option

Clear source attribution

7. Deliverables

Interactive globe

Mode switching

POI sidebar

Markets panel

Mock realtime simulation

Timeline scrub

Detect interaction

Production-ready component structure

8. Future Backend Integration

When RSDIP is live:

Flip feature flag

Replace mock streams

Validate latency

Validate cluster rendering
