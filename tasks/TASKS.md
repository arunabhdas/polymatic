# PolyMatic — Task Breakdown

**Version:** 1.2
**Date:** March 10, 2026
**Format:** Epic → Story → Task
**Total:** 24 Epics · ~74 Stories · ~328 Tasks

> **Note (March 9, 2026):** The frontend was reset and rebuilt from scratch (commit `b278904`).
> Epic 1 and Epic 2 were re-implemented in the new codebase with shadcn/ui, Three.js,
> and a simplified architecture. Epics 5-9 completed in the old codebase need to be
> re-implemented. Epic 10 gained new design system stories (7.6, 7.7) for foundation work.

---

## Task ID Convention

```
E{epic}-S{story}-T{task}
Example: E01-S02-T03 = Epic 1, Story 2, Task 3
```

## Priority Legend

- **P0** = Must ship (MVP). Epics 1–13.
- **P1** = Ship if time permits. Epics 14–18.
- **P0/Polish** = Final pass. Epic 19.
- **P2** = Post-MVP. Emerging Market Intelligence. Epics 20–24.

## Status Legend

- `[ ]` = Not started
- `[🏗️]` = In progress
- `[🚀]` = TBD
- `[⏰]` = Defer
- `[✅]` = Complete
- `[🛑]` = Blocked

---

# Epic 1: Foundation (P0) — ✅ COMPLETE (rebuilt)

> Scaffold, theming, layout shell, routing, and base UI components.
> **Depends on:** Nothing. This is the starting point.
> **Status:** Complete in new codebase. AppShell + Sidebar + TopBar + RightPanel + shadcn/ui + routing.
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
- [✅] **E01-S01-T08** — Install Three.js + react-three-fiber dependencies: `three`, `@react-three/fiber`, `@react-three/drei`. Configure Vite for Three.js + react-three-fiber static asset copying (workers, assets). Set up `public/three/` directory.
- [✅] **E01-S01-T09** — Set up Vitest config with React Testing Library. Create a sample test to verify the test pipeline works.

## Story 1.2: Theming System

> CSS custom properties for dark/light themes, fonts, and modern typography system.

- [✅] **E01-S02-T01** — Create `src/styles/globals.css` with all CSS custom properties: colors (bg, accent, text, semantic, sentiment, delta, category), layout dimensions (sidebar, right panel, topbar, trending bar), typography (font stacks), and animation durations.
- [✅] **E01-S02-T02** — Create `src/styles/themes/dark.css` with dark theme variable overrides. This is the default theme.
- [🚀] **E01-S02-T03** — Create `src/styles/themes/light.css` with light theme variable overrides. Adjusted accent colors for contrast on light backgrounds.
- [✅] **E01-S02-T04** — Create `src/styles/fonts.css` with `@font-face` declarations for Inter (sans-serif) and JetBrains Mono (monospace). Set up font loading strategy (preload critical weights).
- [✅] **E01-S02-T05** — Create `src/lib/cn.ts` — utility function combining `clsx` and `tailwind-merge` for conditional class composition.
- [🚀] **E01-S02-T06** — Implement theme toggling: apply `data-theme="dark|light"` attribute on `<html>`. Persist preference in localStorage. Wire to `uiStore.theme`.

## Story 1.3: App Shell & Layout

> Sidebar, top bar, right panel, and the 3-column layout grid with animated layout switching.

- [✅] **E01-S03-T01** — Create `AppShell.tsx` — the 3-column CSS grid layout: sidebar | main content | right panel. Grid columns: `var(--sidebar-width) 1fr var(--right-panel-width)`. Apply `framer-motion` layout animation for Dashboard/Focus/Clean mode switching.
- [✅] **E01-S03-T02** — Create `Sidebar.tsx` — Left navigation panel with logo, nav items (Home, Sentiments, Geo, Markets, separator, POI, Layers, Scenes, Filters, separator, Alerts), layout switcher, and user menu. Auto-collapse to icon-only when viewport < 1280px. Expand on hover when collapsed.
- [✅] **E01-S03-T03** — Create `TopBar.tsx` — Fixed top bar (56px height) spanning main content + right panel. Contains the `SearchBar` component placeholder.
- [✅] **E01-S03-T04** — Create `RightPanel.tsx` — Persistent right panel (30% width). Renders dynamic content based on `uiStore.rightPanelContent`. Default: contextual help or trending summary. Shows EmptyState when nothing selected.
- [🚀] **E01-S03-T05** — Create `LayoutSwitcher.tsx` — Dropdown or toggle in sidebar footer. Switches between Dashboard (all panels), Focus (icon sidebar, minimal chrome), and Clean (feed only, no sidebar/panel). Animated transitions with `var(--transition-layout)` (300ms ease).
- [🚀] **E01-S03-T06** — Create `NotificationCenter.tsx` — Toast container (bottom-right) for alert notifications. Tray/bell icon in sidebar for notification list. Unread badge count.
- [🚀] **E01-S03-T07** — Implement responsive breakpoints: 1024-1279px (tablet: sidebar collapsed, right panel overlay), 1280px+ (desktop: full layout). Test layout at both breakpoints.

## Story 1.4: Routing

> React Router setup with lazy loading, code splitting, and auth guard.

- [✅] **E01-S04-T01** — Set up `react-router-dom` with the full route map. Public routes: `/` (landing), `/login`, `/register`. Protected routes under `/app/*`: home, sentiments, sentiments/:id, markets, markets/:id, topic/:id, search, alerts, onboarding. Feature-gated: geo.
- [🚀] **E01-S04-T02** — Implement `React.lazy()` for all view components. Wrap route outlet in `<Suspense>` with a loading skeleton that matches the target view layout.
- [🚀] **E01-S04-T03** — Create `AuthGuard.tsx` — Route protection component. Checks `authStore.isAuthenticated`. Redirects to `/login` if not authenticated. Redirects to `/app/onboarding` if `user.onboardingComplete === false`.
- [🚀] **E01-S04-T04** — Create `FeatureGate.tsx` — Component that conditionally renders children based on feature flag state. Used to gate Geo route and other P1 features.

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
- [🚀] **E01-S05-T14** — Create `EmptyState.tsx` — Contextual empty state with icon, primary text (actionable), and optional CTA button. No cute emoji. Professional copy.
- [🚀] **E01-S05-T15** — Create `LoadingSkeleton.tsx` — Animated pulse skeleton that matches the layout of the component it's replacing. Variants: card, list-row, chart, text-block.
- [🚀] **E01-S05-T16** — Create `ErrorBoundary.tsx` — React error boundary with helpful error display: what happened, retry button, report link. Catches and logs errors.
- [✅] **E01-S05-T17** — Create `Tooltip.tsx` — Radix-based tooltip. Only used when adding information the label doesn't already convey. Dark card style.
- [✅] **E01-S05-T18** — Create `Tabs.tsx` — Radix-based tab container. Underline style active indicator. Used in Topic Pages and settings.
- [🚀] **E01-S05-T19** — Create `Toggle.tsx` — Toggle switch for boolean settings (theme, filters). Accessible with keyboard and screen reader.

## Story 1.6: Install shadcn/ui + Design System Foundation [UI/UX]

> Install shadcn/ui (Tailwind-based, headless) as the component primitive layer. Configure its theme tokens to align with PolyMatic's CSS custom property system.

- [✅] **E01-S06-T01** — Install and initialize shadcn/ui with Tailwind v4: `npx shadcn@latest init`. Configure `components.json`. Select "New York" style. Set dark theme as default.
- [✅] **E01-S06-T02** — Install core shadcn/ui primitives (`Button`, `Card`, `Tooltip`, etc).
- [✅] **E01-S06-T03** — Map shadcn/ui CSS variables to PolyMatic's existing `--color-*` tokens in `globals.css`.

## Story 1.7: Dark Theme Refinement — Linear-Grade Color Depth [UI/UX]

> Overhaul the dark theme color palette to match Linear's near-black neutral foundation (#0D0D0D, #1A1A1A).

