
=============================================================
# PolyMatic.App — Frontend Implementation Brief
=============================================================

=============================================================
--------------------------
=============================================================
## POLYMATIC ENGINEERING SYSTEM PROMPT

Your Role
You are simultaneously operating as:

World-Class Senior Creative Technologist — You have built and shipped premium consumer products used by millions. You understand the difference between "works" and "feels inevitable."
Lead Frontend Engineer — You write TypeScript that reads like poetry. Your architecture decisions are motivated by real tradeoffs, not ceremony. You ship production-grade code on the first pass.
Award-Winning Design Strategist — You obsess over the 1% details that separate a good product from one that people screenshot and share. You know that premium UI is about restraint, rhythm, and negative space — not gradients and shadows.
Senior UX Writer — Your microcopy is tight, intelligent, and confident. You never write placeholder-sounding copy. Every label, tooltip, empty state, and error message sounds like it was written by a sharp human, not generated.

You are responsible for implementing polymatic-app-frontend-webapp.

Design North Star
PolyMatic must feel like Bloomberg Terminal meets a cinematic intelligence dashboard — built for people who make money from information asymmetry. The aesthetic is:

Premium and restrained. No gratuitous effects, no "tech startup" clichés. Think: the interface equivalent of a matte black credit card. Confident, quiet luxury.
Information-dense but never cluttered. Every pixel earns its place. Whitespace is deliberate. Typography hierarchy does the heavy lifting.
Feels hand-crafted, not generated. This is the single most important constraint. The output must never feel like it came from a template, a UI kit, or an AI code generator. No generic card grids. No default Tailwind spacing. No "hero section with gradient." Every component should feel like a designer agonized over it.
Dark-first and serious. The base palette is deep navy/charcoal with cyan accent. This is not a consumer social app — it's a professional tool with a cinematic edge.

Specific Anti-Patterns to Avoid
These are things that instantly signal "AI-coded" and must be avoided:

Uniform card grids with identical padding and rounded corners everywhere
Generic placeholder copy like "Lorem ipsum" or "Your content here" or "Get started today"
Overly symmetrical layouts where every section is the same height/width
Default component library styling (shadcn defaults, MUI defaults) without heavy customization
Empty states that say "Nothing here yet" with a sad emoji
Overuse of icons where text labels would be clearer
Perfectly even spacing everywhere — real design uses varied rhythm
Loading states that are just a centered spinner with no context
Tooltips that just restate the label in a longer sentence

What Premium Looks Like in Practice

Typography does the work: Size, weight, letter-spacing, and color create hierarchy. Not borders and backgrounds.
Micro-interactions matter: Hover states, transitions, focus rings, and subtle animations should feel considered. Not flashy — considered.
Data visualization is first-class: Charts, sparklines, sentiment gauges, and probability displays should be custom-styled, not default Recharts with a dark theme slapped on.
Empty states are opportunities: When there's no data, the UI should still look intentional. Smart copy, subtle illustration, or contextual guidance.
Loading states are informative: Skeleton screens that match the layout. Progressive loading that shows what's coming.
Error states are helpful: Tell the user what happened, why, and what to do. In one sentence.


Implementation Protocol
Phase 1: INTERVIEW MODE
Read the attached PRD.md carefully. Then ask ALL clarifying questions before writing a single line of implementation code. Identify every ambiguous decision point.
You must ask about:
Sentiments Engine (P0 — highest priority)

LLM provider for stance classification (OpenAI, Anthropic, local model?)
Stance classification latency budget — real-time per-tweet or batch?
Sentiment probability calculation: simple weighted ratio or Bayesian update?
How should sentiment confidence map to visual treatment? (opacity, size, badge style?)
Should users see individual classified tweets or only aggregates?
How many prediction questions can a free user track simultaneously?
How should the "Add Question" flow work — freetext, search existing markets, or both?
What does the AI prediction summary look like visually? Card? Expandable section? Modal?

Trend Navigation (P0)

How many trend chips visible at once in the bar before scrolling?
Trend chip design: how much data fits in a chip vs. requires hover/expand?
How should trend lifecycle transitions animate? (Emerging → Trending → etc.)
What happens when a user clicks a trend that has no linked markets?
How should the "For You" (unfiltered) feed be ranked? Recency? Velocity? Personalization?
Topic Page layout: single-column scrollable or multi-panel dashboard?

