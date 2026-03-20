# PolyMatic.App — Product Requirements Document

**AI-Powered Geospatial OSINT + Prediction Market Intelligence Platform**
**Frontend Webapp Specification — v2.2**
**March 2026 — CONFIDENTIAL**

---

## v2.2 Revision Summary

1. **NEW:** Sentiments Engine — AI-powered Twitter/X sentiment aggregation for prediction outcomes
2. **NEW:** Trend-based navigation — Generated hashtags and trending topics replace region-based nav
3. **DEPRIORITIZED:** Visual Modes Engine moved to post-MVP roadmap

---

## 1. Product Overview

PolyMatic.App is a real-time intelligence platform that aggregates OSINT data streams, analyzes social sentiment, and correlates signals with prediction markets to help users make informed bets on Polymarket, Kalshi, and similar platforms. The platform's primary experience is a trend-driven intelligence feed where users navigate by hashtags, trending topics, and prediction questions rather than geographic regions.

The platform sits at the intersection of open-source intelligence, social sentiment analysis, and prediction market analytics. Where existing tools like Oddpool and Verso focus on market-side data (prices, volume, arbitrage), and OSINT tools like LiveUAMap focus on geospatial events, PolyMatic uniquely bridges all three: real-world OSINT signals, crowd sentiment on Twitter/X, and prediction market probabilities — all organized around the topics and questions that matter to bettors.

### 1.1 Core Value Proposition

- Consume a real-time intelligence feed organized by trending hashtags, topics, and prediction market questions
- Analyze aggregated Twitter/X sentiment on specific prediction outcomes via the Sentiments Engine
- See AI-generated probability estimates derived from crowd sentiment before markets price them in
- Correlate geospatial OSINT events with trending topics and prediction markets
- Detect anomalies across OSINT layers and surface actionable market signals
- Track whale activity on prediction markets correlated with sentiment shifts and OSINT events
- Navigate by trend, not geography — search and browse by generated hashtags, topic clusters, and market questions
- Drill into a 3D globe for deep geospatial analysis when spatial context is needed

### 1.2 Target Users

| Persona | Description | Primary Workflows |
|---------|-------------|-------------------|
| **Retail Bettor** | Prediction market participant looking for edge on Polymarket, Kalshi, or similar | Browse trending topics, check sentiment predictions, receive signal alerts, follow hashtags |
| **OSINT Analyst** | Intelligence professional who monitors geopolitical events and trades prediction markets | Deep sentiment analysis, Geo tab layer analysis, anomaly detection, data export |
| **Quant / Researcher** | Quantitative trader building signal models for prediction market strategies | API access, sentiment data feeds, backtesting, programmatic signals |

### 1.3 Launch Target

Closed beta with real users. Mock data initially, transitioning to live RSDIP backend via feature flag.

---

## 2. System Architecture

### 2.1 Platform Components

| Component | Description |
|-----------|-------------|
| `polymatic-app-frontend-webapp` | React 18+ TypeScript. Houses the Home feed, Sentiments panel, Geo globe, trending navigation, markets panel, and all core features. |
| `polymatic-app-backend-fastapi` | Python FastAPI. Hosts RSDIP pipeline, sentiment aggregation engine, trend generation, market correlation engine, anomaly detection, and WebSocket streaming. |
| `polymatic-app-frontend-ios` | iOS companion. Alert-first with signal cards, sentiment summaries, watchlist, and quick-glance widget. |

### 2.2 Backend: RSDIP Pipeline

The Realtime Structured Data Ingestion Pipeline transforms raw feeds into actionable, market-correlated intelligence:

- **Feed Ingestion:** Twitter/X API (primary), Reddit API, Telegram OSINT channels, ADS-B, AIS, ACLED, GDELT, seismic APIs, news aggregators, government advisories
- **Normalization:** Unified event schema with timestamps, entity tags, source classification, and geospatial coordinates where available
- **Enrichment:** NER, geocoding, sentiment scoring (per-tweet and aggregate), entity resolution, topic classification
- **Trend Generation:** Real-time hashtag clustering, topic extraction, velocity scoring, and generated trend labels from event streams
- **Sentiment Aggregation:** Twitter/X post collection per prediction question, stance classification (supports/opposes outcome), confidence weighting, and aggregate sentiment scoring
- **POI Clustering:** Spatially proximate events aggregated into Places of Interest
- **Market Correlation:** Match trends, POIs, and sentiment signals to prediction market contracts via NER, semantic similarity, and entity matching
- **Anomaly Detection:** Statistical and ML-based detection of event frequency spikes, sentiment reversals, and probability deltas
- **WebSocket Streaming:** Push real-time events, sentiment updates, trend changes, and market data to clients

