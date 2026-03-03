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

  