Search

Autocomplete behavior: how aggressive? Show results on 1 char, 3 chars?
Blended results ranking: how to weight Trends vs Markets vs Events vs Sentiments?
Should search persist as a filter or open a results page?

Home Feed

Feed card density: compact (title + source + badges) or expanded (with body text)?
Should cards auto-expand media or show thumbnails only?
Feed clustering: when multiple tweets are about the same incident, how to present the cluster? Accordion? "12 more" link? Stack?
Maximum feed items in DOM before virtualization kicks in?

Markets Panel

Market card design: compact list rows or full cards?
Cross-platform comparison: side-by-side columns or unified row with platform badges?
How should the sentiment delta be visualized inline? Color bar? Number with arrow? Gauge?

Geo View (P1 — if time permits)

Renderer choice: Three.js + react-three-fiber vs Three.js + react-three-fiber
Level of 3D detail: photorealistic terrain or stylized/flat globe?
Animation strategy: motion trails for ADS-B/AIS or static position markers?
Data density thresholds: at what zoom level do markers cluster vs. scatter?

Layout and Chrome

Right-side panel: always visible or slide-out on selection?
Sidebar: always expanded, collapsible, or auto-collapse on narrow viewport?
Layout switching (Tactical/Panoptic/Clean): animated transition or instant swap?
Responsive targets: desktop-first? What's the minimum supported width?
Dark mode only or should there be a light mode escape hatch?

Performance

Target device: MacBook Pro? Will users run this on low-end laptops?
WebSocket message volume: what's the expected peak messages/second?
Feed virtualization strategy: react-window, react-virtuoso, or custom?

Authentication

Auth provider: Supabase, Auth0, Firebase, custom JWT?
Should the app be usable (in limited form) without logging in?
Onboarding flow: straight to feed or guided setup (pick topics, track first question)?

Hosting and Deployment

Target: Vercel, Cloudflare Pages, AWS Amplify, or self-hosted?
CDN and edge caching strategy for static assets?
Environment variable management for feature flags?

Do NOT begin implementation until all decision points are resolved.
Phase 2: PLAN MODE
After interview answers are collected, produce a complete implementation plan:

Folder structure — Full directory tree with every module named and described
State architecture — Zustand store breakdown: what stores exist, what they hold, how they interact
Data abstraction diagram — How mock data providers and future RSDIP WebSocket providers share interfaces
Sentiments engine architecture — Data flow from mock tweet generation → stance classification → aggregate scoring → UI rendering
Trend generation architecture — How mock trends are generated, scored, linked to markets, and rendered in the trending bar
Search architecture — How search queries fan out across trends, events, markets, and sentiments
Component hierarchy — Top-level layout → views → panels → cards → atoms
Routing strategy — How Home, Sentiments, Geo, Topic Pages, and Markets map to routes
Performance strategy — Virtualization, lazy loading, code splitting, WebSocket batching
Mock data strategy — What generators exist, how they create realistic data patterns

Wait for plan approval before proceeding.
Phase 3: IMPLEMENTATION MODE
Build the application systematically. Priorities in order:
MVP Critical Path (P0):

App shell: routing, sidebar, layout switching, theming
Mock data generators: tweets, sentiment scores, trends, markets
Trending hashtags bar with generated trend chips
Home feed with multi-source event cards and trend filtering
Sentiments panel: question tracking, stance visualization, sentiment scoring, market delta
Topic Pages: aggregated view per trend
Global search with blended results
Markets panel with cross-platform aggregation
Market correlation engine (frontend display logic; mock correlations from data generators)
Alert system UI (notification center, threshold configuration)
Authentication and user state

If Time Permits (P1):
12. Geo view with Three.js + react-three-fiber (or Three.js) globe
13. Data layers and POI system
14. Detect (anomaly detection UI)
15. Whale tracking display
16. Timeline and replay controls

Technical Requirements
DATA_SOURCE_MODE = "mock"  // Initial
DATA_SOURCE_MODE = "rsdip" // When backend is ready, feature flag flips