### 2.3 Data Source Mode

```
DATA_SOURCE_MODE = "mock" | "rsdip"
```

Initially `"mock"` for closed beta. Mock data must simulate tweet cadences with bursty arrival during breaking events, sentiment distributions that shift over time, trend emergence and decay curves, and market probability random walks.

### 2.4 iOS App Architecture

Alert-first companion, not a full mirror:

- Push notifications for sentiment shifts, trend spikes, market probability deltas
- Sentiment summary cards for watched prediction questions
- Trending topics feed for quick scanning
- Configurable alert thresholds
- Quick-glance iOS home screen widget with top trends and sentiment signals
- Deep links into the webapp for full analysis

### 2.5 Landing Page & Entry Points

Two codebases have distinct entry experiences:

**polymatic-mvp (MVP Globe App)**

The MVP frontend at `web/` uses a marketing-style landing page as its root entry point (`/`). The Cesium globe dashboard is served at `/dashboard`.

- **Landing page (`/`):** Scrolling ticker bar with live intel alerts, top navigation with "Launch Dashboard" CTA, hero section with serif headline + metric pills + globe illustration, 4-cell features strip (Unified Signal Feed, Sentiments Engine, Prediction Correlation, Analyst Scoring), and a 4-step "how it works" section.
- **Dashboard (`/dashboard`):** Lazy-loaded Cesium/Resium globe with OSINT layers, sidebar, event feed, and GDELT conflict panel.
- **Routing:** `react-router-dom` with `createBrowserRouter`. Dashboard is lazy-loaded via dynamic `import()` to keep landing page TTI fast.
- **Design tokens:** PolyMatic brand palette (deep green bg, green/amber/red/teal signal colors) using CSS custom properties. Typography: Playfair Display (serif headlines), DM Sans (body), JetBrains Mono (data/labels).
- **Mobile responsive:** All marketing pages (landing, demo) are fully responsive for mobile viewports (<768px) with single-column layouts, reduced typography, and collapsible navigation. Uses a `useIsMobile()` hook with conditional inline styles to maintain consistency with the inline-style approach.

**polymatic-frontend-webapp (Main SaaS App)**

The main webapp at `polymatic-frontend-webapp/` has its own landing page with a Three.js animated globe (Epic 3, complete). Dashboard at `/dashboard`.

---

## 3. Navigation: Trend-Based Discovery

> **▶ NEW IN v2.2 — Replaces region-based navigation**

PolyMatic's primary navigation paradigm is trend-based, not region-based. Users discover intelligence by following hashtags, trending topics, and prediction market questions. This matches how prediction market participants actually think: they follow stories, narratives, and outcomes — not geographic coordinates.

### 3.1 Trending Hashtags Bar

A horizontal scrolling bar of generated trending hashtags sits prominently at the top of the Home view, serving as the primary navigation affordance.

#### How Trends Are Generated

- **Real-time clustering:** The backend continuously clusters incoming events (tweets, news, OSINT reports, market activity) by topic using NER, keyword co-occurrence, and semantic similarity
- **Hashtag generation:** Each cluster is assigned a generated hashtag label. Some are organic Twitter hashtags that map to the cluster; others are AI-generated labels that capture the topic (e.g., `#IranStraitCrisis`, `#FedRateHold`, `#UkraineCounteroffensive`, `#TrumpTariffEscalation`)
- **Velocity scoring:** Trends are ranked by velocity — the rate of new events and tweets entering the cluster, not just total volume. A small topic that's accelerating fast ranks above a large topic that's cooling
- **Market linkage:** Each trend is automatically linked to correlated prediction market contracts. Trends with active market linkage are visually distinguished (market icon badge)
- **Lifecycle tracking:** Trends have a lifecycle state: `Emerging`, `Trending`, `Peaking`, and `Cooling`. The bar highlights Emerging and Trending topics most prominently

#### Trending Bar UX

- Horizontal scrolling ribbon at the top of the Home view, always visible
- Each trend chip shows: generated hashtag, velocity indicator (arrow + percentage), event count, and market-linked badge if applicable
- Click a trend: Filters the Home feed to show only events in that cluster. The Sentiments panel updates to show sentiment analysis for linked prediction questions. The Markets panel filters to correlated contracts.
- Trend chips are color-coded by category: geopolitics (red), economics (blue), technology (purple), sports (green), culture (orange)
- "View All Trends" expands to a full trending topics dashboard with historical velocity charts, lifecycle stage indicators, and drill-down

