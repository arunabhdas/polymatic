# The Making of PolyMatic — Part 1: From Idea to Architecture

*A dev log on building an AI-powered intelligence platform from scratch with React and TypeScript.*

---

What happens when you cross a Bloomberg Terminal with a cinematic intelligence dashboard — and feed it Twitter sentiment, OSINT signals, and prediction market data?

You get **PolyMatic**.

This is Part 1 of a live dev log series documenting the full build of PolyMatic.App: an AI-powered Geospatial OSINT + Prediction Market Intelligence platform. I'm building it in public and documenting the real decisions, tradeoffs, and lessons along the way.

No fluff. No "10x your productivity" clickbait. Just a real product being built in real time.

---

## The Problem: Intelligence Lives in Silos

If you've ever tried to make sense of a fast-moving geopolitical event — a conflict escalation, a surprise election result, a sanctions announcement — you know the pain. The information you need is scattered across three completely different ecosystems:

**OSINT feeds** (LiveUAMap, Bellingcat, FIRMS) give you the raw signals. What's happening, where, when.

**Social sentiment** (Twitter/X, Reddit, Telegram) gives you the crowd reaction. What do people think will happen next?

**Prediction markets** (Polymarket, Kalshi) give you the money-weighted probabilities. What are people willing to bet on?

Each of these is powerful alone. But they're almost never correlated. You're flipping between tabs, mentally cross-referencing, trying to spot when crowd sentiment diverges from market prices — which is often where the real alpha lives.

Existing tools serve one domain:
- **Oddpool** and **Verso** do prediction market analytics — prices, volume, arbitrage. No OSINT. No sentiment.
- **LiveUAMap** does geospatial events beautifully. No market context. No sentiment scoring.
- **Various Twitter dashboards** aggregate social chatter. No market correlation. No geospatial grounding.

PolyMatic bridges all three into a single, unified intelligence feed.

---

## The Vision: What PolyMatic Actually Does

At its core, PolyMatic lets you:

1. **Browse trending topics** (not geographic regions) and see which events are moving prediction markets
2. **Analyze crowd sentiment** on specific prediction outcomes before markets price them in
3. **Detect divergences** — when OSINT signals, crowd sentiment, and market prices disagree, something interesting is happening
4. **Track whale activity** — large trades correlated with sentiment shifts and geopolitical events

The target users span a spectrum:
- **Retail bettors** browsing trends and checking sentiment before placing trades
- **OSINT analysts** doing deep geospatial analysis with market and sentiment correlation
- **Quants and researchers** building signal models with API access and backtesting

The design north star from day one: *"Bloomberg Terminal meets cinematic intelligence dashboard."*

Not a toy. Not a dashboard template. A premium, information-dense, dark-first professional tool with a cinematic edge.

---

## Phase 1: The Interview — Locking 40+ Decisions Before Writing a Single Line of Code

Here's where the process gets interesting.

Before I wrote any code, I spent an entire phase interviewing myself about every meaningful design decision. Not loose brainstorming — structured Q&A with forced choices, documented and locked.

I call this the **Interview Phase**, and it's the single most valuable thing I did.

**Why?** Because ambiguity is the enemy of velocity. Every time you reach a fork while coding and think "hmm, should I do it this way or that way?" — you lose momentum. If you're lucky, you pick one and move on. If you're not, you build it one way, realize it's wrong, and refactor. I've done enough of that to know: lock the decisions early.

Here's a sample of what got resolved:

**Sentiments Engine:**
- How do we calculate sentiment probability? → Weighted ratio `YES/(YES+NO)`, not Bayesian inference. Simpler, more interpretable, good enough for V1.
- Do we classify tweets in real-time or batches? → Batched every 5-10 seconds. Streaming would hammer the LLM API and isn't necessary for the UX.
- How do we show confidence? → Opacity + label. Low = 60% opacity, Medium = 85%, High = 100%. Visual hierarchy without extra UI chrome.

**Home Feed:**
- Uniform card heights or mixed density? → Mixed density, signal-based. High-severity items get more real estate. The feed should breathe.
- Feed ranking algorithm? → 70% velocity + 30% recency in "For You" mode. Pure chronological available as a toggle.
- When does virtualization kick in? → 50+ items, via react-virtuoso. Below that, native rendering is fine.

**Layout:**
- Is the right panel collapsible? → No. Always visible at 30% width. Contextual detail is always available.
- Sidebar behavior on narrow viewports? → Auto-collapse. The user shouldn't have to manage it.
- Minimum viewport? → 1024px. This is a professional tool, not a mobile app (yet).