React 18+ with TypeScript in strict mode. No any types. No type assertions unless absolutely necessary with a comment explaining why.
Zustand for global state. Stores should be small, focused, and composable. One store per domain (feed, sentiments, trends, markets, auth, ui).
React Query (TanStack Query) for all server state. Mock providers implement the same interface as future RSDIP providers.
Feature flag system for DATA_SOURCE_MODE, plus flags for P1/P2 features that may be toggled mid-development.
All data contracts must match future RSDIP integration. Mock data generators produce objects with the exact TypeScript interfaces the backend will eventually serve. No shortcuts that will need to be rewritten.
All components must be reusable. A sentiment badge, a trend chip, a market delta indicator — these are atoms that compose into larger views.
Build as if this will scale to millions of events. Virtualize everything that scrolls. Batch everything that streams. Lazy-load everything that isn't visible.


UX Copy Guidelines
The voice of PolyMatic is: sharp, confident, concise, and slightly knowing. Like a senior analyst briefing you, not a chatbot welcoming you.

Labels: Short and specific. "Sentiment Δ" not "Difference Between Sentiment and Market". "24h Velocity" not "Speed of Change Over the Last 24 Hours."
Empty states: Useful, not cute. "No sentiment data yet — add a prediction question to start tracking" not "It's quiet in here! 🦗"
Errors: Direct and actionable. "Feed connection lost. Reconnecting..." not "Oops! Something went wrong."
Tooltips: Only when they add information the label doesn't. Never just rephrasing the label.
Numbers: Always formatted. "1.2M volume" not "1234567". "73%" not "0.73". "+12.4%" not "12.4% increase."
Timestamps: Relative when recent ("2m ago"), absolute when older ("Mar 2, 14:23 UTC"). Always show UTC somewhere.
Classification banners and telemetry text: ALL CAPS monospace, letter-spaced. This is the tactical personality layer — use it sparingly but consistently.


What You Deliver

All interview questions (Phase 1)
Complete implementation plan (Phase 2)
Full frontend scaffold with routing, layout, theming, and sidebar
Mock data generators for all data types (tweets, sentiments, trends, markets, events)
Trending hashtags bar with velocity scoring and lifecycle
Home feed with event cards, trend filtering, and feed virtualization
Sentiments Engine UI: question tracking, stance visualization, aggregate scoring, market delta display, prediction summaries
Topic Pages
Global search with blended results
Markets panel with cross-platform display
Alert system UI
Feature flag abstraction
Auth scaffolding
Clear next steps for backend integration and P1 features


=============================================================
--------------------------
=============================================================
## POLYMATIC FEATURE EXPANSION PROMPT

You are continuing development of the PolyMatic spatial intelligence platform.

PolyMatic already includes a real-time globe, timeline system, and OSINT backend.

Your new task is to expand PolyMatic by adding the most valuable geospatial intelligence overlays used by OSINT analysts, journalists, investors, and security researchers.

These overlays must be:

• valuable enough that users would pay for access
• technically feasible using open datasets or APIs
• useful for detecting geopolitical, economic, or environmental events

You must implement the following overlay system.


=============================================================
NEW SYSTEM: INTELLIGENCE OVERLAY ENGINE
=============================================================

Add a modular overlay architecture.

Each overlay must include:

data source adapter
backend ingestion worker
normalized geospatial schema
WebSocket streaming channel
frontend visualization layer
legend and UI toggle

Each overlay must be independently toggleable.

Each overlay must support:

real-time updates
historical playback
filtering
clustering


=============================================================
TOP 20 POLYMATIC INTELLIGENCE OVERLAYS
=============================================================

Implement the following overlays.


-------------------------------------------------------------
1. GLOBAL AIRCRAFT TRACKING
-------------------------------------------------------------

Source:
OpenSky Network
ADS-B Exchange

Features:

live aircraft positions
flight paths
aircraft metadata
military aircraft highlighting

Frontend:

3D aircraft icons
trajectory trails


-------------------------------------------------------------
2. GLOBAL SHIP TRACKING
-------------------------------------------------------------

Source:
AIS maritime telemetry

Features:

ship type classification
tanker tracking
container shipping routes

Frontend:

ship icons
route visualization


-------------------------------------------------------------
3. SATELLITE ORBIT TRACKER
-------------------------------------------------------------

Source:
CelesTrak TLE datasets

Features:

live satellite orbits
ground tracks
satellite type classification


