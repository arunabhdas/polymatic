# PolyMatic — Task Breakdown

**Version:** 1.0
**Date:** March 3, 2026
**Format:** Epic → Story → Task
**Total:** 16 Epics · ~45 Stories · ~200+ Tasks

---

## Task ID Convention

```
E{epic}-S{story}-T{task}
Example: E01-S02-T03 = Epic 1, Story 2, Task 3
```

## Priority Legend

- **P0** = Must ship (MVP). Epics 1–10.
- **P1** = Ship if time permits. Epics 11–15.
- **P0/Polish** = Final pass. Epic 16.

## Status Legend

- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Complete
- `[—]` = Blocked

---

# Epic 1: Foundation (P0)

> Scaffold, theming, layout shell, routing, and base UI components.
> **Depends on:** Nothing. This is the starting point.
> **Blocks:** Everything else.

## Story 1.1: Project Scaffold

> Initialize the Vite + React + TypeScript project with all tooling.

- [✅] **E01-S01-T01** — Initialize Vite project with React + TypeScript template. Configure `tsconfig.json` with strict mode, no implicit any, strict null checks.
- [✅] **E01-S01-T02** — Install and configure Tailwind CSS v4. Set up `tailwind.config.ts` with custom colors, fonts, and spacing scale matching the design system.
- [✅] **E01-S01-T03** — Install and configure ESLint 9 (flat config) with TypeScript, React, and import-order rules. Set up Prettier. Add `.editorconfig`.
- [✅] **E01-S01-T04** — Create the full folder structure: `src/app/`, `src/views/`, `src/feed/`, `src/trends/`, `src/sentiments/`, `src/search/`, `src/markets/`, `src/topic/`, `src/alerts/`, `src/geo/`, `src/auth/`, `src/onboarding/`, `src/state/`, `src/services/`, `src/mock-data/`, `src/hooks/`, `src/components/`, `src/types/`, `src/lib/`, `src/styles/`.
- [✅] **E01-S01-T05** — Create `.env` and `.env.example` with all `VITE_*` feature flag variables. Configure Vite env type declarations in `vite-env.d.ts`.
- [✅] **E01-S01-T06** — Install core dependencies: `zustand`, `@tanstack/react-query`, `react-router-dom`, `framer-motion`, `react-virtuoso`, `recharts`, `lucide-react`, `@radix-ui/react-*` (dialog, dropdown, tooltip, tabs), `clsx`, `tailwind-merge`, `date-fns`, `zod`, `nanoid`, `mitt`.
- [✅] **E01-S01-T07** — Install dev dependencies: `vitest`, `@testing-library/react`, `msw`, `@types/react`, `@types/react-dom`.
- [✅] **E01-S01-T08** — Install CesiumJS dependencies: `cesium`, `resium`. Configure Vite for CesiumJS static asset copying (workers, assets). Set up `public/cesium/` directory.
- [✅] **E01-S01-T09** — Set up Vitest config with React Testing Library. Create a sample test to verify the test pipeline works.

## Story 1.2: Theming System

> CSS custom properties for dark/light themes, fonts, and modern typography system.

- [✅] **E01-S02-T01** — Create `src/styles/globals.css` with all CSS custom properties: colors (bg, accent, text, semantic, sentiment, delta, category), layout dimensions (sidebar, right panel, topbar, trending bar), typography (font stacks), and animation durations.
- [✅] **E01-S02-T02** — Create `src/styles/themes/dark.css` with dark theme variable overrides. This is the default theme.
- [✅] **E01-S02-T03** — Create `src/styles/themes/light.css` with light theme variable overrides. Adjusted accent colors for contrast on light backgrounds.
- [✅] **E01-S02-T04** — Create `src/styles/fonts.css` with `@font-face` declarations for Inter (sans-serif) and JetBrains Mono (monospace). Set up font loading strategy (preload critical weights).
- [✅] **E01-S02-T05** — Create `src/lib/cn.ts` — utility function combining `clsx` and `tailwind-merge` for conditional class composition.
- [✅] **E01-S02-T06** — Implement theme toggling: apply `data-theme="dark|light"` attribute on `<html>`. Persist preference in localStorage. Wire to `uiStore.theme`.

## Story 1.3: App Shell & Layout

> Sidebar, top bar, right panel, and the 3-column layout grid with animated layout switching.

- [✅] **E01-S03-T01** — Create `AppShell.tsx` — the 3-column CSS grid layout: sidebar | main content | right panel. Grid columns: `var(--sidebar-width) 1fr var(--right-panel-width)`. Apply `framer-motion` layout animation for Dashboard/Focus/Clean mode switching.
- [✅] **E01-S03-T02** — Create `Sidebar.tsx` — Left navigation panel with logo, nav items (Home, Sentiments, Geo, Markets, separator, POI, Layers, Scenes, Filters, separator, Alerts), layout switcher, and user menu. Auto-collapse to icon-only when viewport < 1280px. Expand on hover when collapsed.
- [✅] **E01-S03-T03** — Create `TopBar.tsx` — Fixed top bar (56px height) spanning main content + right panel. Contains the `SearchBar` component placeholder.
- [✅] **E01-S03-T04** — Create `RightPanel.tsx` — Persistent right panel (30% width). Renders dynamic content based on `uiStore.rightPanelContent`. Default: contextual help or trending summary. Shows EmptyState when nothing selected.
- [✅] **E01-S03-T05** — Create `LayoutSwitcher.tsx` — Dropdown or toggle in sidebar footer. Switches between Dashboard (all panels), Focus (icon sidebar, minimal chrome), and Clean (feed only, no sidebar/panel). Animated transitions with `var(--transition-layout)` (300ms ease).
- [✅] **E01-S03-T06** — Create `NotificationCenter.tsx` — Toast container (bottom-right) for alert notifications. Tray/bell icon in sidebar for notification list. Unread badge count.
- [✅] **E01-S03-T07** — Implement responsive breakpoints: 1024-1279px (tablet: sidebar collapsed, right panel overlay), 1280px+ (desktop: full layout). Test layout at both breakpoints.

## Story 1.4: Routing

> React Router setup with lazy loading, code splitting, and auth guard.

- [✅] **E01-S04-T01** — Set up `react-router-dom` with the full route map. Public routes: `/` (landing), `/login`, `/register`. Protected routes under `/app/*`: home, sentiments, sentiments/:id, markets, markets/:id, topic/:id, search, alerts, onboarding. Feature-gated: geo.
- [✅] **E01-S04-T02** — Implement `React.lazy()` for all view components. Wrap route outlet in `<Suspense>` with a loading skeleton that matches the target view layout.
- [✅] **E01-S04-T03** — Create `AuthGuard.tsx` — Route protection component. Checks `authStore.isAuthenticated`. Redirects to `/login` if not authenticated. Redirects to `/app/onboarding` if `user.onboardingComplete === false`.
- [✅] **E01-S04-T04** — Create `FeatureGate.tsx` — Component that conditionally renders children based on feature flag state. Used to gate Geo route and other P1 features.

## Story 1.5: Base UI Components

> Shared atoms used throughout the application.

