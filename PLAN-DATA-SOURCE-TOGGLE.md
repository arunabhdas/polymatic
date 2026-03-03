⏺ Good call — let's nail down the data toggle before writing any code.

  Data Source Toggle: DATA_SOURCE_MODE

  Based on the implementation plan (Section 4 & 14), here's the exact mechanism:

  Environment Variable

  # .env
  VITE_DATA_SOURCE_MODE=mock    # "mock" | "rsdip"

  How It Works

  VITE_DATA_SOURCE_MODE
          │
          ▼
    flagsStore (Zustand + persist)
          │
          ├── "mock"  → MockProvider (generators, seed data, simulated latency)
          └── "rsdip" → RSDIPProvider (WebSocket to FastAPI backend — stubbed for now)

  Key points:

  1. Single env var (VITE_DATA_SOURCE_MODE) controls which DataProvider implementation is instantiated
  2. Zustand persist store (flagsStore) reads the env var at init but also supports runtime overrides — so a dev can flip between mock and rsdip without
   restarting Vite
  3. Factory pattern in services/dataProvider.ts resolves the correct provider
  4. All UI code is provider-agnostic — hooks like useFeed(), useSentiments(), useMarkets() call the DataProvider interface, never the concrete
  implementation
  5. MockProvider returns data from generators with simulated 200-500ms latency — the UI behaves identically to real data
  6. RSDIPProvider is a stub for now — every method throws "Not implemented" so TypeScript enforces the interface is complete

  Other Feature Flags (same system)

  VITE_ENABLE_GEO_VIEW=false
  VITE_ENABLE_DETECT=false
  VITE_ENABLE_WHALE_TRACKING=false
  VITE_ENABLE_TIMELINE=false
  VITE_ENABLE_LIGHT_MODE=true

  These are boolean flags consumed via useFeatureFlag('enableGeoView') and <FeatureGate flag="enableGeoView">. P1 features are gated off by default.

  Runtime Override (Dev/Demo)

  // In browser console or dev panel:
  useFlagsStore.getState().setOverride('dataSourceMode', 'rsdip');
  useFlagsStore.getState().setOverride('enableGeoView', true);
  // Overrides persist in localStorage ('polymatic-flags')
  // Clear with: useFlagsStore.getState().clearOverrides()

  ---
  Does this toggle design look right to you? If so, I'll start implementing Epic 1 — the foundation scaffold, theming, app shell, routing, and base UI
  components. That's 5 stories / 40 tasks, and I'd begin with Story 1.1 (project scaffold) since everything else depends on it.