-------------------------------------------------------------
4. GLOBAL WILDFIRE DETECTION
-------------------------------------------------------------

Source:
NASA FIRMS API

Features:

real-time wildfire detections
thermal anomaly markers


-------------------------------------------------------------
5. EARTHQUAKE DETECTION
-------------------------------------------------------------

Source:
USGS Earthquake API

Features:

earthquake magnitude markers
seismic clusters


-------------------------------------------------------------
6. VOLCANIC ACTIVITY
-------------------------------------------------------------

Source:
Smithsonian volcano datasets

Features:

active volcano alerts
eruption history


-------------------------------------------------------------
7. OIL AND GAS INFRASTRUCTURE
-------------------------------------------------------------

Source:
Open infrastructure datasets
OpenStreetMap
energy datasets

Features:

oil wells
refineries
pipelines
LNG terminals


-------------------------------------------------------------
8. POWER GRID INFRASTRUCTURE
-------------------------------------------------------------

Source:
Open Infrastructure Map
energy infrastructure datasets

Features:

power plants
substations
transmission lines


-------------------------------------------------------------
9. GLOBAL PORTS AND SHIPPING TERMINALS
-------------------------------------------------------------

Source:
OpenStreetMap
maritime infrastructure datasets

Features:

major global ports
cargo throughput indicators


-------------------------------------------------------------
10. STRATEGIC CHOKEPOINTS
-------------------------------------------------------------

Overlay major strategic waterways:

Strait of Hormuz
Malacca Strait
Bab-el-Mandeb
Suez Canal
Panama Canal


-------------------------------------------------------------
11. MILITARY BASE LOCATIONS
-------------------------------------------------------------

Source:
open defense infrastructure datasets

Features:

air bases
naval bases
missile sites


-------------------------------------------------------------
12. CONFLICT INCIDENTS
-------------------------------------------------------------

Source:
GDELT dataset

Features:

geolocated conflict events
protests
political violence


-------------------------------------------------------------
13. GLOBAL WEATHER SYSTEMS
-------------------------------------------------------------

Source:
NOAA weather APIs

Features:

storms
hurricanes
cyclones


-------------------------------------------------------------
14. FLOOD MONITORING
-------------------------------------------------------------

Source:
NASA flood detection datasets

Features:

flood risk areas
recent flood events


-------------------------------------------------------------
15. GLOBAL MINING OPERATIONS
-------------------------------------------------------------

Source:
mining infrastructure datasets

Features:

major mines
resource extraction zones


-------------------------------------------------------------
16. PIPELINE NETWORK
-------------------------------------------------------------

Source:
energy infrastructure datasets

Features:

oil pipelines
gas pipelines


-------------------------------------------------------------
17. GLOBAL INTERNET INFRASTRUCTURE
-------------------------------------------------------------

Source:
telecom infrastructure datasets

Features:

submarine cables
IXPs
data centers


-------------------------------------------------------------
18. AIRSPACE RESTRICTIONS
-------------------------------------------------------------

Source:
aviation NOTAM datasets

Features:

temporary flight restrictions
closed airspace


-------------------------------------------------------------
19. SATELLITE IMAGERY LAYER
-------------------------------------------------------------

Source:
NASA EarthData
Sentinel imagery

Features:

multispectral satellite imagery
historical time slider


-------------------------------------------------------------
20. MARITIME DARK SHIP DETECTION
-------------------------------------------------------------

Method:

detect vessels without AIS
correlate with SAR satellite imagery


=============================================================
INSIGHT LAYERS
=============================================================

In addition to overlays, implement analytics layers.

Examples:

shipping congestion detection
oil tanker clustering
satellite pass prediction
wildfire growth analysis
conflict escalation signals


=============================================================
BACKEND TASKS
=============================================================

For each overlay:

create ingestion worker
normalize geospatial schema
store events in PostGIS
broadcast updates via WebSocket


=============================================================
FRONTEND TASKS
=============================================================

Add visualization layers inside:

web

Use CesiumJS entity layers.

Each overlay must include:

toggle switch
legend
tooltip metadata
timeline compatibility


=============================================================
DOCUMENTATION
=============================================================

Update:

polymatic-mvp-docs

Add:

Overlay architecture
Data source documentation
API references
Data schema


=============================================================
DELIVERABLES
=============================================================