- [✅] **E01-S05-T01** — Create `Badge.tsx` — Renders colored badges with variants: severity (green/yellow/red), category (geopolitics/economics/tech/sports/culture), source (Twitter/Reddit/Telegram/News), and custom.
- [✅] **E01-S05-T02** — Create `Button.tsx` — Button with variants: primary (cyan), secondary (outline), ghost (transparent), danger (red). Sizes: sm, md, lg. Loading state with spinner.
- [✅] **E01-S05-T03** — Create `Card.tsx` — Base card with dark background (`var(--color-bg-card)`), subtle border, hover state. Variants: default, interactive (clickable with hover lift), selected (accent border).
- [✅] **E01-S05-T04** — Create `Chip.tsx` — Small tag/chip for entity tags, filter pills, trend hashtags. Category-colored. Removable variant with ✕ button.
- [✅] **E01-S05-T05** — Create `Input.tsx` — Text input with search variant (magnifying glass icon, clear button). Dark background, accent focus ring. Sizes: sm, md.
- [✅] **E01-S05-T06** — Create `Timestamp.tsx` — Smart timestamp component. Shows relative time for recent events ("2m ago", "1h ago"), absolute for older ("Mar 2, 14:23 UTC"). Always shows UTC. Monospace font for numerical values only.
- [✅] **E01-S05-T07** — Create `DataLabel.tsx` — Clean label component for section headers and metadata. Uses Inter (sans-serif) in sentence case with medium weight. Monospace variant available for numerical data only. No ALL CAPS, no letter-spacing treatment.
- [✅] **E01-S05-T08** — Create `DeltaIndicator.tsx` — Shows "+12.4%" or "-5.2%" with directional arrow (▲/▼) and color (green positive, red negative). Bloomberg-style number rendering.
- [✅] **E01-S05-T09** — Create `ProbabilityDisplay.tsx` — Renders "73%" with size variants and directional color. Used for both market probability and sentiment probability.
- [✅] **E01-S05-T10** — Create `ConfidenceBadge.tsx` — Renders Low/Med/High confidence with opacity treatment (60%/85%/100%) and label. Outline badge for Low, filled for Med/High.
- [✅] **E01-S05-T11** — Create `VelocityIndicator.tsx` — Arrow + percentage for trend velocity. Green up arrow for accelerating, red down for decelerating, gray for stable.
- [✅] **E01-S05-T12** — Create `Sparkline.tsx` — Tiny inline chart (Recharts-based). Shows 24h price history or velocity curve. No axes, no labels — just the line.
- [✅] **E01-S05-T13** — Create `SeverityDot.tsx` — Color-coded dot for severity levels: green (0-33), yellow (34-66), red (67-100).
- [✅] **E01-S05-T14** — Create `EmptyState.tsx` — Contextual empty state with icon, primary text (actionable), and optional CTA button. No cute emoji. Professional copy.
- [✅] **E01-S05-T15** — Create `LoadingSkeleton.tsx` — Animated pulse skeleton that matches the layout of the component it's replacing. Variants: card, list-row, chart, text-block.
- [✅] **E01-S05-T16** — Create `ErrorBoundary.tsx` — React error boundary with helpful error display: what happened, retry button, report link. Catches and logs errors.
- [✅] **E01-S05-T17** — Create `Tooltip.tsx` — Radix-based tooltip. Only used when adding information the label doesn't already convey. Dark card style.
- [✅] **E01-S05-T18** — Create `Tabs.tsx` — Radix-based tab container. Underline style active indicator. Used in Topic Pages and settings.
- [✅] **E01-S05-T19** — Create `Toggle.tsx` — Toggle switch for boolean settings (theme, filters). Accessible with keyboard and screen reader.

---

# Epic 2: Mock Data Engine (P0)

> Type definitions, DataProvider interface, seed data, generators, and TanStack Query integration.
> **Depends on:** Epic 1 (scaffold, types folder, stores).
> **Blocks:** Epics 3–10 (all feature UIs).

## Story 2.1: Type Definitions

> All TypeScript interfaces matching future RSDIP contracts.