### 3.2 Search

The global search bar is the second primary navigation tool. It supports multiple query types:

- **Topic search:** Free-text queries that match against trend clusters, event content, entity tags, and market questions. Returns a blended result set with sections for Trends, Events, Markets, and Sentiments.
- **Hashtag search:** Prefix with `#` to search directly for trends by hashtag. Autocomplete suggests active and recent trends.
- **Entity search:** Search for named entities (people, organizations, countries). Returns all trends, events, markets, and sentiment data related to that entity.
- **Market search:** Search prediction market questions by keyword. Returns matching contracts with current probability, linked trends, and sentiment data.
- **Saved searches:** Users can save search queries as persistent watchlist items that trigger alerts when new matching content appears.

### 3.3 Topic Pages

Clicking a trend or searching a topic opens a Topic Page — a dedicated view that aggregates everything PolyMatic knows about a specific subject:

- **Topic header:** Generated hashtag, lifecycle stage, velocity chart (24h sparkline), total event count, and category tag
- **Sentiment summary:** Aggregate sentiment for linked prediction questions (from the Sentiments Engine)
- **Linked markets:** All correlated prediction market contracts with current probabilities and 24h changes
- **Event timeline:** Chronological feed of all events in the cluster (tweets, news, OSINT, structured data)
- **Key entities:** Named entities extracted from the cluster, ranked by mention frequency
- **Geo context:** If the topic has geographic relevance, a mini-map shows event locations with a link to open in the Geo tab
- **Related trends:** Other trending topics that share entities or semantic overlap

---

## 4. Sentiments Engine

> **▶ NEW IN v2.2 — HIGH PRIORITY MVP FEATURE**

The Sentiments Engine is a core intelligence product that aggregates Twitter/X discourse around specific prediction market questions, classifies stance, and generates AI-powered probability estimates derived from crowd sentiment. This is the primary feature that transforms PolyMatic from a passive intelligence dashboard into an active prediction tool.

### 4.1 How It Works

#### Step 1: Question Mapping

The engine maps active prediction market questions to searchable query templates. For each market contract (e.g., "Will there be a US-Iran military conflict before July 2026?"), the system generates a set of Twitter/X search queries that capture relevant discourse: keywords, entity names, hashtags, and semantic variants.

#### Step 2: Tweet Collection

Using the Twitter/X API (and supplementary scrapers for public data), the engine continuously collects tweets matching each question's query set. Collection is filtered for minimum engagement thresholds (likes, retweets, replies) to reduce noise from bots and low-signal accounts. Tweets are deduplicated, and retweets are counted as amplification signals rather than independent opinions.

#### Step 3: Stance Classification

Each collected tweet is classified by an LLM-based classifier into one of four stances relative to the prediction question's outcome:

- **Supports YES:** The tweet's content or expressed opinion supports the outcome happening (e.g., "Iran tensions are escalating, conflict looks inevitable")
- **Supports NO:** The tweet opposes or dismisses the outcome (e.g., "This is all bluster, no one wants a real war")
- **Neutral / Informational:** The tweet reports facts without clear stance (e.g., "US carrier group repositioned to the Strait of Hormuz")
- **Ambiguous:** Stance cannot be reliably determined. Excluded from sentiment scoring.

#### Step 4: Confidence Weighting

Not all tweets are weighted equally. The engine applies confidence multipliers based on:

- **Account credibility:** Verified accounts, known OSINT analysts, journalists, domain experts, and high-follower accounts receive higher weight. Bot-flagged and spam accounts are downweighted or excluded.
- **Engagement signals:** Tweets with high engagement from credible accounts are weighted higher, indicating community validation.
- **Recency:** More recent tweets receive a time-decay boost. Sentiment from 6 hours ago matters less than sentiment from 30 minutes ago.
- **Source diversity:** Sentiment is penalized if it comes from a narrow cluster of similar accounts (echo chamber detection). Diverse, independent sources increase confidence.
- **Stance confidence:** The classifier's own confidence score for the stance classification is factored in.

#### Step 5: Aggregate Sentiment Score

For each prediction question, the engine produces:

- **Sentiment Probability:** A 0–100% score representing the Twitter crowd's implied probability of the YES outcome, derived from the weighted ratio of Supports YES to Supports NO tweets. This is the headline number.
- **Sentiment Direction:** Whether sentiment is currently shifting toward YES or NO, with a velocity indicator.
- **Confidence Level:** How reliable the sentiment score is, based on tweet volume, source diversity, and classification confidence. Low, Medium, or High.
- **Market Delta:** The difference between the Sentiment Probability and the current market price. A large positive delta (sentiment says 70%, market says 50%) suggests the market may be underpricing the outcome — a potential signal.
- **Tweet Volume:** Total tweets analyzed and the breakdown by stance.
- **Key Voices:** The most influential accounts driving sentiment in each direction, with representative tweets.

