 Phase 1: INTERVIEW MODE

  Here are all the decision points I need resolved before writing a single line of code. I've organized them by priority and domain.

  ---
  1. SENTIMENTS ENGINE (P0 — Highest Priority)

  1a. LLM Provider for Stance Classification
  The backend will handle classification, but mock data needs to simulate realistic output. Which LLM is the target for stance classification — OpenAI
  (GPT-4), Anthropic (Claude), or a fine-tuned local model? This affects the mock confidence distributions I generate (different models have different
  confidence calibration curves).

  1b. Stance Classification Latency Model
  Is classification real-time per-tweet (sub-second, streamed to client as each tweet is classified) or batch (every N seconds, a batch of classified
  tweets arrives)? This fundamentally changes the mock data streaming cadence and the UI update pattern (streaming ticker vs. periodic refresh).

  1c. Sentiment Probability Calculation
  The PRD says "weighted ratio of Supports YES to Supports NO." Should the mock implement:
  - Simple weighted ratio: YES_weight / (YES_weight + NO_weight) * 100
  - Bayesian update: prior from market price, updated by each new classified tweet
  - Something else (ELO-style, moving average)?

  1d. Sentiment Confidence → Visual Treatment
  Confidence is Low/Medium/High. How should this map to the UI?
  - Opacity reduction for low confidence? (e.g., 60% opacity)
  - Size reduction? (smaller badge/number)
  - Badge style change? (outline-only for low, filled for high)
  - A combination? What's your instinct?

  1e. Individual Tweets vs. Aggregates
  Should users see the individual classified tweets that contribute to a sentiment score, or only the aggregate numbers? The PRD mentions "key voices
  with representative tweets" in the expanded card — but should there be a full tweet-level drill-down, or is 3-5 representative tweets per stance
  sufficient?

  1f. Free Tier Question Limit
  PRD says 3 tracked questions for free. Can the user browse unlimited questions (read-only) and only track/watchlist 3? Or are they limited to seeing
  only 3 total?

  1g. "Add Question" Flow
  When a user clicks "Add Question," should this be:
  - Freetext input (they type any question, system matches to markets)
  - Search existing prediction market questions (autocomplete from Polymarket/Kalshi catalog)
  - Both (freetext with autocomplete suggestions)
  - Suggested questions based on trending topics

  1h. AI Prediction Summary — Visual Treatment
  The prediction summary ("Twitter sentiment strongly favors YES at 73%...") — should this render as:
  - An inline card within the expanded question card
  - A collapsible/expandable section with a "View AI Analysis" trigger
  - A separate modal/drawer for deep analysis
  - Something that feels like a Bloomberg terminal note

  ---
  2. TRENDING HASHTAGS BAR (P0)

  2a. Visible Chip Count
  How many trend chips should be visible before horizontal scrolling kicks in? On a standard 1440px-wide viewport, I'm thinking 6-8 chips. Confirm or
  adjust?

  2b. Chip Information Density
  Each chip needs: hashtag label, velocity indicator, event count, market-linked badge. That's a lot for a chip. Should I:
  - Show hashtag + velocity arrow only in the chip, with full detail on hover
  - Fit all four data points into the chip (will be wider, ~180-200px each)
  - Use a two-line chip (hashtag on top, stats on bottom)

  2c. Lifecycle Transition Animation
  When a trend moves from "Emerging" to "Trending" to "Peaking" — should this animate (glow pulse, border color shift) or just update silently?

  2d. Trends with No Linked Markets
  When a user clicks a trend that has no linked prediction markets, the Markets panel would be empty. Should I:
  - Show a "No linked markets yet" state with suggested similar markets
  - Hide the Markets panel and give feed more width
  - Show the panel with a "Create alert when markets appear" CTA

  2e. "For You" Feed Ranking
  When no trend is selected, the unfiltered feed is shown. How should it rank?
  - Pure recency (newest first)
  - Velocity-weighted (fast-moving events surface first)
  - Personalization-weighted (based on user's watchlist topics)
  - Some blend — what ratio?

  2f. Topic Page Layout
  When drilling into a trend, the Topic Page has many sections (header, sentiment, markets, timeline, entities, geo, related). Should this be:
  - Single-column scrollable (like a long article)
  - Multi-panel dashboard (like the main view, but scoped to the topic)
  - Tabbed sections within the right panel

  ---
  3. SEARCH

  3a. Autocomplete Aggressiveness
  How many characters before autocomplete suggestions appear? 1 character (aggressive, like Spotlight) or 3 characters (conservative)?

  3b. Blended Results Ranking
  When a query matches across Trends, Markets, Events, and Sentiments — what's the priority order? Should it be:
  - Fixed order (Trends → Markets → Sentiments → Events)
  - Relevance-scored and mixed together
  - Sectioned with a "Top Result" highlighted

  3c. Search Persistence
  Does search act as a filter (results replace the feed, trend bar stays, user backs out) or open a dedicated search results page?

  ---
  4. HOME FEED

  4a. Card Density
  Feed cards: compact (title + source + timestamp + badges, ~80px tall) or expanded (body text visible, media thumbnails, ~200px tall)?

  4b. Media in Cards
  Should cards auto-expand images/videos or show small thumbnails that expand on click?

  4c. Event Clustering
  When 15 tweets are about the same breaking event, should they appear as:
  - Individual cards (noisy but complete)
  - Clustered: lead card + "14 more from this story" expandable
  - Stacked: visually stacked cards with a count badge

  4d. Virtualization Threshold
  At what count should virtualization kick in? I'm proposing 50 items in DOM with react-virtuoso. Confirm or adjust?

  ---
  5. MARKETS PANEL

  5a. Market Card Design
  Compact list rows (like a stock ticker — one line per contract) or full cards (multi-line with chart sparkline)?

  5b. Cross-Platform Comparison
  When Polymarket and Kalshi have the same question at different prices: side-by-side columns, or unified row with platform badges showing each price?

  5c. Sentiment Delta Visualization
  The market delta (sentiment vs. market price) inline display:
  - Color bar (like a horizontal gauge)
  - Number with arrow ("+12.4%" in green)
  - Mini gauge/arc
  - What feels most "Bloomberg terminal"?

  ---
  6. GEO VIEW (P1 — but architecture decisions affect P0)

  6a. Renderer
  CesiumJS (true geospatial, heavier, terrain tiles) or Three.js + react-three-fiber (lighter, more shader control, stylized)? The mocks show
  CesiumJS-style photorealistic terrain. Given geo is P1, should I:
  - Stub the route with a placeholder and build the architecture for CesiumJS later
  - Build a lightweight Three.js globe now as a visual anchor
  - Skip entirely for P0

  6b. Globe Detail Level
  Photorealistic terrain (as in the mocks) or stylized/flat globe (lighter, more "designed")?

  6c. Motion Trails vs. Static Markers
  For ADS-B/AIS data: animated motion trails (computationally expensive, cinematic) or static position markers with heading indicators?

  6d. Clustering Threshold
  At what zoom level do markers cluster vs. scatter? Need a rough density number.

  ---
  7. LAYOUT AND CHROME

  7a. Right Panel Behavior
  Always visible (persistent, taking ~30% of viewport), or slide-out drawer on selection (more feed space, less persistent context)?

  7b. Sidebar Behavior
  Always expanded with labels, collapsible to icon-only, or auto-collapse on narrow viewports? The mocks show icon + label sidebar.

  7c. Layout Switching
  Tactical → Panoptic → Clean: animated CSS transition (300ms ease) or instant swap? What about keyboard shortcuts for switching?

  7d. Responsive Targets
  Desktop-first is clear. What's the minimum supported width? 1280px? 1024px? Should there be a tablet breakpoint or is this strictly desktop?

  7e. Dark Mode Only?
  PRD says dark-first. Should there be a light mode escape hatch, or dark only for MVP?

  ---
  8. PERFORMANCE

  8a. Target Device
  Are users on MacBook Pros and workstations, or should we anticipate lower-end laptops? This affects how aggressively I optimize rendering.

  8b. WebSocket Message Volume
  Expected peak messages per second? 10/sec? 100/sec? 1000/sec? This determines batching and throttling strategy.

  8c. Feed Virtualization Library
  I'm leaning react-virtuoso (best DX, handles variable-height rows). Alternatives: react-window (lighter, fixed height), or custom
  IntersectionObserver. Preference?

  ---
  9. AUTHENTICATION

  9a. Auth Provider
  Supabase Auth (fits with Supabase ecosystem), Auth0 (enterprise-grade, expensive), Firebase Auth (Google ecosystem), or custom JWT with your own
  backend?

  9b. Unauthenticated Access
  Should the app be usable in a limited form without logging in? (E.g., browse trending bar and read-only feed, prompt login for
  sentiments/tracking/alerts?)

  9c. Onboarding Flow
  After first login: straight to the feed (discover organically), or guided setup (pick 3 topics, track first question, configure first alert)?

  ---
  10. HOSTING AND DEPLOYMENT

  10a. Hosting Target
  Vercel (best DX for React), Cloudflare Pages (edge performance), AWS Amplify (if you're already on AWS), or self-hosted?

  10b. CDN Strategy
  Static assets on the hosting CDN, or separate CDN like CloudFront? Any existing infra?

  10c. Feature Flags
  Environment variable-based (simple), LaunchDarkly/Flagsmith (sophisticated), or a lightweight custom system via Zustand + env vars?

  ---
  11. DESIGN DIRECTION CONFIRMATION

  The mocks show the previous WORLDVIEW iteration with heavy geo focus and visual modes. The v2.2 PRD has fundamentally repositioned the product. I want
   to confirm:

  11a. The new product identity is PolyMatic (not WORLDVIEW). Correct?

  11b. The primary experience is now the trend-driven feed + sentiments engine, not the globe. The globe is secondary. Correct?

  11c. Visual modes (CRT, NVG, FLIR) are not in scope for MVP. Correct?

  11d. Should the overall aesthetic DNA from the mocks carry over (dark chrome, monospace telemetry text, tactical HUD feel) even though the primary
  view is now a feed, not a globe?

  11e. The TOP SECRET // classification banners in the mocks — should PolyMatic have equivalent tactical flourishes, or is that too much for a
  feed-first product?

  ---
  Give me your answers across all 11 sections and I'll produce the complete implementation plan.


    Phase 1: INTERVIEW MODE

  Here are all the decision points I need resolved before writing a single line of code. I've organized them by priority and domain.

  ---
  1. SENTIMENTS ENGINE (P0 — Highest Priority)

  1a. LLM Provider for Stance Classification
  The backend will handle classification, but mock data needs to simulate realistic output. Which LLM is the target for stance classification — OpenAI
  (GPT-4), Anthropic (Claude), or a fine-tuned local model? This affects the mock confidence distributions I generate (different models have different
  confidence calibration curves).

  1b. Stance Classification Latency Model
  Is classification real-time per-tweet (sub-second, streamed to client as each tweet is classified) or batch (every N seconds, a batch of classified
  tweets arrives)? This fundamentally changes the mock data streaming cadence and the UI update pattern (streaming ticker vs. periodic refresh).

  1c. Sentiment Probability Calculation
  The PRD says "weighted ratio of Supports YES to Supports NO." Should the mock implement:
  - Simple weighted ratio: YES_weight / (YES_weight + NO_weight) * 100
  - Bayesian update: prior from market price, updated by each new classified tweet
  - Something else (ELO-style, moving average)?

  1d. Sentiment Confidence → Visual Treatment
  Confidence is Low/Medium/High. How should this map to the UI?
  - Opacity reduction for low confidence? (e.g., 60% opacity)
  - Size reduction? (smaller badge/number)
  - Badge style change? (outline-only for low, filled for high)
  - A combination? What's your instinct?

  1e. Individual Tweets vs. Aggregates
  Should users see the individual classified tweets that contribute to a sentiment score, or only the aggregate numbers? The PRD mentions "key voices
  with representative tweets" in the expanded card — but should there be a full tweet-level drill-down, or is 3-5 representative tweets per stance
  sufficient?

  1f. Free Tier Question Limit
  PRD says 3 tracked questions for free. Can the user browse unlimited questions (read-only) and only track/watchlist 3? Or are they limited to seeing
  only 3 total?

  1g. "Add Question" Flow
  When a user clicks "Add Question," should this be:
  - Freetext input (they type any question, system matches to markets)
  - Search existing prediction market questions (autocomplete from Polymarket/Kalshi catalog)
  - Both (freetext with autocomplete suggestions)
  - Suggested questions based on trending topics

  1h. AI Prediction Summary — Visual Treatment
  The prediction summary ("Twitter sentiment strongly favors YES at 73%...") — should this render as:
  - An inline card within the expanded question card
  - A collapsible/expandable section with a "View AI Analysis" trigger
  - A separate modal/drawer for deep analysis
  - Something that feels like a Bloomberg terminal note

  ---
  2. TRENDING HASHTAGS BAR (P0)

  2a. Visible Chip Count
  How many trend chips should be visible before horizontal scrolling kicks in? On a standard 1440px-wide viewport, I'm thinking 6-8 chips. Confirm or
  adjust?

  2b. Chip Information Density
  Each chip needs: hashtag label, velocity indicator, event count, market-linked badge. That's a lot for a chip. Should I:
  - Show hashtag + velocity arrow only in the chip, with full detail on hover
  - Fit all four data points into the chip (will be wider, ~180-200px each)
  - Use a two-line chip (hashtag on top, stats on bottom)

  2c. Lifecycle Transition Animation
  When a trend moves from "Emerging" to "Trending" to "Peaking" — should this animate (glow pulse, border color shift) or just update silently?

  2d. Trends with No Linked Markets
  When a user clicks a trend that has no linked prediction markets, the Markets panel would be empty. Should I:
  - Show a "No linked markets yet" state with suggested similar markets
  - Hide the Markets panel and give feed more width
  - Show the panel with a "Create alert when markets appear" CTA

  2e. "For You" Feed Ranking
  When no trend is selected, the unfiltered feed is shown. How should it rank?
  - Pure recency (newest first)
  - Velocity-weighted (fast-moving events surface first)
  - Personalization-weighted (based on user's watchlist topics)
  - Some blend — what ratio?

  2f. Topic Page Layout
  When drilling into a trend, the Topic Page has many sections (header, sentiment, markets, timeline, entities, geo, related). Should this be:
  - Single-column scrollable (like a long article)
  - Multi-panel dashboard (like the main view, but scoped to the topic)
  - Tabbed sections within the right panel

  ---
  3. SEARCH

  3a. Autocomplete Aggressiveness
  How many characters before autocomplete suggestions appear? 1 character (aggressive, like Spotlight) or 3 characters (conservative)?

  3b. Blended Results Ranking
  When a query matches across Trends, Markets, Events, and Sentiments — what's the priority order? Should it be:
  - Fixed order (Trends → Markets → Sentiments → Events)
  - Relevance-scored and mixed together
  - Sectioned with a "Top Result" highlighted

  3c. Search Persistence
  Does search act as a filter (results replace the feed, trend bar stays, user backs out) or open a dedicated search results page?

  ---
  4. HOME FEED

  4a. Card Density
  Feed cards: compact (title + source + timestamp + badges, ~80px tall) or expanded (body text visible, media thumbnails, ~200px tall)?

  4b. Media in Cards
  Should cards auto-expand images/videos or show small thumbnails that expand on click?

  4c. Event Clustering
  When 15 tweets are about the same breaking event, should they appear as:
  - Individual cards (noisy but complete)
  - Clustered: lead card + "14 more from this story" expandable
  - Stacked: visually stacked cards with a count badge

  4d. Virtualization Threshold
  At what count should virtualization kick in? I'm proposing 50 items in DOM with react-virtuoso. Confirm or adjust?

  ---
  5. MARKETS PANEL

  5a. Market Card Design
  Compact list rows (like a stock ticker — one line per contract) or full cards (multi-line with chart sparkline)?

  5b. Cross-Platform Comparison
  When Polymarket and Kalshi have the same question at different prices: side-by-side columns, or unified row with platform badges showing each price?

  5c. Sentiment Delta Visualization
  The market delta (sentiment vs. market price) inline display:
  - Color bar (like a horizontal gauge)
  - Number with arrow ("+12.4%" in green)
  - Mini gauge/arc
  - What feels most "Bloomberg terminal"?

  ---
  6. GEO VIEW (P1 — but architecture decisions affect P0)

  6a. Renderer
  CesiumJS (true geospatial, heavier, terrain tiles) or Three.js + react-three-fiber (lighter, more shader control, stylized)? The mocks show
  CesiumJS-style photorealistic terrain. Given geo is P1, should I:
  - Stub the route with a placeholder and build the architecture for CesiumJS later
  - Build a lightweight Three.js globe now as a visual anchor
  - Skip entirely for P0

  6b. Globe Detail Level
  Photorealistic terrain (as in the mocks) or stylized/flat globe (lighter, more "designed")?

  6c. Motion Trails vs. Static Markers
  For ADS-B/AIS data: animated motion trails (computationally expensive, cinematic) or static position markers with heading indicators?

  6d. Clustering Threshold
  At what zoom level do markers cluster vs. scatter? Need a rough density number.

  ---
  7. LAYOUT AND CHROME

  7a. Right Panel Behavior
  Always visible (persistent, taking ~30% of viewport), or slide-out drawer on selection (more feed space, less persistent context)?

  7b. Sidebar Behavior
  Always expanded with labels, collapsible to icon-only, or auto-collapse on narrow viewports? The mocks show icon + label sidebar.

  7c. Layout Switching
  Tactical → Panoptic → Clean: animated CSS transition (300ms ease) or instant swap? What about keyboard shortcuts for switching?

  7d. Responsive Targets
  Desktop-first is clear. What's the minimum supported width? 1280px? 1024px? Should there be a tablet breakpoint or is this strictly desktop?

  7e. Dark Mode Only?
  PRD says dark-first. Should there be a light mode escape hatch, or dark only for MVP?

  ---
  8. PERFORMANCE

  8a. Target Device
  Are users on MacBook Pros and workstations, or should we anticipate lower-end laptops? This affects how aggressively I optimize rendering.

  8b. WebSocket Message Volume
  Expected peak messages per second? 10/sec? 100/sec? 1000/sec? This determines batching and throttling strategy.

  8c. Feed Virtualization Library
  I'm leaning react-virtuoso (best DX, handles variable-height rows). Alternatives: react-window (lighter, fixed height), or custom
  IntersectionObserver. Preference?

  ---
  9. AUTHENTICATION

  9a. Auth Provider
  Supabase Auth (fits with Supabase ecosystem), Auth0 (enterprise-grade, expensive), Firebase Auth (Google ecosystem), or custom JWT with your own
  backend?

  9b. Unauthenticated Access
  Should the app be usable in a limited form without logging in? (E.g., browse trending bar and read-only feed, prompt login for
  sentiments/tracking/alerts?)

  9c. Onboarding Flow
  After first login: straight to the feed (discover organically), or guided setup (pick 3 topics, track first question, configure first alert)?

  ---
  10. HOSTING AND DEPLOYMENT

  10a. Hosting Target
  Vercel (best DX for React), Cloudflare Pages (edge performance), AWS Amplify (if you're already on AWS), or self-hosted?

  10b. CDN Strategy
  Static assets on the hosting CDN, or separate CDN like CloudFront? Any existing infra?

  10c. Feature Flags
  Environment variable-based (simple), LaunchDarkly/Flagsmith (sophisticated), or a lightweight custom system via Zustand + env vars?

  ---
  11. DESIGN DIRECTION CONFIRMATION

  The mocks show the previous WORLDVIEW iteration with heavy geo focus and visual modes. The v2.2 PRD has fundamentally repositioned the product. I want
   to confirm:

  11a. The new product identity is PolyMatic (not WORLDVIEW). Correct?

  11b. The primary experience is now the trend-driven feed + sentiments engine, not the globe. The globe is secondary. Correct?

  11c. Visual modes (CRT, NVG, FLIR) are not in scope for MVP. Correct?

  11d. Should the overall aesthetic DNA from the mocks carry over (dark chrome, monospace telemetry text, tactical HUD feel) even though the primary
  view is now a feed, not a globe?

  11e. The TOP SECRET // classification banners in the mocks — should PolyMatic have equivalent tactical flourishes, or is that too much for a
  feed-first product?

  ---
  Give me your answers across all 11 sections and I'll produce the complete implementation plan.

✻ Worked for 1m 43s

❯ Please go into interview mode where we go over each question with multiple choice

⏺ Let's do it. We'll go section by section. Starting with the Sentiments Engine.

⏺ User answered Claude's questions:
  ⎿  · Which LLM provider is the target for stance classification? This affects mock confidence distributions. → Anthropic Claude with Gemini Pro
     fallback
     · How should stance classification arrive at the frontend — real-time per-tweet or in batches? → Batch (every 5-10s)
     · How should the mock calculate sentiment probability from classified tweets? → Weighted ratio (Recommended)
     · How should sentiment confidence level (Low/Medium/High) affect the visual treatment? → Opacity + label

⏺ Noted. Claude primary, Gemini Pro fallback. Batch every 5-10s. Weighted ratio. Opacity + confidence label. Continuing with Sentiments Engine
  questions.

⏺ User answered Claude's questions:
  ⎿  · Should users see individual classified tweets or only aggregate sentiment numbers? → Both, tiered by plan
     · Free tier gets 3 tracked questions. Can free users browse ALL questions read-only, or only see their 3? → Browse top 10, track 3
     · How should the 'Add Question' flow work when a user wants to track a new prediction question? → Trending suggestions first
     · How should the AI prediction summary render visually? → Terminal-style brief

⏺ Good instincts. Tiered tweet access, top-10 browse for free, trending suggestions for discovery, terminal-style intel briefs. Moving to Trending
  Hashtags Bar.

⏺ User answered Claude's questions:
  ⎿  · How many trend chips should be visible before horizontal scrolling on a standard 1440px viewport? → 10-12 chips
     · How much data should fit in each trend chip vs. requiring hover/expand? → All data visible
     · Should trend lifecycle transitions (Emerging → Trending → Peaking → Cooling) animate? → Badge transition
     · When a user clicks a trend with no linked prediction markets, what happens in the Markets panel? → Show related markets

⏺ Dense and information-rich. 10-12 chips, all data visible, badge transitions, related markets fallback. Continuing with feed ranking and Topic Pages.

⏺ User answered Claude's questions:
  ⎿  · When no trend is selected, how should the 'For You' home feed be ranked? → Blended: velocity + recency
     · How should the Topic Page layout work when drilling into a trend? → Multi-panel dashboard
     · How aggressive should search autocomplete be? → 2 characters
     · Should search results replace the feed (filter mode) or open a dedicated results page? → Dropdown overlay

⏺ Velocity-biased feed, dashboard-style topics, 2-char autocomplete, dropdown search overlay. Now the Home Feed details.

⏺ User answered Claude's questions:
  ⎿  · What card density should the home feed use? → Mixed density
     · When 15+ tweets cover the same breaking event, how should they cluster? → Lead card + expandable
     · Should feed cards auto-expand media (images/video) or show thumbnails? → Auto-expand images
     · At what DOM count should feed virtualization activate? → 50 items (Recommended)

⏺ Mixed density with signal-based prominence, lead+expand clustering, auto-expand images, virtualize at 50. Markets Panel next.

⏺ User answered Claude's questions:
  ⎿  · What format should market cards take in the Markets panel? → Full cards with sparkline
     · When Polymarket and Kalshi list the same question at different prices, how to display? → Primary + delta
     · How should the sentiment-market delta be visualized inline on market cards? → Number with arrow

⏺ Full cards with sparklines, primary+delta for cross-platform, number+arrow for sentiment delta. Clean Bloomberg style. Now Geo View decisions
  (architecture-level, even though P1).

⏺ User answered Claude's questions:
  ⎿  · Geo is P1, but the architecture choice affects the whole build. What's the renderer strategy for MVP? → CesiumJS from day one
     · If/when the globe ships, what level of visual detail? → Hybrid
     · For ADS-B and AIS tracking data, motion trails or static markers? → Animated trails

⏺ Ambitious — CesiumJS from day one, hybrid zoom detail, animated trails. You want the full cinematic experience. Layout and Chrome next.

⏺ User answered Claude's questions:
  ⎿  · Should the right-side detail panel be always visible or slide out on selection? → Always visible (~30%)
     · How should the left sidebar behave? → Auto-collapse on narrow
     · Layout switching (Tactical/Panoptic/Clean) — how should the transition feel? → Animated (300ms ease)
     · What's the minimum supported viewport width? → 1024px (tablet-friendly)

⏺ Persistent right panel, auto-collapsing sidebar, animated layout transitions, 1024px minimum. Performance and technical decisions now.

⏺ User answered Claude's questions:
  ⎿  · Dark mode only for MVP, or include a light mode escape hatch? → Dark + light toggle
     · What's the target device tier? This affects rendering budgets and optimization aggressiveness. → Wide range including low-end
     · Expected peak WebSocket message volume? This drives batching and throttling strategy. → Variable (design for spikes)
     · Feed virtualization library preference? → react-virtuoso (Recommended)

⏺ Dark + light (bold choice), wide device support, spike-resilient WS batching, react-virtuoso. Authentication and hosting to close out.

⏺ User answered Claude's questions:
  ⎿  · Which auth provider should the app use? → Custom JWT
     · Should the app be usable without logging in? → Landing page only
     · What should the first-login onboarding experience look like? → Interactive tour
     · Where will the app be hosted? → Vercel

⏺ Custom JWT, landing page gate, interactive tour, Vercel hosting. Final questions — feature flags and design direction confirmation.

⏺ User answered Claude's questions:
  ⎿  · How should feature flags be managed? → Env vars + Zustand
     · The mocks show 'WORLDVIEW' branding. The PRD says 'PolyMatic.' Which is the product name? → PolyMatic
     · Should the tactical aesthetic DNA from the WORLDVIEW mocks (monospace banners, classification text, HUD chrome) carry into the feed-first
     PolyMatic design? → Subtle tactical accents
     · Blended search results ranking — when a query matches across Trends, Markets, Events, and Sentiments? → Fixed order

⏺ All 11 sections resolved. Here's the complete decision log:

  ---
  Interview Summary — All Decisions

  ┌───────────────────┬─────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
  │         #         │        Decision         │                                       Answer                                        │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Sentiments Engine │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1a                │ LLM Provider            │ Anthropic Claude, Gemini Pro fallback                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1b                │ Classification delivery │ Batch every 5-10s                                                                   │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1c                │ Scoring model           │ Weighted ratio                                                                      │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1d                │ Confidence → visual     │ Opacity + label                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1e                │ Tweet visibility        │ Tiered by plan (Free: aggregates, Pro: key voices, Quant: full drill-down)          │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1f                │ Free tier access        │ Browse top 10 read-only, track 3                                                    │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1g                │ Add Question flow       │ Trending suggestions first, then search                                             │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 1h                │ AI prediction summary   │ Terminal-style intelligence brief                                                   │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Trending Bar      │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2a                │ Visible chips           │ 10-12                                                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2b                │ Chip density            │ All data visible (~220px each)                                                      │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2c                │ Lifecycle transitions   │ Badge transition flash                                                              │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2d                │ No linked markets       │ Show related markets                                                                │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2e                │ For You ranking         │ Blended: 70% velocity + 30% recency                                                 │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 2f                │ Topic Page layout       │ Multi-panel dashboard                                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Search            │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 3a                │ Autocomplete            │ 2 characters                                                                        │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 3b                │ Results ranking         │ Fixed order: Trends → Markets → Sentiments → Events                                 │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 3c                │ Search behavior         │ Dropdown overlay                                                                    │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Home Feed         │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 4a                │ Card density            │ Mixed (signal-based prominence)                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 4b                │ Media                   │ Auto-expand images                                                                  │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 4c                │ Clustering              │ Lead card + "N more" expandable                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 4d                │ Virtualization          │ 50 items, react-virtuoso                                                            │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Markets Panel     │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 5a                │ Market cards            │ Full cards with sparkline                                                           │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 5b                │ Cross-platform          │ Primary price + delta                                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 5c                │ Sentiment delta         │ Number with arrow (Bloomberg-style)                                                 │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Geo View          │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 6a                │ Renderer                │ CesiumJS from day one                                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 6b                │ Detail level            │ Hybrid (stylized at zoom-out, satellite at city-level)                              │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 6c                │ Motion data             │ Animated trails                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Layout & Chrome   │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 7a                │ Right panel             │ Always visible (~30%)                                                               │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 7b                │ Sidebar                 │ Auto-collapse on narrow viewports                                                   │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 7c                │ Layout switching        │ Animated 300ms ease                                                                 │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 7d                │ Min viewport            │ 1024px (tablet-friendly)                                                            │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 7e                │ Theme                   │ Dark + light toggle                                                                 │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Performance       │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 8a                │ Target device           │ Wide range including low-end                                                        │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 8b                │ WS volume               │ Variable, design for spikes (10→100+ msg/s)                                         │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 8c                │ Virtualization lib      │ react-virtuoso                                                                      │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Auth & Hosting    │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 9a                │ Auth provider           │ Custom JWT (FastAPI backend)                                                        │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 9b                │ Unauth access           │ Landing page only                                                                   │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 9c                │ Onboarding              │ Interactive tour                                                                    │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 10a               │ Hosting                 │ Vercel                                                                              │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 10b               │ Feature flags           │ Env vars + Zustand store                                                            │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ Design Direction  │                         │                                                                                     │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 11a               │ Brand                   │ PolyMatic                                                                           │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 11b               │ Tactical aesthetic      │ Subtle accents (monospace on data/timestamps, tactical on alerts/confidence labels) │
  ├───────────────────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
  │ 11c               │ Search ranking          │ Sectioned, fixed order                                                              │
  └───────────────────┴─────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

  ---
  Interview mode complete. Ready to enter Phase 2: PLAN MODE and produce the full implementation plan — folder structure, state architecture, data flow
  diagrams, component hierarchy, and build sequence. Shall I proceed?

## Epic 1 Plan

 Plan: Implement Epic 1 — Foundation

 Context

 Phase 2 (planning) is complete. The polymatic-frontend-webapp/ directory is empty. Epic 1 is the foundation that everything else depends on: project
 scaffold, theming, app shell, routing, and base UI components. This covers 5 stories / 40 tasks from tasks/TASKS.md.

 Root directory: /Users/coder/repos/offsideAI/githubworkspace_fr8pro_active_1/polymatic/polymatic-frontend-webapp

 Implementation Order

 Phase A: Scaffold (Story 1.1 — E01-S01-T01 through T09)

 Step 1: Initialize Vite project (E01-S01-T01)
 - Run npm create vite@latest . -- --template react-ts inside polymatic-frontend-webapp/
 - Configure tsconfig.json: strict, noImplicitAny, strictNullChecks, noUnusedLocals, path aliases (@/* → src/*)
 - Configure vite.config.ts: path alias resolution, build target

 Step 2: Install all dependencies (E01-S01-T06, T07)
 - Core: zustand, immer, @tanstack/react-query, react-router-dom, framer-motion, react-virtuoso, recharts, lucide-react, clsx, tailwind-merge,
 date-fns, zod, nanoid, mitt
 - Radix: @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-tooltip, @radix-ui/react-tabs
 - Dev: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, msw

 Step 3: Tailwind CSS v4 (E01-S01-T02)
 - Install tailwindcss @tailwindcss/vite
 - Tailwind v4 uses CSS-based config, not tailwind.config.ts. Configuration goes directly in globals.css with @theme directive
 - Add @import "tailwindcss" to globals.css + @theme block for custom colors, fonts, spacing

 Step 4: ESLint + Prettier (E01-S01-T03)
 - ESLint 9 flat config: eslint.config.js with @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh
 - Prettier: .prettierrc with single quotes, no semicolons (or standard — match user preference)
 - Add .editorconfig

 Step 5: Create folder structure (E01-S01-T04)
 - Create all 20 directories under src/
 - Add .gitkeep in empty directories that don't get files yet

 Step 6: Environment variables (E01-S01-T05)
 - Create .env and .env.example with all VITE_* flags
 - Extend vite-env.d.ts with typed env declarations

 Step 7: CesiumJS setup (E01-S01-T08)
 - Install cesium, resium, vite-plugin-cesium
 - Configure vite plugin in vite.config.ts
 - Create public/cesium/ directory
 - Note: Geo view is P1 behind feature flag — this just ensures the dep is wired

 Step 8: Vitest setup (E01-S01-T09)
 - Configure vitest.config.ts (or inline in vite.config.ts)
 - Create sample test: src/lib/__tests__/cn.test.ts

 Phase B: Theming (Story 1.2 — E01-S02-T01 through T06)

 Step 9: CSS custom properties + themes
 - src/styles/globals.css — All CSS custom properties: bg, accent, text, semantic, sentiment, delta, category, layout dimensions, typography,
 animation. Plus Tailwind v4 @theme block mapping custom properties to Tailwind tokens.
 - src/styles/themes/dark.css — Dark theme variable overrides (default)
 - src/styles/themes/light.css — Light theme overrides with adjusted accent for contrast
 - src/styles/fonts.css — @font-face for Inter + JetBrains Mono (Google Fonts CDN links in index.html for MVP, or font-face with hosted files)

 Step 10: Utility + theme toggle
 - src/lib/cn.ts — clsx + tailwind-merge helper
 - Theme logic: data-theme attribute on <html>, persisted in localStorage, wired to uiStore.theme

 Phase C: State Stores (subset needed for shell — E01-S02-T06 implies uiStore, E01-S01-T05 implies flagsStore)

 Step 11: Core stores needed for Epic 1
 - src/state/uiStore.ts — Layout mode, sidebar state, theme, right panel content, viewport width
 - src/state/flagsStore.ts — Feature flags with env var init + Zustand persist + runtime overrides
 - src/state/authStore.ts — Minimal stub (isAuthenticated, user, tier) needed for AuthGuard
 - src/lib/eventBus.ts — mitt instance for cross-store communication
 - Other 7 stores (feed, trends, sentiments, markets, search, alerts, geo) created as stubs with correct interfaces but no wiring — they'll be fleshed
 out in Epic 2

 Phase D: App Shell (Story 1.3 — E01-S03-T01 through T07)

 Step 12: AppShell + layout grid
 - src/app/AppShell.tsx — 3-column CSS grid with framer-motion layout animation
 - Grid: var(--sidebar-width) 1fr var(--right-panel-width)
 - Layout modes: Tactical (all panels), Panoptic (icon sidebar 64px), Clean (no sidebar, no right panel)

 Step 13: Sidebar
 - src/app/Sidebar.tsx — Nav items with lucide icons, auto-collapse at <1280px, expand on hover
 - Nav structure: Home, Sentiments, Geo (feature-gated), Markets, divider, Alerts, spacer, LayoutSwitcher, UserMenu

 Step 14: TopBar + RightPanel + NotificationCenter
 - src/app/TopBar.tsx — Fixed 56px bar with SearchBar placeholder
 - src/app/RightPanel.tsx — Dynamic content via uiStore, EmptyState default
 - src/app/LayoutSwitcher.tsx — Toggle between 3 layout modes
 - src/app/NotificationCenter.tsx — Toast container, bell icon stub

 Step 15: Responsive breakpoints
 - 1024-1279px: sidebar collapsed, right panel as overlay
 - 1280px+: full layout
 - useLayout hook: listens to window resize, updates uiStore

 Phase E: Routing (Story 1.4 — E01-S04-T01 through T04)

 Step 16: Router setup
 - src/App.tsx — React Router with route config
 - Public: / → LandingView, /login → LoginView
 - Protected: /app/* → AuthGuard → AppShell → lazy-loaded views
 - Feature-gated: /app/geo → FeatureGate
 - All views as React.lazy() with Suspense fallback

 Step 17: Guards
 - src/auth/AuthGuard.tsx — Checks authStore.isAuthenticated, redirects to /login
 - src/components/FeatureGate.tsx — Checks flagsStore, conditionally renders children

 Step 18: View stubs
 - Create minimal placeholder components for all views (HomeView, SentimentsView, etc.)
 - Each renders a MonoLabel with the view name — replaced in later epics

 Phase F: Base UI Components (Story 1.5 — E01-S05-T01 through T19)

 Step 19: 19 shared atom components
 All in src/components/:

 1. Badge.tsx — severity/category/source/custom variants
 2. Button.tsx — primary/secondary/ghost/danger + sizes + loading
 3. Card.tsx — default/interactive/selected variants
 4. Chip.tsx — category-colored, removable variant
 5. Input.tsx — text input + search variant
 6. Timestamp.tsx — relative/absolute, monospace, UTC
 7. MonoLabel.tsx — ALL CAPS, letter-spacing 0.1em
 8. DeltaIndicator.tsx — +12.4% with arrow, green/red
 9. ProbabilityDisplay.tsx — 73% with directional color
 10. ConfidenceBadge.tsx — opacity treatment (60/85/100%)
 11. VelocityIndicator.tsx — arrow + percentage
 12. Sparkline.tsx — Recharts mini chart, no axes
 13. SeverityDot.tsx — color-coded dot
 14. EmptyState.tsx — icon + text + CTA, no emoji
 15. LoadingSkeleton.tsx — pulse animation variants
 16. ErrorBoundary.tsx — catch + retry + report
 17. Tooltip.tsx — Radix-based
 18. Tabs.tsx — Radix-based, underline indicator
 19. Toggle.tsx — accessible switch

 Phase G: Wiring + Verification

 Step 20: main.tsx + App.tsx wiring
 - src/main.tsx — QueryClientProvider, RouterProvider, theme init
 - Verify: npm run dev starts without errors
 - Verify: npm run build produces clean build
 - Verify: npm run test passes sample test
 - Verify: dark/light theme toggle works
 - Verify: layout switching animates correctly
 - Verify: sidebar auto-collapses at narrow viewport

 Files Created/Modified

 All files under polymatic-frontend-webapp/:

 Config (root):
 - index.html, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json
 - eslint.config.js, .prettierrc, .editorconfig
 - .env, .env.example
 - package.json

 Styles:
 - src/styles/globals.css, src/styles/themes/dark.css, src/styles/themes/light.css, src/styles/fonts.css

 Lib:
 - src/lib/cn.ts, src/lib/format.ts, src/lib/time.ts, src/lib/eventBus.ts

 State:
 - src/state/uiStore.ts, src/state/flagsStore.ts, src/state/authStore.ts
 - Stubs: feedStore.ts, trendsStore.ts, sentimentsStore.ts, marketsStore.ts, searchStore.ts, alertsStore.ts, geoStore.ts

 App Shell:
 - src/app/AppShell.tsx, src/app/Sidebar.tsx, src/app/TopBar.tsx, src/app/RightPanel.tsx, src/app/LayoutSwitcher.tsx, src/app/NotificationCenter.tsx

 Routing/Auth:
 - src/App.tsx, src/main.tsx, src/auth/AuthGuard.tsx

 Views (stubs):
 - src/views/HomeView.tsx, SentimentsView.tsx, GeoView.tsx, MarketsView.tsx, TopicPageView.tsx, SearchResultsView.tsx, AlertsConfigView.tsx,
 LandingView.tsx, LoginView.tsx, OnboardingView.tsx

 Components (19):
 - src/components/Badge.tsx, Button.tsx, Card.tsx, Chip.tsx, Input.tsx, Timestamp.tsx, MonoLabel.tsx, DeltaIndicator.tsx, ProbabilityDisplay.tsx,
 ConfidenceBadge.tsx, VelocityIndicator.tsx, Sparkline.tsx, SeverityDot.tsx, EmptyState.tsx, LoadingSkeleton.tsx, ErrorBoundary.tsx, Tooltip.tsx,
 Tabs.tsx, Toggle.tsx, FeatureGate.tsx

 Hooks:
 - src/hooks/useFeatureFlag.ts, src/hooks/useLayout.ts, src/hooks/useTheme.ts

 Key Technical Notes

 1. Tailwind v4 uses CSS-based config (@theme in CSS), not the old tailwind.config.ts. The Vite plugin is @tailwindcss/vite.
 2. CesiumJS via vite-plugin-cesium handles the asset copying. If that plugin isn't v4-compatible, we'll configure the copy manually in vite.config.ts.
 3. Store stubs for domains not yet implemented (feed, trends, etc.) will have correct TypeScript interfaces but empty implementations — ensures
 imports work when wiring the shell.
 4. View stubs are minimal components that render the view name. This lets routing work end-to-end. Real implementations come in Epics 3-10.
 5. No any types anywhere. All components fully typed from day one.

 Verification

 After implementation:
 1. npm run dev — App starts, landing page renders at /
 2. npm run build — Clean production build, no TS errors
 3. npm run test — Sample test passes
 4. Navigate to /app/home — AppShell renders with sidebar, topbar, main content, right panel
 5. Click layout switcher — Tactical/Panoptic/Clean modes animate correctly
 6. Toggle theme — Dark ↔ light switches, persists on reload
 7. Resize browser below 1280px — Sidebar auto-collapses
 8. Resize browser to 1024px — Layout remains usable


## Epic 1 Plan Implementation

⏺ Epic 1 — Foundation is complete. Here's a summary of everything implemented:

  Epic 1 Complete — 60+ files created

  Phase A: Scaffold

  - Vite + React 18 + TypeScript (strict mode, path aliases @/*)
  - All dependencies installed (Zustand, TanStack Query, Framer Motion, Recharts, Radix UI, CesiumJS, etc.)
  - Tailwind CSS v4 with @tailwindcss/vite plugin
  - ESLint 9 flat config + Prettier
  - Vitest configured with jsdom + @testing-library

  Phase B: Theming

  - CSS custom properties for all colors, layout dims, typography, animations
  - Dark theme (default) + light theme via data-theme attribute
  - Font setup (Inter + JetBrains Mono)
  - cn() utility (clsx + tailwind-merge)

  Phase C: State (10 Zustand stores)

  - Core: uiStore (layout, sidebar, theme), flagsStore (feature flags with env var init + persist), authStore (JWT auth with mock login)
  - Stubs with correct interfaces: feedStore, trendsStore, sentimentsStore, marketsStore, searchStore, alertsStore, geoStore
  - Event bus via mitt for cross-store communication

  Phase D: App Shell

  - 3-column CSS grid with framer-motion layout animation
  - Sidebar with nav, auto-collapse at <1280px, expand on hover
  - TopBar (56px) with search placeholder + theme toggle + notification bell
  - RightPanel (30%) with dynamic content
  - LayoutSwitcher (Tactical/Panoptic/Clean)
  - NotificationCenter with animated toasts

  Phase E: Routing

  - React Router v6 with full route map (public + protected + feature-gated)
  - All views lazy-loaded with Suspense
  - AuthGuard + FeatureGate components
  - 10 view stubs (Landing, Login, Home, Sentiments, Geo, Markets, Topic, Search, Alerts, Onboarding)

  Phase F: 20 UI Components

  Badge, Button, Card, Chip, Input, Timestamp, MonoLabel, DeltaIndicator, ProbabilityDisplay, ConfidenceBadge, VelocityIndicator, Sparkline,
  SeverityDot, EmptyState, LoadingSkeleton, ErrorBoundary, Tooltip, Tabs, Toggle, FeatureGate

  Verification

  - npm run build — clean production build (467KB gzipped main chunk)
  - npm run test — 4/4 tests pass
  - npm run dev — dev server starts and serves correctly
  - Zero TypeScript errors, no any types



  ## Scenarios

  ⏺ Created SCENARIOS.md at the repo root with 88 detailed test scenarios organized into 16 sections:

  ┌───────────────────────────┬───────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │          Section          │ Scenarios │                                                Coverage                                                 │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Foundation &              │ 7         │ Build, TypeScript strict, dev server, tests, env vars, stores                                           │
  │ Infrastructure            │           │                                                                                                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Theming & Visual Design   │ 7         │ Dark/light toggle, persistence, CSS vars, monospace rules, no ALL CAPS, SaaS aesthetic                  │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Layout & Navigation       │ 11        │ 3-column grid, sidebar collapse, layout modes, animations, routing, right panel                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Authentication &          │ 5         │ Landing gate, mock login, persistence, logout, protected routes                                         │
  │ Onboarding                │           │                                                                                                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Mock Data Engine          │ 11        │ DataProvider init, feed/sentiment/market/trend generators, cross-domain correlation, alerts, geo        │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Home Feed                 │ 11        │ Display, mixed density, virtualization, infinite scroll, skeletons, filtering, clustering, timestamps   │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Trending Bar              │ 7         │ Chip count/width, lifecycle badges, selection, scroll, market badges                                    │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Sentiments Engine         │ 10        │ Score calculation, confidence levels, direction, delta, detail view, tweets, prediction brief,          │
  │                           │           │ sparklines, batching                                                                                    │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Search                    │ 7         │ 2-char minimum, 200ms debounce, dropdown overlay, fixed section order, recent searches                  │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Markets Panel             │ 8         │ Card display, Bloomberg-style numbers, cross-platform, sentiment delta, sparklines, filtering, sorting  │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Topic Pages               │ 3         │ Navigation, related markets, tabs                                                                       │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Alerts                    │ 6         │ Config, triggering, toasts, mark read, dismiss, auto-generation                                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Geo View                  │ 3         │ Feature flag gating, CesiumJS globe, conflict zone markers                                              │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Performance               │ 5         │ TTI < 3s, 60 FPS scroll, memory < 500MB, lazy loading, bundle size                                      │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Accessibility &           │ 6         │ Number formatting, keyboard nav, toggles, tooltips, error boundary, empty states                        │
  │ Conventions               │           │                                                                                                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Anti-Pattern Checks       │ 6         │ No placeholder copy, no default styling, no centered spinners, varied rhythm, product name              │
  └───────────────────────────┴───────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Plus reference tables for: feature flags, numeric specifications, browser matrix, and seed data.

  
## Epic 3 Plan

 Plan: Implement Epic 3 — Home Feed

 Context

 Epics 1 (Foundation) and 2 (Mock Data Engine) are complete. The app has a working shell with 3-column grid layout, 20 base UI components, 10 Zustand
 stores, DataProvider abstraction with MockProvider, 6 generators, and TanStack Query hooks. HomeView.tsx is currently a stub. Epic 3 builds the core
 Home Feed experience: trending bar, virtualized feed with mixed-density cards, event clustering, and filter controls.

 Root: /Users/coder/repos/offsideAI/githubworkspace_fr8pro_active_1/polymatic/polymatic-frontend-webapp
 Tasks: 13 tasks across 3 stories (E03-S01-T01→T04, E03-S02-T01→T06, E03-S03-T01→T03)

 Existing Code to Reuse

 ┌──────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────┐
 │                 File                 │                             What it provides                              │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/hooks/useTrends.ts               │ useTrends() — returns { trends, isLoading, error }, 6s refetch            │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/hooks/useFeed.ts                 │ useFeed() — infinite query + live subscription; useFeedFilters()          │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/state/trendsStore.ts             │ selectedTrendId, selectTrend(id), updateTrends(trends)                    │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/state/feedStore.ts               │ items, filters (FeedFilters), activeTrendFilter, addItems, setTrendFilter │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/Chip.tsx              │ Category-colored chip with selected state, removable variant              │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/Badge.tsx             │ Severity/category/source/custom badge variants                            │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/Card.tsx              │ Base card: default/interactive/selected variants                          │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/Sparkline.tsx         │ Recharts mini chart, no axes                                              │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/VelocityIndicator.tsx │ Arrow + percentage, green/red/gray                                        │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/SeverityDot.tsx       │ Color-coded severity dot                                                  │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/Timestamp.tsx         │ Smart relative/absolute UTC timestamp                                     │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/LoadingSkeleton.tsx   │ Pulse skeletons: card, list-row, chart, text-block                        │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/components/EmptyState.tsx        │ Icon + text + CTA empty state                                             │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/types/feed.types.ts              │ FeedItem, FeedCluster, FeedFilters, FeedMedia                             │
 ├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
 │ src/types/trend.types.ts             │ Trend, TrendLifecycle, VelocityScore                                      │
 └──────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────┘

 Implementation Order

 Step 1: TrendLifecycleBadge (E03-S01-T03)

 New file: src/trends/TrendLifecycleBadge.tsx

 Small badge showing lifecycle state with visual treatment:
 - Emerging: pulsing border animation (framer-motion animate with opacity oscillation)
 - Trending: filled badge with category-tinted background
 - Peaking: filled + subtle glow (box-shadow animation)
 - Cooling: faded/dimmed (opacity 0.5)
 - Props: lifecycle: TrendLifecycle, size?: 'sm' | 'md'
 - 200ms transition between states

 Step 2: TrendChip (E03-S01-T02)

 New file: src/trends/TrendChip.tsx

 Two-line chip (~220px min-width):
 - Line 1: SeverityDot (category color), hashtag label, VelocityIndicator, market link icon (if linkedMarketIds.length > 0)
 - Line 2: TrendLifecycleBadge, event count (formatCompact number)
 - Click: calls trendsStore.selectTrend(id) + feedStore.setTrendFilter(id)
 - Selected state: accent border + subtle background highlight (reuse Chip's selected pattern)
 - Props: trend: Trend, selected?: boolean, onSelect?: (id: string) => void

 Step 3: TrendingBar (E03-S01-T01)

 New file: src/trends/TrendingBar.tsx

 Horizontal scrolling container:
 - Fixed height (64px), rendered above the feed in HomeView
 - Consumes useTrends() hook, renders 10-12 TrendChip components
 - Horizontal scroll with CSS overflow-x: auto, scroll-behavior: smooth, -webkit-overflow-scrolling: touch
 - Left/right scroll buttons (ChevronLeft/ChevronRight from lucide) that appear on hover at edges
 - Scroll buttons use scrollBy({ left: ±300, behavior: 'smooth' })
 - Shows "View All Trends" button at the end (Step 4)
 - Loading state: row of 6 skeleton chips (pulse animation)
 - Consumes useSelectedTrend() for selected state sync

 Step 4: View All Trends (E03-S01-T04)

 New file: src/trends/ViewAllTrends.tsx

 Rendered in the right panel (via uiStore.setRightPanelContent):
 - Full list of all trends, sorted by velocity descending
 - Each row: hashtag, category badge, TrendLifecycleBadge, velocity sparkline, event count, linked market count
 - Sortable columns (click header to sort)
 - Click row → selectTrend(id) → feed filters to that trend
 - "View All" button at end of TrendingBar triggers this

 Step 5: Feed Utilities (E03-S03-T02)

 New file: src/feed/feed.utils.ts

 Clustering + scoring logic:
 - clusterFeedItems(items: FeedItem[]): { clusters: FeedCluster[], unclustered: FeedItem[] } — groups by clusterId, sorts each cluster by signal score
 - calculateSignalScore(item: FeedItem): number — severity weight (low=1, medium=2, high=3, critical=4) × velocity factor × market-linkage bonus (1.5x
 if relatedMarketIds.length > 0)
 - isHighSignal(item: FeedItem): boolean — signal score > threshold (severity high/critical, or velocity > 60, or has market links)
 - rankFeedItems(items: FeedItem[]): FeedItem[] — 70% velocity + 30% recency ("For You" ranking)
 - Pure functions, no side effects. Easy to unit test.

 Step 6: FeedCardCompact + FeedCardExpanded (E03-S02-T03, T04)

 New file: src/feed/FeedCardCompact.tsx
 Compact variant (~80px):
 - Source icon (small, from sourceType), first line of title/content truncated, Timestamp, key badges (severity dot, trend hashtag chip if present)
 - No media, no body text. Single row feel.
 - Click → expand in right panel or navigate to detail

 New file: src/feed/FeedCardExpanded.tsx
 Expanded variant (~200px+):
 - Full content body, all entity chips, all badges (category, severity, sentiment stance, market correlation)
 - Media: auto-expanded images inline (via FeedMedia), video thumbnails with play overlay
 - Action row: pin/bookmark icon, open in Geo icon (if geoCoords), expand to right panel, share
 - Uses Card component with variant="interactive" as base

 Step 7: FeedCard (E03-S02-T02)

 New file: src/feed/FeedCard.tsx

 Signal-based density routing:
 - Receives item: FeedItem
 - Calls isHighSignal(item) from feed.utils
 - If high signal → renders FeedCardExpanded
 - If low signal → renders FeedCardCompact
 - Wraps in motion.div with layout prop for smooth height transitions
 - Handles click: feedStore.selectItem(id), updates right panel via uiStore

 Step 8: FeedCluster (E03-S03-T01)

 New file: src/feed/FeedCluster.tsx

 Lead card + expandable cluster:
 - Renders lead item (highest signal score) as FeedCardExpanded
 - Below it: clickable "N more from this story" toggle with framer-motion AnimatePresence
 - Expand: shows remaining cluster items as FeedCardCompact list
 - Collapse animation: height transition via framer-motion
 - Props: cluster: FeedCluster, items: FeedItem[]

 Step 9: FeedSkeleton (E03-S02-T05)

 New file: src/feed/FeedSkeleton.tsx

 Feed-specific loading skeleton:
 - 5-7 mixed-height skeleton cards matching the real feed layout
 - Alternates between tall (expanded-like, ~200px) and short (compact-like, ~80px) skeletons
 - Reuses LoadingSkeleton patterns but with feed-specific structure (source icon area, badge row, content area)

 Step 10: FeedFilters (E03-S02-T06)

 New file: src/feed/FeedFilters.tsx

 Filter bar above the feed:
 - Source type toggles (chips: Twitter, Reddit, Telegram, News, Structured)
 - Category filter dropdown (multi-select: geopolitics, economics, technology, sports, culture)
 - Severity minimum dropdown (low, medium, high, critical)
 - Time range selector (1h, 6h, 24h, 7d, all)
 - Updates feedStore.updateFilters() which triggers TanStack Query refetch
 - Compact single-row layout with overflow scroll on narrow viewports
 - Active filter count badge

 Step 11: FeedContainer (E03-S02-T01)

 New file: src/feed/FeedContainer.tsx

 Virtualized feed wrapper:
 - Uses react-virtuoso <Virtuoso> with variableSizeList (variable-height rows)
 - Data: processes useFeed() items through clusterFeedItems() + rankFeedItems()
 - Overscan: 50 items for smooth scrolling at 60fps
 - endReached callback → fetchNextPage() for infinite scroll
 - Empty state: EmptyState with "No signals matching your filters" + reset CTA
 - Loading: FeedSkeleton during initial load
 - itemContent renderer: switches between FeedCluster (for clustered items) and FeedCard (for individual items)

 Step 12: Trend→Feed Wiring (E03-S03-T03)

 Modified file: src/feed/FeedContainer.tsx (or a new hook)

 - When trendsStore.selectedTrendId changes, update feedStore.setTrendFilter(trendId)
 - This triggers useFeedFilters() → filter change → TanStack Query refetch with trend filter
 - Deselecting (null) returns to "For You" blended feed (70% velocity + 30% recency)
 - Add useEffect in FeedContainer that syncs selectedTrendId → feedStore.setTrendFilter

 Step 13: Wire HomeView (modify existing)

 Modified file: src/views/HomeView.tsx

 Replace stub with full layout:
 <div className="flex flex-col h-full">
   <TrendingBar />               ← 64px fixed
   <FeedFilters />                ← auto height
   <FeedContainer className="flex-1" />  ← fills remaining
 </div>

 Files Summary

 New files (11):
 - src/trends/TrendLifecycleBadge.tsx
 - src/trends/TrendChip.tsx
 - src/trends/TrendingBar.tsx
 - src/trends/ViewAllTrends.tsx
 - src/feed/feed.utils.ts
 - src/feed/FeedCardCompact.tsx
 - src/feed/FeedCardExpanded.tsx
 - src/feed/FeedCard.tsx
 - src/feed/FeedCluster.tsx
 - src/feed/FeedSkeleton.tsx
 - src/feed/FeedFilters.tsx
 - src/feed/FeedContainer.tsx

 Modified files (1):
 - src/views/HomeView.tsx — replace stub with TrendingBar + FeedFilters + FeedContainer

 Key Design Decisions

 1. Signal-based density: isHighSignal() determines compact vs expanded rendering — not user-controlled
 2. Feed ranking: 70% velocity + 30% recency for "For You" mode (per binding decisions)
 3. Clustering: Group by clusterId, lead card = highest signal score, rest collapsible
 4. Trend→Feed filter: Selecting a trend chip filters feed to that trend's items; deselecting returns to blended view
 5. Virtualization: react-virtuoso with 50-item overscan for 60fps scroll target
 6. No new stores needed: All state already exists in feedStore + trendsStore

 Verification

 1. npm run build — Clean build, no TS errors
 2. Navigate to /app/home — TrendingBar renders with 10-12 trend chips
 3. Click a trend chip — Feed filters to that trend's items, chip shows selected state
 4. Deselect trend — Feed returns to blended "For You" ranking
 5. Scroll feed — Smooth 60fps, infinite scroll loads more items at bottom
 6. Mixed density — High-signal items render expanded, low-signal render compact
 7. Cluster toggle — "N more from this story" expands/collapses with animation
 8. Filter bar — Toggling source/category/severity/time filters updates feed in real-time
 9. "View All Trends" — Opens trends list in right panel
 10. Loading state — Feed skeleton shows during initial data load
 11. Empty state — Shows when filters match no items