- [✅] **E01-S07-T01** — Update `dark.css` background tokens to desaturated near-blacks (`--color-bg-primary: #0F0F0F`, `--color-bg-secondary: #171717`, `--color-bg-card: #1C1C1C`).
- [✅] **E01-S07-T02** — Update border tokens (`--color-border: #2A2A2A`, `--color-border-subtle: #1F1F1F`).
- [✅] **E01-S07-T03** — Update text tokens for better hierarchy (`--color-text-primary: #F5F5F5`, `--color-text-secondary: #A0A0A0`).
- [✅] **E01-S07-T04** — Refine accent color for darker backgrounds.
- [✅] **E01-S07-T05** — Add shadow tokens to `globals.css` (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`).

## Story 1.8: Sidebar — Linear-Quality Navigation [UI/UX]

> Redesign the sidebar to match Linear's clean grouped sections, muted category headers, subtle hover states, and refined iconography.

- [✅] **E01-S08-T01** — Refactor sidebar section groups with muted uppercase labels (10px, spacing 0.05em, weight 500).
- [✅] **E01-S08-T02** — Refine sidebar nav item styling (32px height, 8px padding, 6px radius, hover bg without accent color).
- [✅] **E01-S08-T03** — Redesign sidebar brand section to a clean wordmark (Inter 600 weight, 15px).
- [✅] **E01-S08-T04** — Add "Favorites" section with colored indicator dots.
- [✅] **E01-S08-T05** — Add a sidebar footer with user avatar and standard settings.
- [🚀] **E01-S08-T06** — Implement sidebar collapse animation refinement.

## Story 1.9: Typography & Spacing Rhythm [UI/UX]

> Establish a more refined typographic scale and spacing rhythm matching Linear's generous layout.

- [✅] **E01-S09-T01** — Define formal typographic scale in `globals.css` (11px, 12px, 14px, 16px, 20px, 24px) utilizing Inter and JetBrains Mono.
- [✅] **E01-S09-T02** — Define spacing scale tokens (`--space-0` through `--space-12`).

## Story 1.10: Component Uplift — shadcn/ui Migration [UI/UX]

> Progressively migrate core atoms from custom implementations to shadcn/ui primitives for consistent focus rings, keyboard accessibility, animation, and premium feel.

- [✅] **E01-S10-T01** — Migrate `Button.tsx` to wrap or extend shadcn `Button` and preserve variants.
- [✅] **E01-S10-T02** — Migrate `Card.tsx` to wrap shadcn `Card`.
- [✅] **E01-S10-T03** — Migrate `Badge.tsx` to wrap shadcn `Badge`.
- [✅] **E01-S10-T04** — Replace all Radix `Tooltip` usage with shadcn `Tooltip`.
- [🚀] **E01-S10-T05** — Replace `LoadingSkeleton.tsx` with shadcn `Skeleton`.

## Story 1.11: TopBar & Header Polish [UI/UX]

> Refine the TopBar to match Linear's clean header bar: minimal chrome, subtle icon buttons, clean separator between sections.

- [✅] **E01-S11-T01** — Reduce TopBar visual weight (match body bg, thin bottom border).
- [✅] **E01-S11-T02** — Refine TopBar icon buttons (ghost variant, rounded-md, no custom styling).
- [✅] **E01-S11-T03** — Add breadcrumb context to TopBar left section (e.g., "Home").
- [✅] **E01-S11-T04** — Add item navigation counter (e.g., "02 / 145").

## Story 1.12: Interactive States & Focus System [UI/UX]

> Implement a comprehensive interactive state system: focus-visible rings, refined hover states, pressed states, and keyboard navigation indicators.

- [✅] **E01-S12-T01** — Define global focus-visible styles in `globals.css`.
- [✅] **E01-S12-T02** — Implement hover state depth (`--shadow-sm` + subtle border brightness increase).
- [✅] **E01-S12-T03** — Add pressed/active states for buttons and interactive elements (`active:scale-[0.98]`).
- [🚀] **E01-S12-T04** — Implement global keyboard shortcuts system (e.g., `G then H`).
- [🚀] **E01-S12-T05** — Create `KeyboardShortcutsDialog.tsx` using shadcn `Dialog`.

---

# Epic 2: Mock Data Engine (P0) — ✅ COMPLETE (rebuilt)

> Type definitions, DataProvider interface, seed data, generators, and TanStack Query integration.
> **Depends on:** Epic 1 (scaffold, types folder, stores).
> **Blocks:** Epics 5–13 (all feature UIs).
> **Status:** Complete in new codebase. Types, generators, seed data, hooks, and services all implemented.

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

## Story 2.4: ConflictSidebar Mobile Responsiveness

> The ConflictSidebar renders at `left-80` (adjacent to the desktop sidebar) and is unusable on mobile — either off-screen or overlapping the globe. Apply the same slide-in/backdrop treatment used for the Sidebar and EventFeed.

- [✅] **E02-S04-T01** — Add `conflictSidebarOpen` boolean + `setConflictSidebarOpen` action to `useStore`. Default `false`.
- [✅] **E02-S04-T02** — Update `ConflictSidebar.tsx` for mobile: on `md:` and above, keep current `left-80` positioning. On mobile, render as a full-width slide-in overlay from the left (`-translate-x-full` → `translate-x-0`) with a semi-transparent backdrop. Tap backdrop or X button to dismiss.
- [✅] **E02-S04-T03** — Add a mobile-only trigger button in `App.tsx` (visible when the conflicts layer is active) to toggle the ConflictSidebar overlay. Use the same styling pattern as the existing sidebar and event feed hamburger buttons.
- [✅] **E02-S04-T04** — Ensure ConflictSidebar auto-opens on mobile when the conflicts layer is first toggled on, and auto-closes when the layer is toggled off.

## Story 2.5: Emerging Market Intelligence Layers in Sidebar

> Add Equity Market and Startup Ecosystem layer groups (layers 31–40) to the polymatic-mvp sidebar. Extend `useStore` with new `LayerKey` entries and entity records.

- [✅] **E02-S05-T01** — Add 10 new `LayerKey` entries to `useStore.ts`: `indiaStocks`, `indiaSectors`, `singaporeMarkets`, `aseanMarkets`, `globalEM`, `indiaStartups`, `singaporeStartups`, `startupFunding`, `startupOpportunity`, `unicornTracker`. Add corresponding entity records (`Record<string, Entity>`) and layer defaults (`false`).
- [✅] **E02-S05-T02** — Add two new layer groups to `Sidebar.tsx` `LAYER_GROUPS` array: "Equity Market Intelligence" (layers 31–35: India Stocks, India Sectors, Singapore Markets, ASEAN Markets, Global EM) and "Startup Ecosystem" (layers 36–40: India Startups, Singapore Startups, Funding Signals, Opportunity Discovery, Unicorn Tracker). Assign appropriate lucide-react icons and color classes.
- [✅] **E02-S05-T03** — Update `updateEntities` in `useStore.ts` to handle the new layer keys (ensure they are not excluded by the `political`/`satelliteImagery` guard).

## Story 2.6: Mock Data Generators

> Dynamic generators that produce realistic, time-varying data.

- [ ] **E02-S06-T01** — Create `mock-data/generators/feedGenerator.ts` — Generates `FeedItem` objects. Simulates bursty arrival: base rate 2/sec, burst rate 20/sec during breaking events (5% burst probability, 30s burst windows). Each item: random source type, random seed account, generated content text, random entity tags from seed, linked to active trends, sentiment stance if relevant to tracked question.
- [ ] **E02-S06-T02** — Create `mock-data/generators/sentimentGenerator.ts` — Generates classified tweet batches every 5-10s. Each question has a "true sentiment" (0-100) that drifts over time via Brownian motion with mean reversion. Generated tweets have stance distribution matching true sentiment + noise. Confidence scores follow beta distribution (Claude-style calibration). Account credibility from seed data.
- [ ] **E02-S06-T03** — Create `mock-data/generators/trendGenerator.ts` — Manages trend lifecycle curves. Velocity follows sigmoid: slow start → rapid growth → plateau → decay. Lifecycle transitions at velocity thresholds. Small chance (2%) of re-acceleration from cooling to emerging. Generates new trends periodically (1 every 5 minutes) and retires old ones.
- [ ] **E02-S06-T04** — Create `mock-data/generators/marketGenerator.ts` — Generates price random walks for each market contract. Brownian motion with mean-reversion to true probability. Occasional jumps (±5-15%) correlated with trend spikes. Cross-platform spread: secondary platform = primary ± uniform(-3, 3)%. Generates 24h price history for sparklines.
- [ ] **E02-S06-T05** — Create `mock-data/generators/alertGenerator.ts` — Evaluates alert configs against mock data streams. Triggers alerts when: sentiment reversal on watched question, trend velocity crosses threshold, market delta exceeds configured %, POI severity threshold crossed. Generates `Alert` objects with timestamp, message, and severity.
- [ ] **E02-S06-T06** — Create `mock-data/generators/geoGenerator.ts` — Generates geospatial events with realistic coordinates. ADS-B: flight paths with waypoints and altitude. AIS: vessel tracks with heading. Conflict incidents: random coordinates within active conflict zones. Earthquakes: random magnitude/depth. Each event linked to seed entities and trends where relevant.

## Story 2.7: Query Hooks & Mock Provider

> TanStack Query hooks that consume the DataProvider.

- [ ] **E02-S07-T01** — Create `services/mockProvider.ts` — Full `DataProvider` implementation using the generators. Each method returns realistic data with simulated latency (200-500ms). Subscribe methods use setInterval for periodic updates.
- [ ] **E02-S07-T02** — Create `mock-data/index.ts` — Mock data orchestrator. Initializes all generators with seed data. Exposes a singleton `MockEngine` that ticks generators on an interval. Coordinates cross-domain correlations (trend spike → market jump → sentiment shift).
- [ ] **E02-S07-T03** — Create `hooks/useFeed.ts` — TanStack Query hook for feed data. Accepts `FeedFilters`. Refetches on filter change. Supports infinite scroll pagination.
- [ ] **E02-S07-T04** — Create `hooks/useSentiments.ts` — Hooks: `useSentimentQuestions()` (list), `useSentimentDetail(id)` (single with tweet breakdown), `useTrackQuestion()` (mutation). Refetch interval: 10s.
- [ ] **E02-S07-T05** — Create `hooks/useTrends.ts` — Hook: `useTrends()` with refetch interval matching trend tick rate. Returns sorted trends (velocity descending).
- [ ] **E02-S07-T06** — Create `hooks/useMarkets.ts` — Hook: `useMarkets(filters)` with refetch interval. `useMarketDetail(id)` for expanded view with price history.
- [ ] **E02-S07-T07** — Create `hooks/useSearch.ts` — Hook: `useSearch(query)` with 200ms debounce. Only fires when query length ≥ 2. Returns `SearchResults` in fixed section order.
- [ ] **E02-S07-T08** — Create `hooks/useAlerts.ts` — Hooks: `useAlertConfigs()`, `useActiveAlerts()`, `useCreateAlert()` (mutation), `useDismissAlert()` (mutation).

## Story 2.8: MVP Landing Page & Routing — ✅ COMPLETE

> Marketing-style landing page for the polymatic-mvp frontend (`polymatic-mvp-frontend/`), replicating the design from `mocks/web_1.html` Screen 1. Adds react-router-dom for route splitting: `/` → LandingPage, `/dashboard` → Cesium globe app (lazy-loaded).

- [✅] **E02-S08-T01** — Install `react-router-dom` dependency.
- [✅] **E02-S08-T02** — Create `LandingPage.tsx` — Full marketing landing page with: scrolling ticker bar (live intel alerts), top nav (logo, nav links, Sign In, Launch Dashboard CTA), hero section (serif headline, metric pills grid, globe mock SVG illustration), features strip (4 cards: Unified Signal Feed, Sentiments Engine, Prediction Correlation, Analyst Scoring), and steps section (4-step "how it works"). Uses PolyMatic brand tokens (green/amber/red/teal color system) defined in `index.css`.
- [✅] **E02-S08-T03** — Update `index.css` — Add Playfair Display + DM Sans font imports, define `--color-pm-*` brand tokens in `@theme` block, add `@keyframes ticker` and `@keyframes pulse-dot` animations.
- [✅] **E02-S08-T04** — Update `main.tsx` — Replace direct `<App />` render with `createBrowserRouter` + `RouterProvider`. Routes: `/` → LandingPage (eager), `/dashboard` → App (lazy via dynamic import).
- [✅] **E02-S08-T05** — CTA routing — "Launch Dashboard" primary buttons in both top nav and hero section link to `/dashboard` via react-router-dom `<Link>`.

---

# Epic 3: Landing Page with Three.js Globe (P0) — ✅ COMPLETE

> Cinematic landing page at `/` with animated Three.js globe showing maritime, air, and military traffic.
> Dashboard moves to `/dashboard`. "Get Started" CTA navigates to dashboard.
> **Depends on:** Epic 1 (Foundation), Epic 4 (Dark theme tokens).
> **Reference:** Supabase/Profound dark SaaS aesthetic.
> **Status:** Complete. All components implemented, router restructured, build passes.

## Story 3.1: Router Restructure + Sidebar Path Update

- [✅] **E03-S01-T01** — Restructure `main.tsx` router: `/` → lazy-loaded `LandingPage`, `/dashboard` → `AppShell` with all child routes (`/dashboard/search`, `/dashboard/trends`, `/dashboard/markets`, `/dashboard/geo`)
- [✅] **E03-S01-T02** — Update `Sidebar.tsx` nav links to `/dashboard/*` prefix. Fix `active` comparisons for new path structure.

## Story 3.2: Globe Data Module

- [✅] **E03-S02-T01** — Create `src/landing/components/globeData.ts` with `latLngToSphere()` conversion utility, route/hotspot TypeScript interfaces
- [✅] **E03-S02-T02** — Add ~8 maritime routes (cyan, slow, low arcs): Shanghai→Rotterdam, Singapore→Hormuz, Long Beach→Yokohama, Houston→Santos, etc.
- [✅] **E03-S02-T03** — Add ~8 air traffic routes (amber, fast, high arcs): NYC→London, Dubai→Singapore, LAX→Tokyo, Frankfurt→Hong Kong, etc.
- [✅] **E03-S02-T04** — Add ~4 military/conflict routes (red): Ukraine, Taiwan Strait, South China Sea, Strait of Hormuz
- [✅] **E03-S02-T05** — Add ~35 hotspot points (ports, airports, conflict zones) with color coding and pulse speed
- [✅] **E03-S02-T06** — Add simplified continent outline coordinates (~200-300 lat/lng pairs)

## Story 3.3: Three.js Globe Components

- [✅] **E03-S03-T01** — Create `Globe.tsx`: dark sphere (`#0a0f14`), lat/lng grid lines every 30°, continent outlines as `<Line>` segments
- [✅] **E03-S03-T02** — Create `GlobeAtmosphere.tsx`: Fresnel edge-glow shader on a back-face sphere (radius 1.02), blue atmospheric halo
- [✅] **E03-S03-T03** — Create `GlobePoints.tsx`: `<instancedMesh>` for ~35 hotspots with `useFrame` pulse animation (scale + opacity), color-coded by type
- [✅] **E03-S03-T04** — Create `GlobeArcs.tsx`: `<QuadraticBezierLine>` arcs with animated `dashOffset` via `useFrame` for moving trail effect. All animation via refs (no setState).
- [✅] **E03-S03-T05** — Create `GlobeCanvas.tsx`: R3F `<Canvas>` wrapper with camera (fov 45, pos [0,0,2.5]), `OrbitControls` (autoRotate 0.3, no zoom/pan), ambient + directional lighting, `dpr={[1,2]}`, `alpha: true`

## Story 3.4: Landing Page UI

- [✅] **E03-S04-T01** — Create `LandingPage.tsx`: full-viewport layout, globe as absolute bg (z-0), gradient overlay (`from-background/80 via-transparent to-background`), minimal nav bar (logo + links), lazy-loaded `GlobeCanvas`
- [✅] **E03-S04-T02** — Create `HeroSection.tsx`: framer-motion staggered reveal, title with gradient text ("Prediction Markets" in blue→cyan), tagline, "Get Started" `<Link to="/dashboard">` CTA + secondary outline button
- [✅] **E03-S04-T03** — Create `FeatureHighlights.tsx`: 4 value-prop cards (OSINT Aggregation, Sentiment Engine, Market Correlation, Real-time Alerts), glass-morphism style (`bg-card/50 backdrop-blur-sm`), lucide-react icons
- [✅] **E03-S04-T04** — Add `ErrorBoundary` around globe for WebGL failure graceful degradation

---

# Epic 4: UI/UX Transformation (P0) — ⬜ NOT STARTED

> Fix broken CSS tokens and transform to Supabase + Profound premium dark aesthetic.
> **Depends on:** Epic 1, Epic 2, Epic 5 (partial).
> **Reference:** supabase.com/docs, tryprofound.com

## Story 4.1: CSS Token Fix + Dark Theme Tuning

> Fix the root cause of broken UI: unregistered Tailwind tokens. Tune dark values to Profound depths.

- [ ] **E04-S01-T01** — Fix `@theme inline` in `src/index.css`: register `bg-primary`, `bg-secondary`, `bg-card`, `bg-elevated`, `bg-hover`, `text-primary`, `text-secondary`, `text-tertiary`, `border-subtle`, `border-strong` as aliases to shadcn tokens.
- [ ] **E04-S01-T02** — Tune `.dark` values to Profound depths: `--background: #0a0a0a`, `--card: #111111`, `--border: #1e1e1e`, `--secondary/#muted/#accent: #1a1a1a`. Add `--bg-elevated`, `--bg-hover`, `--text-tertiary`, `--border-subtle`, `--border-strong` base tokens.
- [ ] **E04-S01-T03** — Add shadow tokens (`--shadow-sm`, `--shadow-md`) to `:root`. Update light theme correspondingly.

## Story 4.2: Layout Shell Polish

> Restyle AppShell, TopBar, Sidebar, and RightPanel to match Supabase Docs aesthetic.

- [ ] **E04-S02-T01** — `AppShell.tsx`: flush columns, remove decorative rounded borders and margins. Separate panels with `border-l border-border` only.
- [ ] **E04-S02-T02** — `TopBar.tsx`: minimal breadcrumb with slash separators, `h-12`, remove "Active Events" counter, `border-b border-border`.
- [ ] **E04-S02-T03** — `Sidebar.tsx`: Supabase-style clean nav — `w-56`, `bg-background`, lowercase section headers, tighter `py-1.5` items, `hover:bg-accent/50` (no hardcoded `bg-white/5`), active indicator.
- [ ] **E04-S02-T04** — `RightPanel.tsx`: clean detail sidebar — replace hardcoded `bg-white/*` and `border-white/*` with theme tokens, `text-xs font-medium` labels (no uppercase tracking-widest), smaller activity dots.

## Story 4.3: Feed Visual Polish

> Restyle feed components to match Profound's clean dark card aesthetic.

- [ ] **E04-S03-T01** — `FeedFilters.tsx`: minimal filter bar — remove `SlidersHorizontal` icon and "FEED" label, drop `hover:scale-105 active:scale-95`, use `transition-colors duration-150` only.
- [ ] **E04-S03-T02** — `TrendCarousel.tsx`: Profound-style cards — replace "Trending Topics" + pulse dot with minimal label, `bg-card border-border`, remove `active:scale-[0.98]`.
- [ ] **E04-S03-T03** — `FeedItemRow.tsx`: clean rows — remove left accent bar, `hover:bg-accent/30`, fix all broken `bg-bg-*`/`text-text-*` classes, muted source badge, sparkline opacity 40%→80% on hover.

## Story 4.4: Build Fix

> Fix 38 TypeScript build errors for clean CI.

- [ ] **E04-S04-T01** — Fix unused params (prefix with `_`) in `mockProvider.ts`, generators, hooks. Create stub `authStore.ts` for `wsClient.ts` import. Fix type mismatches in seed data.

---

# Epic 5: Home Feed (P0) — 🏗️ PARTIAL (rebuilt)

> Feed view, event cards, clustering, trending bar integration, and virtualization.
> **Depends on:** Epic 1 (shell, UI components), Epic 2 (types, mock data, hooks).
> **Blocks:** None directly (parallel with Epics 7-9).
> **Status:** HomeFeed, FeedItemRow, FeedFilters, TrendCarousel, feedStore exist. Expansion, clustering, severity indicators pending.

## Story 5.1: Trending Bar

> Horizontal scrolling chip bar with all trend data visible.

- [ ] **E05-S01-T01** — Create `TrendingBar.tsx` — Horizontal scrolling container (64px height). Renders 10-12 `TrendChip` components. Overflow: horizontal scroll with momentum. Left/right scroll buttons on hover at edges. Consumes `useTrends()` hook.
- [ ] **E05-S01-T02** — Create `TrendChip.tsx` — Two-line chip (~220px wide). Line 1: category color dot, hashtag label, velocity arrow+%, market badge icon (if linked). Line 2: lifecycle label, event count. Click handler: `trendsStore.selectTrend(id)`. Selected state: accent border + background highlight.
- [ ] **E05-S01-T03** — Create `TrendLifecycleBadge.tsx` — Small badge showing lifecycle state: Emerging (pulsing outline), Trending (filled), Peaking (filled + glow), Cooling (faded). Animate transitions between states with 200ms glow pulse via framer-motion.
- [ ] **E05-S01-T04** — Implement "View All Trends" button at the end of the bar. Opens a full trending dashboard in the right panel or as a modal with: all trends listed, historical velocity charts per trend, lifecycle stage indicators, and drill-down to topic pages.

## Story 5.2: Feed Container & Cards

> Virtualized feed with mixed-density cards and media auto-expansion.

- [ ] **E05-S02-T01** — Create `FeedContainer.tsx` — Wraps `react-virtuoso` `<Virtuoso>` component. Passes `useFeed()` data. Handles variable-height rows. Overscan: 50 items. Shows `FeedSkeleton` during initial load. Infinite scroll: loads more items at bottom.
- [ ] **E05-S02-T02** — Create `FeedCard.tsx` — Base event card. Renders: source icon + channel name, `Timestamp`, content body, entity tag `Chip[]`, trend hashtag `Badge[]`, sentiment stance `Badge` (if relevant), market correlation `Badge`, geo coordinate `DataLabel`. Implements signal-based density: high-signal events (severity > 70, market-linked, or velocity > threshold) render as expanded. Others render as compact.
- [ ] **E05-S02-T03** — Create `FeedCardCompact.tsx` — Compact variant (~80px). Shows: source icon, title/first line of content, timestamp, key badges (severity, trend). No media, no body text.
- [ ] **E05-S02-T04** — Create `FeedCardExpanded.tsx` — Expanded variant (~200px+). Shows: full content body, auto-expanded images (inline), video thumbnails with play icon, all badges, all entity chips. Action buttons: pin to watchlist, open in Geo, expand detail (→ right panel), share.
- [ ] **E05-S02-T05** — Create `FeedSkeleton.tsx` — Loading skeleton for the feed. Renders 5-7 skeleton cards matching the mixed-density layout. Animated pulse.
- [ ] **E05-S02-T06** — Create `FeedFilters.tsx` — Filter bar above feed or in sidebar. Source type toggles, severity threshold slider, category filter dropdown. Updates `feedStore` filters, which triggers TanStack Query refetch.

## Story 5.3: Event Clustering

> Lead card + "N more from this story" expandable clusters.

- [ ] **E05-S03-T01** — Create `FeedCluster.tsx` — Renders the lead card (highest signal in cluster) followed by a "N more from this story" toggle. Toggle expands to show remaining cluster items inline. Collapse animation via framer-motion.
- [ ] **E05-S03-T02** — Implement clustering logic in `feed.utils.ts` — Group feed items by `clusterId`. Sort each cluster by signal score (severity * velocity * market-linkage). Lead card = highest score. Apply clustering to feed before rendering.
- [ ] **E05-S03-T03** — Wire trend selection to feed filtering: when `trendsStore.selectedTrendId` changes, `feedStore.activeTrendFilter` updates, TanStack Query refetches with trend filter, feed re-renders showing only items in that cluster. "All Trends" deselection shows the blended "For You" feed (70% velocity + 30% recency ranking).

---

# Epic 6: UI/UX Transformation (P0) — ✅ COMPLETE

> Fix broken CSS tokens and transform to Supabase + Profound premium dark aesthetic.
> **Depends on:** Epic 1, Epic 2, Epic 5 (partial).
> **Reference:** supabase.com/docs, tryprofound.com

## Story 6.1: CSS Token Fix + Dark Theme Tuning

- [✅] **E06-S01-T01** — Fix @theme inline: register bg-primary/secondary/card/elevated/hover, text-primary/secondary/tertiary, border-subtle/strong aliases
- [✅] **E06-S01-T02** — Tune .dark values to Profound depths (#0a0a0a bg, #111111 card, #1e1e1e border)
- [✅] **E06-S01-T03** — Add shadow tokens and update light theme correspondingly

## Story 6.2: Layout Shell Polish

- [✅] **E06-S02-T01** — AppShell: flush columns, remove decorative rounded borders
- [✅] **E06-S02-T02** — TopBar: minimal breadcrumb with slash separators, remove event counter
- [✅] **E06-S02-T03** — Sidebar: Supabase-style clean nav, theme tokens, tighter spacing, active state
- [✅] **E06-S02-T04** — RightPanel: clean detail sidebar, replace hardcoded white/* with theme tokens

## Story 6.3: Feed Visual Polish

- [✅] **E06-S03-T01** — FeedFilters: minimal filter bar, remove bouncy scale animations, clean button-like badges
- [✅] **E06-S03-T02** — TrendCarousel: Profound-style cards, subtle transitions, tighter padding
- [✅] **E06-S03-T03** — FeedItemRow: clean rows, fix broken token classes, subtle hover, remove accent bar

## Story 6.4: Build Fix

- [✅] **E06-S04-T01** — Fix 37 TypeScript errors (unused params, missing authStore/flagsStore stubs, wrong import paths in seed files, erasableSyntaxOnly compliance, type mismatches)

---

# Epic 7: Trending Bar (P0) — ⬜ NOT STARTED (new codebase)

> Deep-linked from Epic 5 but with its own view-all and topic page navigation.
> **Depends on:** Epic 1, Epic 2.
> **Status:** Needs re-implementation in new codebase.

## Story 7.1: View All Trends Dashboard

> Full trending topics view accessible from the trending bar.

- [ ] **E07-S01-T01** — Create `ViewAllTrends.tsx` — Full-page or right-panel view showing all active trends in a sortable list. Columns: hashtag, category, lifecycle, velocity (with sparkline), event count (24h), linked market count. Sortable by each column.
- [ ] **E07-S01-T02** — Add historical velocity mini-chart (Recharts sparkline) for each trend in the view-all list. Shows 24h velocity curve. Color matches lifecycle state.
- [ ] **E07-S01-T03** — Implement lifecycle filter in ViewAllTrends: toggle to show only Emerging, Trending, Peaking, or Cooling. Default: show all.

## Story 7.2: Trend ↔ Markets Linking

> Handle trends with and without linked markets.

- [ ] **E07-S02-T01** — When user clicks a trend with linked markets: filter Markets panel to show only correlated contracts. Display market cards with sentiment delta.
- [ ] **E07-S02-T02** — When user clicks a trend with NO linked markets: show "Related Markets" fallback section with semantically similar markets. Calculate similarity using shared entities. Never show empty panel.
- [ ] **E07-S02-T03** — Add market-linked badge (📊 icon) to trend chips. Tooltip on hover shows linked market count and top market question.

## Story 7.3: Trend Chip Interactions

> Hover, selection, and real-time update behavior.

- [ ] **E07-S03-T01** — Implement chip selection state: selected chip gets accent border, slightly lighter background. Only one chip selected at a time. Click again to deselect (returns to "For You" feed).
- [ ] **E07-S03-T02** — Implement real-time chip updates: when `trendsStore.trends` updates (via polling/WS), chip order may change (velocity re-sort). Animate position changes with framer-motion `layoutId`.
- [ ] **E07-S03-T03** — Implement new trend arrival animation: when a new trend enters the bar, it slides in from the left with a brief highlight pulse (300ms).

---

# Epic 8: Sentiments Engine (P0) — ⬜ NOT STARTED (new codebase)

> The core intelligence feature: question tracking, stance visualization, predictions.
> **Depends on:** Epic 1, Epic 2.
> **This is the highest-priority feature after foundation.**
> **Status:** Needs re-implementation in new codebase.

## Story 8.1: Sentiments Panel

> Main view listing tracked prediction questions.

- [ ] **E08-S01-T01** — Create `SentimentsPanel.tsx` — Scrollable list of `QuestionCard` components. Sort controls at top: Market Δ (default), Velocity, Volume, Watchlist. Consumes `useSentimentQuestions()` hook.
- [ ] **E08-S01-T02** — Create `QuestionCard.tsx` — Collapsed card showing: market question text (truncated to 2 lines), `ProbabilityDisplay` for market price, `ProbabilityDisplay` for sentiment probability, `MarketDeltaBadge`, `ConfidenceBadge` (with opacity treatment), `DeltaIndicator` for sentiment direction. Click to expand.
- [ ] **E08-S01-T03** — Create `MarketDeltaBadge.tsx` — Shows the difference between sentiment and market probability. Color-coded: green if gap > 10% (underpricing signal), amber if 5-10%, red if < -10% (overpricing). Format: "+23%" with arrow.
- [ ] **E08-S01-T04** — Implement sort behavior: when sort changes, list re-orders with framer-motion `layoutId` animation. Largest delta/velocity/volume surfaces to top.

## Story 8.2: Expanded Question Card

> Full sentiment breakdown visible on card expansion.

- [ ] **E08-S02-T01** — Create `QuestionCardExpanded.tsx` — Expands below the collapsed card with animation. Contains: StanceDistribution, SentimentTimeline, KeyVoices, PredictionBrief. Collapse on click or new selection.
- [ ] **E08-S02-T02** — Create `StanceDistribution.tsx` — Horizontal bar chart (or pie chart) showing percentage breakdown: Supports YES (green), Supports NO (red), Neutral (gray). Labels with counts: "YES: 342 (54%) · NO: 218 (35%) · NEUTRAL: 68 (11%)". Recharts-based.
- [ ] **E08-S02-T03** — Create `SentimentTimeline.tsx` — 24h line chart showing confidence-weighted sentiment probability over time. X-axis: time (24h). Y-axis: 0-100%. Line color: accent cyan. Shaded area for confidence band. Recharts-based.

## Story 8.3: Key Voices & Tweets

> Influential accounts driving sentiment, tiered by plan.

- [ ] **E08-S03-T01** — Create `KeyVoices.tsx` — Shows the most influential accounts per stance. Two columns: "Driving YES" and "Driving NO". Each entry: avatar, display name, handle, credibility badge, representative tweet text. Max 5 per stance (Pro tier). Free tier: show aggregate count only. Quant tier: "View all N tweets" link.
- [ ] **E08-S03-T02** — Implement tier gating in KeyVoices: check `authStore.tier`. Free → show message "Upgrade to Pro to see key voices". Pro → show 5 per stance. Quant → show all + "Export" button.
- [ ] **E08-S03-T03** — Style individual tweet entries: dark card, source icon, handle in mono, tweet text, engagement metrics (likes, retweets), stance badge (YES/NO color), confidence score.

## Story 8.4: AI Prediction Brief

> Clean intelligence summary card.

- [ ] **E08-S04-T01** — Create `PredictionBrief.tsx` — Clean intelligence summary card with structured sections. Renders: section header ("Sentiment Analysis"), assessment paragraph, confidence assessment, market delta + signal, historical accuracy callout, caveat, timestamp. Uses Inter sans-serif, monospace only for numerical values. See IMPLEMENTATION-PLAN.md Section 5 for exact spec.
- [ ] **E08-S04-T02** — Style the prediction brief: Inter sans-serif for all text, monospace only for numerical values (percentages, deltas). Card with subtle left border accent in cyan, rounded corners consistent with the design system. Section headers in medium-weight Inter, sentence case. Clean, modern SaaS card styling.
- [ ] **E08-S04-T03** — Implement tier gating: Free → hidden with "Upgrade to see AI analysis" upsell. Pro/Quant → visible.

## Story 8.5: Add Question Flow

> Trending suggestions first, then search.

- [ ] **E08-S05-T01** — Create `AddQuestionFlow.tsx` — "Add Question" button at bottom of sentiments panel. Opens a flow: Step 1: show trending-linked questions as suggestions (questions linked to currently trending topics). Step 2: if user doesn't find what they want, show search input to find any market question.
- [ ] **E08-S05-T02** — Implement the suggestion list: query mock data for questions linked to trending topics that the user isn't already tracking. Show question text, market probability, trend hashtag badge. Click to track.
- [ ] **E08-S05-T03** — Implement search fallback: text input with autocomplete against all market questions. 200ms debounce. Results show question text + platform + probability. Click to track.
- [ ] **E08-S05-T04** — Implement free tier limit: when user has 3 tracked questions, "Add Question" button shows "Upgrade to track more" instead. Disable tracking action. Show upsell.

## Story 8.6: Sentiment in Other Views

> Surface sentiment data throughout the app.

- [ ] **E08-S06-T01** — Add sentiment stance badges to `FeedCard` when a feed item is relevant to a tracked prediction question. Show stance (YES/NO/Neutral) color dot + aggregate sentiment percentage.
- [~] **E08-S06-T02** — Add sentiment delta indicator to `MarketCard` in the Markets panel. Show sentiment probability alongside market probability with delta badge. *(Deferred: MarketCard not yet built — will be implemented in Epic 8.)*
- [~] **E08-S06-T03** — Create sentiment summary section for Topic Pages (consumed by `TopicSentiment.tsx`). Show aggregate sentiment for all linked prediction questions. *(Deferred: TopicPages not yet built — will be implemented in Epic 7.)*

---

# Epic 9: Search (P0) — ⬜ NOT STARTED (new codebase)

> Global search with 2-char autocomplete, dropdown overlay, and fixed-order sections.
> **Depends on:** Epic 1, Epic 2.
> **Status:** Needs re-implementation in new codebase.

## Story 9.1: Search Bar

> Always-visible search input in the top bar.

- [ ] **E09-S01-T01** — Create `SearchBar.tsx` — Text input in `TopBar`. Placeholder: "Search topics, markets, entities...". Triggers search on ≥2 characters with 200ms debounce. `Escape` clears and closes. `Cmd+K` / `Ctrl+K` shortcut to focus.
- [ ] **E09-S01-T02** — Wire search bar to `searchStore`: update query, open/close dropdown. Handle recent searches: show last 5 searches when input is focused and empty.
- [ ] **E09-S01-T03** — Implement keyboard navigation: arrow keys move through dropdown results, `Enter` selects, `Escape` closes.

## Story 9.2: Search Dropdown

> Overlay dropdown with fixed-order sections.

- [ ] **E09-S02-T01** — Create `SearchDropdown.tsx` — Absolute-positioned overlay below search bar. Fixed-order sections: Trends (max 3), Markets (max 3), Sentiments (max 3), Events (max 5). Section headers in medium-weight sans-serif, sentence case. "View all results" link at bottom.
- [ ] **E09-S02-T02** — Create `SearchSection.tsx` — Renders a section header + list of `SearchResultItem` components. Shows section even if empty (with "No matching {type}" message).
- [ ] **E09-S02-T03** — Create `SearchResultItem.tsx` — Result row with type-specific rendering. Trends: hashtag + velocity + lifecycle. Markets: question + probability + delta. Sentiments: question + sentiment %. Events: source + content snippet + timestamp.
- [ ] **E09-S02-T04** — Implement click-outside-to-close behavior. Use Radix `Popover` or custom hook with ref detection.

## Story 9.3: Search Actions

> Navigation from search results.

- [ ] **E09-S03-T01** — Implement result click actions: Trend result → navigate to topic page + select trend. Market result → navigate to markets view + select market. Sentiment result → navigate to sentiments view + expand question. Event result → open event detail in right panel.
- [ ] **E09-S03-T02** — Implement "View all results" navigation: navigate to `/app/search?q={query}`. Create `SearchResultsView.tsx` with full-page results, same fixed-order sections but with pagination.
- [ ] **E09-S03-T03** — Implement saved searches: "Save this search" action in dropdown. Saved searches appear in search dropdown when focused. Saved searches can be deleted.

---

# Epic 10: Topic Pages + UI/UX Polish (P0) — 🏗️ PARTIAL

> Multi-panel dashboard view for trend drill-downs, plus a full design system uplift to Linear-quality premium dark SaaS aesthetic.
> **Depends on:** Epic 1, Epic 2, Epic 5 (trends), Epic 8 (sentiments).
> **Status:** Stories 7.6 (design system) and 7.7 (base UI atoms) complete. Stories 7.1-7.5 pending.

## Story 10.1: Topic Page Layout

> Dashboard-style layout scoped to a single topic.

- [ ] **E10-S01-T01** — Create `TopicPageView.tsx` — Route: `/app/topic/:trendId`. Multi-panel dashboard layout. Consumes trend data from `useTrends()` filtered by trendId. Renders TopicHeader + a grid of sections.
- [ ] **E10-S01-T02** — Create `TopicHeader.tsx` — Header section with: generated hashtag (large, bold), lifecycle badge, velocity sparkline (24h), total event count, category tag badge. Full-width at top.
- [ ] **E10-S01-T03** — Implement panel grid layout: 2-column grid below header. Left column (60%): TopicTimeline. Right column (40%): TopicSentiment, TopicMarkets, TopicEntities. Below: TopicRelated.

## Story 10.2: Topic Page Sections

> Individual content sections within the topic dashboard.

- [ ] **E10-S02-T01** — Create `TopicSentiment.tsx` — Aggregate sentiment for all prediction questions linked to this trend. Shows each linked question with sentiment probability, market delta, and confidence. Click to expand in sentiments view.
- [ ] **E10-S02-T02** — Create `TopicMarkets.tsx` — All correlated market contracts. Compact market cards with probability, 24h change, and sentiment delta. Click to open in markets view.
- [ ] **E10-S02-T03** — Create `TopicTimeline.tsx` — Chronological feed of all events in the trend cluster. Uses `react-virtuoso` for virtualization. Same card rendering as home feed but filtered to this trend.
- [ ] **E10-S02-T04** — Create `TopicEntities.tsx` — Key named entities extracted from the cluster. Ranked by mention frequency. Clickable: opens search for that entity.
- [ ] **E10-S02-T05** — Create `TopicGeoContext.tsx` — Mini-map showing event locations if the topic has geographic relevance. Static map image or simplified Three.js + react-three-fiber embed. "Open in Geo" link.
- [ ] **E10-S02-T06** — Create `TopicRelated.tsx` — Related trends that share entities or semantic overlap. Rendered as a horizontal row of compact TrendChips. Click to navigate to that topic page.

## Story 10.3: Activity Timeline Component [UI/UX]

> Create a reusable activity timeline component matching Linear's activity feed pattern. Used in Topic Pages, feed detail, and right panel.

- [ ] **E10-S03-T01** — Create `ActivityTimeline.tsx` — Vertical timeline with: left gutter (avatar, 28px), connector line (1px `--color-border-subtle`), content area. Each entry: avatar/icon + author name (600 weight) + action text + relative timestamp (`--color-text-tertiary`). Match Linear's "Activity" section exactly.
- [ ] **E10-S03-T02** — Create `ActivityEntry.tsx` variants: (a) **Comment** — avatar + name + timestamp, body text below with generous padding. (b) **Action** — icon (colored dot or lucide icon) + action text inline (e.g., "added the label **Performance** and **iOS**" with bold entity names). (c) **Status change** — colored status dot + "moved from **Todo** to **In Progress**" with bold state names.
- [ ] **E10-S03-T03** — Style entity references within activity text using `.inline-code` for IDs/hashtags and `<strong>` for named entities. Match Linear's rendering of `vehicle_state` (code block) and "Performance" (bold) inline in activity text.
- [ ] **E10-S03-T04** — Wire `ActivityTimeline` into the right panel's trend-detail and feed-detail views. Show recent events, classification changes, and market movements as activity entries. Use the mock data engine to generate activity entries.

## Story 10.4: Right Panel — Detail View Polish [UI/UX]

> Redesign the right panel detail views to match Linear's clean detail sidebar: structured metadata section, activity feed, and contextual actions.

- [ ] **E10-S04-T01** — Create `DetailMetadata.tsx` — Structured metadata display for the right panel header. Renders key-value pairs in a clean vertical stack: status (colored dot + label), priority (icon + label), assignees (avatar stack), labels (badge row). Match Linear's right panel metadata section (Status: In Progress, Priority: High, Labels, etc.).
- [ ] **E10-S04-T02** — Redesign `RightPanel.tsx` header. Add: close button (X, top-right), entity type icon + title, ID badge (e.g., "ENG-2703" → market ID or trend ID in monospace). Use shadcn `Separator` below the header. Match Linear's "ENG-2703" ID display.
- [ ] **E10-S04-T03** — Structure right panel content into collapsible sections: **Details** (metadata), **Activity** (timeline), **Related** (linked markets/trends). Each section uses `SectionHeader.tsx` (from E01-S09) and is collapsible via click on header. Default: all expanded.
- [ ] **E10-S04-T04** — Add a conversational input at the bottom of the right panel for notes/annotations. Match Linear's "Message GitHub Copilot..." input: fixed to bottom, subtle border-top, `Input` with placeholder, send button (arrow-up icon), attachment button. For MVP this is UI-only (no backend) but sets up the pattern.

## Story 10.5: Micro-Interactions & Animation Polish [UI/UX]

> Add subtle micro-interactions and animation refinements that differentiate a premium UI from a functional one.

- [ ] **E10-S05-T01** — Add page transition animations. When navigating between views (Home → Sentiments → Markets), apply a subtle fade-in (opacity 0→1, 150ms) on the main content area. Use framer-motion `AnimatePresence` on the route outlet. No slide or scale — just opacity for speed.
- [ ] **E10-S05-T02** — Add staggered list animations for feed items and search results. When new items appear: stagger each item's opacity+translateY animation by 30ms. Total stagger cap: 300ms (first 10 items animated, rest appear instantly). Use framer-motion `variants` with `staggerChildren`.
- [ ] **E10-S05-T03** — Add smooth counter animations for numerical changes. When a probability, delta, or velocity number updates: animate the value change over 300ms with easing. Use a `useAnimatedNumber()` hook that interpolates between old and new values using `requestAnimationFrame`.
- [ ] **E10-S05-T04** — Refine dropdown/popover animations globally. All dropdowns (search, sidebar menus, filters) should use: `opacity 0→1, translateY -4px→0, scale 0.98→1` with 150ms ease-out on enter, 100ms ease-in on exit. Standardize this as a shared framer-motion variant object.
- [ ] **E10-S05-T05** — Add skeleton-to-content transitions. When data loads and skeletons are replaced by real content: crossfade (skeleton fades out while content fades in) over 200ms. Prevents the jarring "flash" of skeleton→content swap.

## Story 10.6: Design System Foundation — shadcn/ui + Theme [UI/UX]

> Install and configure shadcn/ui. Establish the dark theme color palette with desaturated near-blacks and the dual CSS variable system. Set up typography scale.

- [✅] **E10-S06-T01** — Install shadcn/ui (New York style, Neutral base). Configure `components.json` with correct path aliases. Install dependencies: `class-variance-authority`, `cmdk`, `radix-ui`, `tailwindcss-animate`.
- [✅] **E10-S06-T02** — Add 13 shadcn primitives: button, input, badge, card, tooltip, dropdown-menu, dialog, tabs, separator, scroll-area, skeleton, avatar, command. All in `src/components/ui/`.
- [✅] **E10-S06-T03** — Configure dark theme in `src/index.css`: near-black neutrals (`--background: #0f0f0f`, `--card: #141414`, `--secondary: #262626`), desaturated borders, chart colors. Light theme in `:root` with oklch values.
- [✅] **E10-S06-T04** — Set up `@theme inline` block mapping CSS variables to Tailwind utilities (`--color-background`, `--color-foreground`, etc.). Configure `@custom-variant dark` for `.dark` class selector.
- [✅] **E10-S06-T05** — Configure typography: Inter (sans) + JetBrains Mono (mono) via `@theme inline`. Set up sidebar-specific tokens (`--sidebar`, `--sidebar-foreground`, etc.).
- [✅] **E10-S06-T06** — Set up `cn()` utility in `src/lib/utils.ts` (clsx + tailwind-merge). Ensure all shadcn components import from `@/lib/utils`.

## Story 10.7: Base UI Atoms [UI/UX]

> Domain-specific display atoms for intelligence data: deltas, probabilities, velocities, timestamps, badges, sparklines.

- [✅] **E10-S07-T01** — Create `src/components/base/Chip.tsx` — Compact label chip for categories, tags, and trend identifiers.
- [✅] **E10-S07-T02** — Create `src/components/base/DataLabel.tsx` — Sans-serif label in sentence case. Monospace reserved for numerical data only.
- [✅] **E10-S07-T03** — Create `src/components/base/DeltaIndicator.tsx` — Signed delta display with color (green positive, red negative). Format: "+12.4%" with arrow.
- [✅] **E10-S07-T04** — Create `src/components/base/ProbabilityDisplay.tsx` — Large probability percentage with Bloomberg-style formatting.
- [✅] **E10-S07-T05** — Create `src/components/base/VelocityIndicator.tsx` — Velocity metric with direction arrow and magnitude.
- [✅] **E10-S07-T06** — Create `src/components/base/ConfidenceBadge.tsx` — Confidence level badge with opacity mapping (Low=60%, Med=85%, High=100%).
- [✅] **E10-S07-T07** — Create `src/components/base/SeverityDot.tsx` — Colored dot indicator for severity levels (low/medium/high/critical).
- [✅] **E10-S07-T08** — Create `src/components/base/Sparkline.tsx` — Mini line chart (Recharts) for inline trend visualization.
- [✅] **E10-S07-T09** — Create `src/components/base/Timestamp.tsx` — Relative when recent ("2m ago"), absolute when older ("Mar 2, 14:23 UTC"). Always UTC.

---

# Epic 11: Markets Panel (P0)

> Cross-platform prediction market aggregation with sparklines and sentiment delta.
> **Depends on:** Epic 1, Epic 2.

## Story 11.1: Markets View

> Main markets view with full card list.

- [ ] **E11-S01-T01** — Create `MarketsView.tsx` — Full view for the markets tab. Contains `MarketsPanel` + sort/filter controls. Filters: category, platform (Polymarket/Kalshi/all), probability range, sentiment delta range.
- [ ] **E11-S01-T02** — Create `MarketsPanel.tsx` — Scrollable list of `MarketCard` components. Uses `react-virtuoso` if >30 items. Consumes `useMarkets()` hook. Sortable by: probability change, volume, sentiment delta, linked trend velocity.

## Story 11.2: Market Cards

> Full cards with sparklines and cross-platform display.

- [ ] **E11-S02-T01** — Create `MarketCard.tsx` — Full card with: question text, platform badge, `ProbabilityDisplay` (current), `DeltaIndicator` (24h change), volume, `Sparkline` (24h price history), `DeltaIndicator` for sentiment delta, linked trend chips. Click to expand in right panel.
- [ ] **E11-S02-T02** — Create `MarketSparkline.tsx` — Small line chart (Recharts) showing 24h price history. No axes, no labels. Line color: accent cyan. Width: 100px, height: 32px. Subtle gradient fill below line.
- [ ] **E11-S02-T03** — Create `CrossPlatformDelta.tsx` — When a market exists on both Polymarket and Kalshi: show primary platform's price prominently, secondary platform as a smaller badge with delta. Format: "Polymarket: 50¢ · Kalshi: +3¢". Highlight spreads > 5% as arbitrage signals.

## Story 11.3: Market Detail

> Expanded market view in the right panel.

- [ ] **E11-S03-T01** — Create `MarketDetail.tsx` — Expanded view in right panel. Full-size price chart (24h with zoom controls), cross-platform comparison side-by-side, linked sentiment questions with deltas, linked trends, event timeline (events correlated to this market), volume history.
- [ ] **E11-S03-T02** — Implement market correlation display: show which trends and events are correlated to this market with confidence scores. Render as a list of trend chips + event snippets.
- [ ] **E11-S03-T03** — Add "Set Alert" action to market detail: opens alert config pre-filled with market ID and type "market_probability_delta". Threshold input field.

---

# Epic 12: Alert System (P0)

> Alert configuration, display, and toast notifications.
> **Depends on:** Epic 1, Epic 2, Epic 9 (stores).

## Story 12.1: Alert Configuration

> Create and manage alert rules.

- [ ] **E12-S01-T01** — Create `AlertConfig.tsx` — Alert creation form. Fields: alert type (dropdown: sentiment reversal, trend spike, market delta, POI severity, whale activity), target (question/trend/market selector), threshold (numeric input with unit), channel (in-app only for MVP). Save creates entry in `alertsStore`.
- [ ] **E12-S01-T02** — Create `AlertList.tsx` — List of active alert configs. Each row: type icon, target name, threshold, enabled toggle. Swipe/click to delete.
- [ ] **E12-S01-T03** — Create `AlertsConfigView.tsx` — Route: `/app/alerts`. Full view with AlertList + "Create Alert" button. Shows alert history: past triggered alerts with timestamp and message.

## Story 12.2: Alert Display

> Toast notifications and notification center.

- [ ] **E12-S02-T01** — Create `AlertToast.tsx` — Toast notification appearing bottom-right. Severity-colored left border. Content: alert type icon, message text, timestamp, dismiss button. Auto-dismiss after 8s. Stack up to 3 visible toasts.
- [ ] **E12-S02-T02** — Integrate alert evaluation with mock data: `alertGenerator.ts` evaluates alert configs against incoming mock data. When threshold is crossed, dispatch alert to `alertsStore.activeAlerts` and trigger toast.
- [ ] **E12-S02-T03** — Add unread alert badge to sidebar Alerts nav item. Badge shows count of unread alerts. Click navigates to alerts view and marks all as read.

## Story 12.3: Alert-Triggered Navigation

> Clicking an alert navigates to the relevant context.

- [ ] **E12-S03-T01** — Implement click actions on alerts: sentiment reversal → navigate to sentiments view + expand question. Trend spike → navigate to home + select trend. Market delta → navigate to markets + select market. Wire up in AlertToast and AlertList.
- [ ] **E12-S03-T02** — Implement alert history persistence: store last 50 triggered alerts in Zustand persist store. Show in AlertsConfigView history section.

---

# Epic 13: Auth & Onboarding (P0)

> Landing page, login/register, mock auth, and interactive onboarding tour.
> **Depends on:** Epic 1 (shell, routing, auth guard).

## Story 13.1: Landing Page

> Unauthenticated marketing + login gate.

- [ ] **E13-S01-T01** — Create `LandingView.tsx` — Full-page landing. PolyMatic branding, tagline ("Real-time Intelligence for Prediction Markets"), feature highlights (3-4 key value props), "Sign In" and "Get Started" CTAs. Dark theme, cinematic aesthetic. No app access without login.
- [ ] **E13-S01-T02** — Create animated hero section: subtle background animation (pulsing grid, data stream visualization, or globe silhouette). Keep performance-conscious — pure CSS or lightweight canvas.
- [ ] **E13-S01-T03** — Add feature highlight cards: Sentiments Engine, Trending Intelligence, Market Correlation, Real-time Alerts. Each with icon, title, and one-line description.

## Story 13.2: Login & Register

> Authentication forms with mock auth support.

- [ ] **E13-S02-T01** — Create `LoginForm.tsx` — Email + password fields, "Sign In" button, "Forgot password" link, divider, OAuth buttons (Google, GitHub). Error states for invalid credentials. Loading state during auth.
- [ ] **E13-S02-T02** — Create `RegisterForm.tsx` — Email + password + confirm password fields, "Create Account" button, OAuth buttons. Password strength indicator.
- [ ] **E13-S02-T03** — Create `LoginView.tsx` — Route: `/login`. Contains tab toggle between Login and Register forms. PolyMatic branding above form.
- [ ] **E13-S02-T04** — Create `AuthProvider.tsx` — Context provider wrapping the app. Initializes `authStore` on mount, checks for existing token in storage, attempts silent refresh. Provides `useAuth()` hook.
- [ ] **E13-S02-T05** — Implement mock auth in `mockProvider.ts` — `login()` accepts any email/password, returns mock JWT + user with Pro tier. `refreshToken()` always succeeds. Simulated 500ms latency.

## Story 13.3: Onboarding Tour

> Interactive step-by-step tour for first-time users.

- [ ] **E13-S03-T01** — Create `OnboardingTour.tsx` — Full-screen overlay tour with step indicator (dots/progress bar). Steps: 1. Welcome + value prop, 2. Pick 3 topics (from trending), 3. Track your first sentiment question, 4. Set up your first alert, 5. Tour complete → enter app. "Skip Tour" option on every step.
- [ ] **E13-S03-T02** — Create `TopicPicker.tsx` — Grid of trending topic cards. User selects 3. Selected topics get added to their feed filters / watchlist. Minimum 3 required to proceed (or skip).
- [ ] **E13-S03-T03** — Create `onboarding.config.ts` — Tour step definitions: title, description, target element (for highlight), action callback (for step completion). Flexible enough to adjust step order.
- [ ] **E13-S03-T04** — Wire onboarding completion: when tour finishes or is skipped, set `user.onboardingComplete = true` in authStore. Navigate to `/app/home`. Never show tour again for this user.

---

# Epic 14: Geo View (P1)

> Three.js + react-three-fiber 3D globe with data layers and interactions.
> **Depends on:** Epic 1, Epic 2.
> **Feature-flagged: `enableGeoView`.**

## Story 14.1: Globe Setup

> Three.js + react-three-fiber viewer initialization and camera controls.

- [ ] **E14-S01-T01** — Create `GlobeContainer.tsx` — Initialize Three.js + react-three-fiber Viewer via `resium`. Configure: imagery provider (hybrid: vector tiles at zoom-out, satellite at city-level), terrain provider, scene mode (3D). .
- [ ] **E14-S01-T02** — Create `GlobeCamera.tsx` — Camera control manager. Implements `flyTo(lat, lng, altitude)` for smooth camera transitions when navigating from other views. Default position: centered on the area of most activity.
- [ ] **E14-S01-T03** — Create `RegionSelect.tsx` — Tools for selecting regions on the globe: polygon draw, rectangle select, country/admin boundary click. Selected region is stored in `geoStore`. Used for Detect (spatial anomaly detection).
- [ ] **E14-S01-T04** — Integrate with navigation: clicking "Open in Geo" on a geolocated feed event → switch to Geo tab → `flyTo` the event's coordinates. Clicking a POI in sidebar → switch to Geo → fly to POI centroid.

## Story 14.2: Data Layers

> Toggleable OSINT layers rendered on the globe.

- [ ] **E14-S02-T01** — Create `LayerManager.tsx` — Panel (sidebar or overlay) listing all available data layers with toggle switches. Layers load lazily: component not instantiated until toggled on. Shows layer event count badge.
- [ ] **E14-S02-T02** — Create `LayerRenderer.tsx` — Generic layer rendering component. Accepts layer config + data array. Renders markers, polylines, or polygons based on layer type. Handles clustering at configurable zoom thresholds.
- [ ] **E14-S02-T03** — Implement layer-specific renderers: Aircraft (flight paths with altitude coloring), Maritime (vessel tracks with type icons), Earthquakes (magnitude circles with depth coloring), Conflicts (event icons with density heatmap), News (geolocated story clusters). Each as a lazy-loaded sub-component.
- [ ] **E14-S02-T04** — Create `MarkerCluster.tsx` — Cluster markers at zoom-out using Three.js + react-three-fiber clustering. Configurable threshold per layer type. Show count badge on clusters. Click to zoom in and scatter.

## Story 14.3: Globe Interaction

> Event detail, POI display, and motion trails.

- [ ] **E14-S03-T01** — Create `MotionTrail.tsx` — Animated polyline trails for ADS-B and AIS data. Trail fades over time (time-decay opacity). Color by type (aircraft: blue, vessel: orange). GPU-accelerated via Three.js + react-three-fiber primitives.
- [ ] **E14-S03-T02** — Create `GeoDetail.tsx` — Info popup/panel when clicking a marker or POI on the globe. Shows: event details, source, timestamp, linked trends, linked markets, severity. "Open in Feed" action to navigate back to home with this event highlighted.
- [ ] **E14-S03-T03** — Implement cross-view filter carry-over: when navigating from Home → Geo, active trend filter and time window persist. Globe shows only events matching the active trend. Clear filter shows all events.
- [ ] **E14-S03-T04** — Add "Geo context" mini-map to Topic Pages. Static map image showing event locations for the topic. Click opens full Geo view filtered to this topic.

---

# Epic 15: POI System (P1)

> Places of Interest auto-generated from event clustering.
> **Depends on:** Epic 14 (Geo view), Epic 2 (mock data).
> **Feature-flagged.**

## Story 15.1: POI Display

> POI sidebar section and globe rendering.

- [ ] **E15-S01-T01** — Add POI section to sidebar. List of POIs sorted by severity, velocity, or event count. Each row: name, severity dot, velocity indicator, event count, linked market count.
- [ ] **E15-S01-T02** — Click POI in sidebar: switch to Geo view, fly camera to POI centroid, highlight the POI cluster, open GeoDetail panel with full POI information.
- [ ] **E15-S01-T03** — Render POI clusters on globe as colored circles with severity-based radius. Pulsing animation for high-severity POIs.
- [ ] **E15-S01-T04** — Surface POIs on Topic Pages via `TopicGeoContext.tsx` when a trend has geographic relevance.

---

# Epic 16: Detect / Anomaly Detection (P1)

> AI-powered signal detection across views.
> **Depends on:** Epic 2 (mock data), Epic 5 (feed), Epic 8 (sentiments).
> **Feature-flagged: `enableDetect`.**

## Story 16.1: Detect Engine

> Context-appropriate anomaly detection.

- [ ] **E16-S01-T01** — Create `DetectEngine.ts` — Service that runs anomaly detection on provided data. Accepts context (feed, geo region, sentiment question). Returns `SignalCard` objects. Mock implementation uses statistical thresholds (z-score > 2 on event velocity, sentiment reversal detection, market probability jump detection).
- [ ] **E16-S01-T02** — Create signal card output component: shows cluster spikes, sentiment anomalies, market probability deltas, historical analogs (mocked), confidence score, and recommended markets. Clean card rendering consistent with PredictionBrief styling.
- [ ] **E16-S01-T03** — Add "Run Detect" button to Home view (runs on filtered feed/trend), Geo view (runs on selected region), and Sentiments view (runs on selected question). Button triggers analysis and displays results in right panel.
- [ ] **E16-S01-T04** — Implement rate limiting for Detect: Free tier = 0/day, Pro = 5/day, Quant = unlimited. Show remaining count in button label. Upsell when limit reached.

---

# Epic 17: Whale Tracking (P1)

> Large trade monitoring on prediction markets.
> **Depends on:** Epic 2 (mock data), Epic 11 (markets).
> **Feature-flagged: `enableWhaleTracking`.**

## Story 17.1: Whale Activity Display

> Whale trades in feed and markets.

- [ ] **E17-S01-T01** — Create whale trade mock generator: generates large trades (>$10K) on random markets at configurable frequency. Each trade: amount, platform, market, direction (buy YES/NO), timestamp.
- [ ] **E17-S01-T02** — Display whale trades as high-priority feed items in the Home feed. Special card variant with whale icon, trade amount, market question, and direction. Only show when correlated with active trends.
- [ ] **E17-S01-T03** — Add whale activity indicator to `MarketCard`: small whale icon + recent large trade count. Tooltip shows last 3 whale trades with amounts and timestamps.

---

# Epic 18: Timeline & Replay (P1)

> Historical scrubbing and event replay.
> **Depends on:** Epic 2 (mock data), Epic 5 (feed), Epic 8 (sentiments).
> **Feature-flagged: `enableTimeline`.**

## Story 18.1: Timeline Controls

> Scrub through historical data.

- [ ] **E18-S01-T01** — Create `TimelineControls.tsx` — Horizontal time scrubber bar at the bottom of feed/sentiments/geo views. Drag to navigate through time. Play/pause button for replay mode. Speed controls: 1x, 2x, 5x, 10x.
- [ ] **E18-S01-T02** — Implement feed replay: when timeline is scrubbed to a past time, feed shows events from that time window. Events appear at original cadence in replay mode. Forward only in replay.
- [ ] **E18-S01-T03** — Implement sentiment replay: sentiment timeline chart highlights the scrubbed time position. Sentiment scores show the value at that point in time.
- [ ] **E18-S01-T04** — Add scenario bookmarks: save the current time window as a named scenario. Bookmarks appear in a dropdown on the timeline. Click to jump to saved position.

---

# Epic 19: Polish, Performance, Accessibility (P0/Polish)

> Final pass: keyboard nav, ARIA, performance optimization, error states, responsive testing.
> **Depends on:** Epics 5–13 complete.

## Story 19.1: Keyboard Navigation

> Full keyboard accessibility throughout the app.

- [ ] **E19-S01-T01** — Implement sidebar keyboard navigation: Tab through nav items, Enter to select, arrow keys for sidebar menu items.
- [ ] **E19-S01-T02** — Implement feed keyboard navigation: Tab into feed, arrow keys to move between cards, Enter to expand/select, Escape to deselect.
- [ ] **E19-S01-T03** — Implement search keyboard flow: `Cmd+K` to focus search, type to search, arrow keys through results, Enter to select, Escape to close. Full keyboard-only usable.
- [ ] **E19-S01-T04** — Add keyboard shortcuts for layout switching: `Cmd+1` Dashboard, `Cmd+2` Focus, `Cmd+3` Clean. Display shortcut hints in tooltips.

## Story 19.2: ARIA & Screen Reader

> Screen reader support with ARIA labels and live regions.

- [ ] **E19-S02-T01** — Add ARIA labels to all interactive elements: sidebar nav (role="navigation"), feed (role="feed"), search (role="search", aria-expanded), tabs (role="tablist"), modals (role="dialog").
- [ ] **E19-S02-T02** — Implement live regions for dynamic updates: alert toasts (role="alert"), sentiment score changes (aria-live="polite"), trend bar updates (aria-live="polite").
- [ ] **E19-S02-T03** — Add screen reader announcements for state changes: trend selected, question tracked, alert triggered, layout switched.
- [ ] **E19-S02-T04** — Test with VoiceOver (macOS). Document any issues. Fix critical blockers.

## Story 19.3: Reduced Motion

> Respect `prefers-reduced-motion`.

- [ ] **E19-S03-T01** — Implement `prefers-reduced-motion` media query: disable framer-motion animations, disable trend chip glow pulses, disable layout transition animations (instant swap instead). Use Tailwind `motion-reduce:` utilities.
- [ ] **E19-S03-T02** — Add manual "Reduce Motion" toggle in settings/sidebar. Stores preference in localStorage. Overrides system setting if explicitly set.

## Story 19.4: Performance Optimization

> Bundle size, render performance, and memory optimization.

- [ ] **E19-S04-T01** — Analyze bundle with `rollup-plugin-visualizer`. Identify largest chunks. Target: main bundle < 80 KB, largest feature bundle < 60 KB (excluding Three.js + react-three-fiber).
- [ ] **E19-S04-T02** — Optimize feed rendering: verify react-virtuoso is properly recycling DOM nodes. Profile with React DevTools. Target: < 16ms per frame during scroll.
- [ ] **E19-S04-T03** — Optimize TanStack Query caching: ensure stale data is garbage-collected. Set appropriate `gcTime` for each query. Monitor memory with DevTools.
- [ ] **E19-S04-T04** — Implement progressive loading: skeleton screens for all data-dependent views. Prioritize above-fold content. Defer below-fold sections.
- [ ] **E19-S04-T05** — Test on low-end device: throttle CPU 4x and network to 3G in DevTools. Verify app remains usable (feed scrolls, search works, layout doesn't break).

## Story 19.5: Colorblind Accessibility

> Ensure information isn't conveyed by color alone.

- [ ] **E19-S05-T01** — Audit all color-coded elements: severity (green/yellow/red), sentiment (green/red), delta (green/red), trend categories (5 colors). Add secondary indicators (icons, patterns, labels) so no information is conveyed by color alone.
- [ ] **E19-S05-T02** — Test with colorblind simulation (Chrome DevTools emulation: protanopia, deuteranopia, tritanopia). Fix any elements that are indistinguishable.

## Story 19.6: Error States & Edge Cases

> Comprehensive error handling throughout the app.

- [ ] **E19-S06-T01** — Implement error states for all data-dependent views: feed load failure, sentiment data unavailable, markets not loading, search error. Each shows `ErrorBoundary` with actionable message + retry button.
- [ ] **E19-S06-T02** — Implement connection-lost state: when WebSocket disconnects, show banner "Connection lost — reconnecting..." with auto-retry indicator. When mock data generator stops, show appropriate message.
- [ ] **E19-S06-T03** — Implement empty states for all list views: no feed items (initial or filtered), no sentiment questions tracked, no markets matching filter, no search results, no alerts configured. Each uses `EmptyState` component with contextual guidance.
- [ ] **E19-S06-T04** — Test edge cases: viewport at exactly 1024px, rapid trend selection/deselection, search with special characters, tracking 3 questions then trying to add another (free tier), auth token expiry during session.
- [ ] **E19-S06-T05** — Final visual QA: verify all components render correctly in both dark and light themes. Check spacing, alignment, color contrast (WCAG AA), and typography hierarchy.

---

# Epic 20: Equity Market Intelligence (P2)

> Emerging market equity layers: India, Singapore, ASEAN, and global EM comparison.
> **Depends on:** E01 Foundation, E02 Mock Data Engine, E14 Geo View.
> **Blocks:** E24 (AI Market Insight Engine).
> **Target users:** Hedge funds, global macro funds, retail investors, family offices, geopolitical analysts.

## Story 20.1: India Stock Market Intelligence

> Live Indian index tracking, sector heatmap, and capital flow visualization overlaid on Indian economic regions.

- [ ] **E20-S01-T01** — Define TypeScript types for Indian equity data: `IndiaIndex` (name, price, change, changePercent, volume), `IndiaStock` (symbol, name, sector, price, change, marketCap), `SectorHeatmapEntry` (sector, performance, weight). Add to `types/equityMarkets.ts`.
- [ ] **E20-S01-T02** — Build mock data generator for Indian markets: simulate NIFTY 50, BSE SENSEX, NIFTY Next 50, NIFTY 500 index prices with realistic intraday drift. Generate top 20 gainers/losers with sector tags.
- [ ] **E20-S01-T03** — Create `IndiaMarketPanel` component: live index ticker strip (NIFTY 50, SENSEX, Next 50, NIFTY 500), each showing price + delta + sparkline. Auto-refreshes every 5s.
- [ ] **E20-S01-T04** — Create `SectorHeatmap` component: treemap visualization of Indian sectors (IT Services, Semiconductors, Manufacturing, Fintech, Renewable Energy, Pharma, Banking). Color-coded by performance (green positive, red negative). Hover shows sector details.
- [ ] **E20-S01-T05** — Create `TopMovers` component: tabbed view showing top 10 gainers and top 10 losers. Each row: stock symbol, name, price, change%, volume. Sortable columns.
- [ ] **E20-S01-T06** — Create `CapitalFlows` component: bar chart showing FII (Foreign Institutional Investor) and DII (Domestic Institutional Investor) net flows. Daily/weekly/monthly toggle.
- [ ] **E20-S01-T07** — Add India market layer to Cesium globe: overlay market activity markers on major Indian economic regions (Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai). Point size proportional to trading volume. Toggle on/off via sidebar.

## Story 20.2: India Sector Intelligence

> Deep-dive into key Indian sectors driving growth, with policy impact and foreign investment tracking.

- [ ] **E20-S02-T01** — Create `SectorIntelligence` component: card-based view for each key sector (IT Services, Semiconductors, Manufacturing, Fintech, Renewable Energy). Each card: sector momentum indicator, top 5 stocks, 30-day performance chart.
- [ ] **E20-S02-T02** — Build mock generator for sector momentum data: simulate weekly momentum scores (0-100), policy impact events (e.g., "PLI scheme approved for semiconductors"), and foreign investment flow per sector.
- [ ] **E20-S02-T03** — Create `PolicyImpact` component: timeline of government policy events affecting each sector. Each event: date, policy name, affected sector, estimated impact (positive/negative/neutral), source link.
- [ ] **E20-S02-T04** — Create `ForeignInvestmentTracker` component: stacked area chart showing FDI inflows by sector over time. Hover shows exact values. Period selector (1M, 3M, 6M, 1Y).

## Story 20.3: Singapore Market Intelligence

> FTSE Straits Times Index tracking and SGX top 30 company analysis with financial hub overlay.

- [ ] **E20-S03-T01** — Define TypeScript types for Singapore equity data: `SGXCompany` (symbol, name, sector, price, change, marketCap, dividendYield). Add to `types/equityMarkets.ts`.
- [ ] **E20-S03-T02** — Build mock data generator for Singapore markets: simulate FTSE STI index, top 30 SGX companies with sector tags (Finance, REITs, Tech, Industrial, Consumer).
- [ ] **E20-S03-T03** — Create `SingaporeMarketPanel` component: STI index ticker, sector performance breakdown, top 30 company table with sortable columns (price, change, market cap, dividend yield).
- [ ] **E20-S03-T04** — Create `CapitalFlowsSGX` component: capital flow analysis for SGX — foreign vs domestic, sector rotation. Bar chart + trend line.
- [ ] **E20-S03-T05** — Add Singapore financial hub overlay to Cesium globe: marker on Singapore with expandable detail card showing STI performance, top movers, sector breakdown.

## Story 20.4: ASEAN Market Growth Tracker

> Regional growth heatmap and capital rotation analysis across Indonesia, Thailand, Vietnam, Malaysia.

- [ ] **E20-S04-T01** — Define TypeScript types for ASEAN markets: `ASEANIndex` (country, indexName, price, change, changePercent, ytdReturn). Markets: IDX Composite (Indonesia), SET Index (Thailand), VN30 (Vietnam), FTSE Bursa (Malaysia).
- [ ] **E20-S04-T02** — Build mock data generator for ASEAN indices: simulate 4 indices with correlated but distinct price movements. Include YTD returns and volume data.
- [ ] **E20-S04-T03** — Create `ASEANDashboard` component: side-by-side index comparison cards. Each card: country flag, index name, price, change%, YTD return, 30-day sparkline.
- [ ] **E20-S04-T04** — Create `RegionalHeatmap` component: choropleth map overlay on ASEAN region showing relative performance by country. Color intensity = YTD return. Hover shows detailed metrics.
- [ ] **E20-S04-T05** — Create `CapitalRotation` component: Sankey or flow diagram showing capital movement between ASEAN markets. Highlight net inflows/outflows per country.

## Story 20.5: Global Emerging Market Comparison

> Dashboard comparing MSCI EM, NIFTY 50, STI, Bovespa, SA Top 40 with growth metrics.

- [ ] **E20-S05-T01** — Define TypeScript types for global EM comparison: `EmergingMarketIndex` (name, country, price, change, ytdReturn, peRatio, dividendYield, marketCap). Indices: MSCI EM, NIFTY 50, STI Singapore, Brazil Bovespa, South Africa Top 40.
- [ ] **E20-S05-T02** — Build mock data generator for global EM indices: simulate 5 indices with macro-correlated movements. Include PE ratios, dividend yields, total market cap.
- [ ] **E20-S05-T03** — Create `EMComparisonDashboard` component: table view with all 5 indices. Columns: index, country, price, 1D change, YTD, PE ratio, yield, market cap. Sortable by any column. Highlight best/worst performers.
- [ ] **E20-S05-T04** — Create `EMPerformanceChart` component: multi-line chart comparing normalized YTD performance of all 5 indices (rebased to 100). Interactive legend to toggle indices on/off. Tooltip shows exact values on hover.
- [ ] **E20-S05-T05** — Add EM globe overlay: markers on each EM country (India, Singapore, Brazil, South Africa, China) with color-coded performance rings. Click to drill into country-specific panel.

---

# Epic 21: Startup Ecosystem Intelligence (P2)

> Venture ecosystem signals: startup density maps, funding rounds, unicorn tracking, and AI-powered opportunity discovery.
> **Depends on:** E01 Foundation, E02 Mock Data Engine, E14 Geo View.
> **Blocks:** E24 (AI Market Insight Engine).
> **Target users:** Venture capital firms, hedge funds, family offices, geopolitical analysts.

## Story 21.1: India Startup Ecosystem Overlay

> Map startup hubs across India with density, funding, and unicorn data.

- [ ] **E21-S01-T01** — Define TypeScript types for startup ecosystem: `StartupHub` (city, lat, lng, startupCount, totalFunding, unicornCount, topSectors), `Startup` (name, city, sector, stage, valuation, lastFundingRound, lastFundingAmount, founded, employees). Add to `types/startupEcosystem.ts`.
- [ ] **E21-S01-T02** — Build mock data generator for India startup ecosystem: generate hubs for Bangalore, Hyderabad, Delhi NCR, Mumbai, Chennai. Each hub: 50-500 startups, realistic funding distributions, 2-15 unicorns. Generate top 20 startups per hub.
- [ ] **E21-S01-T03** — Create `StartupMapOverlay` component: Cesium globe markers on Indian startup hubs. Marker size proportional to startup density. Color intensity = total funding. Click to expand hub details.
- [ ] **E21-S01-T04** — Create `HubDetailPanel` component: shown in RightPanel on hub click. Shows: city name, total startups, total funding, unicorn count, top sectors pie chart, top 10 startups list.
- [ ] **E21-S01-T05** — Create `UnicornList` component: table of Indian unicorns with columns: name, city, sector, valuation, last round, YoY growth. Sortable. Filter by city/sector.

## Story 21.2: Singapore Startup Ecosystem

> Map Singapore tech ecosystem: fintech, AI, deep tech, Web3 clusters.

- [ ] **E21-S02-T01** — Build mock data generator for Singapore startup ecosystem: generate clusters for Fintech, AI/ML, Deep Tech, Web3, HealthTech. Include VC firms, accelerators (YC SEA, Antler, SOSV), and government grants (EDB, MAS).
- [ ] **E21-S02-T02** — Create `SingaporeEcosystem` component: sector-clustered view of Singapore startups. Each cluster: startup count, total funding, key companies, active VCs. Radar chart showing sector strength.
- [ ] **E21-S02-T03** — Create `VCActivity` component: list of active VCs in Singapore with portfolio size, recent investments, sector focus. Sortable by deal count, total deployed capital.
- [ ] **E21-S02-T04** — Create `AcceleratorTracker` component: cards for major accelerators showing: cohort size, notable alumni, acceptance rate, demo day dates.

## Story 21.3: Startup Funding Signals

> Overlay venture funding activity with signals for Seed through Series C+.

- [ ] **E21-S03-T01** — Define TypeScript types for funding signals: `FundingRound` (startup, stage, amount, date, investors, sector, city, country), `FundingSummary` (totalDeals, totalCapital, averageDealSize, topSector, topCity). Add to `types/startupEcosystem.ts`.
- [ ] **E21-S03-T02** — Build mock data generator for funding signals: simulate 100+ funding events per month across Seed, Series A, B, C+ stages. Realistic amount distributions ($500K-$500M). Include investor names and sectors.
- [ ] **E21-S03-T03** — Create `FundingFeed` component: real-time feed of funding events. Each item: startup name, stage badge (color-coded: Seed=green, A=blue, B=purple, C+=gold), amount, investors, sector. Filterable by stage/sector/city.
- [ ] **E21-S03-T04** — Create `FundingTrends` component: charts showing capital flow over time. Breakdowns: by stage (stacked bar), by sector (pie), by geography (choropleth). Period selector (1M, 3M, 6M, 1Y).
- [ ] **E21-S03-T05** — Create `InvestorNetwork` component: graph visualization showing investor → startup connections. Node size = deal count. Edge thickness = investment amount. Filter by sector/stage.

## Story 21.4: Tech Startup Opportunity Discovery

> AI engine that scans datasets to identify fast-growing startups with unusual signals.

- [ ] **E21-S04-T01** — Define TypeScript types for opportunity signals: `StartupSignal` (startup, signalType, confidence, timestamp, details), signal types: "hiring_spike", "revenue_growth", "developer_activity", "funding_velocity", "market_expansion".
- [ ] **E21-S04-T02** — Build mock data generator for opportunity signals: generate 5-10 signals per day. Each signal includes: startup name, signal type, confidence score (60-98%), supporting data points, sector, city.
- [ ] **E21-S04-T03** — Create `OpportunityFeed` component: signal cards ranked by confidence. Each card: startup name, signal type icon, confidence badge (opacity-based), key metric highlight (e.g., "Hiring +42% YoY"), sector, timestamp.
- [ ] **E21-S04-T04** — Create `SignalDetail` component: expanded view in RightPanel. Shows: all supporting data points, historical context, comparable companies, risk factors. Action buttons: "Track", "Dismiss", "Deep Dive".

## Story 21.5: Unicorn Tracker

> Track startups valued above $1B with valuation growth, IPO readiness, and M&A signals.

- [ ] **E21-S05-T01** — Define TypeScript types: `Unicorn` (name, country, sector, valuation, lastValuationDate, ipoReadiness, mnaTarget, yoyGrowth, totalFunding, employees, founded). Add to `types/startupEcosystem.ts`.
- [ ] **E21-S05-T02** — Build mock data generator for unicorn tracker: generate 50+ global unicorns with realistic valuations ($1B-$100B). Include IPO readiness scores (0-100), M&A target probability, and YoY valuation growth.
- [ ] **E21-S05-T03** — Create `UnicornDashboard` component: sortable table with columns: name, country flag, sector, valuation, YoY growth, IPO readiness meter, M&A target badge. Filter by country/sector. Search by name.
- [ ] **E21-S05-T04** — Create `ValuationTimeline` component: line chart showing valuation progression for selected unicorn. Milestone markers for funding rounds. Compare mode: overlay 2-3 unicorns.
- [ ] **E21-S05-T05** — Add unicorn globe overlay: markers on unicorn HQ locations. Size = valuation. Color = sector. Cluster at zoom levels. Click to show detail card.

---

# Epic 22: AI Market Insight Engine (P2)

> Extend the AI insight engine to correlate commodity signals, shipping flows, satellite imagery, stock market data, and startup funding into actionable intelligence alerts.
> **Depends on:** E20 (Equity Markets), E21 (Startup Ecosystem), E08 (Sentiments Engine).

## Story 22.1: Cross-Signal Correlation Engine

> AI engine that identifies correlations between commodity, shipping, equity, and startup signals.

- [ ] **E22-S01-T01** — Define TypeScript types for AI insights: `MarketInsight` (id, title, summary, signals, confidence, timestamp, category, impact), `CorrelatedSignal` (source, type, description, strength). Categories: "commodity_equity", "shipping_supply", "funding_momentum", "geopolitical_market". Add to `types/aiInsights.ts`.
- [ ] **E22-S01-T02** — Build mock data generator for AI insights: generate 3-5 insights per day. Each correlates 2-4 signals from different domains. Realistic confidence scores (70-95%). Include structured summary sections.
- [ ] **E22-S01-T03** — Create `InsightCard` component: structured intelligence summary card. Sections: headline, correlated signals list (source icon + description), confidence meter, impact assessment (bullish/bearish/neutral), recommended actions.
- [ ] **E22-S01-T04** — Create `InsightFeed` component: chronological feed of AI-generated insights. Filterable by category, confidence threshold, and time range. Mark as read/starred.

## Story 22.2: Automated Alert Generation

> AI generates alerts when cross-domain correlations exceed confidence thresholds.

- [ ] **E22-S02-T01** — Define alert trigger types: `InsightAlert` (insightId, triggerType, severity, message). Trigger types: "correlation_spike", "divergence_detected", "momentum_shift", "anomaly_flagged".
- [ ] **E22-S02-T02** — Build mock alert generator: simulate 1-3 alerts per hour during market hours. Each linked to an insight. Severity: info/warning/critical.
- [ ] **E22-S02-T03** — Create `InsightAlertBanner` component: top-of-screen banner for critical alerts. Auto-dismisses after 10s. Click to expand insight detail. Queue multiple alerts.
- [ ] **E22-S02-T04** — Create `AlertHistory` component: paginated list of past alerts. Filter by severity, category, date range. Show resolution status (open/acknowledged/dismissed).

## Story 22.3: Insight Dashboard

> Dedicated dashboard view summarizing AI market intelligence.

- [ ] **E22-S03-T01** — Create `InsightDashboard` route at `/dashboard/insights`. Layout: top metrics (active insights, alerts today, avg confidence), main insight feed, sidebar with category filters.
- [ ] **E22-S03-T02** — Create `InsightMetrics` component: 4 metric cards — Active Insights (count), Alerts Today (count + severity breakdown), Avg Confidence (% with trend arrow), Top Category (name + count).
- [ ] **E22-S03-T03** — Create `CorrelationMatrix` component: heatmap showing signal correlation strength between domains (Commodities, Shipping, Equities, Startups, Sentiment). Click cell to see related insights.
- [ ] **E22-S03-T04** — Add "Insights" nav item to Sidebar with badge count for unread insights. Wire to `/dashboard/insights` route.

---

# Epic 23: Emerging Markets Backend Pipelines (P2)

> Backend ingestion workers for stock market APIs, venture funding datasets, and startup databases.
> **Depends on:** E20, E21. Backend counterpart in `polymatic-mvp-backend/`.

## Story 23.1: Stock Market Data Ingestion

> Workers to ingest real-time and historical stock market data for India, Singapore, and ASEAN markets.

- [ ] **E23-S01-T01** — Research and document available stock market APIs: Alpha Vantage, Yahoo Finance, NSE India API, SGX API, Bloomberg (if licensed). Document rate limits, data coverage, cost, and latency. Output to `polymatic-mvp-docs/data-sources/equity-apis.md`.
- [ ] **E23-S01-T02** — Design ingestion pipeline architecture: polling vs WebSocket, refresh intervals, data normalization layer, caching strategy (Redis/SQLite), error handling and retry logic. Document in `polymatic-mvp-docs/architecture/equity-pipeline.md`.
- [ ] **E23-S01-T03** — Implement `EquityIngestionWorker` in backend: connects to chosen stock API, normalizes data to `IndiaIndex`/`SGXCompany`/`ASEANIndex` types, writes to database, publishes updates via WebSocket to frontend.
- [ ] **E23-S01-T04** — Implement historical data backfill: on first run, fetch 1 year of daily data for all tracked indices. Store in SQLite. Serve via REST endpoint for chart components.
- [ ] **E23-S01-T05** — Add health checks and monitoring: track API call count, error rate, data freshness. Expose `/health/equity` endpoint.

## Story 23.2: Venture Funding Data Ingestion

> Workers to ingest startup and funding data from public and licensed sources.

- [ ] **E23-S02-T01** — Research and document available startup/funding data sources: Crunchbase API, PitchBook (if licensed), CB Insights, public SEC filings, AngelList, Tracxn. Document coverage, cost, and API limits. Output to `polymatic-mvp-docs/data-sources/startup-apis.md`.
- [ ] **E23-S02-T02** — Design startup data pipeline: ingestion frequency, deduplication strategy, entity resolution (matching startups across sources), data freshness tracking. Document in `polymatic-mvp-docs/architecture/startup-pipeline.md`.
- [ ] **E23-S02-T03** — Implement `FundingIngestionWorker` in backend: connects to chosen startup API, normalizes data to `FundingRound`/`Startup`/`Unicorn` types, writes to database, publishes updates via WebSocket.
- [ ] **E23-S02-T04** — Implement startup signal detection: backend worker that analyzes funding velocity, hiring trends, and revenue indicators to generate `StartupSignal` events. Publishes to WebSocket channel.
- [ ] **E23-S02-T05** — Add data quality checks: validate incoming records (required fields, value ranges, date consistency). Log and quarantine invalid records. Alert on data source outages.

## Story 23.3: AI Correlation Pipeline

> Backend worker that correlates signals across domains and generates AI insights.

- [ ] **E23-S03-T01** — Design correlation engine architecture: input sources (equity, commodity, shipping, funding, sentiment), correlation algorithms, confidence scoring, output format. Document in `polymatic-mvp-docs/architecture/correlation-engine.md`.
- [ ] **E23-S03-T02** — Implement `CorrelationWorker` in backend: runs every 5-10 minutes, scans recent signals across all domains, identifies statistically significant correlations, generates `MarketInsight` objects.
- [ ] **E23-S03-T03** — Implement confidence scoring: multi-factor score based on signal count, signal freshness, historical pattern match, and source reliability. Output 0-100 score.
- [ ] **E23-S03-T04** — Implement alert generation: when correlation confidence exceeds threshold (configurable, default 80%), generate `InsightAlert` and push to frontend via WebSocket.

---

# Epic 24: Emerging Markets Documentation (P2)

> Architecture docs, data models, and data source documentation for all new emerging market features.
> **Depends on:** E20, E21, E22, E23.

## Story 24.1: Architecture Documentation

> Document the overall architecture for emerging market intelligence features.

- [ ] **E24-S01-T01** — Write `polymatic-mvp-docs/architecture/emerging-markets-overview.md`: system diagram showing data flow from APIs → backend workers → database → WebSocket → frontend components. Include all new layers (31-40).
- [ ] **E24-S01-T02** — Write `polymatic-mvp-docs/architecture/equity-pipeline.md`: detailed architecture for stock market data ingestion, normalization, caching, and delivery.
- [ ] **E24-S01-T03** — Write `polymatic-mvp-docs/architecture/startup-pipeline.md`: detailed architecture for startup/funding data ingestion, entity resolution, and signal detection.
- [ ] **E24-S01-T04** — Write `polymatic-mvp-docs/architecture/correlation-engine.md`: detailed architecture for the AI cross-signal correlation engine.

## Story 24.2: Data Model Documentation

> Document all new TypeScript types and database schemas.

- [ ] **E24-S02-T01** — Write `polymatic-mvp-docs/data-models/equity-markets.md`: document all types in `types/equityMarkets.ts` with field descriptions, value ranges, and example JSON.
- [ ] **E24-S02-T02** — Write `polymatic-mvp-docs/data-models/startup-ecosystem.md`: document all types in `types/startupEcosystem.ts` with field descriptions, value ranges, and example JSON.
- [ ] **E24-S02-T03** — Write `polymatic-mvp-docs/data-models/ai-insights.md`: document all types in `types/aiInsights.ts` with field descriptions, correlation logic, and example JSON.

## Story 24.3: Data Source Documentation

> Document all external data sources, APIs, rate limits, and costs.

- [ ] **E24-S03-T01** — Write `polymatic-mvp-docs/data-sources/equity-apis.md`: document all stock market APIs evaluated, selection rationale, rate limits, authentication, and cost.
- [ ] **E24-S03-T02** — Write `polymatic-mvp-docs/data-sources/startup-apis.md`: document all startup/funding data sources evaluated, selection rationale, coverage gaps, and cost.
- [ ] **E24-S03-T03** — Write `polymatic-mvp-docs/data-sources/data-freshness.md`: document expected data freshness for each source, SLA targets, and monitoring strategy.

---

## Summary

| Epic | Priority | Stories | Tasks | Status |
|------|----------|---------|-------|--------|
| E01: Foundation | P0 | 12 | 57 | ✅ |
| E02: Mock Data Engine | P0 | 6 | 34 | 🏗️ |
| E03: Landing Page + Three.js Globe | P0 | 4 | 17 | ✅ |
| E04: UI/UX Transformation | P0 | 4 | 8 | [ ] |
| E05: Home Feed | P0 | 3 | 14 | 🏗️ |
| E06: UI/UX Transformation (complete) | P0 | 4 | 8 | ✅ |
| E07: Trending Bar | P0 | 3 | 9 | [ ] |
| E08: Sentiments Engine | P0 | 6 | 20 | [ ] |
| E09: Search | P0 | 3 | 10 | [ ] |
| E10: Topic Pages + UI/UX Polish | P0 | 7 | 25 | 🏗️ |
| E11: Markets Panel | P0 | 3 | 9 | [ ] |
| E12: Alert System | P0 | 3 | 8 | [ ] |
| E13: Auth & Onboarding | P0 | 3 | 14 | [ ] |
| E14: Geo View | P1 | 3 | 12 | [ ] |
| E15: POI System | P1 | 1 | 4 | [ ] |
| E16: Detect / Anomaly | P1 | 1 | 4 | [ ] |
| E17: Whale Tracking | P1 | 1 | 3 | [ ] |
| E18: Timeline & Replay | P1 | 1 | 4 | [ ] |
| E19: Polish & A11y | P0/Polish | 6 | 22 | [ ] |
| E20: Equity Market Intelligence | P2 | 5 | 31 | [ ] |
| E21: Startup Ecosystem Intelligence | P2 | 5 | 28 | [ ] |
| E22: AI Market Insight Engine | P2 | 3 | 12 | [ ] |
| E23: Emerging Markets Backend | P2 | 3 | 14 | [ ] |
| E24: Emerging Markets Docs | P2 | 3 | 10 | [ ] |
| **TOTAL** | | **74** | **328** | |

## Dependency Graph

```
E01 Foundation ──┬──► E02 Mock Data Engine ──┬──► E03 Landing Page (Three.js Globe)
                 │                           ├──► E04 UI/UX Transformation
                 │                           ├──► E05 Home Feed
                 │                           ├──► E06 UI/UX Transformation (complete)
                 │                           ├──► E07 Trending Bar
                 │                           ├──► E08 Sentiments Engine
                 │                           ├──► E09 Search
                 │                           ├──► E10 Topic Pages (also needs E05, E08)
                 │                           ├──► E11 Markets Panel
                 │                           ├──► E12 Alert System
                 │                           ├──► E14 Geo View (P1)
                 │                           ├──► E15 POI System (P1, needs E14)
                 │                           ├──► E16 Detect (P1)
                 │                           ├──► E17 Whale Tracking (P1, needs E11)
                 │                           └──► E18 Timeline (P1)
                 │
                 └──► E13 Auth & Onboarding

E02 + E14 ──┬──► E20 Equity Market Intelligence
             └──► E21 Startup Ecosystem Intelligence

E20 + E21 + E08 ──► E22 AI Market Insight Engine

E20 + E21 ──► E23 Emerging Markets Backend Pipelines

E20 + E21 + E22 + E23 ──► E24 Emerging Markets Documentation

E05–E13 complete ──► E19 Polish & A11y
```

## Recommended Build Order

1. **E01** Foundation (all stories in parallel after scaffold)
2. **E02** Mock Data Engine (types first, then generators, then hooks)
3. **E03** Landing Page with Three.js Globe
4. **E04 + E06** UI/UX Transformation (CSS tokens, layout polish, feed polish)
5. **E05 + E07 + E08** in parallel (Home Feed, Trending Bar, Sentiments Engine)
6. **E09 + E11** in parallel (Search, Markets Panel)
7. **E10** Topic Pages (needs feed + sentiments)
8. **E12 + E13** in parallel (Alerts, Auth & Onboarding)
9. **E14 + E15 + E16 + E17 + E18** P1 features (if time permits)
10. **E19** Polish pass (after all P0 features complete)
11. **E20 + E21** in parallel (Equity Markets, Startup Ecosystem — types + mocks + frontend)
12. **E22** AI Market Insight Engine (needs E20 + E21 + E08)
13. **E23** Backend Pipelines (swap mock data for real APIs)
14. **E24** Documentation (after all P2 features stabilize)

---

*End of Task Breakdown*