#### Step 6: Prediction Generation

The engine generates an AI-powered prediction summary for each question:

- A natural language summary explaining what Twitter sentiment indicates about the outcome (e.g., "Twitter sentiment strongly favors YES at 73%, driven by OSINT accounts reporting military buildups. However, confidence is Medium due to echo-chamber concentration among defense-focused accounts.")
- Historical accuracy callout: If the Sentiments Engine has made prior predictions on resolved markets, display the engine's track record (e.g., "Sentiment-based predictions have been directionally correct on 68% of resolved markets")
- Caveats: Clearly labeled as sentiment-derived estimates, not financial advice.

### 4.2 Sentiments Sidebar Panel

The Sentiments panel is accessed via the left sidebar and is a primary navigation element alongside Home, Geo, and Markets.

#### Panel Layout

- **Top section:** List of tracked prediction questions, sortable by market delta (largest discrepancy first), sentiment velocity (fastest-moving), volume, or user watchlist
- **Question card (collapsed):** Market question text, current market probability, sentiment probability, market delta badge (color-coded: green if agree, amber if moderate gap, red if large divergence), confidence level, and sentiment direction arrow
- **Question card (expanded):** Full sentiment breakdown including stance distribution pie chart, confidence-weighted sentiment timeline (24h), key voices with representative tweets, tweet volume over time, linked trend hashtags, and the AI prediction summary
- **"Add Question" button:** Users can manually add any prediction market question to track
- **Watchlist:** Users mark questions for persistent tracking and alerting

### 4.3 Sentiment Signals in Other Views

Sentiment data surfaces throughout the platform:

- **Home feed:** When a tweet in the feed is relevant to a tracked prediction question, a sentiment badge appears showing stance and aggregate sentiment
- **Markets panel:** Each market card shows a sentiment indicator alongside probability. Delta is always visible.
- **Topic pages:** Sentiment summary for all linked prediction questions is a primary section
- **Alerts:** Configurable alerts for sentiment reversals, large market deltas, and confidence-level changes
- **iOS app:** Sentiment summary cards with push notifications on major shifts
- **API:** Full sentiment data via Quant tier, including per-tweet classifications and timeseries

### 4.4 Sentiment Data Integrity

- **Bot detection:** Filter known bots and coordinated inauthentic behavior via account-age, posting-pattern, and network analysis
- **Manipulation detection:** Alert when sentiment is driven by a small number of coordinated accounts (astroturfing)
- **Source transparency:** Every sentiment score links to underlying tweets. Users can drill down to raw data.
- **Calibration:** Track prediction accuracy on resolved markets. Display historical accuracy. Recalibrate weighting models based on outcomes.

---

## 5. Dashboard Structure

### 5.1 Left Sidebar Navigation

| Tab / Section | Description |
|---------------|-------------|
| **Home** | Default view. Live intelligence feed organized by trending hashtags. Aggregates Twitter/X, Reddit, Telegram, news, and structured OSINT. Trending hashtags bar at top. Feed filterable by trend, source type, and severity. |
| **Sentiments** | HIGH PRIORITY. AI-powered sentiment analysis panel. Tracked prediction questions with crowd sentiment probabilities, market deltas, key voices, and AI prediction summaries. |
| **Geo** | 3D interactive globe for spatial analysis. Data layers, POI clusters, motion tracking, and region-based Detect. Accessed when geographic context is needed. |
| **Markets** | Cross-platform prediction market aggregation (Polymarket + Kalshi). Market cards show probability, volume, sentiment delta, and linked trends. |
| **POI** | Places of Interest. Auto-generated from backend clustering. Sortable by severity, velocity, or event count. Clicking switches to Geo view. |
| **Data Layers** | Toggle OSINT layers for the Geo view. Aircraft, satellites, maritime, conflict, earthquakes, news, etc. |
| **Scenes** | Saved configurations: active tab, filters, tracked questions, time window. Shareable via link. |
| **Filters** | Global filters: severity threshold, time window, entity type, source type, category. Apply across all views. |

The sidebar order reflects priority: Home and Sentiments are the primary tools for MVP. Geo, Markets, and supporting sections are secondary but fully functional.

### 5.2 Home View: Trend-Driven Intelligence Feed

