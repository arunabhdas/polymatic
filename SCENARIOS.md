# PolyMatic — QA Test Scenarios

**Version:** 1.0
**Date:** March 3, 2026
**Prepared for:** QA Engineers
**Prerequisites:** Node 18+, npm, Chrome/Edge/Firefox. Clone repo and run `cd polymatic-frontend-webapp && npm install && npm run dev`.

---

## How to Use This Document

Each scenario follows this format:

- **ID** — Unique identifier (`SC-{epic}-{number}`)
- **Feature** — What is being tested
- **Preconditions** — Setup required before running the test
- **Steps** — Numbered instructions to execute
- **Expected Result** — What should happen
- **Priority** — P0 (must pass for MVP), P1 (should pass), P2 (nice to have)

**Mock login:** Any email/password combination works (e.g., `test@polymatic.app` / `password`).

---

## Table of Contents

1. [Foundation & Infrastructure](#1-foundation--infrastructure)
2. [Theming & Visual Design](#2-theming--visual-design)
3. [Layout & Navigation](#3-layout--navigation)
4. [Authentication & Onboarding](#4-authentication--onboarding)
5. [Mock Data Engine](#5-mock-data-engine)
6. [Home Feed](#6-home-feed)
7. [Trending Bar](#7-trending-bar)
8. [Sentiments Engine](#8-sentiments-engine)
9. [Search](#9-search)
10. [Markets Panel](#10-markets-panel)
11. [Topic Pages](#11-topic-pages)
12. [Alerts](#12-alerts)
13. [Geo View (P1)](#13-geo-view-p1)
14. [Performance](#14-performance)
15. [Accessibility & Conventions](#15-accessibility--conventions)
16. [Anti-Pattern Checks](#16-anti-pattern-checks)

---

## 1. Foundation & Infrastructure

### SC-01-001: Application Builds Successfully
**Priority:** P0
**Preconditions:** Fresh clone, dependencies installed.
**Steps:**
1. Run `npm run build` in `polymatic-frontend-webapp/`.
2. Observe console output.
**Expected Result:** Build completes with zero errors. TypeScript strict mode catches all type issues. Output appears in `dist/` folder.

---

### SC-01-002: TypeScript Strict Mode Enforced
**Priority:** P0
**Preconditions:** None.
**Steps:**
1. Run `npx tsc --noEmit` in the project directory.
2. Search the codebase for `any` type usage: `grep -r ': any' src/`.
**Expected Result:** Zero TypeScript errors. No `any` types found anywhere in source code (type assertions with explanatory comments are acceptable but should be rare).

---

### SC-01-003: Development Server Starts
**Priority:** P0
**Preconditions:** Dependencies installed.
**Steps:**
1. Run `npm run dev`.
2. Open `http://localhost:5173` in a browser.
**Expected Result:** Landing page loads without console errors. Vite HMR is active.

---

### SC-01-004: Tests Pass
**Priority:** P0
**Preconditions:** None.
**Steps:**
1. Run `npm run test`.
**Expected Result:** All test suites pass with zero failures.

---

### SC-01-005: Folder Structure Complete
**Priority:** P0
**Preconditions:** None.
**Steps:**
1. Verify the following directories exist under `src/`:
   - `app/`, `views/`, `feed/`, `trends/`, `sentiments/`, `search/`, `markets/`, `topic/`, `alerts/`, `geo/`, `auth/`, `onboarding/`, `state/`, `services/`, `mock-data/`, `hooks/`, `components/`, `types/`, `lib/`, `styles/`
**Expected Result:** All 20 directories present.

---

### SC-01-006: Environment Variables Configured
**Priority:** P0
**Preconditions:** None.
**Steps:**
1. Open `.env.example`.
2. Verify it contains: `VITE_DATA_SOURCE_MODE`, `VITE_ENABLE_GEO_VIEW`, `VITE_ENABLE_DETECT`, `VITE_ENABLE_WHALE_TRACKING`, `VITE_ENABLE_TIMELINE`, `VITE_ENABLE_LIGHT_MODE`, `VITE_API_BASE_URL`, `VITE_WS_URL`, `VITE_CESIUM_ION_TOKEN`.
3. Open `src/vite-env.d.ts` and verify typed `ImportMetaEnv` interface declares all variables.
**Expected Result:** All env vars declared in both files with correct types.

---

### SC-01-007: Ten Zustand Stores Exist
**Priority:** P0
**Preconditions:** None.
**Steps:**
1. Open `src/state/` directory.
2. Verify 10 store files exist: `uiStore.ts`, `feedStore.ts`, `trendsStore.ts`, `sentimentsStore.ts`, `marketsStore.ts`, `searchStore.ts`, `authStore.ts`, `alertsStore.ts`, `geoStore.ts`, `flagsStore.ts`.
3. Verify each exports a Zustand `create()` hook.
**Expected Result:** Ten stores present, each with typed state interface and actions.

---

## 2. Theming & Visual Design

### SC-02-001: Dark Theme Loads by Default
**Priority:** P0
**Preconditions:** Clear localStorage. Open app in new incognito window.
**Steps:**
1. Navigate to `http://localhost:5173/`.
2. Inspect `<html>` element.
**Expected Result:** `data-theme="dark"` attribute is present on `<html>`. Background is dark (`#1A1A2E` or similar). Text is light.

---

### SC-02-002: Light Theme Toggle Works
**Priority:** P0
**Preconditions:** Logged in, on dashboard.
**Steps:**
1. Locate the theme toggle in the top bar (Sun/Moon icon).
2. Click the toggle.
3. Inspect `<html>` element.
4. Verify all text remains readable.
5. Click toggle again to return to dark.
**Expected Result:**
- Step 2: Theme switches to light. `data-theme="light"` on `<html>`.
- Step 4: All content readable with light backgrounds and dark text.
- Step 5: Returns to dark theme.

---

### SC-02-003: Theme Persists Across Sessions
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Switch to light theme.
2. Close the browser tab.
3. Open `http://localhost:5173/app` in a new tab.
**Expected Result:** Light theme is still active (no flash of dark theme). Theme persisted via localStorage.

---

### SC-02-004: CSS Custom Properties Used for All Colors
**Priority:** P1
**Preconditions:** None.
**Steps:**
1. Open `src/styles/themes/dark.css` and `light.css`.
2. Verify all colors are defined as `--color-*` custom properties.
3. Inspect a few UI elements in DevTools — verify they reference `var(--color-*)`.
**Expected Result:** No hardcoded hex colors in component files. All colors flow through CSS custom properties.

---

### SC-02-005: Monospace Font Reserved for Numerical Data Only
**Priority:** P0
**Preconditions:** Logged in, on dashboard with data visible.
**Steps:**
1. Inspect any price display (e.g., "73%", "$4.2M", "+12.4%", "14:23 UTC").
2. Verify the font-family includes `JetBrains Mono` or the `.mono-data` CSS class.
3. Inspect any label (e.g., "Sentiment Δ", "Market Price", "Category").
4. Verify the font-family is `Inter` (sans-serif) — NOT monospace.
**Expected Result:** Monospace (JetBrains Mono) used exclusively for: prices, percentages, timestamps, deltas. All labels, headings, and body copy use Inter (sans-serif).

---

### SC-02-006: No ALL CAPS Headers or Classification Labels
**Priority:** P0
**Preconditions:** Logged in, viewing any page with labels.
**Steps:**
1. Scan all visible text on the dashboard.
2. Look for any ALL CAPS text (e.g., "SUPPORTS YES", "BREAKING", "SENTIMENT ANALYSIS").
**Expected Result:** No ALL CAPS text anywhere. All labels use sentence case (e.g., "Supports YES", "Sentiment analysis"). No `letter-spacing: 0.1em` treatment on labels.

---

### SC-02-007: Minimal Modern SaaS Aesthetic (Not Tactical)
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Review the overall visual design across all pages.
2. Check for any "terminal-style" elements: green-on-black text, command-line aesthetics, scanline effects, military-style borders.
**Expected Result:** Clean, modern SaaS design similar to Linear, Vercel, or shadcn/ui. No terminal or tactical styling. Professional typography with varied visual rhythm.

---

## 3. Layout & Navigation

### SC-03-001: Three-Column Grid Layout
**Priority:** P0
**Preconditions:** Logged in, viewport ≥ 1280px wide.
**Steps:**
1. Open DevTools and inspect the main layout container.
2. Verify it uses CSS Grid with three columns.
3. Measure column widths.
**Expected Result:** Layout is a CSS Grid with: sidebar (~220px) | main content (flexible) | right panel (~30% of viewport). Right panel is always visible.

---

### SC-03-002: Sidebar Navigation Links
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Observe the sidebar.
2. Verify navigation items are present: Home, Sentiments, Markets, Alerts, Geo (if feature-flagged).
3. Click each navigation item.
**Expected Result:** Each link navigates to the correct route. Active link is visually highlighted. Geo link only appears when `VITE_ENABLE_GEO_VIEW=true`.

---

### SC-03-003: Sidebar Auto-Collapse at < 1280px
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Set browser viewport to 1400px wide. Observe sidebar is expanded (labels visible).
2. Resize browser to 1200px wide.
3. Observe sidebar state.
4. Hover over the collapsed sidebar.
**Expected Result:**
- Step 1: Sidebar shows icons + text labels at 220px width.
- Step 3: Sidebar collapses to icon-only mode (~60px width).
- Step 4: Sidebar expands temporarily on hover to show labels.

---

### SC-03-004: Layout Mode — Dashboard
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click the layout switcher and select "Dashboard" mode.
2. Observe the layout.
**Expected Result:** All three panels visible: expanded sidebar (220px) + main content + right panel (30%). This is the default mode.

---

### SC-03-005: Layout Mode — Focus
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click the layout switcher and select "Focus" mode.
2. Observe the layout.
**Expected Result:** Sidebar collapses to icon-only (~60px). Main content and right panel remain visible. More horizontal space for content.

---

### SC-03-006: Layout Mode — Clean
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click the layout switcher and select "Clean" mode.
2. Observe the layout.
**Expected Result:** Sidebar hidden or minimal. Main feed takes full width. Right panel may be hidden or minimized. Maximum content area.

---

### SC-03-007: Layout Transition Animation
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Switch between Dashboard → Focus → Clean modes.
2. Observe the transition.
**Expected Result:** Layout changes are animated with a smooth 300ms ease transition (not instant snap). Grid columns animate smoothly via framer-motion.

---

### SC-03-008: Right Panel Always Visible
**Priority:** P0
**Preconditions:** Logged in, Dashboard mode, viewport ≥ 1280px.
**Steps:**
1. Observe the right panel (rightmost column).
2. Try to close or hide it (if any close button exists).
**Expected Result:** Right panel is always visible in Dashboard and Focus modes, taking approximately 30% of viewport width. No close/hide button.

---

### SC-03-009: Minimum Viewport 1024px
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Resize browser to exactly 1024px wide.
2. Navigate through all pages.
3. Resize to 1000px wide.
**Expected Result:**
- Step 2: All content is usable at 1024px. No horizontal overflow or overlapping elements.
- Step 3: Below 1024px, layout may degrade but should not crash.

---

### SC-03-010: Routing with Lazy Loading
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Open Network tab in DevTools.
2. Navigate to Home view.
3. Navigate to Sentiments view.
4. Navigate to Markets view.
**Expected Result:** Each view loads a separate JS chunk on first navigation (visible in Network tab as separate `.js` file requests). Subsequent visits use cached chunks.

---

### SC-03-011: Top Bar Elements
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Observe the top bar (56px height).
2. Verify presence of: search placeholder (with Cmd+K hint), theme toggle (Sun/Moon icon), notification bell.
**Expected Result:** All three elements present. Search shows keyboard shortcut hint. Bell shows unread count badge when alerts exist.

---

## 4. Authentication & Onboarding

### SC-04-001: Landing Page Gate
**Priority:** P0
**Preconditions:** Not logged in (clear localStorage).
**Steps:**
1. Navigate to `http://localhost:5173/`.
2. Observe the landing page.
3. Try to navigate directly to `http://localhost:5173/app`.
**Expected Result:**
- Step 2: Landing page displays with PolyMatic branding and "Access Terminal" link.
- Step 3: Redirected to `/login` (AuthGuard blocks unauthenticated access to `/app/*` routes).

---

### SC-04-002: Mock Login Flow
**Priority:** P0
**Preconditions:** Not logged in.
**Steps:**
1. Navigate to `/login`.
2. Enter any email (e.g., `test@polymatic.app`).
3. Enter any password (e.g., `password`).
4. Click "Sign in".
5. Observe where you are redirected.
**Expected Result:** Login succeeds with any email/password combination. User is redirected to `/app` (home dashboard). User appears as "Dev User" with `quant` tier (full access).

---

### SC-04-003: Auth Persists Across Page Refresh
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Refresh the page (F5 / Cmd+R).
2. Observe the page.
**Expected Result:** User remains logged in after refresh. No redirect to login page. Auth state persisted via localStorage (Zustand persist middleware).

---

### SC-04-004: Logout Flow
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Find and click the logout action (if available in UI).
2. Alternatively, clear `polymatic-auth` from localStorage and refresh.
**Expected Result:** User is logged out. Redirected to landing page or login. All authenticated routes are inaccessible.

---

### SC-04-005: Protected Routes Redirect
**Priority:** P0
**Preconditions:** Not logged in.
**Steps:**
1. Try to navigate directly to each of these URLs:
   - `/app`
   - `/app/sentiments`
   - `/app/markets`
   - `/app/alerts`
   - `/app/geo`
**Expected Result:** Every URL redirects to `/login`. No flash of authenticated content before redirect.

---

## 5. Mock Data Engine

### SC-05-001: DataProvider Initializes in Mock Mode
**Priority:** P0
**Preconditions:** `VITE_DATA_SOURCE_MODE=mock` in `.env`.
**Steps:**
1. Start dev server.
2. Log in.
3. Open browser console.
4. Check for errors related to data provider.
**Expected Result:** No errors. MockProvider initializes and starts generating data. MockEngine begins ticking generators.

---

### SC-05-002: Feed Data Generates Continuously
**Priority:** P0
**Preconditions:** Logged in, on home page.
**Steps:**
1. Open the browser console.
2. Wait 10 seconds.
3. Observe feed items appearing.
**Expected Result:** New feed items appear periodically (every ~3 seconds). Items have realistic titles, sources, categories, timestamps. Mix of severities (low, medium, high, critical).

---

### SC-05-003: Seed Data — 20 Prediction Questions
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate to Sentiments view.
2. Count the number of prediction questions displayed.
3. Verify questions span multiple categories.
**Expected Result:** At least 20 questions visible. Categories include: geopolitics (e.g., "Will Iran close the Strait of Hormuz..."), economics (e.g., "Will the Fed cut rates..."), technology (e.g., "Will OpenAI release GPT-5..."), sports, culture.

---

### SC-05-004: Seed Data — 25 Market Contracts
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate to Markets view.
2. Count market contracts.
3. Verify both platforms represented.
**Expected Result:** At least 25 market contracts. Mix of Polymarket and Kalshi platforms. Each has: title, probability, 24h change, volume, category.

---

### SC-05-005: Seed Data — 15 Trending Topics
**Priority:** P0
**Preconditions:** Logged in, on home page.
**Steps:**
1. Observe the trending bar.
2. Count trend chips.
3. Verify lifecycle mix.
**Expected Result:** 10-15 trend chips visible. Mix of lifecycles: some Emerging (pulsing), some Trending (solid), some Peaking (glow), some Cooling (faded).

---

### SC-05-006: Sentiment Score Updates in Batches
**Priority:** P0
**Preconditions:** Logged in, viewing sentiments.
**Steps:**
1. Note the current sentiment score for any question.
2. Wait 10-15 seconds.
3. Observe if the score changes.
**Expected Result:** Sentiment scores update in batches every 5-10 seconds (not continuously streaming). Score changes are small increments (Brownian drift), not jumps.

---

### SC-05-007: Market Prices Update with Random Walk
**Priority:** P0
**Preconditions:** Logged in, viewing markets.
**Steps:**
1. Note the current probability for any market.
2. Wait 15-20 seconds.
3. Observe probability changes.
**Expected Result:** Probabilities drift slightly with each tick (Brownian motion). Occasional larger jumps (±5-15%) when correlated with trend spikes. Changes are realistic, not erratic.

---

### SC-05-008: Trend Lifecycle Progression
**Priority:** P0
**Preconditions:** Logged in, observe trends over ~5 minutes.
**Steps:**
1. Note lifecycle states of current trends.
2. Wait 5+ minutes (or trigger via dev tools).
3. Check if any trend changed lifecycle.
**Expected Result:** Trends progress through lifecycle: Emerging → Trending → Peaking → Cooling. Velocity changes drive transitions. Occasionally a cooling trend re-accelerates (2% chance per tick).

---

### SC-05-009: Cross-Domain Correlation
**Priority:** P1
**Preconditions:** Logged in, observing trends and markets.
**Steps:**
1. Watch for a trend velocity spike (velocity delta > 8).
2. Check the linked market contracts.
**Expected Result:** When a trend spikes, linked market contracts show correlated price movement. The market generator applies trend-correlated jumps.

---

### SC-05-010: Alert Generation from Data Changes
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Wait for data generators to run (30-60 seconds).
2. Check the notification bell or alerts panel.
**Expected Result:** Alerts auto-generate when: trend velocity spikes (>10 delta), market moves significantly (>5% delta). Alerts include descriptive messages, severity levels, and timestamps.

---

### SC-05-011: Geo Events Generate in Conflict Zones
**Priority:** P1
**Preconditions:** Geo view enabled (`VITE_ENABLE_GEO_VIEW=true`).
**Steps:**
1. Navigate to Geo view.
2. Observe event markers.
**Expected Result:** Events appear in 5 zones: Strait of Hormuz, Ukraine/Russia front, Taiwan Strait, Korean Peninsula, South China Sea. Events include ADS-B flights, AIS vessels, conflict incidents. Motion tracks show animated paths.

---

## 6. Home Feed

### SC-06-001: Feed Displays on Home Page
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate to `/app` (Home).
2. Observe the main content area.
**Expected Result:** Feed items are visible with: source icon + channel name, timestamp, content body, entity tags as chips, trend hashtag badges, severity indicators. Items are sorted by relevance (70% velocity + 30% recency).

---

### SC-06-002: Mixed Density Cards
**Priority:** P0
**Preconditions:** Logged in, feed has items.
**Steps:**
1. Observe feed cards.
2. Compare high-severity items vs low-severity items.
**Expected Result:** High-signal items (severity > high, market-linked, high velocity) render as expanded cards (~200px+ height) with full content. Low-signal items render as compact cards (~80px height) with title + key badges only.

---

### SC-06-003: Feed Virtualization
**Priority:** P0
**Preconditions:** Logged in, feed has 50+ items.
**Steps:**
1. Open DevTools Elements panel.
2. Scroll through the feed.
3. Count the actual DOM nodes for feed items.
**Expected Result:** Uses react-virtuoso. Only visible items + overscan buffer are in the DOM (not all 50+ items). Scroll performance remains smooth at 60 FPS.

---

### SC-06-004: Infinite Scroll Pagination
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Scroll to the bottom of the feed.
2. Wait for loading indicator.
3. Continue scrolling.
**Expected Result:** More items load automatically when scrolling to the bottom. Loading skeleton or indicator shows during fetch. New items append seamlessly.

---

### SC-06-005: Feed Skeleton Loading State
**Priority:** P0
**Preconditions:** Clear cache, log in.
**Steps:**
1. Navigate to Home.
2. Observe the loading state.
**Expected Result:** Skeleton loading cards (5-7 animated pulse placeholders) appear during initial data load. NOT a centered spinner. Skeletons match the mixed-density layout.

---

### SC-06-006: Feed Filtering by Category
**Priority:** P0
**Preconditions:** Logged in, feed visible.
**Steps:**
1. Locate category filter controls (if present in filter bar).
2. Select "Geopolitics" only.
3. Observe feed items.
4. Deselect filter.
**Expected Result:** Only geopolitics-category items appear when filtered. Items from other categories are hidden. Removing the filter shows all items again.

---

### SC-06-007: Feed Filtering by Severity
**Priority:** P0
**Preconditions:** Logged in, feed visible.
**Steps:**
1. Set minimum severity filter to "High".
2. Observe feed items.
**Expected Result:** Only items with severity "high" or "critical" appear. Low and medium severity items are filtered out.

---

### SC-06-008: Feed Clustering — Lead Card + Expand
**Priority:** P0
**Preconditions:** Logged in, feed has clustered items (items sharing a `clusterId`).
**Steps:**
1. Look for a cluster indicator (e.g., "14 more from this story").
2. Click to expand the cluster.
3. Click to collapse.
**Expected Result:**
- Step 1: Lead card (highest signal in cluster) is visible. "N more from this story" toggle below it.
- Step 2: Remaining cluster items expand inline with framer-motion animation.
- Step 3: Items collapse back. Only lead card visible.

---

### SC-06-009: Trend Selection Filters Feed
**Priority:** P0
**Preconditions:** Logged in, feed and trending bar visible.
**Steps:**
1. Click a trend chip in the trending bar (e.g., "#IranStraitCrisis").
2. Observe the feed.
3. Click "All Trends" or deselect the trend.
**Expected Result:**
- Step 2: Feed filters to show only items related to the selected trend.
- Step 3: Feed returns to blended "For You" mode (70% velocity + 30% recency ranking).

---

### SC-06-010: Feed Item — Entity Chips
**Priority:** P0
**Preconditions:** Logged in, viewing an expanded feed item.
**Steps:**
1. Observe entity tags on a feed card.
**Expected Result:** Named entities appear as colored Chip components (e.g., "Iran", "Strait of Hormuz", "IRGC"). Chips are category-colored. Clicking a chip could navigate to topic page.

---

### SC-06-011: Feed Item — Timestamps
**Priority:** P0
**Preconditions:** Logged in, feed visible.
**Steps:**
1. Observe timestamps on recent feed items (< 1 hour old).
2. Observe timestamps on older feed items (> 6 hours old).
**Expected Result:**
- Recent: Relative time — "2m ago", "45m ago", "1h ago".
- Older: Absolute UTC — "Mar 2, 14:23 UTC".
- Timestamps use monospace font for the numerical portion.

---

## 7. Trending Bar

### SC-07-001: Trending Bar Displays 10-12 Chips
**Priority:** P0
**Preconditions:** Logged in, on home page, viewport ≥ 1440px.
**Steps:**
1. Observe the trending bar (horizontal bar, typically below the top bar).
2. Count visible trend chips.
**Expected Result:** 10-12 trend chips visible. Bar height is ~64px. Each chip is ~220px wide.

---

### SC-07-002: Trend Chip Content
**Priority:** P0
**Preconditions:** Logged in, trending bar visible.
**Steps:**
1. Examine a single trend chip closely.
**Expected Result:** Two-line chip showing:
- Line 1: Category color dot, hashtag label (e.g., "#IranStraitCrisis"), velocity arrow+%, market-linked badge icon (if linked).
- Line 2: Lifecycle label (Emerging/Trending/Peaking/Cooling), event count.
- All data visible without hover.

---

### SC-07-003: Trend Chip — Lifecycle Badge States
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Find a trend with "Emerging" lifecycle.
2. Find a trend with "Trending" lifecycle.
3. Find a trend with "Peaking" lifecycle.
4. Find a trend with "Cooling" lifecycle.
**Expected Result:**
- Emerging: Pulsing outline animation.
- Trending: Filled badge.
- Peaking: Filled badge with glow effect.
- Cooling: Faded/muted badge.

---

### SC-07-004: Trend Chip Click — Selects Trend
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click a trend chip.
2. Observe chip visual state.
3. Observe feed and right panel.
**Expected Result:**
- Step 2: Selected chip shows accent border + background highlight.
- Step 3: Feed filters to items related to that trend. Right panel may show trend detail.

---

### SC-07-005: Horizontal Scroll for Overflow
**Priority:** P0
**Preconditions:** Logged in, more than 12 trends.
**Steps:**
1. If more than viewport-width of chips, try scrolling horizontally.
2. Check for left/right scroll buttons at edges.
**Expected Result:** Bar scrolls horizontally with momentum. Scroll indicator buttons appear on hover at left/right edges. Chips do NOT wrap to next line.

---

### SC-07-006: "View All Trends" Button
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Look for "View All Trends" at the end of the trending bar.
2. Click it.
**Expected Result:** Opens a full trending dashboard (in right panel or as overlay) showing: all trends listed, historical velocity sparklines per trend, lifecycle indicators, sortable columns. Drill-down to topic pages.

---

### SC-07-007: Market-Linked Badge on Trend Chips
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Find a trend chip with a market-linked badge icon.
2. Hover over the badge.
**Expected Result:** Market-linked trends show a chart icon badge. Tooltip on hover shows linked market count and top market question text.

---

## 8. Sentiments Engine

### SC-08-001: Sentiment Questions List
**Priority:** P0
**Preconditions:** Logged in, navigate to Sentiments view.
**Steps:**
1. Observe the list of sentiment questions.
2. Verify each card shows: question text, sentiment probability (%), confidence level, sentiment direction arrow, market probability, market delta.
**Expected Result:** 20 questions displayed. Each card shows the collapsed view with all required data points. Questions are sortable.

---

### SC-08-002: Sentiment Score Calculation
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. View any sentiment question.
2. Note the YES count, NO count, and displayed score.
3. Verify: score ≈ YES / (YES + NO) * 100.
**Expected Result:** Sentiment score matches the weighted ratio formula: `YES/(YES+NO)`. Displayed as whole percentage (e.g., "73%", not "0.73" or "73.24%").

---

### SC-08-003: Confidence Level Display
**Priority:** P0
**Preconditions:** Logged in, sentiments visible.
**Steps:**
1. Find a question with "Low" confidence.
2. Find a question with "Medium" confidence.
3. Find a question with "High" confidence.
4. Compare their visual treatment.
**Expected Result:**
- Low: 60% opacity + "Low" label. Outline badge style.
- Medium: 85% opacity + "Medium" label. Filled badge.
- High: 100% opacity + "High" label. Filled badge.
- All three visually distinguishable.

---

### SC-08-004: Sentiment Direction Indicator
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Find questions with different sentiment directions (rising, falling, stable).
**Expected Result:**
- Rising: Green up arrow (▲).
- Falling: Red down arrow (▼).
- Stable: Gray neutral indicator.

---

### SC-08-005: Market Delta Display
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. View a sentiment question that has a linked market.
2. Observe the market delta badge.
**Expected Result:** 

Shows difference between sentiment probability and market probability. 

Formatted as "+12.4%" or "-5.2%" with directional color (green for positive, red for negative). Bloomberg-style number+arrow rendering.

---

### SC-08-006: Sentiment Detail — Expanded View
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click on a sentiment question to expand/view detail.
2. Observe the expanded content.
**Expected Result:** 

Shows: stance breakdown (yes/no/neutral/ambiguous counts), sentiment sparkline (24h history), 

recent classified tweets with stance labels, linked trend hashtags, confidence-weighted timeline.

---

### SC-08-007: Classified Tweet Display
**Priority:** P0
**Preconditions:** Logged in as `quant` tier user (default mock).
**Steps:**
1. Expand a sentiment question detail.
2. Observe individual tweet entries.
**Expected Result:** Each tweet shows: account handle, display name, content text, stance label (Supports YES / Supports NO / Neutral), confidence score, timestamp. Account credibility reflected in display.

---

### SC-08-008: Prediction Brief / AI Summary
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. View a sentiment question detail.
2. Look for the AI prediction summary section.
**Expected Result:** Clean intelligence summary card with structured sections. Contains: headline, summary paragraph, key signals (bullet points), sentiment score, market probability, confidence level. No emoji. Professional, concise copy. Modern typography (not terminal-style).

---

### SC-08-009: Sentiment Sparkline
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. View a sentiment question card.
2. Observe the sparkline.
**Expected Result:** Tiny inline chart showing 24h sentiment score history. No axes, no labels — just the trend line. Uses Recharts. Line color reflects direction.

---

### SC-08-010: Sentiment Batch Updates (5-10s)
**Priority:** P0
**Preconditions:** Logged in, viewing sentiments.
**Steps:**
1. Open DevTools Network tab.
2. Watch for data fetches over 30 seconds.
3. Count the sentiment update requests.
**Expected Result:** Sentiment data refreshes approximately every 5-10 seconds (TanStack Query refetch interval). Updates arrive as batches, not individual tweet streams.

---

## 9. Search

### SC-09-001: Search Bar — Location and Visual Presentation
**Priority:** P0
**Preconditions:** Logged in, on any `/app/*` page.
**Steps:**
1. Observe the top bar. Locate the search input in the center region.
2. Verify the input has a magnifying glass icon on the left.
3. Verify the placeholder reads "Search topics, markets, entities...".
4. When the input is **not focused and empty**, verify a `⌘K` keyboard shortcut badge is visible on the right side of the input.
5. Click the input to focus it. Verify the `⌘K` badge disappears while focused.
6. Type "test" — verify a clear button (X icon) appears on the right.
7. Click the clear button — verify the input is cleared and the clear button disappears.
**Expected Result:** Search input is centered in the top bar between the sidebar spacer and the right action buttons. Magnifying glass icon, placeholder text, `⌘K` hint badge (when unfocused + empty), and clear button (when has text) all render correctly. Input has an accent border on focus.

---

### SC-09-002: Search Bar — Cmd+K / Ctrl+K Global Shortcut
**Priority:** P0
**Preconditions:** Logged in, search input is not focused (click somewhere else on the page first).
**Steps:**
1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux).
2. Verify the search input receives focus and the cursor is blinking inside it.
3. Verify the dropdown opens (even if empty, showing the recent/saved prompt).
4. Type "test" to confirm the input is functional.
5. Press `Escape` to clear, then `Escape` again to close and blur.
6. Press `Cmd+K` again — verify focus returns to the search input immediately.
**Expected Result:** The global `Cmd+K` / `Ctrl+K` shortcut focuses the search input and opens the dropdown from anywhere in the app. The shortcut works repeatedly.

---

### SC-09-003: Search Autocomplete — 2 Character Minimum
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click the search input or press `Cmd+K` to focus.
2. Type one character (e.g., "I").
3. Observe the dropdown — it should show recent/saved searches (or the "Start typing" prompt), **not** search results.
4. Type a second character (e.g., "r" → "Ir").
5. Wait 200ms for the debounce to fire.
6. Observe the dropdown — it should now display search results grouped by section.
7. Delete one character back to "I" — verify results disappear and recent/saved mode returns.
**Expected Result:**
- 1 character: No search query fires. Dropdown shows recent/saved mode.
- 2+ characters: Search fires after 200ms debounce. Dropdown shows results sections.
- Deleting below 2 characters reverts to recent/saved mode.

---

### SC-09-004: Search Debounce — 200ms
**Priority:** P0
**Preconditions:** Logged in. Open React DevTools or TanStack Query DevTools to monitor queries.
**Steps:**
1. Open browser DevTools → Network tab (or TanStack Query devtools if available).
2. Click the search input and type "Iran" quickly (all 4 characters within ~100ms).
3. Count the number of search fetch requests that fire.
4. Now type slowly: "t" (wait 300ms) "e" (wait 300ms) "s" (wait 300ms) "t".
5. Count the requests for the slow typing.
**Expected Result:**
- Fast typing ("Iran" in <200ms): Only 1 search request fires (for "Iran" after final debounce).
- Slow typing: Up to 3 requests fire (for "te", "tes", "test") since each pause exceeds 200ms.
- No request fires for a single character regardless of timing.

---

### SC-09-005: Search Dropdown — Overlay Positioning and Appearance
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Type "Ir" in the search input.
2. Observe the dropdown appears below the search bar.
3. Verify the dropdown has: rounded corners, border matching `--color-border`, background matching `--color-bg-secondary`, subtle shadow.
4. Verify the dropdown does **not** push page content down — it overlays on top.
5. Verify the dropdown has a subtle entrance animation (opacity + slight upward slide).
6. Scroll the dropdown if content exceeds viewport — verify `max-h-[70vh]` with overflow scroll.
7. Verify z-index: the dropdown appears **above** the main content and right panel, but **below** any modal dialogs.
**Expected Result:** Dropdown is absolutely positioned below the search bar, overlays content, has smooth enter animation, scrolls when content overflows, and respects z-index layering (z-60).

---

### SC-09-006: Search Results — Fixed Section Order
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Type a broad query that matches across all types (e.g., "Iran" or a common keyword in mock data).
2. Observe the sections in the dropdown from top to bottom.
3. Verify the order is always: **Trends → Markets → Sentiments → Events**.
4. Verify each section has a header with: an icon (Hash for Trends, BarChart3 for Markets, MessageSquare for Sentiments, Rss for Events) + a label in sentence case using `data-label` class.
5. Verify section limits: Trends (max 3), Markets (max 3), Sentiments (max 3), Events (max 5).
6. Try different queries — verify the section order never changes regardless of result counts.
**Expected Result:** Sections always appear in fixed order: Trends, Markets, Sentiments, Events. Each has an icon + label header. Results per section are capped at 3/3/3/5.

---

### SC-09-007: Search Result Items — Type-Specific Rendering
**Priority:** P0
**Preconditions:** Logged in, search for a term with results across all types.
**Steps:**
1. **Trends section:** Verify each result shows: hashtag text (truncated if long) + `VelocityIndicator` (arrow + percentage) + `TrendLifecycleBadge` (Emerging/Trending/Peaking/Cooling with appropriate color/animation).
2. **Markets section:** Verify each result shows: question text (truncated) + `ProbabilityDisplay` (e.g., "73%") + `DeltaIndicator` (e.g., "+2.4%") + platform `Badge` (polymarket/kalshi).
3. **Sentiments section:** Verify each result shows: question text (truncated) + score percentage in monospace (e.g., "65%") + `ConfidenceBadge` (Low/Med/High) + direction arrow (green up / red down / gray minus).
4. **Events section:** Verify each result shows: source icon badge (𝕏/R/T/N/S/M in a small square) + title text (truncated) + relative `Timestamp` (e.g., "2m ago").
5. Verify all numerical values (percentages, deltas) use monospace font. Labels use sans-serif.
**Expected Result:** Each result type renders its own specific data layout using the correct UI atoms. Typography rules are respected (monospace for numbers only).

---

### SC-09-008: Search Result Items — Hover and Active States
**Priority:** P0
**Preconditions:** Logged in, search results visible in dropdown.
**Steps:**
1. Hover over a result item — verify it gets a `bg-hover` background color.
2. Press `ArrowDown` to move keyboard focus to the first item — verify it shows `bg-hover` background **plus** a left accent-colored border (2px left border in `--color-accent`).
3. Move keyboard focus to different items — verify only one item has the active state at a time.
4. Move the mouse over a different item while keyboard focus is elsewhere — verify hover state applies independently.
5. Verify each result item has `role="option"` and `aria-selected` reflects the active state.
**Expected Result:** Hover shows background highlight. Keyboard-active items show background highlight + left accent border. ARIA attributes are correct for accessibility.

---

### SC-09-009: Search Dropdown — Keyboard Navigation
**Priority:** P0
**Preconditions:** Logged in, search dropdown open with results.
**Steps:**
1. Type a query with results (e.g., "Ir").
2. Press `ArrowDown` — verify the first result in the first section gets active highlight.
3. Press `ArrowDown` repeatedly — verify focus moves through all items sequentially across sections (Trends items → Markets items → Sentiments items → Events items → "View all results" footer).
4. At the last item ("View all results"), press `ArrowDown` — verify it wraps to the first item.
5. Press `ArrowUp` — verify it moves backwards. At the first item, press `ArrowUp` — verify it wraps to the last item.
6. Press `Enter` on a highlighted result — verify navigation occurs to the correct route (topic page for trends, markets view for markets, sentiments view for sentiments, home for events).
7. Press `Enter` on "View all results" — verify navigation to `/app/search?q={query}`.
8. Press `Enter` with no item highlighted (activeIndex is null) — verify navigation to `/app/search?q={query}`.
**Expected Result:** Arrow keys cycle through all items in order including the "View all results" footer. Navigation wraps at both ends. Enter navigates to the correct route per item type.

---

### SC-09-010: Search Dropdown — Escape Key Behavior (Double-Escape)
**Priority:** P0
**Preconditions:** Logged in, search dropdown open with text in input.
**Steps:**
1. Type "Iran" in the search input. Dropdown is open with results.
2. Press `Escape` once.
3. Verify the input text is cleared (query becomes empty), but the dropdown remains open (showing recent/saved mode).
4. Press `Escape` a second time.
5. Verify the dropdown closes and the input loses focus (blurs).
6. Verify the `⌘K` hint badge reappears since input is now unfocused and empty.
**Expected Result:** First Escape clears the query. Second Escape closes the dropdown and blurs the input. This is the "double-escape" pattern.

---

### SC-09-011: Search Dropdown — Click-Outside to Close
**Priority:** P0
**Preconditions:** Logged in, search dropdown is open.
**Steps:**
1. Click the search input to open the dropdown.
2. Type "te" to get results.
3. Click anywhere outside the search bar + dropdown (e.g., on the feed content, sidebar, or right panel).
4. Verify the dropdown closes.
5. Verify the search input retains its current text (clicking outside does not clear the query).
6. Click the search input again — verify the dropdown reopens with results for the existing query.
**Expected Result:** Clicking outside the search container closes the dropdown without clearing the query. Re-focusing the input reopens the dropdown.

---

### SC-09-012: Search Dropdown — Recent Searches
**Priority:** P0
**Preconditions:** Logged in, no prior searches in this session.
**Steps:**
1. Focus the search input (click or Cmd+K). With no prior searches, verify the dropdown shows a prompt: "Start typing to search topics, markets, and sentiments".
2. Type "Iran" and wait for results to load. Then clear the input.
3. Type "Bitcoin" and wait for results. Then clear the input.
4. Type "election" and wait for results. Then clear the input.
5. Focus the search input with it empty — verify the dropdown shows a "Recent" section with a `Clock` icon header.
6. Verify recent searches are listed in reverse chronological order: "election", "Bitcoin", "Iran".
7. Each recent entry shows a clock icon on the left and the query text.
8. Click on "Bitcoin" — verify the input is populated with "Bitcoin" and results load for that query.
9. Verify the "Clear" button appears next to the "Recent" header. Click it.
10. Verify all recent searches are removed and the prompt returns.
**Expected Result:** Recent searches accumulate (up to 10), display in reverse chronological order with clock icons, are clickable to re-run, and can be bulk-cleared.

---

### SC-09-013: Search Dropdown — Saved Searches
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate to the full search results page: type "Iran", then click "View all results" or press Enter.
2. On the `/app/search?q=Iran` page, find and click the "Save this search" button (Bookmark icon + text).
3. Verify the button changes to "Saved" with a filled bookmark icon and becomes disabled.
4. Navigate back to the home feed.
5. Focus the search input with it empty — verify a "Saved" section appears in the dropdown below recent searches, with a `Bookmark` icon header.
6. Verify "Iran" appears as a saved search entry with a bookmark icon and a delete `X` button.
7. Click the saved search entry "Iran" — verify the input is populated with "Iran" and results load.
8. Clear the input. Focus it again. Click the `X` button on the "Iran" saved search.
9. Verify the saved search is removed from the list.
**Expected Result:** Saved searches appear in the dropdown with bookmark icons, are clickable to re-run, and each has an individual delete button. The delete button doesn't trigger the re-run action (stopPropagation).

---

### SC-09-014: Search Dropdown — Recent Searches Keyboard Navigation
**Priority:** P1
**Preconditions:** Logged in, have at least 2 recent searches stored.
**Steps:**
1. Focus the search input with it empty. Recent searches are shown.
2. Press `ArrowDown` — verify the first recent search gets active highlight.
3. Press `ArrowDown` again — verify the second recent search gets active highlight.
4. Press `Enter` — verify the input is populated with that recent search's text and results load.
**Expected Result:** Keyboard navigation works in recent searches mode. Enter selects and runs the highlighted recent search.

---

### SC-09-015: Search Dropdown — View All Results Footer
**Priority:** P0
**Preconditions:** Logged in, search returns results.
**Steps:**
1. Type "Ir" to get search results.
2. Scroll to the bottom of the dropdown (if needed).
3. Verify a "View all results" link with a right arrow icon appears at the bottom, separated by a top border.
4. Click "View all results".
5. Verify navigation to `/app/search?q=Ir`.
6. Verify the URL contains the query parameter.
**Expected Result:** "View all results" footer appears at the bottom of the dropdown when results exist. Clicking it navigates to the full search results page with the query preserved in the URL.

---

### SC-09-016: Search Results Page — URL Query Sync
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate directly to `/app/search?q=Iran` by typing the URL in the browser.
2. Verify the page loads, the search runs, and results are displayed for "Iran".
3. Verify the search input in the top bar also shows "Iran".
4. Change the query in the search bar to "Bitcoin". Click "View all results".
5. Verify the URL updates to `/app/search?q=Bitcoin` and results update accordingly.
**Expected Result:** The search results page reads from the `?q=` URL parameter on mount and syncs it to the search store. The URL is the source of truth for the full results page.

---

### SC-09-017: Search Results Page — Full Layout
**Priority:** P0
**Preconditions:** Logged in, navigated to `/app/search?q=Iran`.
**Steps:**
1. Verify the page header shows: "Results for" followed by the query in accent color with quotes (e.g., Results for "Iran").
2. Below the header, verify a result count in monospace (e.g., "12 results found").
3. Verify results are displayed in the same fixed section order as the dropdown: Trends → Markets → Sentiments → Events.
4. Verify the full results page shows **more** results per section than the dropdown (up to 20/20/20/50 vs dropdown's 3/3/3/5).
5. Verify each section shows its empty state message when no results match (e.g., "No matching trends").
6. Verify a "Save this search" button with Bookmark icon appears in the header area.
**Expected Result:** Full-page results view with header (query + count), higher limits per section, all four sections always visible (with empty states), and a save action.

---

### SC-09-018: Search Results Page — Empty State
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Navigate to `/app/search?q=xyznonexistent123`.
2. Verify the page shows a centered empty state with: a search icon (SearchX), a message "No results match 'xyznonexistent123'", and a suggestion "Try different keywords or broaden your search".
3. Verify there are NO sad emojis, no generic "Nothing here" text, no Lorem ipsum.
**Expected Result:** Professional, actionable empty state. No anti-pattern violations (no sad emoji, no generic copy).

---

### SC-09-019: Search Result Navigation — Per-Type Routing
**Priority:** P0
**Preconditions:** Logged in, search results visible (dropdown or full page).
**Steps:**
1. Click a **Trend** result — verify navigation to `/app/topic/{trendId}`.
2. Go back. Click a **Market** result — verify navigation to `/app/markets/{marketId}`.
3. Go back. Click a **Sentiment** result — verify navigation to `/app/sentiments/{sentimentId}`.
4. Go back. Click an **Event** result — verify navigation to `/app/home`.
5. Verify that after clicking a result in the dropdown, the dropdown closes.
**Expected Result:** Each result type navigates to its correct route. Dropdown closes after selection.

---

### SC-09-020: Search — Typography and Design Conventions
**Priority:** P0
**Preconditions:** Logged in, search dropdown or results page visible with results.
**Steps:**
1. Inspect section headers (Trends, Markets, Sentiments, Events) — verify they use `data-label` class: sans-serif (Inter), sentence case, no ALL CAPS, no letter-spacing treatment.
2. Inspect numerical values (probabilities, percentages, deltas, timestamps) — verify they use monospace font (JetBrains Mono / `font-mono`).
3. Verify the "⌘K" shortcut badge uses monospace font.
4. Verify no ALL CAPS text anywhere in the search UI (section headers, labels, buttons).
5. Verify the "View all results" text and "Save this search" text are in normal sentence case.
**Expected Result:** All typography rules are followed per CLAUDE.md conventions. Monospace reserved for numbers only. Labels in Inter sans-serif sentence case.

---

### SC-09-021: Search — Loading State
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Optionally throttle network in DevTools to slow down responses.
2. Type a query (e.g., "test").
3. Observe the dropdown while results are loading.
4. Verify a loading skeleton (list-row variant, 3 rows) appears — not a centered spinner.
5. Verify that once results arrive, the skeletons are replaced by actual result sections.
**Expected Result:** Loading state shows skeleton rows (not a spinner). Transitions smoothly to results once loaded.

---

## 10. Markets Panel

### SC-10-001: Market Cards Display
**Priority:** P0
**Preconditions:** Logged in, Markets view or market panel visible.
**Steps:**
1. Observe market contract cards.
2. Verify each card shows: title, platform badge, probability, 24h change, volume, sparkline.
**Expected Result:** Full market cards (not just list rows). Each card includes:
- Question title
- Platform badge (Polymarket / Kalshi)
- Current probability in large monospace font
- 24h change with directional arrow and color (green up, red down)
- Volume formatted as abbreviated number ("$4.2M")
- Inline sparkline showing 24h price history

---

### SC-10-002: Bloomberg-Style Number Rendering
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Inspect market probability display.
2. Inspect delta display.
**Expected Result:** Probabilities rendered as "73%" in monospace. Deltas rendered as "+4.2%" or "-1.5%" with ▲/▼ arrows. Green for positive, red for negative. Professional number formatting — no "increased by 4.2%".

---

### SC-10-003: Cross-Platform Market Display
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Find a question that has contracts on both Polymarket and Kalshi (e.g., "Will Iran close the Strait of Hormuz...").
2. Observe both market cards.
**Expected Result:** Both platform cards visible. Primary price + secondary platform delta shown. Cross-platform spread visible (e.g., Polymarket 12%, Kalshi 14%). Platform badges clearly distinguish them.

---

### SC-10-004: Market Sentiment Delta
**Priority:** P0
**Preconditions:** Logged in, markets and sentiments data available.
**Steps:**
1. View a market card that has linked sentiment data.
2. Observe the sentiment delta indicator.
**Expected Result:** Market cards enriched with sentiment score. Sentiment-vs-market delta displayed (e.g., if sentiment says 73% but market says 62%, delta is +11%). Number with arrow indicator.

---

### SC-10-005: Market Sparkline
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. View any market card.
2. Observe the sparkline.
**Expected Result:** Tiny inline Recharts line showing 24h price (probability) history. 48 data points. No axes or labels. Color reflects direction of price movement.

---

### SC-10-006: Market Filtering by Platform
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Filter markets to show only "Polymarket".
2. Verify all visible markets are Polymarket.
3. Filter to show only "Kalshi".
4. Verify all visible markets are Kalshi.
5. Remove filter.
**Expected Result:** Platform filter correctly includes/excludes markets. Both platforms have contracts. Removing filter shows all.

---

### SC-10-007: Market Sorting
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Sort markets by "Probability" (default).
2. Sort by "Volume".
3. Sort by "Delta".
4. Sort by "Recent".
**Expected Result:** Each sort option correctly reorders the list. Volume sorts by descending volume. Delta sorts by absolute delta descending. Recent sorts by timestamp.

---

### SC-10-008: Market Detail View
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click on a market card.
2. Observe the detail view (in right panel or expanded).
**Expected Result:** Detail view shows: full question text, larger sparkline, full price history, linked trends, sentiment data if available, expiration date, volume breakdown.

---

## 11. Topic Pages

### SC-11-001: Topic Page Navigation
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Click on a trend chip or entity chip that leads to a topic page.
2. Observe the topic page.
**Expected Result:** Topic page loads for the selected entity/trend. Shows: entity name, related feed items, linked markets, linked sentiments, historical data.

---

### SC-11-002: Topic Page — Related Markets
**Priority:** P0
**Preconditions:** On a topic page for an entity with linked markets (e.g., "Iran").
**Steps:**
1. Observe the markets section of the topic page.
**Expected Result:** Related market contracts displayed. If no directly linked markets: show semantically similar markets (based on shared entities). Panel is NEVER empty.

---

### SC-11-003: Topic Page — Tabs
**Priority:** P1
**Preconditions:** On a topic page.
**Steps:**
1. Observe tab navigation (e.g., Feed, Markets, Sentiments, Timeline).
2. Click through each tab.
**Expected Result:** Radix-based tabs with underline active indicator. Each tab shows relevant content for the topic. Tabs switch content without page reload.

---

## 12. Alerts

### SC-12-001: Alert Configuration
**Priority:** P0
**Preconditions:** Logged in, navigate to Alerts Config.
**Steps:**
1. Create a new alert with trigger type "velocity spike" for a specific trend.
2. Set threshold to 50.
3. Save the alert.
**Expected Result:** Alert config is created and appears in the list. Shows: name, trigger type, target, threshold, enabled status.

---

### SC-12-002: Alert Triggered and Displayed
**Priority:** P0
**Preconditions:** Alert configured, data generators running.
**Steps:**
1. Wait for alert conditions to be met (or set a very low threshold).
2. Check the notification bell in the top bar.
3. Click to view alerts.
**Expected Result:** Notification bell shows unread count. Alert appears with: title, message, severity level (color-coded), timestamp. Alert is dismissible.

---

### SC-12-003: Notification Toast
**Priority:** P0
**Preconditions:** Logged in, alerts are firing.
**Steps:**
1. Wait for a new alert to fire.
2. Observe the bottom-right corner of the screen.
**Expected Result:** Toast notification appears with AnimatePresence animation. Shows alert message and severity. Has dismiss button. Auto-disappears after timeout.

---

### SC-12-004: Mark All Alerts Read
**Priority:** P1
**Preconditions:** Multiple unread alerts exist.
**Steps:**
1. Observe the unread count on the notification bell.
2. Click "Mark all read" action.
**Expected Result:** All alerts marked as read. Unread count badge disappears. Alert items show "read" state (muted styling).

---

### SC-12-005: Dismiss Individual Alert
**Priority:** P0
**Preconditions:** Unread alert exists.
**Steps:**
1. Click dismiss on a single alert.
**Expected Result:** Alert marked as read. Unread count decrements by 1.

---

### SC-12-006: Auto-Generated Alerts
**Priority:** P0
**Preconditions:** Logged in, no manual alert configs.
**Steps:**
1. Wait 1-2 minutes for data generators to run.
2. Check for alerts.
**Expected Result:** System auto-generates alerts for significant events: velocity spikes (trend delta > 10), large market moves (delta > 5%). These appear even without user-configured alert rules.

---

## 13. Geo View (P1)

### SC-13-001: Geo View Behind Feature Flag
**Priority:** P1
**Preconditions:** `VITE_ENABLE_GEO_VIEW=false` in `.env`.
**Steps:**
1. Log in.
2. Check sidebar for "Geo" navigation link.
3. Try to navigate to `/app/geo`.
**Expected Result:**
- Step 2: "Geo" link is NOT visible in sidebar.
- Step 3: FeatureGate blocks access. Fallback content or redirect shown.

---

### SC-13-002: Geo View Enabled
**Priority:** P1
**Preconditions:** `VITE_ENABLE_GEO_VIEW=true` in `.env`.
**Steps:**
1. Log in.
2. Click "Geo" in sidebar.
3. Observe the geo view.
**Expected Result:** Three.js + react-three-fiber globe loads. Geo events plotted as markers in conflict zones. ADS-B/AIS motion tracks visible as animated trails.

---

### SC-13-003: Geo Event Markers in Conflict Zones
**Priority:** P1
**Preconditions:** Geo view open.
**Steps:**
1. Zoom to Strait of Hormuz region.
2. Observe event markers.
3. Zoom to Ukraine/Russia front.
4. Zoom to Taiwan Strait.
**Expected Result:** Each conflict zone has event markers. Events include: naval vessel tracks, military aircraft, conflict incidents. Markers color-coded by severity.

---

## 14. Performance

### SC-14-001: Time to Interactive < 3 Seconds
**Priority:** P0
**Preconditions:** Production build (`npm run build`).
**Steps:**
1. Serve the production build.
2. Open Chrome DevTools → Lighthouse.
3. Run a performance audit.
**Expected Result:** TTI (Time to Interactive) is under 3 seconds. Page becomes clickable and responsive within 3 seconds of navigation.

---

### SC-14-002: Feed Scroll at 60 FPS
**Priority:** P0
**Preconditions:** Logged in, feed has 50+ items.
**Steps:**
1. Open Chrome DevTools → Performance tab.
2. Start recording.
3. Scroll the feed rapidly for 5 seconds.
4. Stop recording.
5. Check frame rate chart.
**Expected Result:** Frame rate maintains 60 FPS (or near 60). No jank, no dropped frames. react-virtuoso handles DOM recycling.

---

### SC-14-003: Memory Usage < 500MB
**Priority:** P1
**Preconditions:** Logged in, all features active (feed + markets + sentiments).
**Steps:**
1. Open Chrome DevTools → Memory tab.
2. Take a heap snapshot.
3. Navigate through multiple views over 5 minutes.
4. Take another heap snapshot.
**Expected Result:** Memory usage stays under 500MB. No significant memory leaks between snapshots (some growth is acceptable from accumulating mock data).

---

### SC-14-004: Lazy-Loaded Routes
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Open DevTools Network tab, clear it.
2. Navigate from Home to Sentiments.
3. Observe network requests.
**Expected Result:** A new JS chunk loads for the Sentiments view (lazy loading via React.lazy + Suspense). Initial page load does NOT download all view code.

---

### SC-14-005: Production Bundle Size
**Priority:** P1
**Preconditions:** Run `npm run build`.
**Steps:**
1. Observe build output size.
2. Check for code splitting (separate chunks for recharts, radix, etc.).
**Expected Result:** Main bundle is reasonable (< 500KB gzipped). Recharts and Radix are in separate chunks. Three.js + react-three-fiber is externalized (not in main bundle).

---

## 15. Accessibility & Conventions

### SC-15-001: Number Formatting
**Priority:** P0
**Preconditions:** Logged in, data visible.
**Steps:**
1. Find any large number (volume, follower count).
2. Find any percentage.
3. Find any delta.
**Expected Result:**
- Large numbers: "1.2M" not "1234567", "4.2K" not "4200".
- Percentages: "73%" not "0.73".
- Deltas: "+12.4%" not "12.4% increase". Includes +/- sign.
- Currency: "$4.2M" not "$4200000".

---

### SC-15-002: Keyboard Accessibility
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Press Tab to navigate through interactive elements.
2. Use Enter/Space to activate buttons and links.
3. Use Escape to close dropdowns and modals.
**Expected Result:** All interactive elements are reachable via Tab. Focus ring is visible. Buttons activate on Enter/Space. Dropdowns close on Escape.

---

### SC-15-003: Toggle Accessibility
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Tab to the theme toggle.
2. Press Space to toggle.
3. Check for ARIA attributes.
**Expected Result:** Toggle switch is keyboard accessible. Has `role="switch"` or similar ARIA role. Screen reader announces state change.

---

### SC-15-004: Tooltip Behavior
**Priority:** P1
**Preconditions:** Logged in.
**Steps:**
1. Hover over an element with a tooltip.
2. Observe tooltip appearance.
3. Move mouse away.
**Expected Result:** Radix-based tooltip appears on hover. Dark card style. Dismisses on mouse leave. Only used when adding information the label doesn't already convey.

---

### SC-15-005: Error Boundary
**Priority:** P0
**Preconditions:** Trigger a component error (e.g., via dev tools or invalid data).
**Steps:**
1. Force a rendering error in a component.
2. Observe the error display.
**Expected Result:** Error boundary catches the error. Displays helpful message: what happened, retry button, report link. Does NOT crash the entire app. Other panels remain functional.

---

### SC-15-006: Empty States — Professional Copy
**Priority:** P0
**Preconditions:** Logged in.
**Steps:**
1. Navigate to a view with no data (e.g., clear all filters so nothing matches).
2. Observe the empty state.
**Expected Result:** Empty state shows: relevant icon, actionable primary text, optional CTA button. NO sad emoji. NO "Oops!" or "Nothing here yet!" copy. Professional, product-confident messaging.

---

## 16. Anti-Pattern Checks

### SC-16-001: No Generic Placeholder Copy
**Priority:** P0
**Preconditions:** Browse all views.
**Steps:**
1. Search the codebase and UI for: "Lorem ipsum", "Your content here", "Get started today", "Welcome to...", placeholder text.
**Expected Result:** No generic placeholder copy anywhere in the UI. All text is real, contextual, and product-specific.

---

### SC-16-002: No Default Component Library Styling
**Priority:** P0
**Preconditions:** Browse all views.
**Steps:**
1. Check Radix UI components (dialogs, dropdowns, tooltips, tabs).
2. Compare against default Radix styling.
**Expected Result:** All Radix components are heavily customized with PolyMatic's design system. No out-of-the-box Radix styling. Custom colors, spacing, typography applied.

---

### SC-16-003: No Centered Spinner Loading States
**Priority:** P0
**Preconditions:** Trigger loading states across the app.
**Steps:**
1. Reload the app and observe loading states for: feed, markets, sentiments, trends.
**Expected Result:** Loading states use skeleton screens or contextual placeholders — NOT a centered spinner alone. Skeletons match the shape of the content they replace.

---

### SC-16-004: Varied Visual Rhythm
**Priority:** P1
**Preconditions:** Browse all views.
**Steps:**
1. Examine spacing across the app.
2. Check if all cards have identical padding and rounded corners.
**Expected Result:** Visual rhythm varies based on content importance. High-signal cards have different treatment than low-signal cards. Not a uniform grid of identical boxes.

---

### SC-16-005: No Uniform Card Grid
**Priority:** P1
**Preconditions:** Browse feed and markets views.
**Steps:**
1. Check if all cards are identical rectangles with same dimensions.
**Expected Result:** Feed uses mixed-density (compact vs expanded). Markets may use different card sizes. Not a boring uniform grid of identical cards.

---

### SC-16-006: Product Name Consistency
**Priority:** P0
**Preconditions:** Browse all views including landing page.
**Steps:**
1. Search all visible text for "WORLDVIEW" or any incorrect product name.
**Expected Result:** All references use "PolyMatic" consistently. No remnants of old branding.

---

## Feature Flag Test Matrix

| Flag | `true` Behavior | `false` Behavior |
|------|----------------|-----------------|
| `VITE_ENABLE_GEO_VIEW` | Geo nav link visible, `/app/geo` accessible with Three.js + react-three-fiber globe | Geo nav link hidden, `/app/geo` blocked by FeatureGate |
| `VITE_ENABLE_DETECT` | Detect feature accessible | Detect feature hidden |
| `VITE_ENABLE_WHALE_TRACKING` | Whale tracking feature accessible | Whale tracking hidden |
| `VITE_ENABLE_TIMELINE` | Timeline feature accessible | Timeline hidden |
| `VITE_ENABLE_LIGHT_MODE` | Light theme toggle visible | Light theme toggle hidden (dark only) |
| `VITE_DATA_SOURCE_MODE=mock` | MockProvider used, generators run | — |
| `VITE_DATA_SOURCE_MODE=rsdip` | RSDIPProvider used (throws "not implemented" in dev) | — |

---

## Numeric Specification Reference

| Specification | Value |
|--------------|-------|
| Trending bar chips visible | 10-12 |
| Chip width | ~220px |
| Trending bar height | 64px |
| Classification batch interval | 5-10 seconds |
| Search autocomplete min chars | 2 |
| Search debounce | 200ms |
| Feed virtualization overscan | 50 items |
| Layout animation duration | 300ms ease |
| Sidebar width (expanded) | 220px |
| Sidebar width (collapsed) | ~60px |
| Sidebar collapse breakpoint | < 1280px viewport |
| Right panel width | 30% viewport |
| Top bar height | 56px |
| Feed ranking: velocity weight | 70% |
| Feed ranking: recency weight | 30% |
| Compact card height | ~80px |
| Expanded card height | ~200px+ |
| Low confidence opacity | 60% |
| Medium confidence opacity | 85% |
| High confidence opacity | 100% |
| Free tier: tracked questions | 3 max |
| Pro tier: key voices shown | 3-5 tweets |
| Min viewport width | 1024px |
| TTI target | < 3 seconds |
| Feed scroll FPS target | 60 FPS |
| Memory target (with geo) | < 500MB |
| Mock feed base rate | 2 items/sec |
| Mock feed burst rate | 15 items/sec |
| Burst probability | 5% per tick |
| Burst window | 30 seconds |
| Sentiment true value drift | Brownian motion with mean reversion |
| Market random walk | Brownian motion, occasional ±5-15% jumps |
| Trend re-acceleration chance | 2% per tick |
| Price history points | 48 (24h) |
| Alert dedup window | 5 minutes |
| WebSocket batch interval | 100ms |
| WebSocket spike threshold | 50 buffered messages |
| WebSocket spike batch interval | 250ms |
| WebSocket max reconnect delay | 30 seconds |
| Reconnect backoff | Exponential: 1s → 2s → 4s → 8s → 30s |

---

## Cross-Browser Testing Matrix

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest | P0 |
| Firefox | Latest | P0 |
| Edge | Latest | P1 |
| Safari | Latest | P1 |

**Note:** Desktop only. No mobile/tablet testing required (min viewport 1024px).

---

## Test Data Seed Summary

| Dataset | Count | Key Examples |
|---------|-------|-------------|
| Prediction questions | 20 | Iran Strait, Fed rates, Trump tariffs, GPT-5, Ukraine ceasefire |
| OSINT accounts | 30 | @AuroraIntel, @BNONews, @bellingcat, @sentdefender, @IntelDoge |
| Market contracts | 25 | Polymarket + Kalshi, cross-platform pairs |
| Trending topics | 15 | 3 emerging, 5 trending, 4 peaking, 3 cooling |
| Named entities | 50 | People, orgs, countries, locations, commodities |
| Geo conflict zones | 5 | Strait of Hormuz, Ukraine, Taiwan, Korea, South China Sea |
