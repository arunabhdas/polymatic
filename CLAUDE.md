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
| `tasks/TASKS.md` | Epic/Story/Task breakdown (16 epics, 49 stories, 217 tasks) |
| `docs/` | Planning screenshots (plan_1.png through plan_33.png) |
| `mocks/` | High-fidelity UI mockups (mock_1.png through mock_7.png) |

## Tech Stack

- **Framework:** React 18 + TypeScript (strict mode, no `any`)
- **Build:** Vite 5
- **State:** Zustand (10 stores) + TanStack Query v5 (server state)
- **Styling:** Tailwind CSS v4 + CSS custom properties for theming
- **Animation:** framer-motion (layout transitions, micro-interactions)
- **Virtualization:** react-virtuoso (feed, markets, timelines)
- **Charts:** Recharts (sparklines, sentiment timelines, velocity charts)
- **Icons:** lucide-react
- **Primitives:** Radix UI (dialog, dropdown, tooltip, tabs)
- **Geo (P1):** CesiumJS + resium
- **Routing:** react-router-dom v6 (lazy loaded)
- **Validation:** Zod (runtime schema validation)
- **Hosting:** Vercel

## Architecture Rules

### Data Abstraction
All data flows through a `DataProvider` interface (`src/services/dataProvider.ts`). Resolved at runtime via `DATA_SOURCE_MODE`:
- `"mock"` — MockProvider with generators (current)
- `"rsdip"` — Future RSDIP WebSocket backend

Mock data generators MUST produce objects matching the exact TypeScript interfaces the backend will serve. No shortcuts.

### State Management
10 Zustand stores, one per domain: `uiStore`, `feedStore`, `trendsStore`, `sentimentsStore`, `marketsStore`, `searchStore`, `authStore`, `alertsStore`, `geoStore`, `flagsStore`. Cross-store communication via `mitt` event bus.

### Feature Flags
Env vars (`VITE_*`) + Zustand persist store with runtime overrides. Use `useFeatureFlag(flag)` hook and `<FeatureGate>` component.

### Layout
3-column CSS grid: sidebar (220px, auto-collapse at <1280px) | main content | right panel (30%, always visible). Three layout modes: Tactical (all panels), Panoptic (icon sidebar, minimal chrome), Clean (feed only). Animated transitions (300ms ease).

### Theming
Dark (default) + light toggle. All colors via CSS custom properties (`var(--color-*)`). Theme applied via `data-theme` attribute on `<html>`.

## Binding Design Decisions (from Interview)

These are resolved and MUST NOT be changed without explicit approval:

- **Sentiments scoring:** Weighted ratio `YES/(YES+NO)` — not Bayesian
- **Classification delivery:** Batch every 5-10s — not streaming
- **Confidence visual:** Opacity + label (Low=60%, Med=85%, High=100%)
- **Tweet visibility:** Tiered by plan (Free: aggregates, Pro: 5 key voices, Quant: full)
- **Prediction summaries:** Terminal-style intelligence briefs (monospace, classification header)
- **Trending bar:** 10-12 chips, all data visible (~220px each), badge lifecycle transitions
- **Feed:** Mixed density (signal-based), lead+expand clustering, react-virtuoso at 50 items
- **Feed ranking:** 70% velocity + 30% recency (For You mode)
- **Search:** 2-char autocomplete, 200ms debounce, dropdown overlay, fixed-order sections
- **Markets:** Full cards with sparklines, primary+delta cross-platform, Bloomberg-style number+arrow
- **Geo:** CesiumJS from day one (behind feature flag), hybrid detail, animated motion trails
- **Right panel:** Always visible (30%)
- **Sidebar:** Auto-collapse on narrow viewports
- **Layout switching:** Animated 300ms ease
- **Min viewport:** 1024px
- **Theme:** Dark + light toggle
- **Auth:** Custom JWT (FastAPI backend), landing page gate, interactive onboarding tour
- **Hosting:** Vercel
- **Feature flags:** Env vars + Zustand persist store
- **Brand:** PolyMatic (not WORLDVIEW)
- **Aesthetic:** Subtle tactical accents (monospace on data/timestamps, tactical on alerts/confidence)

## Priority

- **P0 (MVP):** Epics 1-10 — Foundation, Mock Data, Home Feed, Trending Bar, Sentiments Engine, Search, Topic Pages, Markets, Alerts, Auth
- **P1 (If time):** Epics 11-15 — Geo View, POI, Detect, Whale Tracking, Timeline
- **P2 (Post-MVP):** Visual Modes, Collaborative Workspaces, Quant API, Backtesting

## Code Conventions

- No `any` types. No type assertions unless absolutely necessary (with explanatory comment).
- Stores: small, focused, composable. One per domain.
- Components: reusable atoms (Badge, Chip, DeltaIndicator) compose into larger views.
- UX copy: sharp, confident, concise. "Sentiment Δ" not "Difference Between Sentiment and Market." No cute emoji in empty states.
- Timestamps: relative when recent ("2m ago"), absolute when older ("Mar 2, 14:23 UTC"). Always show UTC.
- Numbers: always formatted. "1.2M" not "1234567". "73%" not "0.73". "+12.4%" not "12.4% increase."
- Monospace labels: ALL CAPS, letter-spacing 0.1em. Used sparingly for tactical personality.
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