> **▶ REVISED IN v2.2 — Now organized by trends, not regions**

#### Layout (Top to Bottom)

- **Global search bar:** Always visible at the very top. Supports topic, hashtag, entity, and market search.
- **Trending hashtags bar:** Horizontal scrolling ribbon of generated trend chips below the search bar
- **Feed area:** Scrolling event cards. When no trend is selected, shows a blended "For You" feed ranked by velocity and relevance. When a trend is selected, filters to that cluster.
- **Right-side panel:** Contextual detail panel. Expands on event selection, shows Topic Page on trend selection, or houses Detect output.

#### Feed Sources

- **Twitter/X OSINT:** Curated accounts (Aurora Intel, BNO News, OSINTdefender, Bellingcat, etc.) plus trending discourse. Sentiment-classified when relevant to tracked questions.
- **Reddit:** Posts from r/geopolitics, r/OSINT, r/CredibleDefense, r/polymarket, etc. Ranked by velocity.
- **Telegram OSINT:** Curated channels. Deduplicated and topic-classified.
- **News Clusters:** Aggregated breaking news, clustered by story.
- **Structured Events:** Conflict incidents, earthquakes, thermal anomalies, government advisories, economic releases.
- **Market Signals:** Probability shifts exceeding thresholds, whale trades, sentiment-market divergences.

#### Event Card Design

- Source icon and channel name
- Timestamp (UTC + local, monospace)
- Content body with media thumbnails
- Entity tag chips (NER-extracted people, places, orgs)
- Trend hashtag badges: which generated trends this event belongs to
- Sentiment stance badge: if relevant to a tracked question, shows stance (YES/NO/Neutral) and aggregate sentiment
- Market correlation badge: linked market name and probability
- Geo pin: coordinate badge linking to Geo view (when geolocated)
- Actions: Pin to watchlist, open in Geo view, expand detail, share

### 5.3 Geo View: 3D Interactive Globe

Accessed via the Geo tab. Provides spatial analysis when geographic context is needed.

#### 3D World Engine

- **Preferred renderer:** Three.js + react-three-fiber (geospatial accuracy, terrain, imagery tiles)
- **Alternative:** Three.js + react-three-fiber (full shader control)
- City-level zoom, smooth flyTo, layer stacking, instanced rendering for 10,000+ markers
- Region selection: polygon draw, rectangle select, country/admin boundary click

#### Transition from Other Views

- Clicking a geolocated event in the Home feed → "Open in Geo" → flies camera to location
- Clicking a POI in the sidebar → switches to Geo view
- Clicking "Geo context" mini-map on a Topic Page → Geo view filtered to that topic's events
- Filter state and active trend carry over between views

### 5.4 Data Layers (Geo View)

| Layer | Data Source | Visualization |
|-------|-----------|---------------|
| Aircraft (ADS-B) | ADS-B Exchange, OpenSky | Flight paths, altitude coloring |
| Satellites (TLE) | CelesTrak, Space-Track | Orbital paths, ground tracks |
| Earthquakes | USGS, EMSC | Magnitude circles, depth color |
| Conflict Incidents | ACLED, GDELT | Event icons, cluster density |
| Maritime AIS | MarineTraffic, AIS feeds | Vessel tracks, type classification |
| Weather Radar | OpenWeatherMap, NOAA | Radar overlay, storm tracking |
| Cyber Incidents | Threat intel feeds | Target geolocation, severity |
| Economic Releases | Central bank calendars | Country-level indicators |
| News Clusters | GDELT, news APIs, Telegram | Geolocated story clusters |
| Gov. Advisories | US State, UK FCDO, AU DFAT | Country risk shading |
| Thermal Anomalies | NASA FIRMS | Fire/explosion hotspots |

---

## 6. Core Features

### 6.1 POI (Places of Interest)

- Auto-generated from backend event clustering (mocked initially)
- Each POI: Name, Severity (0–100), Velocity, Event Count (24h), Linked Markets, Linked Trends, Confidence, Entity Tags
- Click in sidebar: Switch to Geo view, fly camera, highlight cluster, show detail
- POIs also surface on Topic Pages when a trend has geographic relevance

### 6.2 Markets Panel

Cross-platform prediction market aggregation from Polymarket (CLOB API / Dome), Kalshi (REST/FIX API), and Manifold (REST API):

- Market cards: question text, probability, 24h change, volume, sentiment delta, linked trends, source platform
- Unified market view: same-event contracts from multiple platforms side by side
- Arbitrage detection: cross-platform price spreads surfaced as signals
- Market radar: auto-surface correlated markets within 2 minutes of a trend spike or OSINT event
- Sort/filter by category, probability change, volume, sentiment delta, linked trend velocity

