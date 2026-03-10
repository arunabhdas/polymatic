# PolyMatic — AI-native Macro Geospatial Intelligence

<p align="center">
  <img src="./screenshot_1.png" alt="PolyMatic Dashboard Mockup" width="100%" />
</p>

## Architecture: Data Source Toggle (Mock vs Real API)

The frontend is capable of operating completely independently using a robust local Mock Data Engine, or switching to the real live backend API (referred to internally as the **RSDIP** — Realtime Semantic Data Ingestion Pipeline).

This switch is controlled dynamically via an environment variable and a local persist store, without requiring code changes to the UI components.

### 1. The Environment Variable
At build/startup time, Vite checks the `.env` file for the `VITE_DATA_SOURCE_MODE` variable:
```env
VITE_DATA_SOURCE_MODE=mock  # Can be "mock" or "rsdip"
```

### 2. The Flags Store (Runtime Override)
This environment variable serves as the initial state for the `flagsStore` (a Zustand store with local storage persistence). This allows developers to override the data source mode **at runtime** without restarting the dev server. For example, from the browser console:
```javascript
useFlagsStore.getState().setOverride('dataSourceMode', 'rsdip');
```

### 3. The Factory Pattern (`services/dataProvider.ts`)
The core switching mechanism happens inside `services/dataProvider.ts`, acting as a Factory:
* **`MockProvider`:** Returned if mode is `"mock"`. Uses powerful local mock generators to simulate real-time feed updates, market probability drifts, and sentiment classifications natively in the browser, complete with simulated network latency (200-500ms).
* **`RSDIPProvider`:** Returned if mode is `"rsdip"`. Makes actual HTTP and WebSocket remote calls to the FastAPI backend.

### 4. UI Layer Agnosticism
Because both providers conform to the exact same `DataProvider` TypeScript interface, the entire UI layer is completely blind to this switch. React components simply consume TanStack Query hooks (e.g., `useFeed()`, `useTrends()`) which ask the Factory for the current provider and call methods on it identically, making the transition seamless.