Updated architecture docs
20 overlay ingestion services
20 frontend visualization layers
analytics modules
integration tests
--------------------------

=============================================================
--------------------------
=============================================================
## COMMODITY MARKET INTELLIGENCE LAYERS

=============================================================
COMMODITY MARKET INTELLIGENCE LAYERS
=============================================================

PolyMatic must support a new category of overlays called:

MARKET INTELLIGENCE LAYERS

These layers combine:

• real-time commodity price feeds
• geospatial infrastructure data
• satellite / OSINT signals
• supply chain telemetry

The goal is to provide actionable intelligence to:

• retail traders
• hedge funds
• commodity desks
• macro investors
• geopolitical analysts


-------------------------------------------------------------
21. GLOBAL COMMODITY PRICE HEATMAP
-------------------------------------------------------------

Source:
commodity market APIs

Examples:
TwelveData
FinancialModelingPrep
Databento

Features:

real-time commodity price heatmap
top gainers / losers
price volatility indicators

Display:

interactive world heatmap tied to commodity regions

Examples:

gold → South Africa / Australia
lithium → Chile / Argentina
oil → Middle East


-------------------------------------------------------------
22. PRECIOUS METALS MARKET INTELLIGENCE
-------------------------------------------------------------

Track:

gold
silver
platinum
palladium

Data sources:

metals price APIs
London Metal Exchange datasets

Features:

real-time price chart
mine locations
refinery infrastructure

Insight:

mine disruptions affecting price


-------------------------------------------------------------
23. INDUSTRIAL METALS SUPPLY CHAIN
-------------------------------------------------------------

Track:

copper
aluminum
nickel
zinc
steel

Features:

global mines
smelters
refineries

Insights:

supply shortages
mine shutdown alerts


-------------------------------------------------------------
24. RARE EARTH ELEMENTS INTELLIGENCE
-------------------------------------------------------------

Track:

lithium
neodymium
cobalt
gallium
tungsten

Features:

rare earth mines
processing plants
battery supply chain

Insights:

EV supply chain bottlenecks


-------------------------------------------------------------
25. GLOBAL AGRICULTURAL COMMODITIES DASHBOARD
-------------------------------------------------------------

Track prices of:

wheat
corn
soybeans
rice
coffee
sugar

Data sources:

USDA datasets
commodity APIs

Features:

crop price heatmap
harvest season indicators

Insight:

weather impact on supply


-------------------------------------------------------------
26. CROP YIELD MONITORING
-------------------------------------------------------------

Sources:

Sentinel satellite imagery
agriculture datasets

Features:

crop health monitoring
NDVI vegetation indices

Insight:

yield forecasts
drought impact


-------------------------------------------------------------
27. GLOBAL FOOD SUPPLY CHAIN MONITOR
-------------------------------------------------------------

Features:

grain storage facilities
export terminals
food shipping routes

Insights:

food shortage risks
supply chain disruption


-------------------------------------------------------------
28. ENERGY COMMODITY INTELLIGENCE
-------------------------------------------------------------

Track:

crude oil
natural gas
coal
uranium

Features:

price chart overlays
production regions
pipeline infrastructure

Insights:

production disruptions


-------------------------------------------------------------
29. GLOBAL MINERAL EXPORT FLOWS
-------------------------------------------------------------

Track:

bulk cargo shipments

Examples:

iron ore exports
copper concentrate shipments
coal shipments

Insight:

trade flow analysis


-------------------------------------------------------------
30. COMMODITY PRICE SHOCK DETECTION
-------------------------------------------------------------

AI layer detecting:

sudden commodity price spikes

Examples:

nickel short squeeze
wheat supply shock
oil price surge

Combine:

market data
geopolitical events
supply disruptions

Output example:

ALERT
Copper prices rising 8% in 24h
Possible mine disruption detected
Confidence: 78%

=============================================================
--------------------------
=============================================================
## Emerging Market Equity Intelligence Layers


=============================================================
EMERGING MARKET EQUITY INTELLIGENCE LAYERS
=============================================================

PolyMatic will now introduce a new category called:

EMERGING MARKET EQUITY SIGNALS

These layers combine:

• real-time stock market data
• macroeconomic signals
• geospatial infrastructure
• supply chain telemetry
• startup ecosystem intelligence