### 6.3 AI-Powered Signal Engine (Detect)

Detect runs anomaly detection with context-appropriate behavior:

- **From Home view:** Runs on the currently filtered feed/trend. Identifies event velocity spikes, unusual multi-source clustering, sentiment reversals, and market probability anomalies.
- **From Geo view:** User selects a region, then runs spatial anomaly detection across active layers.
- **From Sentiments:** Runs on a specific prediction question. Detects unusual sentiment velocity, coordinated account activity, and divergence from historical patterns.

#### Signal Card Output

- Cluster spikes: unusual event concentrations by type and source
- Sentiment anomalies: sudden reversals, coordinated shifts, or bot-driven spikes
- Market probability deltas during the anomaly window
- Historical analogs: past patterns and their market impact
- Confidence score and recommended markets

### 6.4 Whale Tracking + Smart Money Correlation

- Real-time monitoring of large trades on Polymarket and Kalshi (configurable thresholds)
- Correlation with concurrent sentiment shifts and OSINT activity
- Smart money alerts when large trades coincide with unusual patterns
- Whale trades appear as high-priority events in the Home feed when correlated to active trends

### 6.5 Timeline + Historical Replay

- **Home feed:** Scrub through feed history, replay events at 1x–10x speed
- **Sentiments:** Sentiment timeline showing how crowd opinion evolved on a question over hours/days
- **Geo view:** Scrub all layers, POIs, and motion tracks with market probability curves in sync
- Scenario bookmarks: save time windows as named scenarios
- Backtesting mode (Quant tier): replay historical periods, evaluate signal and sentiment accuracy

### 6.6 Mispricing Detection

- Cross-platform spreads between Polymarket and Kalshi
- Sentiment-informed mispricing: when sentiment probability diverges significantly from market price
- Historical mispricing pattern tracking with accuracy metrics
- Alert integration for watchlist and iOS push

### 6.7 Collaborative Workspaces

- Saved scenes: view state, tracked questions, filters, active trend
- Sharing via link or invite
- Annotations and team dashboards
- Export: snapshots, event data as CSV/JSON, sentiment data export

### 6.8 Alert System

#### Alert Types

- Sentiment reversal or large delta on a watched prediction question
- Trend spike: a watched hashtag's velocity crosses a threshold
- Market probability delta exceeding X% in Y minutes
- POI severity threshold crossing
- Whale activity on a watched market
- Layer-specific events (ADS-B loss, earthquake, etc.)
- Sentiment-market divergence exceeding configurable threshold

#### Delivery Channels

- In-app notification center (web)
- Push notifications (iOS)
- Webhook integration (Quant tier)
- Email digest (real-time, hourly, or daily)

### 6.9 API and Data Export

- `GET /sentiments` — Aggregate sentiment scores, stance distributions, key voices per question
- `GET /sentiments/tweets` — Raw classified tweets for a question (Quant tier)
- `GET /trends` — Current trending hashtags with velocity, lifecycle, linked markets
- `GET /signals` — Signal cards with filters for trend, severity, category
- `GET /pois` — POI state with severity, velocity, linked markets and trends
- `GET /markets` — Cross-platform market data with sentiment delta and OSINT correlation
- `GET /feed` — Raw intelligence feed with source-type filtering
- `WebSocket /stream` — Real-time push of events, sentiment updates, trend changes, market data
- CSV/JSON export for any time window; bulk historical data for Quant tier

---

## 7. Market Correlation Engine

*CORE IP*

Connects events, trends, and sentiment signals to prediction market contracts:

1. **Market Text NER:** Extract entities and event types from market question text
2. **Entity Geocoding:** Geocode entities with disambiguation cache
3. **Semantic Matching:** LLM embeddings for similarity between market questions and OSINT/tweet content (0–1)
4. **Trend Matching:** Link markets to generated trend clusters via shared entities and keywords
5. **Spatial Correlation:** Geographic proximity between geocoded entities and POI centroids
6. **Temporal Scoring:** Weight correlations by proximity to market probability shifts
7. **Sentiment Integration:** Factor sentiment delta into the composite relevance score
8. **Composite Ranking:** Combine all scores into final relevance ranking per market-event pair

The engine self-calibrates by tracking correlations against actual market movements and exposes accuracy metrics to users.

---

## 8. Visual Modes Engine

> **▶ DEPRIORITIZED IN v2.2 — Post-MVP roadmap item**

