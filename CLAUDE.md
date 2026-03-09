# PolyMatic — Project Instructions

## What This Is

PolyMatic.App is an AI-powered Geospatial OSINT + Prediction Market Intelligence platform. The frontend webapp (`polymatic-frontend-webapp/`) is a React 18 + TypeScript application that aggregates OSINT data streams, analyzes social sentiment from Twitter/X, and correlates signals with prediction markets (Polymarket, Kalshi).

**Design north star:** "Bloomberg Terminal meets cinematic intelligence dashboard."

## Key Documents

| File | Purpose |
|------|---------|
| `PRD.md` | Product Requirements Document v2.2 — the source of truth |
| `PROMPT.md` | Implementation brief with role definition, anti-patterns, and UX copy guidelines |
| `PLAN.md` | Phase 1 interview questions + all resolved answers |
| `tasks/IMPLEMENTATION-PLAN.md` | Full 16-section architecture and implementation plan |
| `tasks/TASKS.md` | Epic/Story/Task breakdown (16 epics, 49+ stories, 217+ tasks) |
| `docs/` | Planning screenshots (plan_1.png through plan_33.png) |
| `mocks/` | High-fidelity UI mockups (mock_1.png through mock_7.png) |

## Tech Stack

- **Framework:** React 18 + TypeScript (strict mode, no `any`)
- **Build:** Vite 7
- **State:** Zustand (feedStore + more as needed) + TanStack Query v5 (server state)
- **Styling:** Tailwind CSS v4 + shadcn/ui (New York style) + CSS custom properties
- **UI Primitives:** shadcn/ui (button, input, badge, card, tooltip, dialog, dropdown-menu, tabs, separator, scroll-area, skeleton, avatar, command)
- **Animation:** framer-motion (layout transitions, micro-interactions) + tailwindcss-animate
- **Virtualization:** react-virtuoso (feed, markets, timelines)
- **Charts:** Recharts (sparklines, sentiment timelines, velocity charts)
- **Icons:** lucide-react
- **Geo (P1):** Three.js + @react-three/fiber + @react-three/drei + resium
- **Routing:** react-router-dom v7 with `createBrowserRouter` (lazy loaded)
- **Validation:** Zod (runtime schema validation)
- **Hosting:** Vercel

## Architecture Rules

### Project Structure
```
polymatic-frontend-webapp/src/
├── app/                 # AppShell, TopBar (layout shell)
├── sidebar/             # Sidebar navigation
├── panels/              # RightPanel (contextual detail)
├── feed/                # HomeFeed, FeedItemRow, FeedFilters, TrendCarousel
├── trends/              # (upcoming)
├── sentiments/          # (upcoming)
├── search/              # (upcoming)
├── markets/             # (upcoming)
├── topic/               # (upcoming)
├── alerts/              # (upcoming)
├── geo/                 # (upcoming)
├── auth/                # (upcoming)
├── onboarding/          # (upcoming)
├── components/
│   ├── base/            # Domain-specific atoms (Chip, DataLabel, DeltaIndicator, etc.)
│   └── ui/              # shadcn/ui primitives (auto-generated, do not hand-edit)
├── state/               # Zustand stores (feedStore.ts, more to come)
├── services/            # apiClient, dataProvider, mockProvider, wsClient, etc.
├── mock-data/           # Mock generators + seed data
│   ├── generators/      # feedGenerator, marketGenerator, sentimentGenerator, trendGenerator
│   └── seed/            # Static seed data (accounts, entities, markets, questions, trends)
├── hooks/               # Data hooks (useFeed, useMarkets, useSentiments, useTrends)
├── types/               # TypeScript type definitions (11 domain files)
├── lib/                 # Utilities (utils.ts with cn() helper)
├── utils/               # Additional utility functions
├── index.css            # Main CSS: Tailwind v4 + shadcn theme + dark/light variables
└── main.tsx             # Entry point: createBrowserRouter + RouterProvider
```