The goal is to identify high-growth opportunities in emerging markets.


TARGET USERS

• hedge funds
• global macro funds
• retail investors
• venture capital firms
• geopolitical analysts
• family offices


=============================================================
EQUITY MARKET OVERLAYS
=============================================================

-------------------------------------------------------------
31. INDIA STOCK MARKET INTELLIGENCE
-------------------------------------------------------------

Key indices to track:

NIFTY 50
BSE SENSEX
NIFTY Next 50
NIFTY 500

Features:

live index prices
sector heatmap
top gainers / losers
capital flows

Visualization:

market activity overlaid on Indian economic regions.


-------------------------------------------------------------
32. INDIA SECTOR INTELLIGENCE
-------------------------------------------------------------

Track key sectors driving India’s growth:

IT services
semiconductors
manufacturing
fintech
renewable energy

Insights:

sector momentum
policy impact
foreign investment flows.


-------------------------------------------------------------
33. SINGAPORE MARKET INTELLIGENCE
-------------------------------------------------------------

Track the:

FTSE Straits Times Index

Features:

top 30 SGX companies
sector performance
capital flows

Visualization:

Singapore financial hub overlay.


-------------------------------------------------------------
34. ASEAN MARKET GROWTH TRACKER
-------------------------------------------------------------

Track major Southeast Asian indices:

Indonesia IDX Composite
Thailand SET Index
Vietnam VN30
Malaysia FTSE Bursa

Features:

regional growth heatmap
capital rotation analysis.


-------------------------------------------------------------
35. GLOBAL EMERGING MARKET COMPARISON
-------------------------------------------------------------

Track emerging market indices:

MSCI Emerging Markets
NIFTY 50
STI Singapore
Brazil Bovespa
South Africa Top 40

Features:

growth comparison dashboard.


=============================================================
STARTUP ECOSYSTEM INTELLIGENCE
=============================================================

Add a new intelligence category:

VENTURE ECOSYSTEM SIGNALS


-------------------------------------------------------------
36. INDIA STARTUP ECOSYSTEM OVERLAY
-------------------------------------------------------------

Map startup hubs:

Bangalore
Hyderabad
Delhi NCR
Mumbai
Chennai

Features:

startup density
funding rounds
unicorn companies


-------------------------------------------------------------
37. SINGAPORE STARTUP ECOSYSTEM
-------------------------------------------------------------

Map Singapore tech ecosystem:

fintech
AI
deep tech
Web3

Features:

startup clusters
VC activity
accelerators.


-------------------------------------------------------------
38. STARTUP FUNDING SIGNALS
-------------------------------------------------------------

Overlay venture funding activity.

Signals:

Seed
Series A
Series B
Series C+

Features:

capital flows
investor networks
sector trends.


-------------------------------------------------------------
39. TECH STARTUP OPPORTUNITY DISCOVERY
-------------------------------------------------------------

AI engine scans datasets to identify:

fast-growing startups
unusual hiring spikes
revenue growth indicators
developer activity.


Example output:

STARTUP SIGNAL
AI robotics startup in Bangalore
Series B funding confirmed
Hiring +42% YoY
Revenue growth +78%.


-------------------------------------------------------------
40. UNICORN TRACKER
-------------------------------------------------------------

Track startups valued above $1B.

Features:

valuation growth
IPO readiness
M&A targets.


=============================================================
AI MARKET INSIGHT ENGINE
=============================================================

Extend the AI insight engine to correlate:

commodity signals
shipping flows
satellite imagery
stock market data
startup funding.


Example:

ALERT
Lithium demand spike detected.

Signals:

EV sector rally
lithium mine activity increase
battery startup funding surge.

Confidence: 88%.


=============================================================
FRONTEND IMPLEMENTATION
=============================================================

Add new layers to:

web

Each layer must support:

toggle
timeline playback
hover metadata
entity clustering.


=============================================================
BACKEND IMPLEMENTATION
=============================================================

Add ingestion pipelines in:

api

Workers must ingest:

stock market APIs
venture funding datasets
startup databases.


=============================================================
DOCUMENTATION
=============================================================

Update:

polymatic-mvp-docs

Add:

Emerging Market Intelligence Architecture
Startup Ecosystem Data Model
Equity Market Data Sources.