Visual modes (Normal, CRT, NVG, FLIR, Anime, Noir, Snow, AI) remain in the product vision but are **not required for the MVP** closed beta. The MVP ships with a single, polished dark-theme "Normal" mode.

### 8.1 MVP Scope

- Ship with Normal mode only: Dark base (#1A1A2E), cyan accent (#00BCD4), clean sans-serif UI
- The UI architecture must support future mode injection (postprocessing pipeline, color theme abstraction, HUD density controls) but these are not built for MVP
- The Style Presets bottom bar is omitted from MVP. The LAYOUT dropdown (Tactical/Panoptic) and CLEAN UI toggle remain.

### 8.2 Post-MVP Roadmap

- Phase 1: CRT + NVG
- Phase 2: FLIR + Noir
- Phase 3: Anime + Snow + AI

---

## 9. UI/UX Design Language

### 9.1 Brand Personality

Intelligence-grade. Minimalist. Cinematic. High-end. The platform should feel like a tool for professionals who make consequential decisions, with enough visual polish to be compelling to a broader audience.

### 9.2 Typography

- UI labels and navigation: Clean sans-serif (Inter, SF Pro, or system)
- Telemetry data, coordinates, timestamps: Monospace (JetBrains Mono, Consolas)
- Market data and probabilities: Tabular-numeral sans-serif
- Trending hashtags: Bold sans-serif, larger size, with category-colored backgrounds
- Sentiment scores and deltas: Bold with directional color (green/red)

### 9.3 Color System

- Dark base: `#1A1A2E` primary, `#16213E` secondary
- Cyan accent: `#00BCD4` for interactive elements and highlights
- Severity: Green (`#4CAF50`) → Yellow (`#FFC107`) → Red (`#F44336`)
- Sentiment: Green for Supports YES, Red for Supports NO, Gray for Neutral
- Market delta: Green (sentiment > market, underpricing), Red (sentiment < market, overpricing)
- Trend categories: Geopolitics (red), Economics (blue), Technology (purple), Sports (green), Culture (orange)
- Text: `#FFFFFF` primary, `#B0B0B0` secondary, `#666666` tertiary

### 9.4 Layout

- **Tactical:** Dense, maximum information. All panels visible. For deep analysis.
- **Panoptic:** Minimal, clean. Sidebar icon-only, focus on content. For scanning.
- **Clean UI:** Chrome-free. Feed or globe only. For screenshots or focused work.

---

## 10. Frontend Architecture

### 10.1 Tech Stack

- React 18+ with TypeScript in strict mode
- Zustand or Jotai for state management
- React Query (TanStack Query) for server state and caching
- Three.js + react-three-fiber (preferred) or Three.js + react-three-fiber for Geo view
- WebSocket client with auto-reconnection and backpressure
- Feature flag system for `DATA_SOURCE_MODE` and progressive rollout

### 10.2 Project Structure

```
polymatic-app-frontend-webapp/
  src/
    app/          — Shell, routing, view switching
    feed/         — Home feed components, event cards, feed clustering
    trends/       — Trending hashtags bar, trend chips, Topic Pages
    sentiments/   — Sentiments panel, question cards, stance viz, prediction summaries
    search/       — Global search, autocomplete, blended results
    engine/       — 3D globe engine, camera controls (Geo view)
    layers/       — Data layer rendering components (Geo view)
    components/   — Shared UI components
    sidebar/      — Sidebar sections (Home, Sentiments, Geo, Markets, POI, Layers, Scenes, Filters)
    panels/       — Right-side contextual panels, signal cards, Topic Pages
    state/        — Zustand/Jotai stores
    mock-data/    — Mock generators (feeds, sentiment distributions, trend curves, market data)
    services/     — API clients, WebSocket manager, data provider abstraction
    hooks/        — Custom hooks
    alerts/       — Alert system logic
    api/          — Public API layer (Quant tier)
```

### 10.3 Data Abstraction Layer

```typescript
if (DATA_SOURCE_MODE === "mock") return mockData;
if (DATA_SOURCE_MODE === "rsdip") return websocketStream;
```

Mock generators must simulate: tweet cadences with bursty arrival, sentiment distributions that shift over time, trend emergence/peak/decay lifecycles, market probability random walks, and POI clustering dynamics.

---

## 11. Performance Requirements

- 60fps globe interaction in Geo view
- Feed rendering under 16ms per frame with 100+ visible cards
- Sentiment score updates within 30 seconds of classification pipeline completion
- Trend bar updates within 10 seconds of velocity threshold crossing
- GPU instancing for 10,000+ markers on globe
- Lazy layer mounting: only instantiate when toggled on
- Debounced WebSocket: batch events into 100ms render frames
- Time-to-interactive under 3 seconds
- Memory: under 500MB with feed + 5 Geo layers active
- Feed virtualization: only render visible cards, recycle DOM nodes

---

## 12. Accessibility and Usability

- Keyboard navigable: all sidebar, panels, feed, search, and timeline
- High-contrast fallback mode
- Reduced motion option
- Screen reader: ARIA labels, live regions for alerts and sentiment updates
- Source attribution: every event shows source and timestamp
- Colorblind-safe palettes for severity, sentiment, and trend categories

---

## 13. Monetization Strategy

| Tier | Price | Features |
|------|-------|----------|
| **Free** | Free | Home feed (limited sources), 3 tracked sentiment questions, trending bar (top 10 only), delayed market data (15 min), 2 Geo layers, 5 POIs, no Detect, no alerts, no API |
| **Pro** | $29–49/mo | Full feed sources, unlimited sentiment tracking, full trending bar, real-time markets, all Geo layers, alerts (10 active), Detect (5/day), saved scenes (10), whale tracking, iOS push, historical replay, sentiment export |
| **Quant** | $99–199/mo | Everything in Pro + full API (including raw sentiment tweets and trend data), webhook alerts, bulk historical data, unlimited Detect, backtesting, advanced signal engine |

Apply to both Polymarket Builders Program and Kalshi Builder Codes for supplementary revenue and API access.

---

## 14. Authentication and User Management

- Email/password + OAuth (Google, GitHub). Magic link option.
- User profiles: tracked sentiment questions, saved searches, watchlists, alert configs, tier status
- State sync across web and iOS via backend REST API
- JWT-based sessions with refresh token rotation
- Future: team/organization accounts

---

## 15. MVP Feature Priority

> **▶ NEW IN v2.2**

### 15.1 P0 — Must Ship (MVP)

- Sentiments Engine: full pipeline from tweet collection through prediction generation
- Trending hashtags bar with generated trends and velocity scoring
- Global search with topic, hashtag, entity, and market queries
- Home feed with multi-source aggregation and trend filtering
- Topic Pages with sentiment summary, linked markets, and event timeline
- Markets panel with cross-platform aggregation (Polymarket + Kalshi)
- Market correlation engine (NER + semantic + trend matching)
- Alert system with sentiment and market triggers
- Authentication and user state management
- Mock data simulation for all of the above

### 15.2 P1 — Ship If Time Permits

- Geo view with 3D globe and data layers
- POI system with auto-clustering
- Detect (anomaly detection) across all views
- Whale tracking with sentiment correlation
- Mispricing detection
- Historical replay and timeline
- iOS companion app

### 15.3 P2 — Post-MVP

- Visual Modes Engine (CRT, NVG, FLIR, Noir, Anime, Snow, AI)
- Collaborative workspaces and team features
- Quant tier API
- Backtesting mode
- Advanced scene sharing and annotations

---

## 16. Deliverables

### Core Platform (P0)

- Home view: trend-driven intelligence feed with multi-source aggregation
- Trending hashtags bar with generated trends, velocity, and lifecycle indicators
- Global search with blended results (topics, hashtags, entities, markets)
- Topic Pages with event timeline, sentiment, markets, and entity extraction
- Sentiments panel: tracked questions, stance classification, aggregate scoring, market deltas, AI predictions
- Markets panel with Polymarket + Kalshi aggregation and sentiment integration
- Market correlation engine
- Alert system (sentiment, trend, and market triggers)
- Authentication and user profiles
- Normal mode dark-theme UI
- Mock data simulation for all features

### Extended Platform (P1)

- Geo view with 3D globe, data layers, and POI system
- Detect with context-appropriate anomaly detection
- Whale tracking and mispricing detection
- Timeline and historical replay
- iOS companion app

### Post-MVP (P2)

- Visual Modes Engine
- Collaborative workspaces
- Quant tier API and backtesting

---

## 17. Future Backend Integration

- Flip `DATA_SOURCE_MODE` from `"mock"` to `"rsdip"`
- Validate Twitter/X API rate limits and fallback scraping for sentiment collection at scale
- Validate sentiment classification accuracy against manually labeled test sets (target: >80% stance accuracy)
- Validate trend generation quality and hashtag relevance
- Validate market correlation accuracy against analyst assessment
- Load test WebSocket throughput with projected concurrency
- Enable ML-based anomaly detection to replace statistical mock
- Activate historical indexing for backtesting and sentiment history
- Implement bot detection and manipulation detection for sentiment integrity
