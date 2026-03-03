# PolyMatic — Frontend Implementation Plan

**Version:** 1.0
**Date:** March 3, 2026
**Status:** Approved — Phase 1 Interview Complete

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [State Architecture](#3-state-architecture)
4. [Data Abstraction Layer](#4-data-abstraction-layer)
5. [Sentiments Engine Architecture](#5-sentiments-engine-architecture)
6. [Trend Generation Architecture](#6-trend-generation-architecture)
7. [Search Architecture](#7-search-architecture)
8. [Component Hierarchy](#8-component-hierarchy)
9. [Routing Strategy](#9-routing-strategy)
10. [Theming System](#10-theming-system)
11. [Performance Strategy](#11-performance-strategy)
12. [Mock Data Strategy](#12-mock-data-strategy)
13. [Auth Flow](#13-auth-flow)
14. [Feature Flag System](#14-feature-flag-system)
15. [Build Sequence](#15-build-sequence)
16. [Interview Decisions — Binding Constraints](#16-interview-decisions--binding-constraints)

---

## 1. Tech Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3 | UI framework |
| `react-dom` | ^18.3 | DOM renderer |
| `typescript` | ^5.4 | Strict mode, no `any` |
| `vite` | ^5.4 | Build tool + dev server |

### State & Data

| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | ^4.5 | Client state (10 stores) |
| `@tanstack/react-query` | ^5.x | Server state, caching, mock/rsdip abstraction |
| `immer` | ^10.x | Immutable updates in Zustand |

### UI & Layout

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.x | Utility-first styling |
| `framer-motion` | ^11.x | Layout transitions, micro-interactions, 300ms ease |
| `react-virtuoso` | ^4.x | Feed virtualization (50-item threshold) |
| `recharts` | ^2.x | Sparklines, sentiment timelines, velocity charts |
| `lucide-react` | ^0.x | Icon system (clean line icons) |
| `@radix-ui/react-*` | latest | Accessible primitives (dialog, dropdown, tooltip, tabs) |
| `clsx` | ^2.x | Conditional classnames |
| `tailwind-merge` | ^2.x | Merge conflicting Tailwind classes |

### Geo (P1 — installed day one)

| Package | Version | Purpose |
|---------|---------|---------|
| `cesium` | ^1.115 | 3D globe engine |
| `resium` | ^1.18 | React bindings for CesiumJS |

### Routing

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | ^6.x | Client-side routing, lazy loading |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | ^3.x | Date formatting (relative + absolute) |
| `zod` | ^3.x | Runtime schema validation for data contracts |
| `nanoid` | ^5.x | ID generation for mock data |
| `mitt` | ^3.x | Lightweight event bus for cross-store communication |

### Dev & Build

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^9.x | Linting (flat config) |
| `prettier` | ^3.x | Code formatting |
| `vitest` | ^1.x | Unit testing |
| `@testing-library/react` | ^14.x | Component testing |
| `msw` | ^2.x | API mocking for tests |

---

## 2. Folder Structure

```
polymatic-frontend-webapp/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env                              # DATA_SOURCE_MODE, feature flags
├── .env.example
├── public/
│   ├── favicon.svg
│   └── cesium/                       # CesiumJS static assets (ion token, workers)
│
├── src/
│   ├── main.tsx                      # React root, providers, QueryClient
│   ├── App.tsx                       # Top-level router + layout shell
│   ├── vite-env.d.ts
│   │
│   ├── app/                          # App shell and global layout
│   │   ├── AppShell.tsx              # Sidebar + main + right panel grid
│   │   ├── Sidebar.tsx               # Left nav with auto-collapse
│   │   ├── RightPanel.tsx            # Persistent 30% detail panel
│   │   ├── TopBar.tsx                # Search bar container
│   │   ├── LayoutSwitcher.tsx        # Dashboard/Focus/Clean toggle
│   │   └── NotificationCenter.tsx    # Alert toasts + notification tray
│   │
│   ├── views/                        # Route-level view components
│   │   ├── HomeView.tsx              # Trending bar + feed + right panel
│   │   ├── SentimentsView.tsx        # Sentiments engine full view
│   │   ├── GeoView.tsx               # CesiumJS globe (P1)
│   │   ├── MarketsView.tsx           # Markets panel full view
│   │   ├── TopicPageView.tsx         # Topic drill-down dashboard
│   │   ├── SearchResultsView.tsx     # Dedicated search results (if navigated)
│   │   ├── AlertsConfigView.tsx      # Alert configuration
│   │   ├── LandingView.tsx           # Unauthenticated landing page
│   │   ├── LoginView.tsx             # Login/register forms
│   │   └── OnboardingView.tsx        # Interactive tour
│   │
│   ├── feed/                         # Home feed domain
│   │   ├── FeedContainer.tsx         # Virtualized feed list
│   │   ├── FeedCard.tsx              # Base event card
│   │   ├── FeedCardCompact.tsx       # Compact card variant
│   │   ├── FeedCardExpanded.tsx      # Expanded card with media
│   │   ├── FeedCluster.tsx           # "N more from this story" cluster
│   │   ├── FeedFilters.tsx           # Source type, severity, category
│   │   ├── FeedSkeleton.tsx          # Loading skeleton
│   │   └── feed.utils.ts            # Ranking, clustering logic
│   │
│   ├── trends/                       # Trending hashtags domain
│   │   ├── TrendingBar.tsx           # Horizontal scrolling chip bar
│   │   ├── TrendChip.tsx             # Individual trend chip (all data visible)
│   │   ├── TrendLifecycleBadge.tsx   # Emerging/Trending/Peaking/Cooling
│   │   ├── TrendVelocityArrow.tsx    # Velocity indicator component
│   │   ├── ViewAllTrends.tsx         # Full trending dashboard
│   │   └── trends.utils.ts          # Velocity scoring, lifecycle logic
│   │
│   ├── sentiments/                   # Sentiments engine domain
│   │   ├── SentimentsPanel.tsx       # Main sentiments list
│   │   ├── QuestionCard.tsx          # Collapsed question card
│   │   ├── QuestionCardExpanded.tsx  # Expanded with full breakdown
│   │   ├── StanceDistribution.tsx    # YES/NO/Neutral pie/bar chart
│   │   ├── SentimentTimeline.tsx     # 24h confidence-weighted timeline
│   │   ├── KeyVoices.tsx            # Influential accounts per stance
│   │   ├── PredictionBrief.tsx       # AI intelligence summary card
│   │   ├── MarketDeltaBadge.tsx      # Sentiment vs market delta
│   │   ├── AddQuestionFlow.tsx       # Trending suggestions → search
│   │   ├── SentimentConfidence.tsx   # Opacity + label treatment
│   │   └── sentiments.utils.ts      # Scoring formula, confidence calc
│   │
│   ├── search/                       # Global search domain
│   │   ├── SearchBar.tsx             # Global search input
│   │   ├── SearchDropdown.tsx        # Overlay dropdown results
│   │   ├── SearchSection.tsx         # Section within dropdown (Trends, Markets, etc.)
│   │   ├── SearchResultItem.tsx      # Individual result row
│   │   └── search.utils.ts          # Fan-out, debounce, ranking
│   │
│   ├── markets/                      # Markets panel domain
│   │   ├── MarketsPanel.tsx          # Markets list container
│   │   ├── MarketCard.tsx            # Full card with sparkline
│   │   ├── MarketSparkline.tsx       # Mini price chart
│   │   ├── CrossPlatformDelta.tsx    # Primary price + platform delta
│   │   ├── MarketDetail.tsx          # Expanded market detail
│   │   └── markets.utils.ts         # Sorting, filtering, arbitrage detection
│   │
│   ├── topic/                        # Topic page domain
│   │   ├── TopicHeader.tsx           # Hashtag, lifecycle, velocity chart
│   │   ├── TopicSentiment.tsx        # Aggregate sentiment for linked questions
│   │   ├── TopicMarkets.tsx          # Linked markets section
│   │   ├── TopicTimeline.tsx         # Chronological event feed
│   │   ├── TopicEntities.tsx         # Key named entities
│   │   ├── TopicGeoContext.tsx       # Mini-map (links to Geo tab)
│   │   └── TopicRelated.tsx          # Related trends
│   │
│   ├── alerts/                       # Alert system domain
│   │   ├── AlertConfig.tsx           # Alert creation/edit form
│   │   ├── AlertList.tsx             # Active alerts list
│   │   ├── AlertToast.tsx            # Toast notification
│   │   ├── AlertBadge.tsx            # Inline alert indicator
│   │   └── alerts.utils.ts          # Threshold evaluation, delivery
│   │
│   ├── geo/                          # Geo view domain (P1)
│   │   ├── GlobeContainer.tsx        # CesiumJS viewer wrapper
│   │   ├── GlobeCamera.tsx           # Camera controls, flyTo
│   │   ├── LayerManager.tsx          # Data layer toggle panel
│   │   ├── LayerRenderer.tsx         # Generic layer rendering
│   │   ├── MarkerCluster.tsx         # Clustered markers
│   │   ├── MotionTrail.tsx           # Animated ADS-B/AIS trails
│   │   ├── RegionSelect.tsx          # Polygon/rect selection
│   │   └── GeoDetail.tsx            # POI/event detail panel
│   │
│   ├── auth/                         # Authentication domain
│   │   ├── AuthProvider.tsx          # Context provider, JWT management
│   │   ├── AuthGuard.tsx             # Route protection HOC
│   │   ├── LoginForm.tsx             # Email/password + OAuth
│   │   ├── RegisterForm.tsx          # Registration form
│   │   ├── useAuth.ts               # Auth hook
│   │   └── auth.utils.ts            # Token refresh, storage
│   │
│   ├── onboarding/                   # Onboarding tour
│   │   ├── OnboardingTour.tsx        # Step-by-step overlay tour
│   │   ├── TourStep.tsx             # Individual tour step
│   │   ├── TopicPicker.tsx          # "Pick 3 topics" step
│   │   └── onboarding.config.ts    # Tour step definitions
│   │
│   ├── state/                        # Zustand stores
│   │   ├── feedStore.ts             # Feed items, filters, active trend
│   │   ├── sentimentsStore.ts       # Tracked questions, sentiment data
│   │   ├── trendsStore.ts           # Active trends, velocity, lifecycle
│   │   ├── marketsStore.ts          # Market contracts, prices, deltas
│   │   ├── searchStore.ts          # Search query, results, history
│   │   ├── uiStore.ts              # Layout mode, sidebar state, theme, right panel
│   │   ├── authStore.ts            # User, token, tier, preferences
│   │   ├── alertsStore.ts          # Alert configs, active alerts
│   │   ├── geoStore.ts             # Camera state, active layers, selected region
│   │   └── flagsStore.ts           # Feature flags, data source mode
│   │
│   ├── services/                     # Data layer
│   │   ├── dataProvider.ts          # DataProvider interface + factory
│   │   ├── mockProvider.ts          # Mock implementation
│   │   ├── rsdipProvider.ts         # Future RSDIP WebSocket implementation
│   │   ├── apiClient.ts            # HTTP client (axios or fetch wrapper)
│   │   ├── wsClient.ts             # WebSocket client with reconnect + batching
│   │   └── queryKeys.ts            # TanStack Query key factory
│   │
│   ├── mock-data/                    # Mock data generators
│   │   ├── generators/
│   │   │   ├── feedGenerator.ts     # Event/tweet generation with bursty arrival
│   │   │   ├── sentimentGenerator.ts # Stance classification, aggregate scores
│   │   │   ├── trendGenerator.ts    # Trend creation, velocity curves, lifecycle
│   │   │   ├── marketGenerator.ts   # Market contracts, price random walks
│   │   │   ├── alertGenerator.ts    # Alert triggers from mock data
│   │   │   └── geoGenerator.ts     # Geospatial events, ADS-B, AIS tracks
│   │   ├── seed/
│   │   │   ├── questions.ts         # Seed prediction questions
│   │   │   ├── accounts.ts          # Seed Twitter/X accounts (analysts, journalists)
│   │   │   ├── markets.ts           # Seed market contracts
│   │   │   ├── trends.ts            # Seed trending topics
│   │   │   └── entities.ts         # Seed named entities
│   │   └── index.ts                 # Mock data orchestrator
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useFeed.ts               # Feed data + filters
│   │   ├── useSentiments.ts         # Sentiment queries + mutations
│   │   ├── useTrends.ts             # Trending data
│   │   ├── useMarkets.ts            # Market data
│   │   ├── useSearch.ts             # Search with debounce
│   │   ├── useAlerts.ts             # Alert management
│   │   ├── useFeatureFlag.ts        # Flag checks
│   │   ├── useLayout.ts            # Layout mode + responsive
│   │   ├── useWebSocket.ts          # WS connection management
│   │   └── useTheme.ts             # Theme toggle
│   │
│   ├── components/                   # Shared UI atoms
│   │   ├── Badge.tsx                # Generic badge (severity, category, etc.)
│   │   ├── Button.tsx               # Button variants
│   │   ├── Card.tsx                 # Base card component
│   │   ├── Chip.tsx                 # Generic chip (filters, tags)
│   │   ├── ConfidenceBadge.tsx      # Low/Med/High with opacity treatment
│   │   ├── DeltaIndicator.tsx       # +12.4% with arrow and color
│   │   ├── EmptyState.tsx           # Smart empty states
│   │   ├── ErrorBoundary.tsx        # Error boundary with helpful messaging
│   │   ├── Icon.tsx                 # Icon wrapper (lucide)
│   │   ├── Input.tsx                # Text input with search variant
│   │   ├── LoadingSkeleton.tsx      # Context-aware skeletons
│   │   ├── DataLabel.tsx            # Clean label for section headers and metadata
│   │   ├── ProbabilityDisplay.tsx   # 73% with directional color
│   │   ├── SeverityDot.tsx          # Color-coded severity indicator
│   │   ├── Sparkline.tsx            # Mini inline chart
│   │   ├── Tabs.tsx                 # Tab container (Radix-based)
│   │   ├── Timestamp.tsx            # Smart relative/absolute timestamp
│   │   ├── Toggle.tsx               # Toggle switch
│   │   ├── Tooltip.tsx              # Informational tooltip (Radix-based)
│   │   └── VelocityIndicator.tsx    # Arrow + percentage
│   │
│   ├── types/                        # TypeScript interfaces (shared contracts)
│   │   ├── feed.types.ts            # FeedItem, EventCard, Source
│   │   ├── sentiment.types.ts       # SentimentQuestion, Stance, AggregateScore
│   │   ├── trend.types.ts           # Trend, TrendLifecycle, VelocityScore
│   │   ├── market.types.ts          # MarketContract, Platform, PricePoint
│   │   ├── search.types.ts          # SearchQuery, SearchResult, SearchSection
│   │   ├── alert.types.ts           # AlertConfig, AlertTrigger, AlertType
│   │   ├── geo.types.ts             # GeoEvent, Layer, POI, MotionTrack
│   │   ├── auth.types.ts            # User, AuthState, UserTier
│   │   ├── common.types.ts          # Shared types (Timestamp, Entity, Severity)
│   │   └── api.types.ts             # API response wrappers, pagination
│   │
│   ├── lib/                          # Pure utility functions
│   │   ├── format.ts                # Number formatting (1.2M, 73%, +12.4%)
│   │   ├── time.ts                  # Relative/absolute time formatting
│   │   ├── color.ts                 # Color utilities (severity, category)
│   │   ├── debounce.ts              # Debounce utility
│   │   └── cn.ts                    # clsx + tailwind-merge helper
│   │
│   └── styles/
│       ├── globals.css              # CSS custom properties, theme tokens
│       ├── themes/
│       │   ├── dark.css             # Dark theme variables
│       │   └── light.css            # Light theme variables
│       └── fonts.css                # Font face declarations
```

**Total: ~120 files across 18 directories**

---

## 3. State Architecture

### 10 Zustand Stores

Each store is small, focused, and typed. Stores communicate via `mitt` event bus for cross-domain reactions (e.g., trend selection → feed filter → markets filter).

#### 3.1 `uiStore`

```typescript
interface UIState {
  layoutMode: 'dashboard' | 'focus' | 'clean';
  sidebarExpanded: boolean;
  sidebarAutoCollapsed: boolean; // true when viewport < 1280px
  rightPanelContent: RightPanelContent | null;
  theme: 'dark' | 'light';
  viewportWidth: number;

  setLayoutMode: (mode: UIState['layoutMode']) => void;
  toggleSidebar: () => void;
  setRightPanel: (content: RightPanelContent | null) => void;
  toggleTheme: () => void;
}

type RightPanelContent =
  | { type: 'event-detail'; eventId: string }
  | { type: 'topic-page'; trendId: string }
  | { type: 'market-detail'; marketId: string }
  | { type: 'question-detail'; questionId: string }
  | { type: 'detect-output'; signalId: string };
```

#### 3.2 `feedStore`

```typescript
interface FeedState {
  items: FeedItem[];
  activeTrendFilter: string | null; // trend ID
  sourceFilters: SourceType[];
  severityThreshold: number;
  categoryFilter: string | null;
  isStreaming: boolean;
  clusterMap: Map<string, string[]>; // clusterId → itemIds

  setTrendFilter: (trendId: string | null) => void;
  addItems: (items: FeedItem[]) => void;
  setSourceFilters: (sources: SourceType[]) => void;
}
```

#### 3.3 `trendsStore`

```typescript
interface TrendsState {
  trends: Trend[];
  selectedTrendId: string | null;

  selectTrend: (id: string | null) => void;
  updateTrends: (trends: Trend[]) => void;
  getTrendById: (id: string) => Trend | undefined;
}
```

#### 3.4 `sentimentsStore`

```typescript
interface SentimentsState {
  questions: SentimentQuestion[];
  trackedQuestionIds: Set<string>;
  sortBy: 'delta' | 'velocity' | 'volume' | 'watchlist';
  expandedQuestionId: string | null;

  trackQuestion: (id: string) => void;
  untrackQuestion: (id: string) => void;
  updateQuestion: (question: SentimentQuestion) => void;
  setSortBy: (sort: SentimentsState['sortBy']) => void;
}
```

#### 3.5 `marketsStore`

```typescript
interface MarketsState {
  contracts: MarketContract[];
  activePlatformFilter: Platform | null;
  sortBy: 'probability' | 'delta' | 'volume' | 'sentiment';
  selectedMarketId: string | null;

  updateContracts: (contracts: MarketContract[]) => void;
  selectMarket: (id: string | null) => void;
}
```

#### 3.6 `searchStore`

```typescript
interface SearchState {
  query: string;
  isOpen: boolean;
  results: SearchResults | null;
  recentSearches: string[];
  savedSearches: SavedSearch[];

  setQuery: (query: string) => void;
  setResults: (results: SearchResults | null) => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  saveSearch: (query: string) => void;
}
```

#### 3.7 `authStore`

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tier: UserTier;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setUser: (user: User) => void;
}
```

#### 3.8 `alertsStore`

```typescript
interface AlertsState {
  configs: AlertConfig[];
  activeAlerts: Alert[];
  unreadCount: number;

  addConfig: (config: AlertConfig) => void;
  removeConfig: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAllRead: () => void;
}
```

#### 3.9 `geoStore`

```typescript
interface GeoState {
  cameraPosition: CameraPosition;
  activeLayers: Set<LayerType>;
  selectedRegion: GeoRegion | null;
  selectedPOI: string | null;
  clusteringZoomThreshold: number;

  flyTo: (position: CameraPosition) => void;
  toggleLayer: (layer: LayerType) => void;
  setSelectedRegion: (region: GeoRegion | null) => void;
}
```

#### 3.10 `flagsStore`

```typescript
interface FlagsState {
  dataSourceMode: 'mock' | 'rsdip';
  enableGeoView: boolean;
  enableDetect: boolean;
  enableWhaleTracking: boolean;
  enableTimeline: boolean;
  enableLightMode: boolean;

  isEnabled: (flag: keyof Omit<FlagsState, 'isEnabled' | 'setFlag' | 'dataSourceMode'>) => boolean;
  setFlag: (flag: string, value: boolean) => void;
}
```

### Cross-Store Communication

```
User clicks trend chip
  → trendsStore.selectTrend(id)
  → mitt.emit('trend:selected', { trendId })
  → feedStore listener filters feed
  → marketsStore listener filters markets
  → sentimentsStore listener highlights linked questions
  → uiStore listener updates right panel to TopicPage
```

---

## 4. Data Abstraction Layer

### DataProvider Interface

```typescript
interface DataProvider {
  // Feed
  getFeedItems(params: FeedParams): Promise<FeedItem[]>;
  subscribeFeed(callback: (items: FeedItem[]) => void): Unsubscribe;

  // Sentiments
  getSentimentQuestions(params: PaginationParams): Promise<SentimentQuestion[]>;
  getSentimentDetail(questionId: string): Promise<SentimentDetail>;
  subscribeSentimentUpdates(questionId: string, callback: (update: SentimentUpdate) => void): Unsubscribe;

  // Trends
  getTrends(): Promise<Trend[]>;
  subscribeTrendUpdates(callback: (trends: Trend[]) => void): Unsubscribe;

  // Markets
  getMarkets(params: MarketParams): Promise<MarketContract[]>;
  subscribeMarketUpdates(callback: (updates: MarketUpdate[]) => void): Unsubscribe;

  // Search
  search(query: string, options?: SearchOptions): Promise<SearchResults>;

  // Alerts
  getAlertConfigs(): Promise<AlertConfig[]>;
  createAlert(config: Omit<AlertConfig, 'id'>): Promise<AlertConfig>;

  // Auth
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthResponse>;

  // Geo (P1)
  getGeoEvents(bounds: GeoBounds, layers: LayerType[]): Promise<GeoEvent[]>;
  subscribeGeoUpdates(bounds: GeoBounds, callback: (events: GeoEvent[]) => void): Unsubscribe;
}
```

### Factory

```typescript
// services/dataProvider.ts
import { MockProvider } from './mockProvider';
import { RSDIPProvider } from './rsdipProvider';
import { useFlagsStore } from '../state/flagsStore';

export function createDataProvider(): DataProvider {
  const mode = useFlagsStore.getState().dataSourceMode;

  if (mode === 'mock') return new MockProvider();
  if (mode === 'rsdip') return new RSDIPProvider();
  throw new Error(`Unknown data source mode: ${mode}`);
}
```

### TanStack Query Integration

```typescript
// hooks/useSentiments.ts
export function useSentimentQuestions() {
  const provider = useDataProvider();

  return useQuery({
    queryKey: queryKeys.sentiments.list(),
    queryFn: () => provider.getSentimentQuestions({ page: 1, limit: 20 }),
    refetchInterval: 10_000, // Poll every 10s (mock batch cadence)
    staleTime: 5_000,
  });
}

export function useSentimentDetail(questionId: string) {
  const provider = useDataProvider();

  return useQuery({
    queryKey: queryKeys.sentiments.detail(questionId),
    queryFn: () => provider.getSentimentDetail(questionId),
    refetchInterval: 5_000, // Match batch classification interval
  });
}
```

### Query Key Factory

```typescript
export const queryKeys = {
  feed: {
    all: ['feed'] as const,
    list: (filters: FeedFilters) => ['feed', 'list', filters] as const,
    detail: (id: string) => ['feed', 'detail', id] as const,
  },
  sentiments: {
    all: ['sentiments'] as const,
    list: () => ['sentiments', 'list'] as const,
    detail: (id: string) => ['sentiments', 'detail', id] as const,
    tweets: (id: string) => ['sentiments', 'tweets', id] as const,
  },
  trends: {
    all: ['trends'] as const,
    list: () => ['trends', 'list'] as const,
    detail: (id: string) => ['trends', 'detail', id] as const,
  },
  markets: {
    all: ['markets'] as const,
    list: (filters: MarketFilters) => ['markets', 'list', filters] as const,
    detail: (id: string) => ['markets', 'detail', id] as const,
  },
  search: {
    results: (query: string) => ['search', query] as const,
  },
} as const;
```

---

## 5. Sentiments Engine Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                     SENTIMENTS ENGINE DATA FLOW                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Mock Generator]                    [RSDIP Backend (future)]        │
│       │                                     │                        │
│       │  Generates tweets every              │  Twitter/X API        │
│       │  5-10s in batches                    │  → LLM classification │
│       │                                      │  → Batch delivery     │
│       ▼                                      ▼                       │
│  ┌─────────────────────────────────────────────┐                     │
│  │           DataProvider.getSentimentDetail()  │                     │
│  │           DataProvider.subscribeSentiments()  │                    │
│  └──────────────────┬──────────────────────────┘                     │
│                     │                                                │
│                     ▼                                                │
│  ┌─────────────────────────────────────────────┐                     │
│  │         TanStack Query (5s stale time)       │                    │
│  │         Refetch every 10s (batch cadence)    │                    │
│  └──────────────────┬──────────────────────────┘                     │
│                     │                                                │
│                     ▼                                                │
│  ┌─────────────────────────────────────────────┐                     │
│  │           sentimentsStore (Zustand)          │                     │
│  │  - questions[]                               │                    │
│  │  - trackedQuestionIds                        │                    │
│  │  - expandedQuestionId                        │                    │
│  └──────────────────┬──────────────────────────┘                     │
│                     │                                                │
│          ┌──────────┼──────────┐                                     │
│          ▼          ▼          ▼                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                             │
│  │ Question │ │ Sentiment│ │ Market   │                              │
│  │ Card     │ │ Timeline │ │ Delta    │                              │
│  │ (list)   │ │ (detail) │ │ Badge    │                              │
│  └──────────┘ └──────────┘ └──────────┘                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Scoring Formula

```typescript
// sentiments.utils.ts

interface ClassifiedTweet {
  id: string;
  stance: 'supports_yes' | 'supports_no' | 'neutral' | 'ambiguous';
  confidenceScore: number;      // 0-1, classifier confidence
  accountCredibility: number;   // 0-1, based on verification, followers, domain expertise
  engagementWeight: number;     // 0-1, normalized engagement
  recencyDecay: number;         // 0-1, time-decay factor (1.0 = just now, 0.5 = 6h ago)
  diversityFactor: number;      // 0-1, penalized if echo-chamber cluster
}

function calculateSentimentProbability(tweets: ClassifiedTweet[]): number {
  // Filter out ambiguous
  const scorable = tweets.filter(t => t.stance !== 'ambiguous');

  let yesWeight = 0;
  let noWeight = 0;

  for (const tweet of scorable) {
    const weight =
      tweet.confidenceScore *
      tweet.accountCredibility *
      tweet.engagementWeight *
      tweet.recencyDecay *
      tweet.diversityFactor;

    if (tweet.stance === 'supports_yes') yesWeight += weight;
    else if (tweet.stance === 'supports_no') noWeight += weight;
    // neutral tweets don't contribute to YES/NO ratio
  }

  if (yesWeight + noWeight === 0) return 50; // No signal → 50%

  return Math.round((yesWeight / (yesWeight + noWeight)) * 100);
}

function calculateConfidenceLevel(tweets: ClassifiedTweet[]): 'low' | 'medium' | 'high' {
  const volume = tweets.filter(t => t.stance !== 'ambiguous').length;
  const avgDiversity = mean(tweets.map(t => t.diversityFactor));
  const avgConfidence = mean(tweets.map(t => t.confidenceScore));

  if (volume < 20 || avgDiversity < 0.3 || avgConfidence < 0.5) return 'low';
  if (volume < 100 || avgDiversity < 0.6 || avgConfidence < 0.7) return 'medium';
  return 'high';
}
```

### Confidence Visual Treatment

```
Confidence HIGH:   opacity: 1.0, label: "HIGH CONFIDENCE", filled badge
Confidence MEDIUM: opacity: 0.85, label: "MED CONFIDENCE", filled badge
Confidence LOW:    opacity: 0.6, label: "LOW CONFIDENCE", outline badge
```

### Tier Gating

| Feature | Free | Pro | Quant |
|---------|------|-----|-------|
| Browse questions | Top 10 (read-only) | Unlimited | Unlimited |
| Track questions | 3 | Unlimited | Unlimited |
| Tweet visibility | Aggregates only | Key voices (5 per stance) | Full drill-down |
| AI prediction summary | Hidden | Visible | Visible + API |
| Sentiment export | No | CSV | CSV + JSON + API |

### Intelligence Summary Card

```
┌─────────────────────────────────────────────────────────┐
│  Sentiment Analysis                                      │
│                                                          │
│  Will Iran close the Strait of Hormuz before             │
│  July 2026?                                              │
│                                                          │
│  Assessment                                              │
│  Twitter sentiment strongly favors YES at 73%, driven    │
│  primarily by OSINT accounts reporting naval buildups    │
│  in the Persian Gulf region. Key voices include          │
│  @AuroraIntel and @sentdefender.                         │
│                                                          │
│  Confidence: Medium — Source diversity score 0.54.        │
│  Sentiment concentration among defense-focused accounts  │
│  limits confidence ceiling.                              │
│                                                          │
│  Market Δ   +23% (Sentiment 73% vs Market 50%)          │
│  Signal     Potential underpricing detected              │
│                                                          │
│  ⚠ Sentiment-derived estimate. Not financial advice.     │
│  Historical accuracy: 68% directionally correct.         │
│                                                          │
│  Generated Mar 3, 2026 14:23 UTC                         │
└─────────────────────────────────────────────────────────┘
```

Rendered with: Inter (sans-serif) for all text, monospace only for numerical values (percentages, deltas). Clean card with subtle left border accent. Section headers use medium-weight Inter, sentence case. No ALL CAPS, no letter-spacing treatment. Rounded corners, consistent with the modern SaaS card system.

---

## 6. Trend Generation Architecture

### Lifecycle State Machine

```
  ┌───────────┐     velocity > threshold     ┌───────────┐
  │  EMERGING  │ ──────────────────────────► │  TRENDING  │
  │  (new)     │                             │ (growing)  │
  └───────────┘                              └─────┬─────┘
       ▲                                           │
       │                              velocity peaks
       │                                           ▼
       │                                    ┌───────────┐
       │                                    │  PEAKING   │
       │                                    │  (max vel) │
       │                                    └─────┬─────┘
       │                                          │
       │                           velocity declining
       │                                          ▼
       │                                    ┌───────────┐
       └────── re-accelerates ◄──────────── │  COOLING   │
                                            │ (fading)   │
                                            └───────────┘
```

### Velocity Scoring

```typescript
interface Trend {
  id: string;
  hashtag: string;           // e.g., "#IranStraitCrisis"
  category: TrendCategory;   // 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture'
  lifecycle: TrendLifecycle; // 'emerging' | 'trending' | 'peaking' | 'cooling'
  velocity: number;          // events per minute, normalized 0-100
  velocityDelta: number;     // change in velocity from last interval (positive = accelerating)
  eventCount: number;        // total events in cluster (24h)
  linkedMarketIds: string[]; // correlated market contract IDs
  topEntities: string[];     // NER-extracted entities
  createdAt: number;         // timestamp of first event in cluster
  updatedAt: number;         // timestamp of most recent event
}

type TrendCategory = 'geopolitics' | 'economics' | 'technology' | 'sports' | 'culture';

const CATEGORY_COLORS: Record<TrendCategory, string> = {
  geopolitics: '#F44336', // red
  economics: '#2196F3',   // blue
  technology: '#9C27B0',  // purple
  sports: '#4CAF50',      // green
  culture: '#FF9800',     // orange
};
```

### Chip Rendering Spec

Each chip is ~220px wide, showing all data:

```
┌──────────────────────────────────────┐
│ 🔴 #IranStraitCrisis  ▲ 42%  📊     │
│    TRENDING · 1.2K events            │
└──────────────────────────────────────┘

Line 1: Category dot · Hashtag · Velocity arrow+% · Market badge (📊 if linked)
Line 2: Lifecycle label · Event count
```

- Badge transitions: When lifecycle changes, the lifecycle label flashes briefly (200ms glow pulse via `framer-motion`) then settles to the new state color.
- 10-12 chips visible on 1440px viewport. Horizontal scroll for overflow.
- Chips are sorted by velocity descending (fastest-moving first).

---

## 7. Search Architecture

### Flow

```
User types ≥2 chars
  → 200ms debounce
  → searchStore.setQuery(query)
  → Fan-out to 4 indices (via DataProvider.search()):
      ├── Trends index (hashtag, entity match)
      ├── Markets index (question text match)
      ├── Sentiments index (question text, entity match)
      └── Events index (content, entity match)
  → Results arrive
  → searchStore.setResults(results)
  → SearchDropdown renders in fixed order:
      1. Trends (max 3)
      2. Markets (max 3)
      3. Sentiments (max 3)
      4. Events (max 5)
```

### Dropdown Overlay Spec

```
┌─────────────────────────────────────────────────┐
│ 🔍 iran strait                           ✕      │
├─────────────────────────────────────────────────┤
│ TRENDS                                          │
│   #IranStraitCrisis  ▲ 42%  TRENDING            │
│   #PersianGulfTension ▲ 18%  EMERGING           │
├─────────────────────────────────────────────────┤
│ MARKETS                                         │
│   Will Iran close the Strait...?  50¢  Δ+23%   │
│   US-Iran military conflict...?   34¢  Δ+12%   │
├─────────────────────────────────────────────────┤
│ SENTIMENTS                                      │
│   Strait closure sentiment  73% YES  MED CONF   │
├─────────────────────────────────────────────────┤
│ EVENTS                                          │
│   @AuroraIntel: US carrier group repo... 2m ago │
│   Reuters: Iran navy exercises in...    15m ago │
│   @sentdefender: IRGC statement on...   1h ago  │
├─────────────────────────────────────────────────┤
│ View all results →                              │
└─────────────────────────────────────────────────┘
```

- Dropdown opens as an absolute-positioned overlay below the search bar.
- Click outside or press `Escape` to dismiss.
- Arrow keys navigate results. `Enter` selects.
- "View all results" navigates to a full search results page.

---

## 8. Component Hierarchy

```
App
├── QueryClientProvider
├── AuthProvider
├── ThemeProvider (CSS class on <html>)
│
└── Router
    ├── LandingView (unauthenticated)
    ├── LoginView (unauthenticated)
    │
    └── AuthGuard
        └── AppShell
            ├── Sidebar
            │   ├── Logo
            │   ├── NavItem (Home)
            │   ├── NavItem (Sentiments)
            │   ├── NavItem (Geo) [feature-flagged]
            │   ├── NavItem (Markets)
            │   ├── Divider
            │   ├── NavItem (POI)
            │   ├── NavItem (Layers)
            │   ├── NavItem (Scenes)
            │   ├── NavItem (Filters)
            │   ├── Spacer
            │   ├── NavItem (Alerts)
            │   ├── LayoutSwitcher
            │   └── UserMenu
            │
            ├── TopBar
            │   └── SearchBar
            │       └── SearchDropdown
            │           ├── SearchSection (Trends)
            │           │   └── SearchResultItem[]
            │           ├── SearchSection (Markets)
            │           ├── SearchSection (Sentiments)
            │           └── SearchSection (Events)
            │
            ├── MainContent (route outlet)
            │   ├── HomeView
            │   │   ├── TrendingBar
            │   │   │   ├── TrendChip[]
            │   │   │   │   ├── TrendLifecycleBadge
            │   │   │   │   └── VelocityIndicator
            │   │   │   └── ViewAllTrendsButton
            │   │   └── FeedContainer (react-virtuoso)
            │   │       ├── FeedCard / FeedCardCompact / FeedCardExpanded
            │   │       │   ├── Badge (source)
            │   │       │   ├── Timestamp
            │   │       │   ├── Chip[] (entity tags)
            │   │       │   ├── Badge (trend hashtag)
            │   │       │   ├── Badge (sentiment stance)
            │   │       │   ├── Badge (market correlation)
            │   │       │   └── DataLabel (geo coordinate)
            │   │       └── FeedCluster
            │   │           ├── FeedCard (lead)
            │   │           └── "N more" expand toggle
            │   │
            │   ├── SentimentsView
            │   │   └── SentimentsPanel
            │   │       ├── SortControls
            │   │       ├── QuestionCard[]
            │   │       │   ├── ProbabilityDisplay (market price)
            │   │       │   ├── ProbabilityDisplay (sentiment)
            │   │       │   ├── MarketDeltaBadge
            │   │       │   ├── ConfidenceBadge
            │   │       │   └── DeltaIndicator (direction)
            │   │       ├── QuestionCardExpanded
            │   │       │   ├── StanceDistribution
            │   │       │   ├── SentimentTimeline
            │   │       │   ├── KeyVoices
            │   │       │   └── PredictionBrief
            │   │       └── AddQuestionFlow
            │   │
            │   ├── MarketsView
            │   │   └── MarketsPanel
            │   │       ├── MarketCard[]
            │   │       │   ├── Sparkline
            │   │       │   ├── CrossPlatformDelta
            │   │       │   └── DeltaIndicator (sentiment)
            │   │       └── MarketDetail (expanded)
            │   │
            │   ├── GeoView [feature-flagged]
            │   │   └── GlobeContainer
            │   │       ├── CesiumViewer
            │   │       ├── LayerManager
            │   │       ├── MarkerCluster[]
            │   │       └── MotionTrail[]
            │   │
            │   └── TopicPageView
            │       ├── TopicHeader
            │       ├── TopicSentiment
            │       ├── TopicMarkets
            │       ├── TopicTimeline
            │       ├── TopicEntities
            │       ├── TopicGeoContext
            │       └── TopicRelated
            │
            ├── RightPanel (persistent, 30%)
            │   └── (dynamic content based on uiStore.rightPanelContent)
            │
            └── NotificationCenter
                └── AlertToast[]
```

---

## 9. Routing Strategy

### Route Map

```typescript
const routes = [
  // Public (unauthenticated)
  { path: '/', element: <LandingView /> },
  { path: '/login', element: <LoginView /> },
  { path: '/register', element: <LoginView mode="register" /> },

  // Protected (AuthGuard)
  {
    path: '/app',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/app/home" /> },
      { path: 'home', element: <HomeView /> },
      { path: 'sentiments', element: <SentimentsView /> },
      { path: 'sentiments/:questionId', element: <SentimentsView /> },
      { path: 'markets', element: <MarketsView /> },
      { path: 'markets/:marketId', element: <MarketsView /> },
      { path: 'topic/:trendId', element: <TopicPageView /> },
      { path: 'search', element: <SearchResultsView /> },
      { path: 'alerts', element: <AlertsConfigView /> },
      { path: 'onboarding', element: <OnboardingView /> },

      // P1 — Feature-flagged
      { path: 'geo', element: <FeatureGate flag="enableGeoView"><GeoView /></FeatureGate> },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" /> },
];
```

### Lazy Loading

```typescript
const HomeView = lazy(() => import('./views/HomeView'));
const SentimentsView = lazy(() => import('./views/SentimentsView'));
const MarketsView = lazy(() => import('./views/MarketsView'));
const GeoView = lazy(() => import('./views/GeoView'));
const TopicPageView = lazy(() => import('./views/TopicPageView'));
const OnboardingView = lazy(() => import('./views/OnboardingView'));
```

### Code Splitting Strategy

| Bundle | Contents | Expected Size |
|--------|----------|---------------|
| `main` | App shell, sidebar, routing, topbar | ~80 KB |
| `home` | Feed, trending bar, cards | ~60 KB |
| `sentiments` | Sentiments panel, charts, prediction brief | ~50 KB |
| `markets` | Markets panel, sparklines | ~40 KB |
| `geo` | CesiumJS, globe, layers | ~500 KB (+ CesiumJS worker ~2 MB) |
| `topic` | Topic page components | ~30 KB |
| `auth` | Login, register, onboarding | ~25 KB |
| `search` | Search results page | ~20 KB |

---

## 10. Theming System

### CSS Custom Properties

```css
/* styles/globals.css */
:root {
  /* Base — overridden by theme */
  --color-bg-primary: #1A1A2E;
  --color-bg-secondary: #16213E;
  --color-bg-card: #1E2A45;
  --color-bg-hover: #243354;

  /* Accent */
  --color-accent: #00BCD4;
  --color-accent-hover: #00ACC1;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-text-tertiary: #666666;

  /* Semantic */
  --color-success: #4CAF50;
  --color-warning: #FFC107;
  --color-danger: #F44336;

  /* Sentiment */
  --color-sentiment-yes: #4CAF50;
  --color-sentiment-no: #F44336;
  --color-sentiment-neutral: #9E9E9E;

  /* Market delta */
  --color-delta-positive: #4CAF50;
  --color-delta-negative: #F44336;

  /* Trend categories */
  --color-cat-geopolitics: #F44336;
  --color-cat-economics: #2196F3;
  --color-cat-technology: #9C27B0;
  --color-cat-sports: #4CAF50;
  --color-cat-culture: #FF9800;

  /* Layout */
  --sidebar-width: 220px;
  --sidebar-collapsed-width: 64px;
  --right-panel-width: 30%;
  --topbar-height: 56px;
  --trending-bar-height: 64px;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;

  /* Animation */
  --transition-layout: 300ms ease;
  --transition-hover: 150ms ease;
}
```

### Dark Theme (Default)

```css
/* styles/themes/dark.css */
[data-theme="dark"] {
  --color-bg-primary: #1A1A2E;
  --color-bg-secondary: #16213E;
  --color-bg-card: #1E2A45;
  --color-bg-hover: #243354;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-text-tertiary: #666666;
  --color-border: #2A3A5C;
}
```

### Light Theme

```css
/* styles/themes/light.css */
[data-theme="light"] {
  --color-bg-primary: #F5F6FA;
  --color-bg-secondary: #FFFFFF;
  --color-bg-card: #FFFFFF;
  --color-bg-hover: #EEEEF2;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #5A5A6E;
  --color-text-tertiary: #9E9EA8;
  --color-border: #D8D8E0;
  --color-accent: #0097A7; /* slightly darker cyan for contrast on light bg */
}
```

### Typography Strategy — Minimal Modern SaaS

Monospace (JetBrains Mono) is reserved for **numerical data only**:
- Timestamps: `14:23 UTC · 2m ago`
- Coordinates: `38.9072° N, 77.0369° W`
- Prices and percentages: `73%`, `+12.4%`, `$1.2M`
- Deltas and velocity numbers

Everything else uses Inter (sans-serif) in **normal case** — no ALL CAPS classification headers, no letter-spacing 0.1em label treatment. Section headers use medium-weight Inter with appropriate size hierarchy. Labels are clean, lowercase or sentence case. The overall aesthetic is a minimal, modern SaaS — data-rich but visually calm.

---

## 11. Performance Strategy

### Virtualization

| Component | Library | Threshold | Notes |
|-----------|---------|-----------|-------|
| Home feed | `react-virtuoso` | 50 items in DOM | Variable-height rows, auto-sizing |
| Markets list | `react-virtuoso` | 30 items | Fixed-height rows |
| Event timeline (Topic) | `react-virtuoso` | 50 items | Variable-height |
| Search results | Native DOM | No virtualization | Max 14 items in dropdown |

### WebSocket Batching

```typescript
// wsClient.ts
class WebSocketClient {
  private buffer: WSMessage[] = [];
  private flushInterval: NodeJS.Timer;

  constructor(url: string) {
    this.flushInterval = setInterval(() => this.flush(), 100); // 100ms render frames
  }

  private onMessage(event: MessageEvent) {
    this.buffer.push(JSON.parse(event.data));
  }

  private flush() {
    if (this.buffer.length === 0) return;
    const batch = this.buffer.splice(0);
    // Dispatch batch to appropriate stores
    this.dispatchBatch(batch);
  }
}
```

- Normal mode: batch every 100ms (10 fps update cadence)
- Spike mode (>50 msgs buffered): batch every 250ms, drop low-severity events
- Auto-reconnect with exponential backoff: 1s, 2s, 4s, 8s, max 30s

### Lazy Layer Loading (Geo)

```typescript
// Layers are not instantiated until toggled on
const layerComponents: Record<LayerType, () => Promise<ComponentType>> = {
  aircraft: () => import('./layers/AircraftLayer'),
  maritime: () => import('./layers/MaritimeLayer'),
  earthquakes: () => import('./layers/EarthquakeLayer'),
  conflicts: () => import('./layers/ConflictLayer'),
  // ...
};
```

### Memory Budget

| Component | Target | Notes |
|-----------|--------|-------|
| Feed (virtualized) | < 50 MB | 50 DOM nodes, recycled |
| Sentiments | < 20 MB | 20 questions cached |
| Markets | < 15 MB | 50 contracts + sparkline data |
| CesiumJS globe | < 200 MB | Lazy, only when Geo tab active |
| WS buffer | < 5 MB | Flush at 100ms |
| **Total target** | **< 500 MB** | With feed + 5 geo layers active |

### Rendering Budget

| Target | Budget |
|--------|--------|
| Feed scroll | < 16ms per frame (60fps) |
| Trend bar update | < 10ms |
| Sentiment score refresh | < 5ms |
| Globe interaction | < 16ms (60fps) |
| Layout transition | 300ms (animated, not blocking) |
| Time to interactive | < 3s |
| Largest Contentful Paint | < 2.5s |

---

## 12. Mock Data Strategy

### Generator Architecture

Each generator produces data that matches the exact TypeScript interfaces the RSDIP backend will eventually serve. No shortcuts.

#### Feed Generator

```typescript
// Simulates bursty tweet arrival during breaking events
class FeedGenerator {
  private baseRate = 2;    // events per second during quiet periods
  private burstRate = 20;  // events per second during breaking events
  private burstProbability = 0.05; // 5% chance of burst each interval
  private burstDuration = 30_000;  // 30 second burst windows

  generate(): FeedItem[] {
    const isBurst = Math.random() < this.burstProbability || this.isActiveBurst;
    const count = isBurst ? this.burstRate : this.baseRate;
    return Array.from({ length: count }, () => this.createFeedItem(isBurst));
  }
}
```

#### Sentiment Generator

```typescript
// Simulates stance classification arriving in batches every 5-10s
class SentimentGenerator {
  // Each question has a "true" sentiment that drifts over time
  private trueSentiments: Map<string, number>; // questionId → true probability (0-100)
  private driftVelocity: Map<string, number>;  // questionId → drift per batch

  generateBatch(questionId: string): ClassifiedTweet[] {
    const trueSentiment = this.trueSentiments.get(questionId)!;
    // Generate 10-30 tweets per batch
    // Stance distribution roughly matches true sentiment with noise
    // Confidence scores follow beta distribution (Claude-like calibration)
  }
}
```

#### Trend Generator

```typescript
// Simulates trend emergence, acceleration, peak, and decay
class TrendGenerator {
  generateTrend(): Trend {
    // Pick from seed topics, generate hashtag
    // Velocity follows sigmoid curve: slow start → rapid growth → plateau → decay
    // Lifecycle transitions at velocity thresholds
  }

  tickVelocity(trend: Trend): Trend {
    // Advance velocity along lifecycle curve
    // Random perturbation for realism
    // Small chance of re-acceleration (cooling → emerging)
  }
}
```

#### Market Generator

```typescript
// Simulates prediction market price random walks
class MarketGenerator {
  generatePriceHistory(contract: MarketContract): PricePoint[] {
    // Brownian motion with mean-reversion
    // Occasional jumps correlated with trend spikes
    // Cross-platform spread: Kalshi = Polymarket ± uniform(-3, 3)%
  }
}
```

### Seed Data

Pre-defined realistic seed data for compelling demos:

| Seed Set | Count | Examples |
|----------|-------|---------|
| Prediction questions | 20 | "Will Iran close the Strait of Hormuz before July 2026?" |
| Twitter accounts | 30 | @AuroraIntel, @BNONews, @sentdefender, @belaborated |
| Market contracts | 25 | Polymarket + Kalshi contracts for each question |
| Trending topics | 15 | #IranStraitCrisis, #FedRateHold, #TrumpTariffEscalation |
| Named entities | 50 | Iran, Strait of Hormuz, IRGC, Federal Reserve, Trump |

---

## 13. Auth Flow

### Custom JWT Flow

```
Landing Page (unauthenticated)
       │
       ▼
Login Form (email/password)  ─or─  OAuth (Google, GitHub)
       │
       ▼
POST /api/auth/login
       │
       ▼
Response: { accessToken, refreshToken, user }
       │
       ├── accessToken → stored in memory (Zustand authStore)
       ├── refreshToken → stored in httpOnly cookie (or localStorage for mock)
       └── user → stored in authStore
       │
       ▼
AuthGuard checks authStore.isAuthenticated
       │
       ├── true → Render AppShell
       │           │
       │           ├── First login? → OnboardingView (interactive tour)
       │           └── Returning? → HomeView
       │
       └── false → Redirect to /login
```

### Token Refresh

```typescript
// auth.utils.ts
async function refreshAuth(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await apiClient.post('/auth/refresh', { refreshToken });
  authStore.getState().setTokens(response.accessToken, response.refreshToken);
}

// Automatic refresh: intercept 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await refreshAuth();
      return apiClient(error.config);
    }
    throw error;
  }
);
```

### Mock Auth (MVP)

For `DATA_SOURCE_MODE === "mock"`, the mock provider returns a fake JWT and user object immediately. No real backend calls. The auth flow is identical — it just resolves instantly.

```typescript
class MockAuthProvider {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500); // Simulate network
    return {
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'user-1',
        email,
        name: 'Demo User',
        tier: 'pro', // Default to Pro for demo
        onboardingComplete: false,
      },
    };
  }
}
```

---

## 14. Feature Flag System

### Environment Variables

```env
# .env
VITE_DATA_SOURCE_MODE=mock
VITE_ENABLE_GEO_VIEW=false
VITE_ENABLE_DETECT=false
VITE_ENABLE_WHALE_TRACKING=false
VITE_ENABLE_TIMELINE=false
VITE_ENABLE_LIGHT_MODE=true
```

### Zustand Flags Store

```typescript
// state/flagsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FlagsState {
  dataSourceMode: 'mock' | 'rsdip';
  enableGeoView: boolean;
  enableDetect: boolean;
  enableWhaleTracking: boolean;
  enableTimeline: boolean;
  enableLightMode: boolean;
  // Runtime overrides (for dev/demo)
  overrides: Record<string, boolean>;

  isEnabled: (flag: string) => boolean;
  setOverride: (flag: string, value: boolean) => void;
  clearOverrides: () => void;
}

export const useFlagsStore = create<FlagsState>()(
  persist(
    (set, get) => ({
      dataSourceMode: (import.meta.env.VITE_DATA_SOURCE_MODE as 'mock' | 'rsdip') || 'mock',
      enableGeoView: import.meta.env.VITE_ENABLE_GEO_VIEW === 'true',
      enableDetect: import.meta.env.VITE_ENABLE_DETECT === 'true',
      enableWhaleTracking: import.meta.env.VITE_ENABLE_WHALE_TRACKING === 'true',
      enableTimeline: import.meta.env.VITE_ENABLE_TIMELINE === 'true',
      enableLightMode: import.meta.env.VITE_ENABLE_LIGHT_MODE === 'true',
      overrides: {},

      isEnabled: (flag: string) => {
        const state = get();
        if (flag in state.overrides) return state.overrides[flag];
        return (state as any)[flag] ?? false;
      },

      setOverride: (flag, value) =>
        set((s) => ({ overrides: { ...s.overrides, [flag]: value } })),

      clearOverrides: () => set({ overrides: {} }),
    }),
    { name: 'polymatic-flags' }
  )
);
```

### Per-Flag Hook

```typescript
// hooks/useFeatureFlag.ts
export function useFeatureFlag(flag: string): boolean {
  return useFlagsStore((s) => s.isEnabled(flag));
}

// Usage in component
function GeoNavItem() {
  const geoEnabled = useFeatureFlag('enableGeoView');
  if (!geoEnabled) return null;
  return <NavItem icon={Globe} label="Geo" to="/app/geo" />;
}
```

### FeatureGate Component

```typescript
function FeatureGate({ flag, children, fallback }: {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const enabled = useFeatureFlag(flag);
  return enabled ? <>{children}</> : <>{fallback}</> ?? null;
}
```

---

## 15. Build Sequence

### 14 Phases

| Phase | Description | Depends On | Est. Days |
|-------|-------------|------------|-----------|
| **1** | **Project scaffold** — Vite, TypeScript strict, Tailwind v4, ESLint flat config, folder structure, .env | — | 1 |
| **2** | **Theming system** — CSS custom properties, dark + light themes, font loading, `cn()` utility | Phase 1 | 1 |
| **3** | **App shell** — Sidebar, TopBar, RightPanel, layout grid, layout switching (Dashboard/Focus/Clean), 300ms transitions | Phase 2 | 2 |
| **4** | **Base UI components** — Badge, Button, Card, Chip, Input, Tooltip, Timestamp, DataLabel, DeltaIndicator, EmptyState, LoadingSkeleton, ErrorBoundary | Phase 2 | 2 |
| **5** | **Type definitions** — All TypeScript interfaces in `types/`, Zod schemas | Phase 1 | 1 |
| **6** | **State stores** — All 10 Zustand stores, mitt event bus, cross-store wiring | Phase 5 | 2 |
| **7** | **Data abstraction layer** — DataProvider interface, MockProvider stub, TanStack Query setup, query key factory | Phase 5, 6 | 1 |
| **8** | **Mock data generators** — Feed, sentiment, trend, market, alert, geo generators + seed data | Phase 5, 7 | 3 |
| **9** | **Auth flow** — Login/register views, AuthProvider, AuthGuard, mock auth, route protection | Phase 3, 6 | 2 |
| **10** | **Home feed + Trending bar** — TrendingBar, TrendChips, FeedContainer, FeedCards, clustering, virtualization, feed filtering | Phase 4, 6, 8 | 4 |
| **11** | **Sentiments Engine** — SentimentsPanel, QuestionCards, StanceDistribution, SentimentTimeline, KeyVoices, PredictionBrief, AddQuestion, MarketDelta | Phase 4, 6, 8 | 4 |
| **12** | **Markets + Search + Topics** — MarketsPanel, MarketCards, Sparklines, SearchBar, SearchDropdown, TopicPageView | Phase 4, 6, 8 | 3 |
| **13** | **Alerts + Onboarding** — AlertConfig, AlertToasts, NotificationCenter, OnboardingTour, TopicPicker | Phase 6, 9 | 2 |
| **14** | **Polish + Performance + A11y** — Keyboard navigation, ARIA labels, reduced motion, responsive testing, bundle optimization, skeleton screens, error states | Phase 10-13 | 3 |

**Total estimated: ~31 days**

### Dependency Graph

```
Phase 1 (Scaffold)
  ├── Phase 2 (Theming)
  │     ├── Phase 3 (App Shell)
  │     │     └── Phase 9 (Auth)
  │     └── Phase 4 (Base UI)
  │
  └── Phase 5 (Types)
        ├── Phase 6 (Stores)
        │     └── Phase 9 (Auth)
        └── Phase 7 (Data Layer)
              └── Phase 8 (Mock Data)
                    ├── Phase 10 (Home + Trends)
                    ├── Phase 11 (Sentiments)
                    ├── Phase 12 (Markets + Search + Topics)
                    └── Phase 13 (Alerts + Onboarding)

Phase 10-13 → Phase 14 (Polish)
```

---

## 16. Interview Decisions — Binding Constraints

All decisions from the Phase 1 interview are **binding constraints** for implementation. Deviating from these requires explicit approval.

| ID | Domain | Decision | Answer | Implementation Impact |
|----|--------|----------|--------|----------------------|
| 1a | Sentiments | LLM provider | Anthropic Claude + Gemini Pro fallback | Mock confidence follows Claude-style calibration (well-calibrated, β distribution centered on 0.7-0.9) |
| 1b | Sentiments | Classification delivery | Batch every 5-10s | TanStack Query refetch at 10s interval. No streaming ticker. Batch arrival animation. |
| 1c | Sentiments | Scoring model | Weighted ratio: YES/(YES+NO) | `sentiments.utils.ts` implements weighted ratio formula, not Bayesian |
| 1d | Sentiments | Confidence visual | Opacity + label | Low=60% opacity + outline badge, Med=85% + filled, High=100% + filled + glow |
| 1e | Sentiments | Tweet visibility | Tiered by plan | Free: aggregates only. Pro: 5 key voices per stance. Quant: full drill-down. |
| 1f | Sentiments | Free tier | Browse top 10, track 3 | Show top 10 questions with read-only cards. "Track" button on 3 max. Upsell on track limit. |
| 1g | Sentiments | Add Question | Trending suggestions first | Show trending-linked questions as suggestions. Fallback to search. |
| 1h | Sentiments | Prediction summary | Clean summary card | Modern card with structured sections, sans-serif text. See Section 5 spec. |
| 2a | Trends | Chip count | 10-12 visible | ~220px per chip on 1440px viewport. Horizontal overflow scroll. |
| 2b | Trends | Chip density | All data visible | Two-line chip: hashtag + velocity + market badge on line 1, lifecycle + events on line 2. |
| 2c | Trends | Lifecycle animation | Badge transition | 200ms glow pulse on lifecycle change via framer-motion. |
| 2d | Trends | No linked markets | Show related markets | Fallback: show semantically similar markets. Never empty panel. |
| 2e | Feed | For You ranking | 70% velocity + 30% recency | Blended sort: `score = 0.7 * velocity_norm + 0.3 * recency_norm` |
| 2f | Topics | Layout | Multi-panel dashboard | Dashboard layout scoped to topic, not single-column article. |
| 3a | Search | Autocomplete | 2 characters | 200ms debounce after ≥2 chars typed. |
| 3b | Search | Results ranking | Fixed order | Sections: Trends → Markets → Sentiments → Events. Always in this order. |
| 3c | Search | Behavior | Dropdown overlay | Absolute-positioned overlay below search bar. Not a page navigation. |
| 4a | Feed | Card density | Mixed (signal-based) | High-signal events get expanded cards. Low-signal get compact. Signal = severity + velocity + market-linked. |
| 4b | Feed | Media | Auto-expand images | Images render inline. Videos show thumbnail + play button. |
| 4c | Feed | Clustering | Lead + expandable | Lead card visible. "N more from this story" toggle. Expand in-place. |
| 4d | Feed | Virtualization | 50 items, react-virtuoso | react-virtuoso with 50-item overscan. Variable-height rows. |
| 5a | Markets | Card design | Full cards + sparkline | Multi-line cards with 24h sparkline chart. Not compact list rows. |
| 5b | Markets | Cross-platform | Primary + delta | Show primary platform price + delta from secondary. Platform badges. |
| 5c | Markets | Sentiment delta | Number + arrow | "+12.4%" in green with ▲ arrow. Bloomberg-style. |
| 6a | Geo | Renderer | CesiumJS from day one | Install CesiumJS/resium in Phase 1. Build Geo route behind feature flag. |
| 6b | Geo | Detail level | Hybrid | Stylized at zoom-out (vector tiles), satellite imagery at city-level. |
| 6c | Geo | Motion data | Animated trails | Full animated polyline trails for ADS-B/AIS. GPU-accelerated. |
| 7a | Layout | Right panel | Always visible (30%) | CSS grid: `sidebar | main | right-panel(30%)`. Persistent. |
| 7b | Layout | Sidebar | Auto-collapse on narrow | Collapse to icons at viewport < 1280px. Expand on hover. |
| 7c | Layout | Switching | Animated 300ms ease | `framer-motion` layout animations. CSS `transition: var(--transition-layout)`. |
| 7d | Layout | Min viewport | 1024px | Breakpoints: 1024-1279 (tablet), 1280+ (desktop). No mobile. |
| 7e | Theme | Mode | Dark + light toggle | Both themes defined. Toggle in sidebar footer. Persist via localStorage. |
| 8a | Performance | Device target | Wide range incl. low-end | Aggressive optimization: virtualize everything, lazy load layers, batch WS. |
| 8b | Performance | WS volume | Variable (design for spikes) | 100ms batch window. Spike mode at 50+ buffered: 250ms batch, drop low-severity. |
| 8c | Performance | Virtualization | react-virtuoso | Variable-height support. Auto-sizing. Used for feed, markets, timelines. |
| 9a | Auth | Provider | Custom JWT | FastAPI backend auth. Mock provider for `DATA_SOURCE_MODE=mock`. |
| 9b | Auth | Unauth access | Landing page only | No app access without login. Landing page is marketing + login CTA. |
| 9c | Auth | Onboarding | Interactive tour | Step-by-step overlay: pick topics → track first question → configure alert. |
| 10a | Hosting | Target | Vercel | Vite + Vercel. Automatic preview deploys. Edge functions if needed. |
| 10b | Flags | System | Env vars + Zustand | `VITE_*` env vars + Zustand persist store with runtime overrides. |
| 11a | Brand | Name | PolyMatic | Not WORLDVIEW. All branding, copy, and assets use PolyMatic. |
| 11b | Design | Aesthetic | Minimal modern SaaS | Monospace reserved for numerical data only (prices, %, timestamps). Clean sans-serif (Inter) everywhere else. No ALL CAPS headers. |
| 11c | Search | Ranking order | Fixed, sectioned | Trends → Markets → Sentiments → Events. Max 3-5 items per section. |

---

*End of Implementation Plan*