### Theming
- **CSS entry:** `src/index.css` — single file for Tailwind v4, shadcn imports, and theme variables
- **Dark mode:** `.dark` class on a wrapping `<div>` — shadcn's `@custom-variant dark` pattern
- **Light mode:** `:root` variables (oklch colors)
- **Dark values:** `.dark` block with hex colors (#0f0f0f bg, #fafafa fg, desaturated neutrals)
- **Variable hierarchy:** `--background`, `--foreground`, `--card`, `--primary`, `--muted`, etc. → mapped to `--color-*` via `@theme inline` for Tailwind utility generation
- **Chart colors:** 5 chart tokens (`--chart-1` through `--chart-5`)
- **Sidebar colors:** Dedicated sidebar tokens (`--sidebar`, `--sidebar-foreground`, etc.)
- **Currently hardcoded dark** in `main.tsx` — runtime toggle not yet implemented

### Layout Shell
- `AppShell.tsx`: flex container — Sidebar | Main (TopBar + content outlet) | RightPanel
- Main content area has `rounded-lg border-t border-l border-border/40 bg-card/30 shadow-sm` for visual depth
- Routes defined in `main.tsx` via `createBrowserRouter` with lazy-loaded views

### Data Abstraction
All data flows through a `DataProvider` interface (`src/services/dataProvider.ts`). Resolved at runtime via `DATA_SOURCE_MODE`:
- `"mock"` — MockProvider with generators (current)
- `"rsdip"` — Future RSDIP WebSocket backend

Mock data generators MUST produce objects matching the exact TypeScript interfaces the backend will serve.

### State Management
Zustand stores, one per domain. Currently: `feedStore.ts`. Additional stores created as features are implemented. Cross-store communication via `mitt` event bus.

### Feature Flags
Env vars (`VITE_*`) + runtime overrides planned via Zustand persist store.

### shadcn/ui
- Configured via `components.json` at project root
- Components generated to `src/components/ui/`
- Uses `@/lib/utils` for `cn()` helper
- Style: New York, base color: Neutral
- **Do not hand-edit** generated shadcn files — add wrappers or extend via className

## Binding Design Decisions (from Interview)

These are resolved and MUST NOT be changed without explicit approval:

- **Sentiments scoring:** Weighted ratio `YES/(YES+NO)` — not Bayesian
- **Classification delivery:** Batch every 5-10s — not streaming
- **Confidence visual:** Opacity + label (Low=60%, Med=85%, High=100%)
- **Tweet visibility:** Tiered by plan (Free: aggregates, Pro: 5 key voices, Quant: full)
- **Prediction summaries:** Clean intelligence summary cards (structured sections, modern typography)
- **Trending bar:** 10-12 chips, all data visible (~220px each), badge lifecycle transitions
- **Feed:** Mixed density (signal-based), lead+expand clustering, react-virtuoso at 50 items
- **Feed ranking:** 70% velocity + 30% recency (For You mode)
- **Search:** 2-char autocomplete, 200ms debounce, dropdown overlay, fixed-order sections
- **Markets:** Full cards with sparklines, primary+delta cross-platform, Bloomberg-style number+arrow
- **Geo:** Three.js + react-three-fiber from day one (behind feature flag), hybrid detail, animated motion trails
- **Right panel:** Always visible (30%)
- **Sidebar:** Auto-collapse on narrow viewports
- **Layout switching:** Animated 300ms ease
- **Min viewport:** 1024px
- **Theme:** Dark + light toggle
- **Auth:** Custom JWT (FastAPI backend), landing page gate, interactive onboarding tour
- **Hosting:** Vercel
- **Feature flags:** Env vars + Zustand persist store
- **Brand:** PolyMatic (not WORLDVIEW)
- **Aesthetic:** Minimal, modern SaaS — clean typography, monospace only for numerical data (prices, percentages, timestamps), no ALL CAPS classification headers

## Priority

- **P0 (MVP):** Epics 1-10 — Foundation, Mock Data, Home Feed, Trending Bar, Sentiments Engine, Search, Topic Pages, Markets, Alerts, Auth
- **P1 (If time):** Epics 11-15 — Geo View, POI, Detect, Whale Tracking, Timeline
- **P2 (Post-MVP):** Visual Modes, Collaborative Workspaces, Quant API, Backtesting

## Code Conventions

- No `any` types. No type assertions unless absolutely necessary (with explanatory comment).
- Stores: small, focused, composable. One per domain.
- Components: reusable atoms in `components/base/` compose into feature-level views.
- shadcn primitives in `components/ui/` — use directly or wrap with domain props.
- UX copy: sharp, confident, concise. "Sentiment Δ" not "Difference Between Sentiment and Market." No cute emoji in empty states.
- Timestamps: relative when recent ("2m ago"), absolute when older ("Mar 2, 14:23 UTC"). Always show UTC.
- Numbers: always formatted. "1.2M" not "1234567". "73%" not "0.73". "+12.4%" not "12.4% increase."
- Monospace: reserved for numerical data only (prices, percentages, timestamps, deltas). Labels use Inter (sans-serif) in normal case.
- Virtualize everything that scrolls. Batch everything that streams. Lazy-load everything not visible.
- Performance: target 60fps feed scroll, <3s TTI, <500MB memory with feed + 5 geo layers.

## Anti-Patterns to Avoid

- Uniform card grids with identical padding and rounded corners
- Generic placeholder copy ("Lorem ipsum", "Your content here", "Get started today")
- Default component library styling without heavy customization
- Empty states with sad emoji
- Perfectly even spacing everywhere (use varied rhythm)
- Loading states that are just a centered spinner
- Over-engineering beyond what's requested
