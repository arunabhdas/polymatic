# PolyMatic Project Memory

## Project Status

- **Phase 1 (Interview):** Complete — all 40+ design decisions resolved
- **Phase 2 (Plan):** Complete — IMPLEMENTATION-PLAN.md and TASKS.md written
- **Phase 3 (Implementation):** In progress (rebuilt from scratch after reset)

### Reset Context
The original `polymatic-frontend-webapp/` was deprecated (commit `b278904`) and rebuilt from scratch with:
- Proper shadcn/ui integration from day one
- Three.js + react-three-fiber replacing CesiumJS for geo
- Simplified architecture (single CSS file, createBrowserRouter)
- Linear-quality dark aesthetic baked in from start

### What's Built (New Codebase)

**Epic 1 — Foundation: COMPLETE**
- Vite 7 + React 18 + TypeScript (strict), Tailwind v4
- shadcn/ui: 13 primitives (button, input, badge, card, tooltip, dialog, dropdown-menu, tabs, separator, scroll-area, skeleton, avatar, command)
- App shell: AppShell (flex layout), TopBar, Sidebar, RightPanel
- Routing: react-router-dom v7 with `createBrowserRouter`, lazy loading
- Dark theme: desaturated near-blacks (#0f0f0f, #141414, #262626), `.dark` class pattern
- 9 base UI components: Chip, ConfidenceBadge, DataLabel, DeltaIndicator, ProbabilityDisplay, SeverityDot, Sparkline, Timestamp, VelocityIndicator

**Epic 2 — Mock Data Engine: COMPLETE**
- Type definitions: 11 domain type files
- Mock generators: feedGenerator, marketGenerator, sentimentGenerator, trendGenerator
- Seed data: accounts, entities, markets, questions, trends
- Data hooks: useFeed, useMarkets, useSentiments, useTrends
- Services: apiClient, dataProvider, mockProvider, wsClient, rsdipProvider

**Epic 3 — Home Feed: PARTIALLY COMPLETE**
- HomeFeed.tsx with react-virtuoso
- FeedItemRow, FeedFilters, TrendCarousel
- feedStore (Zustand)

**Epics 4-10:** Not yet started in new codebase
**Epic 7 (UI/UX Polish):** Design system foundation done (shadcn, theme tokens), feature stories pending

### What's NOT Built Yet
- Sentiments engine UI
- Search interface
- Trending bar (standalone)
- Topic pages
- Markets panel
- Alerts system
- Auth & onboarding
- Geo view
- Activity timeline, right panel polish, micro-interactions
- Theme toggle (dark is hardcoded)
- Additional Zustand stores (only feedStore exists)

## Architecture Notes

### Theming
- Single CSS file: `src/index.css` (not separate dark.css/light.css)
- Dark mode: `.dark` class on wrapper div (shadcn pattern via `@custom-variant dark`)
- Variables: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, etc.
- Mapped to Tailwind via `@theme inline` block: `--color-background: var(--background)` etc.
- Currently hardcoded dark in main.tsx — no runtime toggle yet

### Routing
- `createBrowserRouter` in `main.tsx` (not declarative `<Routes>`)
- Lazy imports for feature views
- Routes: `/` (HomeFeed), `/search`, `/trends`, `/markets`, `/geo` (stubs)

### Components
- `components/ui/` — shadcn generated primitives (do not hand-edit)
- `components/base/` — Domain-specific atoms (Chip, DataLabel, etc.)
- Feature components live in feature directories (e.g., `feed/components/`)

### Key Technical Details
- Path alias: `@/*` → `src/*` (tsconfig + vite)
- `cn()` helper: `src/lib/utils.ts` (shadcn default location)
- components.json: `@/lib/utils` for utils alias, `@/components/ui` for UI dir
- tailwindcss-animate + tw-animate-css for animation utilities
- shadcn uses `radix-ui` unified package (not individual `@radix-ui/*`)

## Repository Structure
```
polymatic/
├── PRD.md                         # Product requirements v2.2
├── PROMPT.md                      # Implementation brief
├── PLAN.md                        # Interview Q&A
├── CLAUDE.md                      # Project instructions for Claude
├── MEMORY.md                      # This file
├── docs/                          # Planning screenshots
├── mocks/                         # High-fidelity UI mockups
├── tasks/
│   ├── IMPLEMENTATION-PLAN.md     # 16-section architecture plan
│   └── TASKS.md                   # Epic/Story/Task breakdown
└── polymatic-frontend-webapp/     # The active frontend app
    ├── components.json            # shadcn/ui configuration
    ├── package.json
    └── src/
        ├── main.tsx               # Entry: createBrowserRouter + RouterProvider
        ├── index.css              # Tailwind v4 + shadcn theme + dark/light vars
        ├── app/                   # AppShell, TopBar
        ├── sidebar/               # Sidebar
        ├── panels/                # RightPanel
        ├── feed/                  # HomeFeed + components
        ├── components/{base,ui}/  # Base atoms + shadcn primitives
        ├── state/                 # Zustand stores (feedStore)
        ├── services/              # Data providers, API, WebSocket
        ├── mock-data/             # Generators + seed data
        ├── hooks/                 # Data hooks
        └── types/                 # TypeScript type definitions
```

## User Preferences
- Prefers interactive multi-choice interview format for decision-making
- Wants comprehensive documentation before implementation begins
- Values production-grade quality: no shortcuts, no placeholders
- Brand identity: PolyMatic (evolved from WORLDVIEW)
- Dark + light theme support (not dark-only)
- Wide device range including low-end laptops
- Three.js + react-three-fiber from day one (ambitious geo strategy)

## Build Order (Remaining)
1. Complete Epic 3 (feed polish: clustering, expansion, severity indicators)
2. Epic 4: Trending Bar (standalone trending bar with detail panel)
3. Epic 5: Sentiments Engine UI
4. Epic 6: Search Interface
5. Epic 7: Topic Pages + remaining UI/UX polish
6. Epic 8: Markets Panel
7. Epics 9-10: Alerts + Auth
8. Epics 11-15: P1 features (geo, POI, detect, whale, timeline)

## Notes
- Task IDs follow `E{epic}-S{story}-T{task}` convention (e.g., E01-S02-T03)
- The mocks in `mocks/` show the older WORLDVIEW iteration — reference for aesthetic DNA only
- Old codebase (Epics 1-6 from commits before reset) is deprecated