- [✅] **E02-S01-T01** — Create `types/common.types.ts` — Shared types: `Timestamp`, `Entity` (name, type, id), `Severity` (0-100), `SourceType` (twitter, reddit, telegram, news, structured, market_signal), `Pagination`, `SortOrder`.
- [✅] **E02-S01-T02** — Create `types/feed.types.ts` — `FeedItem` (id, source, content, timestamp, entities, trendIds, sentimentStance, marketCorrelation, geoCoords, media, severity, clusterId), `FeedCluster`, `FeedFilters`, `FeedParams`.
- [✅] **E02-S01-T03** — Create `types/sentiment.types.ts` — `SentimentQuestion` (id, questionText, marketProbability, sentimentProbability, marketDelta, confidenceLevel, sentimentDirection, tweetVolume, stanceBreakdown, linkedTrendIds, linkedMarketIds), `ClassifiedTweet`, `StanceType`, `AggregateScore`, `SentimentDetail`, `PredictionBrief`.
- [✅] **E02-S01-T04** — Create `types/trend.types.ts` — `Trend` (id, hashtag, category, lifecycle, velocity, velocityDelta, eventCount, linkedMarketIds, topEntities, createdAt, updatedAt), `TrendLifecycle`, `TrendCategory`, `VelocityScore`.
- [✅] **E02-S01-T05** — Create `types/market.types.ts` — `MarketContract` (id, questionText, platform, probability, probability24hAgo, change24h, volume, sentimentDelta, linkedTrendIds, priceHistory, category), `Platform`, `PricePoint`, `MarketFilters`.
- [✅] **E02-S01-T06** — Create `types/search.types.ts` — `SearchQuery`, `SearchResults` (trends, markets, sentiments, events — each as typed arrays), `SearchOptions`, `SavedSearch`.
- [✅] **E02-S01-T07** — Create `types/alert.types.ts` — `AlertConfig` (id, type, targetId, threshold, channel, enabled), `Alert` (id, configId, triggeredAt, message, severity, read), `AlertType` enum.
- [✅] **E02-S01-T08** — Create `types/geo.types.ts` — `GeoEvent`, `Layer`, `LayerType`, `POI` (id, name, severity, velocity, eventCount, linkedMarkets, linkedTrends, centroid), `MotionTrack`, `CameraPosition`, `GeoBounds`, `GeoRegion`.
- [✅] **E02-S01-T09** — Create `types/auth.types.ts` — `User` (id, email, name, tier, onboardingComplete, preferences), `UserTier`, `AuthState`, `LoginCredentials`, `AuthResponse`.
- [✅] **E02-S01-T10** — Create `types/api.types.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `ErrorResponse`, `WSMessage`, `WSMessageType`.

## Story 2.2: DataProvider Interface

> Abstract data layer with mock/rsdip resolution.

- [✅] **E02-S02-T01** — Create `services/dataProvider.ts` — Define the `DataProvider` interface with all method signatures for feed, sentiments, trends, markets, search, alerts, auth, and geo. Create the factory function that resolves mock vs rsdip based on `flagsStore.dataSourceMode`.
- [✅] **E02-S02-T02** — Create `services/queryKeys.ts` — TanStack Query key factory with namespaced keys for all data domains: feed, sentiments, trends, markets, search.
- [✅] **E02-S02-T03** — Create `services/apiClient.ts` — HTTP client wrapper (fetch-based). Includes auth token injection, 401 refresh interceptor, error normalization. Used by rsdipProvider (future) and mockProvider (for simulated latency).
- [✅] **E02-S02-T04** — Create `services/wsClient.ts` — WebSocket client class with auto-reconnect (exponential backoff: 1s→2s→4s→8s→30s), message batching (100ms flush interval), spike detection (>50 buffered → 250ms batch + drop low-severity), and typed message dispatch.
- [✅] **E02-S02-T05** — Create `services/rsdipProvider.ts` — Stub implementation of `DataProvider` for future RSDIP backend. Each method throws "Not implemented — switch DATA_SOURCE_MODE to mock". Ensures the interface is properly typed.

## Story 2.3: Seed Data

> Pre-defined realistic seed data for compelling demos.

- [✅] **E02-S03-T01** — Create `mock-data/seed/questions.ts` — 20 seed prediction market questions spanning geopolitics, economics, technology, sports. Each has: question text, category, current market probability, correct answer (for historical accuracy tracking). Examples: "Will Iran close the Strait of Hormuz before July 2026?", "Will the Fed cut rates in Q2 2026?", "Will Trump impose >25% tariffs on EU goods?".
- [✅] **E02-S03-T02** — Create `mock-data/seed/accounts.ts` — 30 seed Twitter/X accounts with display name, handle, avatar placeholder, credibility score (0-1), follower count, domain expertise tags. Include real OSINT account names: @AuroraIntel, @BNONews, @sentdefender, @bellingcat, @IntelDoge, @NOELreports, etc.
- [✅] **E02-S03-T03** — Create `mock-data/seed/markets.ts` — 25 seed market contracts (some Polymarket, some Kalshi). Linked to seed questions. Include: current probability, 24h change, volume, platform, category.
- [✅] **E02-S03-T04** — Create `mock-data/seed/trends.ts` — 15 seed trending topics with hashtag, category, lifecycle state, velocity, linked market IDs, and top entities. Mix of lifecycles: 3 emerging, 5 trending, 4 peaking, 3 cooling.
- [✅] **E02-S03-T05** — Create `mock-data/seed/entities.ts` — 50 seed named entities with name, type (person/org/country/location), and linked trend/market IDs. Examples: Iran, Strait of Hormuz, IRGC, Federal Reserve, Jerome Powell, Trump, Polymarket.

## Story 2.4: Mock Data Generators

> Dynamic generators that produce realistic, time-varying data.

- [✅] **E02-S04-T01** — Create `mock-data/generators/feedGenerator.ts` — Generates `FeedItem` objects. Simulates bursty arrival: base rate 2/sec, burst rate 20/sec during breaking events (5% burst probability, 30s burst windows). Each item: random source type, random seed account, generated content text, random entity tags from seed, linked to active trends, sentiment stance if relevant to tracked question.
- [✅] **E02-S04-T02** — Create `mock-data/generators/sentimentGenerator.ts` — Generates classified tweet batches every 5-10s. Each question has a "true sentiment" (0-100) that drifts over time via Brownian motion with mean reversion. Generated tweets have stance distribution matching true sentiment + noise. Confidence scores follow beta distribution (Claude-style calibration). Account credibility from seed data.
- [✅] **E02-S04-T03** — Create `mock-data/generators/trendGenerator.ts` — Manages trend lifecycle curves. Velocity follows sigmoid: slow start → rapid growth → plateau → decay. Lifecycle transitions at velocity thresholds. Small chance (2%) of re-acceleration from cooling to emerging. Generates new trends periodically (1 every 5 minutes) and retires old ones.
- [✅] **E02-S04-T04** — Create `mock-data/generators/marketGenerator.ts` — Generates price random walks for each market contract. Brownian motion with mean-reversion to true probability. Occasional jumps (±5-15%) correlated with trend spikes. Cross-platform spread: secondary platform = primary ± uniform(-3, 3)%. Generates 24h price history for sparklines.
- [✅] **E02-S04-T05** — Create `mock-data/generators/alertGenerator.ts` — Evaluates alert configs against mock data streams. Triggers alerts when: sentiment reversal on watched question, trend velocity crosses threshold, market delta exceeds configured %, POI severity threshold crossed. Generates `Alert` objects with timestamp, message, and severity.
- [✅] **E02-S04-T06** — Create `mock-data/generators/geoGenerator.ts` — Generates geospatial events with realistic coordinates. ADS-B: flight paths with waypoints and altitude. AIS: vessel tracks with heading. Conflict incidents: random coordinates within active conflict zones. Earthquakes: random magnitude/depth. Each event linked to seed entities and trends where relevant.

## Story 2.5: Query Hooks & Mock Provider

> TanStack Query hooks that consume the DataProvider.

- [✅] **E02-S05-T01** — Create `services/mockProvider.ts` — Full `DataProvider` implementation using the generators. Each method returns realistic data with simulated latency (200-500ms). Subscribe methods use setInterval for periodic updates.
- [✅] **E02-S05-T02** — Create `mock-data/index.ts` — Mock data orchestrator. Initializes all generators with seed data. Exposes a singleton `MockEngine` that ticks generators on an interval. Coordinates cross-domain correlations (trend spike → market jump → sentiment shift).
- [✅] **E02-S05-T03** — Create `hooks/useFeed.ts` — TanStack Query hook for feed data. Accepts `FeedFilters`. Refetches on filter change. Supports infinite scroll pagination.
- [✅] **E02-S05-T04** — Create `hooks/useSentiments.ts` — Hooks: `useSentimentQuestions()` (list), `useSentimentDetail(id)` (single with tweet breakdown), `useTrackQuestion()` (mutation). Refetch interval: 10s.
- [✅] **E02-S05-T05** — Create `hooks/useTrends.ts` — Hook: `useTrends()` with refetch interval matching trend tick rate. Returns sorted trends (velocity descending).
- [✅] **E02-S05-T06** — Create `hooks/useMarkets.ts` — Hook: `useMarkets(filters)` with refetch interval. `useMarketDetail(id)` for expanded view with price history.
- [✅] **E02-S05-T07** — Create `hooks/useSearch.ts` — Hook: `useSearch(query)` with 200ms debounce. Only fires when query length ≥ 2. Returns `SearchResults` in fixed section order.
- [✅] **E02-S05-T08** — Create `hooks/useAlerts.ts` — Hooks: `useAlertConfigs()`, `useActiveAlerts()`, `useCreateAlert()` (mutation), `useDismissAlert()` (mutation).

---

# Epic 3: Home Feed (P0)

> Feed view, event cards, clustering, trending bar integration, and virtualization.
> **Depends on:** Epic 1 (shell, UI components), Epic 2 (types, mock data, hooks).
> **Blocks:** None directly (parallel with Epics 4-6).

## Story 3.1: Trending Bar

> Horizontal scrolling chip bar with all trend data visible.

- [✅] **E03-S01-T01** — Create `TrendingBar.tsx` — Horizontal scrolling container (64px height). Renders 10-12 `TrendChip` components. Overflow: horizontal scroll with momentum. Left/right scroll buttons on hover at edges. Consumes `useTrends()` hook.
- [✅] **E03-S01-T02** — Create `TrendChip.tsx` — Two-line chip (~220px wide). Line 1: category color dot, hashtag label, velocity arrow+%, market badge icon (if linked). Line 2: lifecycle label, event count. Click handler: `trendsStore.selectTrend(id)`. Selected state: accent border + background highlight.
- [✅] **E03-S01-T03** — Create `TrendLifecycleBadge.tsx` — Small badge showing lifecycle state: Emerging (pulsing outline), Trending (filled), Peaking (filled + glow), Cooling (faded). Animate transitions between states with 200ms glow pulse via framer-motion.
- [✅] **E03-S01-T04** — Implement "View All Trends" button at the end of the bar. Opens a full trending dashboard in the right panel or as a modal with: all trends listed, historical velocity charts per trend, lifecycle stage indicators, and drill-down to topic pages.

## Story 3.2: Feed Container & Cards

> Virtualized feed with mixed-density cards and media auto-expansion.

- [✅] **E03-S02-T01** — Create `FeedContainer.tsx` — Wraps `react-virtuoso` `<Virtuoso>` component. Passes `useFeed()` data. Handles variable-height rows. Overscan: 50 items. Shows `FeedSkeleton` during initial load. Infinite scroll: loads more items at bottom.
- [✅] **E03-S02-T02** — Create `FeedCard.tsx` — Base event card. Renders: source icon + channel name, `Timestamp`, content body, entity tag `Chip[]`, trend hashtag `Badge[]`, sentiment stance `Badge` (if relevant), market correlation `Badge`, geo coordinate `DataLabel`. Implements signal-based density: high-signal events (severity > 70, market-linked, or velocity > threshold) render as expanded. Others render as compact.
- [✅] **E03-S02-T03** — Create `FeedCardCompact.tsx` — Compact variant (~80px). Shows: source icon, title/first line of content, timestamp, key badges (severity, trend). No media, no body text.
- [✅] **E03-S02-T04** — Create `FeedCardExpanded.tsx` — Expanded variant (~200px+). Shows: full content body, auto-expanded images (inline), video thumbnails with play icon, all badges, all entity chips. Action buttons: pin to watchlist, open in Geo, expand detail (→ right panel), share.
- [✅] **E03-S02-T05** — Create `FeedSkeleton.tsx` — Loading skeleton for the feed. Renders 5-7 skeleton cards matching the mixed-density layout. Animated pulse.
- [✅] **E03-S02-T06** — Create `FeedFilters.tsx` — Filter bar above feed or in sidebar. Source type toggles, severity threshold slider, category filter dropdown. Updates `feedStore` filters, which triggers TanStack Query refetch.

## Story 3.3: Event Clustering

> Lead card + "N more from this story" expandable clusters.

- [✅] **E03-S03-T01** — Create `FeedCluster.tsx` — Renders the lead card (highest signal in cluster) followed by a "N more from this story" toggle. Toggle expands to show remaining cluster items inline. Collapse animation via framer-motion.
- [✅] **E03-S03-T02** — Implement clustering logic in `feed.utils.ts` — Group feed items by `clusterId`. Sort each cluster by signal score (severity * velocity * market-linkage). Lead card = highest score. Apply clustering to feed before rendering.
- [✅] **E03-S03-T03** — Wire trend selection to feed filtering: when `trendsStore.selectedTrendId` changes, `feedStore.activeTrendFilter` updates, TanStack Query refetches with trend filter, feed re-renders showing only items in that cluster. "All Trends" deselection shows the blended "For You" feed (70% velocity + 30% recency ranking).

---

# Epic 4: Trending Bar (P0)

> Deep-linked from Epic 3 but with its own view-all and topic page navigation.
> **Depends on:** Epic 1, Epic 2.

## Story 4.1: View All Trends Dashboard

> Full trending topics view accessible from the trending bar.

- [✅] **E04-S01-T01** — Create `ViewAllTrends.tsx` — Full-page or right-panel view showing all active trends in a sortable list. Columns: hashtag, category, lifecycle, velocity (with sparkline), event count (24h), linked market count. Sortable by each column.
- [✅] **E04-S01-T02** — Add historical velocity mini-chart (Recharts sparkline) for each trend in the view-all list. Shows 24h velocity curve. Color matches lifecycle state.
- [✅] **E04-S01-T03** — Implement lifecycle filter in ViewAllTrends: toggle to show only Emerging, Trending, Peaking, or Cooling. Default: show all.

## Story 4.2: Trend ↔ Markets Linking

> Handle trends with and without linked markets.

- [✅] **E04-S02-T01** — When user clicks a trend with linked markets: filter Markets panel to show only correlated contracts. Display market cards with sentiment delta.
- [✅] **E04-S02-T02** — When user clicks a trend with NO linked markets: show "Related Markets" fallback section with semantically similar markets. Calculate similarity using shared entities. Never show empty panel.
- [✅] **E04-S02-T03** — Add market-linked badge (📊 icon) to trend chips. Tooltip on hover shows linked market count and top market question.

## Story 4.3: Trend Chip Interactions

> Hover, selection, and real-time update behavior.

- [✅] **E04-S03-T01** — Implement chip selection state: selected chip gets accent border, slightly lighter background. Only one chip selected at a time. Click again to deselect (returns to "For You" feed).
- [✅] **E04-S03-T02** — Implement real-time chip updates: when `trendsStore.trends` updates (via polling/WS), chip order may change (velocity re-sort). Animate position changes with framer-motion `layoutId`.
- [✅] **E04-S03-T03** — Implement new trend arrival animation: when a new trend enters the bar, it slides in from the left with a brief highlight pulse (300ms).

---

# Epic 5: Sentiments Engine (P0)

> The core intelligence feature: question tracking, stance visualization, predictions.
> **Depends on:** Epic 1, Epic 2.
> **This is the highest-priority feature after foundation.**

## Story 5.1: Sentiments Panel

> Main view listing tracked prediction questions.

- [✅] **E05-S01-T01** — Create `SentimentsPanel.tsx` — Scrollable list of `QuestionCard` components. Sort controls at top: Market Δ (default), Velocity, Volume, Watchlist. Consumes `useSentimentQuestions()` hook.
- [✅] **E05-S01-T02** — Create `QuestionCard.tsx` — Collapsed card showing: market question text (truncated to 2 lines), `ProbabilityDisplay` for market price, `ProbabilityDisplay` for sentiment probability, `MarketDeltaBadge`, `ConfidenceBadge` (with opacity treatment), `DeltaIndicator` for sentiment direction. Click to expand.
- [✅] **E05-S01-T03** — Create `MarketDeltaBadge.tsx` — Shows the difference between sentiment and market probability. Color-coded: green if gap > 10% (underpricing signal), amber if 5-10%, red if < -10% (overpricing). Format: "+23%" with arrow.
- [✅] **E05-S01-T04** — Implement sort behavior: when sort changes, list re-orders with framer-motion `layoutId` animation. Largest delta/velocity/volume surfaces to top.

## Story 5.2: Expanded Question Card

> Full sentiment breakdown visible on card expansion.

- [✅] **E05-S02-T01** — Create `QuestionCardExpanded.tsx` — Expands below the collapsed card with animation. Contains: StanceDistribution, SentimentTimeline, KeyVoices, PredictionBrief. Collapse on click or new selection.
- [✅] **E05-S02-T02** — Create `StanceDistribution.tsx` — Horizontal bar chart (or pie chart) showing percentage breakdown: Supports YES (green), Supports NO (red), Neutral (gray). Labels with counts: "YES: 342 (54%) · NO: 218 (35%) · NEUTRAL: 68 (11%)". Recharts-based.
- [✅] **E05-S02-T03** — Create `SentimentTimeline.tsx` — 24h line chart showing confidence-weighted sentiment probability over time. X-axis: time (24h). Y-axis: 0-100%. Line color: accent cyan. Shaded area for confidence band. Recharts-based.

## Story 5.3: Key Voices & Tweets

> Influential accounts driving sentiment, tiered by plan.

- [✅] **E05-S03-T01** — Create `KeyVoices.tsx` — Shows the most influential accounts per stance. Two columns: "Driving YES" and "Driving NO". Each entry: avatar, display name, handle, credibility badge, representative tweet text. Max 5 per stance (Pro tier). Free tier: show aggregate count only. Quant tier: "View all N tweets" link.
- [✅] **E05-S03-T02** — Implement tier gating in KeyVoices: check `authStore.tier`. Free → show message "Upgrade to Pro to see key voices". Pro → show 5 per stance. Quant → show all + "Export" button.
- [✅] **E05-S03-T03** — Style individual tweet entries: dark card, source icon, handle in mono, tweet text, engagement metrics (likes, retweets), stance badge (YES/NO color), confidence score.

## Story 5.4: AI Prediction Brief

> Clean intelligence summary card.

- [✅] **E05-S04-T01** — Create `PredictionBrief.tsx` — Clean intelligence summary card with structured sections. Renders: section header ("Sentiment Analysis"), assessment paragraph, confidence assessment, market delta + signal, historical accuracy callout, caveat, timestamp. Uses Inter sans-serif, monospace only for numerical values. See IMPLEMENTATION-PLAN.md Section 5 for exact spec.
- [✅] **E05-S04-T02** — Style the prediction brief: Inter sans-serif for all text, monospace only for numerical values (percentages, deltas). Card with subtle left border accent in cyan, rounded corners consistent with the design system. Section headers in medium-weight Inter, sentence case. Clean, modern SaaS card styling.
- [✅] **E05-S04-T03** — Implement tier gating: Free → hidden with "Upgrade to see AI analysis" upsell. Pro/Quant → visible.

## Story 5.5: Add Question Flow

> Trending suggestions first, then search.

- [✅] **E05-S05-T01** — Create `AddQuestionFlow.tsx` — "Add Question" button at bottom of sentiments panel. Opens a flow: Step 1: show trending-linked questions as suggestions (questions linked to currently trending topics). Step 2: if user doesn't find what they want, show search input to find any market question.
- [✅] **E05-S05-T02** — Implement the suggestion list: query mock data for questions linked to trending topics that the user isn't already tracking. Show question text, market probability, trend hashtag badge. Click to track.
- [✅] **E05-S05-T03** — Implement search fallback: text input with autocomplete against all market questions. 200ms debounce. Results show question text + platform + probability. Click to track.
- [✅] **E05-S05-T04** — Implement free tier limit: when user has 3 tracked questions, "Add Question" button shows "Upgrade to track more" instead. Disable tracking action. Show upsell.

## Story 5.6: Sentiment in Other Views

> Surface sentiment data throughout the app.

- [✅] **E05-S06-T01** — Add sentiment stance badges to `FeedCard` when a feed item is relevant to a tracked prediction question. Show stance (YES/NO/Neutral) color dot + aggregate sentiment percentage.
- [~] **E05-S06-T02** — Add sentiment delta indicator to `MarketCard` in the Markets panel. Show sentiment probability alongside market probability with delta badge. *(Deferred: MarketCard not yet built — will be implemented in Epic 8.)*
- [~] **E05-S06-T03** — Create sentiment summary section for Topic Pages (consumed by `TopicSentiment.tsx`). Show aggregate sentiment for all linked prediction questions. *(Deferred: TopicPages not yet built — will be implemented in Epic 7.)*

---

# Epic 6: Search (P0)

> Global search with 2-char autocomplete, dropdown overlay, and fixed-order sections.
> **Depends on:** Epic 1, Epic 2.

## Story 6.1: Search Bar

> Always-visible search input in the top bar.

- [ ] **E06-S01-T01** — Create `SearchBar.tsx` — Text input in `TopBar`. Placeholder: "Search topics, markets, entities...". Triggers search on ≥2 characters with 200ms debounce. `Escape` clears and closes. `Cmd+K` / `Ctrl+K` shortcut to focus.
- [ ] **E06-S01-T02** — Wire search bar to `searchStore`: update query, open/close dropdown. Handle recent searches: show last 5 searches when input is focused and empty.
- [ ] **E06-S01-T03** — Implement keyboard navigation: arrow keys move through dropdown results, `Enter` selects, `Escape` closes.

## Story 6.2: Search Dropdown

> Overlay dropdown with fixed-order sections.

- [ ] **E06-S02-T01** — Create `SearchDropdown.tsx` — Absolute-positioned overlay below search bar. Fixed-order sections: Trends (max 3), Markets (max 3), Sentiments (max 3), Events (max 5). Section headers in medium-weight sans-serif, sentence case. "View all results" link at bottom.
- [ ] **E06-S02-T02** — Create `SearchSection.tsx` — Renders a section header + list of `SearchResultItem` components. Shows section even if empty (with "No matching {type}" message).
- [ ] **E06-S02-T03** — Create `SearchResultItem.tsx` — Result row with type-specific rendering. Trends: hashtag + velocity + lifecycle. Markets: question + probability + delta. Sentiments: question + sentiment %. Events: source + content snippet + timestamp.
- [ ] **E06-S02-T04** — Implement click-outside-to-close behavior. Use Radix `Popover` or custom hook with ref detection.

## Story 6.3: Search Actions

> Navigation from search results.

- [ ] **E06-S03-T01** — Implement result click actions: Trend result → navigate to topic page + select trend. Market result → navigate to markets view + select market. Sentiment result → navigate to sentiments view + expand question. Event result → open event detail in right panel.
- [ ] **E06-S03-T02** — Implement "View all results" navigation: navigate to `/app/search?q={query}`. Create `SearchResultsView.tsx` with full-page results, same fixed-order sections but with pagination.
- [ ] **E06-S03-T03** — Implement saved searches: "Save this search" action in dropdown. Saved searches appear in search dropdown when focused. Saved searches can be deleted.

---

# Epic 7: Topic Pages (P0)

> Multi-panel dashboard view for trend drill-downs.
> **Depends on:** Epic 1, Epic 2, Epic 3 (trends), Epic 5 (sentiments).

## Story 7.1: Topic Page Layout

> Dashboard-style layout scoped to a single topic.

- [ ] **E07-S01-T01** — Create `TopicPageView.tsx` — Route: `/app/topic/:trendId`. Multi-panel dashboard layout. Consumes trend data from `useTrends()` filtered by trendId. Renders TopicHeader + a grid of sections.
- [ ] **E07-S01-T02** — Create `TopicHeader.tsx` — Header section with: generated hashtag (large, bold), lifecycle badge, velocity sparkline (24h), total event count, category tag badge. Full-width at top.
- [ ] **E07-S01-T03** — Implement panel grid layout: 2-column grid below header. Left column (60%): TopicTimeline. Right column (40%): TopicSentiment, TopicMarkets, TopicEntities. Below: TopicRelated.

## Story 7.2: Topic Page Sections

> Individual content sections within the topic dashboard.

- [ ] **E07-S02-T01** — Create `TopicSentiment.tsx` — Aggregate sentiment for all prediction questions linked to this trend. Shows each linked question with sentiment probability, market delta, and confidence. Click to expand in sentiments view.
- [ ] **E07-S02-T02** — Create `TopicMarkets.tsx` — All correlated market contracts. Compact market cards with probability, 24h change, and sentiment delta. Click to open in markets view.
- [ ] **E07-S02-T03** — Create `TopicTimeline.tsx` — Chronological feed of all events in the trend cluster. Uses `react-virtuoso` for virtualization. Same card rendering as home feed but filtered to this trend.
- [ ] **E07-S02-T04** — Create `TopicEntities.tsx` — Key named entities extracted from the cluster. Ranked by mention frequency. Clickable: opens search for that entity.
- [ ] **E07-S02-T05** — Create `TopicGeoContext.tsx` — Mini-map showing event locations if the topic has geographic relevance. Static map image or simplified CesiumJS embed. "Open in Geo" link.
- [ ] **E07-S02-T06** — Create `TopicRelated.tsx` — Related trends that share entities or semantic overlap. Rendered as a horizontal row of compact TrendChips. Click to navigate to that topic page.

---

# Epic 8: Markets Panel (P0)

> Cross-platform prediction market aggregation with sparklines and sentiment delta.
> **Depends on:** Epic 1, Epic 2.

## Story 8.1: Markets View

> Main markets view with full card list.

- [ ] **E08-S01-T01** — Create `MarketsView.tsx` — Full view for the markets tab. Contains `MarketsPanel` + sort/filter controls. Filters: category, platform (Polymarket/Kalshi/all), probability range, sentiment delta range.
- [ ] **E08-S01-T02** — Create `MarketsPanel.tsx` — Scrollable list of `MarketCard` components. Uses `react-virtuoso` if >30 items. Consumes `useMarkets()` hook. Sortable by: probability change, volume, sentiment delta, linked trend velocity.

## Story 8.2: Market Cards

> Full cards with sparklines and cross-platform display.

- [ ] **E08-S02-T01** — Create `MarketCard.tsx` — Full card with: question text, platform badge, `ProbabilityDisplay` (current), `DeltaIndicator` (24h change), volume, `Sparkline` (24h price history), `DeltaIndicator` for sentiment delta, linked trend chips. Click to expand in right panel.
- [ ] **E08-S02-T02** — Create `MarketSparkline.tsx` — Small line chart (Recharts) showing 24h price history. No axes, no labels. Line color: accent cyan. Width: 100px, height: 32px. Subtle gradient fill below line.
- [ ] **E08-S02-T03** — Create `CrossPlatformDelta.tsx` — When a market exists on both Polymarket and Kalshi: show primary platform's price prominently, secondary platform as a smaller badge with delta. Format: "Polymarket: 50¢ · Kalshi: +3¢". Highlight spreads > 5% as arbitrage signals.

## Story 8.3: Market Detail

> Expanded market view in the right panel.

- [ ] **E08-S03-T01** — Create `MarketDetail.tsx` — Expanded view in right panel. Full-size price chart (24h with zoom controls), cross-platform comparison side-by-side, linked sentiment questions with deltas, linked trends, event timeline (events correlated to this market), volume history.
- [ ] **E08-S03-T02** — Implement market correlation display: show which trends and events are correlated to this market with confidence scores. Render as a list of trend chips + event snippets.
- [ ] **E08-S03-T03** — Add "Set Alert" action to market detail: opens alert config pre-filled with market ID and type "market_probability_delta". Threshold input field.

---

# Epic 9: Alert System (P0)

> Alert configuration, display, and toast notifications.
> **Depends on:** Epic 1, Epic 2, Epic 6 (stores).

## Story 9.1: Alert Configuration

> Create and manage alert rules.

- [ ] **E09-S01-T01** — Create `AlertConfig.tsx` — Alert creation form. Fields: alert type (dropdown: sentiment reversal, trend spike, market delta, POI severity, whale activity), target (question/trend/market selector), threshold (numeric input with unit), channel (in-app only for MVP). Save creates entry in `alertsStore`.
- [ ] **E09-S01-T02** — Create `AlertList.tsx` — List of active alert configs. Each row: type icon, target name, threshold, enabled toggle. Swipe/click to delete.
- [ ] **E09-S01-T03** — Create `AlertsConfigView.tsx` — Route: `/app/alerts`. Full view with AlertList + "Create Alert" button. Shows alert history: past triggered alerts with timestamp and message.

## Story 9.2: Alert Display

> Toast notifications and notification center.

- [ ] **E09-S02-T01** — Create `AlertToast.tsx` — Toast notification appearing bottom-right. Severity-colored left border. Content: alert type icon, message text, timestamp, dismiss button. Auto-dismiss after 8s. Stack up to 3 visible toasts.
- [ ] **E09-S02-T02** — Integrate alert evaluation with mock data: `alertGenerator.ts` evaluates alert configs against incoming mock data. When threshold is crossed, dispatch alert to `alertsStore.activeAlerts` and trigger toast.
- [ ] **E09-S02-T03** — Add unread alert badge to sidebar Alerts nav item. Badge shows count of unread alerts. Click navigates to alerts view and marks all as read.

## Story 9.3: Alert-Triggered Navigation

> Clicking an alert navigates to the relevant context.

- [ ] **E09-S03-T01** — Implement click actions on alerts: sentiment reversal → navigate to sentiments view + expand question. Trend spike → navigate to home + select trend. Market delta → navigate to markets + select market. Wire up in AlertToast and AlertList.
- [ ] **E09-S03-T02** — Implement alert history persistence: store last 50 triggered alerts in Zustand persist store. Show in AlertsConfigView history section.

---

# Epic 10: Auth & Onboarding (P0)

> Landing page, login/register, mock auth, and interactive onboarding tour.
> **Depends on:** Epic 1 (shell, routing, auth guard).

## Story 10.1: Landing Page

> Unauthenticated marketing + login gate.

- [ ] **E10-S01-T01** — Create `LandingView.tsx` — Full-page landing. PolyMatic branding, tagline ("Real-time Intelligence for Prediction Markets"), feature highlights (3-4 key value props), "Sign In" and "Get Started" CTAs. Dark theme, cinematic aesthetic. No app access without login.
- [ ] **E10-S01-T02** — Create animated hero section: subtle background animation (pulsing grid, data stream visualization, or globe silhouette). Keep performance-conscious — pure CSS or lightweight canvas.
- [ ] **E10-S01-T03** — Add feature highlight cards: Sentiments Engine, Trending Intelligence, Market Correlation, Real-time Alerts. Each with icon, title, and one-line description.

## Story 10.2: Login & Register

> Authentication forms with mock auth support.

- [ ] **E10-S02-T01** — Create `LoginForm.tsx` — Email + password fields, "Sign In" button, "Forgot password" link, divider, OAuth buttons (Google, GitHub). Error states for invalid credentials. Loading state during auth.
- [ ] **E10-S02-T02** — Create `RegisterForm.tsx` — Email + password + confirm password fields, "Create Account" button, OAuth buttons. Password strength indicator.
- [ ] **E10-S02-T03** — Create `LoginView.tsx` — Route: `/login`. Contains tab toggle between Login and Register forms. PolyMatic branding above form.
- [ ] **E10-S02-T04** — Create `AuthProvider.tsx` — Context provider wrapping the app. Initializes `authStore` on mount, checks for existing token in storage, attempts silent refresh. Provides `useAuth()` hook.
- [ ] **E10-S02-T05** — Implement mock auth in `mockProvider.ts` — `login()` accepts any email/password, returns mock JWT + user with Pro tier. `refreshToken()` always succeeds. Simulated 500ms latency.

## Story 10.3: Onboarding Tour

> Interactive step-by-step tour for first-time users.

- [ ] **E10-S03-T01** — Create `OnboardingTour.tsx` — Full-screen overlay tour with step indicator (dots/progress bar). Steps: 1. Welcome + value prop, 2. Pick 3 topics (from trending), 3. Track your first sentiment question, 4. Set up your first alert, 5. Tour complete → enter app. "Skip Tour" option on every step.
- [ ] **E10-S03-T02** — Create `TopicPicker.tsx` — Grid of trending topic cards. User selects 3. Selected topics get added to their feed filters / watchlist. Minimum 3 required to proceed (or skip).
- [ ] **E10-S03-T03** — Create `onboarding.config.ts` — Tour step definitions: title, description, target element (for highlight), action callback (for step completion). Flexible enough to adjust step order.
- [ ] **E10-S03-T04** — Wire onboarding completion: when tour finishes or is skipped, set `user.onboardingComplete = true` in authStore. Navigate to `/app/home`. Never show tour again for this user.

---

# Epic 11: Geo View (P1)

> CesiumJS 3D globe with data layers and interactions.
> **Depends on:** Epic 1, Epic 2.
> **Feature-flagged: `enableGeoView`.**

## Story 11.1: Globe Setup

> CesiumJS viewer initialization and camera controls.

- [ ] **E11-S01-T01** — Create `GlobeContainer.tsx` — Initialize CesiumJS Viewer via `resium`. Configure: Cesium ion token, imagery provider (hybrid: vector tiles at zoom-out, satellite at city-level), terrain provider, scene mode (3D). Disable default Cesium widgets (use custom UI).
- [ ] **E11-S01-T02** — Create `GlobeCamera.tsx` — Camera control manager. Implements `flyTo(lat, lng, altitude)` for smooth camera transitions when navigating from other views. Default position: centered on the area of most activity.
- [ ] **E11-S01-T03** — Create `RegionSelect.tsx` — Tools for selecting regions on the globe: polygon draw, rectangle select, country/admin boundary click. Selected region is stored in `geoStore`. Used for Detect (spatial anomaly detection).
- [ ] **E11-S01-T04** — Integrate with navigation: clicking "Open in Geo" on a geolocated feed event → switch to Geo tab → `flyTo` the event's coordinates. Clicking a POI in sidebar → switch to Geo → fly to POI centroid.

## Story 11.2: Data Layers

> Toggleable OSINT layers rendered on the globe.

- [ ] **E11-S02-T01** — Create `LayerManager.tsx` — Panel (sidebar or overlay) listing all available data layers with toggle switches. Layers load lazily: component not instantiated until toggled on. Shows layer event count badge.
- [ ] **E11-S02-T02** — Create `LayerRenderer.tsx` — Generic layer rendering component. Accepts layer config + data array. Renders markers, polylines, or polygons based on layer type. Handles clustering at configurable zoom thresholds.
- [ ] **E11-S02-T03** — Implement layer-specific renderers: Aircraft (flight paths with altitude coloring), Maritime (vessel tracks with type icons), Earthquakes (magnitude circles with depth coloring), Conflicts (event icons with density heatmap), News (geolocated story clusters). Each as a lazy-loaded sub-component.
- [ ] **E11-S02-T04** — Create `MarkerCluster.tsx` — Cluster markers at zoom-out using CesiumJS clustering. Configurable threshold per layer type. Show count badge on clusters. Click to zoom in and scatter.

## Story 11.3: Globe Interaction

> Event detail, POI display, and motion trails.

- [ ] **E11-S03-T01** — Create `MotionTrail.tsx` — Animated polyline trails for ADS-B and AIS data. Trail fades over time (time-decay opacity). Color by type (aircraft: blue, vessel: orange). GPU-accelerated via CesiumJS primitives.
- [ ] **E11-S03-T02** — Create `GeoDetail.tsx` — Info popup/panel when clicking a marker or POI on the globe. Shows: event details, source, timestamp, linked trends, linked markets, severity. "Open in Feed" action to navigate back to home with this event highlighted.
- [ ] **E11-S03-T03** — Implement cross-view filter carry-over: when navigating from Home → Geo, active trend filter and time window persist. Globe shows only events matching the active trend. Clear filter shows all events.
- [ ] **E11-S03-T04** — Add "Geo context" mini-map to Topic Pages. Static map image showing event locations for the topic. Click opens full Geo view filtered to this topic.

---

# Epic 12: POI System (P1)

> Places of Interest auto-generated from event clustering.
> **Depends on:** Epic 11 (Geo view), Epic 2 (mock data).
> **Feature-flagged.**

## Story 12.1: POI Display

> POI sidebar section and globe rendering.

- [ ] **E12-S01-T01** — Add POI section to sidebar. List of POIs sorted by severity, velocity, or event count. Each row: name, severity dot, velocity indicator, event count, linked market count.
- [ ] **E12-S01-T02** — Click POI in sidebar: switch to Geo view, fly camera to POI centroid, highlight the POI cluster, open GeoDetail panel with full POI information.
- [ ] **E12-S01-T03** — Render POI clusters on globe as colored circles with severity-based radius. Pulsing animation for high-severity POIs.
- [ ] **E12-S01-T04** — Surface POIs on Topic Pages via `TopicGeoContext.tsx` when a trend has geographic relevance.

---

# Epic 13: Detect / Anomaly Detection (P1)

> AI-powered signal detection across views.
> **Depends on:** Epic 2 (mock data), Epic 3 (feed), Epic 5 (sentiments).
> **Feature-flagged: `enableDetect`.**

## Story 13.1: Detect Engine

> Context-appropriate anomaly detection.

- [ ] **E13-S01-T01** — Create `DetectEngine.ts` — Service that runs anomaly detection on provided data. Accepts context (feed, geo region, sentiment question). Returns `SignalCard` objects. Mock implementation uses statistical thresholds (z-score > 2 on event velocity, sentiment reversal detection, market probability jump detection).
- [ ] **E13-S01-T02** — Create signal card output component: shows cluster spikes, sentiment anomalies, market probability deltas, historical analogs (mocked), confidence score, and recommended markets. Clean card rendering consistent with PredictionBrief styling.
- [ ] **E13-S01-T03** — Add "Run Detect" button to Home view (runs on filtered feed/trend), Geo view (runs on selected region), and Sentiments view (runs on selected question). Button triggers analysis and displays results in right panel.
- [ ] **E13-S01-T04** — Implement rate limiting for Detect: Free tier = 0/day, Pro = 5/day, Quant = unlimited. Show remaining count in button label. Upsell when limit reached.

---

# Epic 14: Whale Tracking (P1)

> Large trade monitoring on prediction markets.
> **Depends on:** Epic 2 (mock data), Epic 8 (markets).
> **Feature-flagged: `enableWhaleTracking`.**

## Story 14.1: Whale Activity Display

> Whale trades in feed and markets.

- [ ] **E14-S01-T01** — Create whale trade mock generator: generates large trades (>$10K) on random markets at configurable frequency. Each trade: amount, platform, market, direction (buy YES/NO), timestamp.
- [ ] **E14-S01-T02** — Display whale trades as high-priority feed items in the Home feed. Special card variant with whale icon, trade amount, market question, and direction. Only show when correlated with active trends.
- [ ] **E14-S01-T03** — Add whale activity indicator to `MarketCard`: small whale icon + recent large trade count. Tooltip shows last 3 whale trades with amounts and timestamps.

---

# Epic 15: Timeline & Replay (P1)

> Historical scrubbing and event replay.
> **Depends on:** Epic 2 (mock data), Epic 3 (feed), Epic 5 (sentiments).
> **Feature-flagged: `enableTimeline`.**

## Story 15.1: Timeline Controls

> Scrub through historical data.

- [ ] **E15-S01-T01** — Create `TimelineControls.tsx` — Horizontal time scrubber bar at the bottom of feed/sentiments/geo views. Drag to navigate through time. Play/pause button for replay mode. Speed controls: 1x, 2x, 5x, 10x.
- [ ] **E15-S01-T02** — Implement feed replay: when timeline is scrubbed to a past time, feed shows events from that time window. Events appear at original cadence in replay mode. Forward only in replay.
- [ ] **E15-S01-T03** — Implement sentiment replay: sentiment timeline chart highlights the scrubbed time position. Sentiment scores show the value at that point in time.
- [ ] **E15-S01-T04** — Add scenario bookmarks: save the current time window as a named scenario. Bookmarks appear in a dropdown on the timeline. Click to jump to saved position.

---

# Epic 16: Polish, Performance, Accessibility (P0/Polish)

> Final pass: keyboard nav, ARIA, performance optimization, error states, responsive testing.
> **Depends on:** Epics 3–10 complete.

## Story 16.1: Keyboard Navigation

> Full keyboard accessibility throughout the app.

- [ ] **E16-S01-T01** — Implement sidebar keyboard navigation: Tab through nav items, Enter to select, arrow keys for sidebar menu items.
- [ ] **E16-S01-T02** — Implement feed keyboard navigation: Tab into feed, arrow keys to move between cards, Enter to expand/select, Escape to deselect.
- [ ] **E16-S01-T03** — Implement search keyboard flow: `Cmd+K` to focus search, type to search, arrow keys through results, Enter to select, Escape to close. Full keyboard-only usable.
- [ ] **E16-S01-T04** — Add keyboard shortcuts for layout switching: `Cmd+1` Dashboard, `Cmd+2` Focus, `Cmd+3` Clean. Display shortcut hints in tooltips.

## Story 16.2: ARIA & Screen Reader

> Screen reader support with ARIA labels and live regions.

- [ ] **E16-S02-T01** — Add ARIA labels to all interactive elements: sidebar nav (role="navigation"), feed (role="feed"), search (role="search", aria-expanded), tabs (role="tablist"), modals (role="dialog").
- [ ] **E16-S02-T02** — Implement live regions for dynamic updates: alert toasts (role="alert"), sentiment score changes (aria-live="polite"), trend bar updates (aria-live="polite").
- [ ] **E16-S02-T03** — Add screen reader announcements for state changes: trend selected, question tracked, alert triggered, layout switched.
- [ ] **E16-S02-T04** — Test with VoiceOver (macOS). Document any issues. Fix critical blockers.

## Story 16.3: Reduced Motion

> Respect `prefers-reduced-motion`.

- [ ] **E16-S03-T01** — Implement `prefers-reduced-motion` media query: disable framer-motion animations, disable trend chip glow pulses, disable layout transition animations (instant swap instead). Use Tailwind `motion-reduce:` utilities.
- [ ] **E16-S03-T02** — Add manual "Reduce Motion" toggle in settings/sidebar. Stores preference in localStorage. Overrides system setting if explicitly set.

## Story 16.4: Performance Optimization

> Bundle size, render performance, and memory optimization.

- [ ] **E16-S04-T01** — Analyze bundle with `rollup-plugin-visualizer`. Identify largest chunks. Target: main bundle < 80 KB, largest feature bundle < 60 KB (excluding CesiumJS).
- [ ] **E16-S04-T02** — Optimize feed rendering: verify react-virtuoso is properly recycling DOM nodes. Profile with React DevTools. Target: < 16ms per frame during scroll.
- [ ] **E16-S04-T03** — Optimize TanStack Query caching: ensure stale data is garbage-collected. Set appropriate `gcTime` for each query. Monitor memory with DevTools.
- [ ] **E16-S04-T04** — Implement progressive loading: skeleton screens for all data-dependent views. Prioritize above-fold content. Defer below-fold sections.
- [ ] **E16-S04-T05** — Test on low-end device: throttle CPU 4x and network to 3G in DevTools. Verify app remains usable (feed scrolls, search works, layout doesn't break).

## Story 16.5: Colorblind Accessibility

> Ensure information isn't conveyed by color alone.

- [ ] **E16-S05-T01** — Audit all color-coded elements: severity (green/yellow/red), sentiment (green/red), delta (green/red), trend categories (5 colors). Add secondary indicators (icons, patterns, labels) so no information is conveyed by color alone.
- [ ] **E16-S05-T02** — Test with colorblind simulation (Chrome DevTools emulation: protanopia, deuteranopia, tritanopia). Fix any elements that are indistinguishable.

## Story 16.6: Error States & Edge Cases

> Comprehensive error handling throughout the app.

- [ ] **E16-S06-T01** — Implement error states for all data-dependent views: feed load failure, sentiment data unavailable, markets not loading, search error. Each shows `ErrorBoundary` with actionable message + retry button.
- [ ] **E16-S06-T02** — Implement connection-lost state: when WebSocket disconnects, show banner "Connection lost — reconnecting..." with auto-retry indicator. When mock data generator stops, show appropriate message.
- [ ] **E16-S06-T03** — Implement empty states for all list views: no feed items (initial or filtered), no sentiment questions tracked, no markets matching filter, no search results, no alerts configured. Each uses `EmptyState` component with contextual guidance.
- [ ] **E16-S06-T04** — Test edge cases: viewport at exactly 1024px, rapid trend selection/deselection, search with special characters, tracking 3 questions then trying to add another (free tier), auth token expiry during session.
- [ ] **E16-S06-T05** — Final visual QA: verify all components render correctly in both dark and light themes. Check spacing, alignment, color contrast (WCAG AA), and typography hierarchy.

---

## Summary

| Epic | Priority | Stories | Tasks | Status |
|------|----------|---------|-------|--------|
| E01: Foundation | P0 | 5 | 40 | [✅] |
| E02: Mock Data Engine | P0 | 5 | 30 | [ ] |
| E03: Home Feed | P0 | 3 | 14 | [ ] |
| E04: Trending Bar | P0 | 3 | 9 | [ ] |
| E05: Sentiments Engine | P0 | 6 | 20 | [ ] |
| E06: Search | P0 | 3 | 10 | [ ] |
| E07: Topic Pages | P0 | 2 | 9 | [ ] |
| E08: Markets Panel | P0 | 3 | 9 | [ ] |
| E09: Alert System | P0 | 3 | 8 | [ ] |
| E10: Auth & Onboarding | P0 | 3 | 14 | [ ] |
| E11: Geo View | P1 | 3 | 12 | [ ] |
| E12: POI System | P1 | 1 | 4 | [ ] |
| E13: Detect / Anomaly | P1 | 1 | 4 | [ ] |
| E14: Whale Tracking | P1 | 1 | 3 | [ ] |
| E15: Timeline & Replay | P1 | 1 | 4 | [ ] |
| E16: Polish & A11y | P0/Polish | 6 | 22 | [ ] |
| **TOTAL** | | **48** | **212** | |

## Dependency Graph

```
E01 Foundation ──┬──► E02 Mock Data Engine ──┬──► E03 Home Feed
                 │                           ├──► E04 Trending Bar
                 │                           ├──► E05 Sentiments Engine
                 │                           ├──► E06 Search
                 │                           ├──► E07 Topic Pages (also needs E03, E05)
                 │                           ├──► E08 Markets Panel
                 │                           ├──► E09 Alert System
                 │                           ├──► E11 Geo View (P1)
                 │                           ├──► E12 POI System (P1, needs E11)
                 │                           ├──► E13 Detect (P1)
                 │                           ├──► E14 Whale Tracking (P1, needs E08)
                 │                           └──► E15 Timeline (P1)
                 │
                 └──► E10 Auth & Onboarding

E03–E10 complete ──► E16 Polish & A11y
```

## Recommended Build Order

1. **E01** Foundation (all 5 stories in parallel after scaffold)
2. **E02** Mock Data Engine (types first, then generators, then hooks)
3. **E03 + E04 + E05** in parallel (Home Feed, Trending Bar, Sentiments Engine)
4. **E06 + E08** in parallel (Search, Markets Panel)
5. **E07** Topic Pages (needs feed + sentiments)
6. **E09 + E10** in parallel (Alerts, Auth & Onboarding)
7. **E11 + E12 + E13 + E14 + E15** P1 features (if time permits)
8. **E16** Polish pass (after all P0 features complete)

---

*End of Task Breakdown*