**Geo View:**
- CesiumJS or Three.js? → Three.js + react-three-fiber. More flexible, better React integration, lighter weight. CesiumJS is great for cartographic accuracy but overkill for our use case.

**Typography (this one matters more than people think):**
- Monospace everywhere or selective? → Selective. Monospace *only* for numerical data — prices, percentages, timestamps, deltas. Everything else uses Inter. This prevents the "terminal cosplay" aesthetic that plagues OSINT tools.
- ALL CAPS classification headers? → No. Clean, normal-case typography. The data speaks for itself.

40+ decisions like these. All documented in a 2,000-line `PLAN.md`. All locked before implementation began.

---

## Phase 2: The Architecture Plan — 16 Sections, 230+ Tasks

With decisions locked, I wrote a comprehensive implementation plan before touching the codebase. This isn't a loose outline — it's a 1,600-line architecture document covering:

1. Tech stack rationale (why each library, what it replaces)
2. Folder structure (feature-based, not type-based)
3. State architecture (Zustand stores, one per domain, cross-store communication via event bus)
4. Data abstraction (the `DataProvider` pattern — more on this below)
5. Theming system (single CSS file, CSS custom properties, shadcn's dark class pattern)
6. Routing strategy (lazy-loaded routes via `createBrowserRouter`)
7. Performance targets (60fps scroll, <3s TTI, <500MB memory)
8. All 16 epics broken into stories and tasks

The task breakdown uses a simple convention: `E{epic}-S{story}-T{task}`. So `E3-S2-T4` means Epic 3 (Home Feed), Story 2 (Feed Item Row), Task 4 (implement sentiment badge). This makes status tracking trivial and lets me reference specific work items in commits.

### The Tech Stack

Here's what I landed on and why:

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript (strict) | Ecosystem, hiring pool, strict TS eliminates entire categories of bugs |
| Build | Vite 7 | Fast HMR, ESM-native, no Webpack config hell |
| State | Zustand + TanStack Query v5 | Zustand for client state (simple, no boilerplate). TanStack Query for server state (caching, refetching, stale-while-revalidate) |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first + headless primitives. shadcn gives you components you own, not a library you depend on |
| Animation | framer-motion | Layout animations, micro-interactions, spring physics. The difference between "works" and "feels good" |
| Virtualization | react-virtuoso | Feed performance. Only render what's visible, recycle DOM nodes |
| Charts | Recharts | Sparklines, sentiment timelines. Lightweight, composable, React-native |
| Geo | Three.js + react-three-fiber | 3D globe with data layers. GPU-instanced markers for 10,000+ points |
| Routing | react-router-dom v7 | `createBrowserRouter` with lazy loading. Code-split by route |
| Validation | Zod | Runtime schema validation. TypeScript types aren't enough when data comes from an API |
| Hosting | Vercel | Deploy-on-push, edge functions, analytics. The obvious choice for a React SPA |

No `any` types. No type assertions without explanatory comments. 11 carefully designed domain type files covering every entity in the system.

---

## The Data Abstraction: My Favorite Architectural Decision

This is the pattern I'm most proud of, and it's deceptively simple.

All data in PolyMatic flows through a `DataProvider` interface. The app resolves which provider to use at runtime based on a single environment variable:

```typescript
type DataSourceMode = "mock" | "rsdip";
```

Both `MockProvider` and `RsdipProvider` implement the exact same interface:

```typescript
interface DataProvider {
  getFeedItems(filters?: FeedFilters): Promise<FeedItem[]>;
  getTrends(): Promise<Trend[]>;
  getSentiments(questionId: string): Promise<SentimentData>;
  getMarkets(filters?: MarketFilters): Promise<Market[]>;
  // ... etc
}
```

React components never know or care where data comes from. They consume TanStack Query hooks — `useFeed()`, `useTrends()`, `useMarkets()` — which internally ask a factory for the current provider.

**Why this matters:** The backend (a FastAPI Python service with WebSocket streaming) is being built in parallel. The frontend can be fully developed, tested, and demoed using mock data that matches the exact TypeScript interfaces the backend will serve. When the backend is ready, I flip one env var and the entire app switches to live data. No component changes. No refactoring. Just a config toggle.

The mock data generators are themselves non-trivial. The `FeedGenerator` simulates bursty tweet arrival patterns with burst/calm cycles. The `TrendGenerator` creates realistic trending topic clusters with velocity scoring and lifecycle states (Emerging → Trending → Peaking → Cooling). The `SentimentGenerator` produces stance distributions with confidence-weighted scoring.

This isn't dummy data — it's a simulation engine that makes the app feel alive during development.

---

## The Reset: When You Have to Throw Away Code

Here's the part most dev logs skip: the failure.

A few epics into implementation, I hit a point where the codebase wasn't right. The initial approach lacked proper shadcn/ui integration from the start. I'd chosen CesiumJS for geo and it was fighting me. The CSS architecture had split into multiple files that were hard to reason about. The dark theme felt like an afterthought rather than a foundation.

So I reset. Commit `b278904`. Deprecated the original codebase entirely and rebuilt from scratch.

**What I kept:** All the documentation. The PRD, the PLAN, the TASKS, the architecture decisions. Every one of those 40+ locked decisions. The types. The mock data generators.

**What I threw away:** The component implementations, the CSS architecture, the routing setup, the geo integration.

**What I changed:**
- shadcn/ui integrated from day one (13 primitives, properly configured)
- Single `index.css` for all theming (Tailwind v4 + CSS custom properties + shadcn dark class pattern)
- Three.js + react-three-fiber instead of CesiumJS
- `createBrowserRouter` instead of declarative `<Routes>`
- "Profound depths" dark aesthetic baked into the foundation — near-black backgrounds (#0a0a0a), desaturated borders, subtle shadows

The reset cost me time. But it paid for itself almost immediately because every new component built on a solid foundation instead of working around early mistakes.

**The lesson:** Comprehensive documentation makes resets survivable. When your architecture plan is 1,600 lines and your decisions are locked, rebuilding is systematic — not chaotic. You're not re-making decisions. You're re-executing known good decisions on a better foundation.

---

## What's Built So Far

After the reset, here's what's complete:

**Epic 1 — Foundation (Complete)**
- Vite 7 + React 18 + TypeScript strict mode
- AppShell layout: Sidebar | Main Content | Right Panel
- shadcn/ui: 13 primitives configured and themed
- Routing with lazy-loaded views
- Dark theme with the "Profound depths" palette
- 9 base UI atoms: Chip, DataLabel, DeltaIndicator, MiniSparkline, PulseIndicator, SeverityBar, SourceIcon, StatusDot, TimeAgo

**Epic 2 — Mock Data Engine (Complete)**
- 11 domain type files (FeedItem, Trend, Market, Sentiment, etc.)
- 4 generators (feed, market, sentiment, trend) with realistic simulation
- Seed data: 50+ accounts, entities, prediction questions, markets
- DataProvider factory with mock/live toggle
- TanStack Query hooks for all data domains

**Epic 3 — Home Feed (Partial)**
- HomeFeed with react-virtuoso
- FeedItemRow with severity-based density
- FeedFilters (source, severity, category)
- TrendCarousel (horizontal scrolling trend chips)
- Zustand feedStore

**Epic 3A — UI/UX Polish (Complete)**
- CSS token audit and fixes
- Dark theme refinement (Supabase + Profound aesthetic)
- 37 TypeScript errors resolved
- Layout shell visual polish

---

## What's Next

Part 2 will cover the **Sentiments Engine** — the feature that transforms PolyMatic from a passive dashboard into an active prediction tool. I'll walk through:

- The 6-step pipeline: tweet collection → stance classification → confidence weighting → aggregate scoring → prediction generation → UI surfaces
- How LLM-powered stance classification works (and why batching beats streaming)
- The `SentimentGenerator` mock data strategy
- Building the sentiments panel UI with shadcn/ui + framer-motion

Part 3 will tackle the **Trending Bar and Search** — topic-based navigation, velocity scoring, and the 2-character autocomplete system.

---

*Follow along as I build PolyMatic in public. Next up: Part 2 — The Sentiments Engine.*

*If you're building something ambitious, I'd love to hear about it. Drop a comment or reach out.*

---

**Tech Stack Reference**

```
React 18 · TypeScript (strict) · Vite 7 · Zustand · TanStack Query v5
Tailwind CSS v4 · shadcn/ui · framer-motion · react-virtuoso · Recharts
Three.js · react-three-fiber · Zod · react-router-dom v7 · Vercel
```

**Project Links**
- PRD: 655 lines, 37KB
- Architecture Plan: 1,619 lines, 69KB
- Task Breakdown: 16 epics, ~49 stories, 230+ tasks
- Current Codebase: 100+ TypeScript files, 11 type definitions, 13 shadcn primitives

---

*This is Part 1 of "The Making of PolyMatic" — a live dev log and codelab series on building an AI-powered intelligence platform from the ground up.*
