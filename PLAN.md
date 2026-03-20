 # Plan
 
 ## Phase 1: INTERVIEW MODE

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
  Three.js + react-three-fiber (true geospatial, heavier, terrain tiles) or Three.js + react-three-fiber (lighter, more shader control, stylized)? The mocks show
  Three.js + react-three-fiber-style photorealistic terrain. Given geo is P1, should I:
  - Stub the route with a placeholder and build the architecture for Three.js + react-three-fiber later
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
  Three.js + react-three-fiber (true geospatial, heavier, terrain tiles) or Three.js + react-three-fiber (lighter, more shader control, stylized)? The mocks show
  Three.js + react-three-fiber-style photorealistic terrain. Given geo is P1, should I:
  - Stub the route with a placeholder and build the architecture for Three.js + react-three-fiber later
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
  ⎿  · Geo is P1, but the architecture choice affects the whole build. What's the renderer strategy for MVP? → Three.js + react-three-fiber from day one
     · If/when the globe ships, what level of visual detail? → Hybrid
     · For ADS-B and AIS tracking data, motion trails or static markers? → Animated trails

⏺ Ambitious — Three.js + react-three-fiber from day one, hybrid zoom detail, animated trails. You want the full cinematic experience. Layout and Chrome next.

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
  │ 6a                │ Renderer                │ Three.js + react-three-fiber from day one                                                               │
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

 Step 7: Three.js + react-three-fiber setup (E01-S01-T08)
 - Install three, resium, vite-plugin-three
 - Configure vite plugin in vite.config.ts
 - Create public/three/ directory
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
 2. Three.js + react-three-fiber via vite-plugin-three handles the asset copying. If that plugin isn't v4-compatible, we'll configure the copy manually in vite.config.ts.
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
  - All dependencies installed (Zustand, TanStack Query, Framer Motion, Recharts, Radix UI, Three.js + react-three-fiber, etc.)
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
  │ Geo View                  │ 3         │ Feature flag gating, Three.js + react-three-fiber globe, conflict zone markers                                              │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Performance               │ 5         │ TTI < 3s, 60 FPS scroll, memory < 500MB, lazy loading, bundle size                                      │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Accessibility &           │ 6         │ Number formatting, keyboard nav, toggles, tooltips, error boundary, empty states                        │
  │ Conventions               │           │                                                                                                         │
  ├───────────────────────────┼───────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Anti-Pattern Checks       │ 6         │ No placeholder copy, no default styling, no centered spinners, varied rhythm, product name              │
  └───────────────────────────┴───────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Plus reference tables for: feature flags, numeric specifications, browser matrix, and seed data.
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

## Epic 2A1 Plan

╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Landing Page with Animated Three.js Globe

 Context

 The app currently drops users directly into the dashboard at /. We need a landing page gate at / with a cinematic Three.js globe showing animated
 maritime, air, and military traffic. The "Get Started" CTA navigates to the dashboard (moved to /dashboard).

 All Three.js deps are already installed (three@^0.183, @react-three/fiber@^9.5, @react-three/drei@^10.7) but unused. The src/geo/ directory is empty.
 framer-motion@^12.35 is also available.

 New Files

 src/landing/
 ├── LandingPage.tsx           # Full-page layout: globe bg + hero overlay + features
 ├── components/
 │   ├── HeroSection.tsx       # Title, tagline, CTA buttons (framer-motion stagger)
 │   ├── FeatureHighlights.tsx  # 4 value-prop cards below the fold
 │   ├── GlobeCanvas.tsx       # R3F <Canvas> wrapper (lazy-loaded)
 │   ├── Globe.tsx             # Dark sphere + lat/lng grid + continent outlines
 │   ├── GlobeArcs.tsx         # Animated maritime/air/military arc trails
 │   ├── GlobePoints.tsx       # Pulsing hotspot markers (instanced mesh)
 │   ├── GlobeAtmosphere.tsx   # Fresnel edge-glow shader
 │   └── globeData.ts          # Route coords, hotspots, continent outlines, latLngToSphere()

 Modified Files

 ┌─────────────────────────┬──────────────────────────────────────────────────────────────────┐
 │          File           │                              Change                              │
 ├─────────────────────────┼──────────────────────────────────────────────────────────────────┤
 │ src/main.tsx            │ / → LandingPage (lazy), /dashboard → AppShell + all child routes │
 ├─────────────────────────┼──────────────────────────────────────────────────────────────────┤
 │ src/sidebar/Sidebar.tsx │ Update all to paths to /dashboard/*, fix active comparisons      │
 └─────────────────────────┴──────────────────────────────────────────────────────────────────┘

 Implementation Steps

 Step 1: Router restructure (main.tsx)

 - Lazy-import LandingPage at /
 - Move AppShell + all children to /dashboard
 - Child routes: /dashboard (HomeFeed), /dashboard/search, /dashboard/trends, /dashboard/markets, /dashboard/geo

 Step 2: Sidebar path update (Sidebar.tsx)

 - All to="/" → to="/dashboard", to="/search" → to="/dashboard/search", etc.
 - Active checks: location.pathname === "/dashboard", startsWith("/dashboard/search"), etc.

 Step 3: Globe data module (globeData.ts)

 Pure data — no React/Three imports. Contains:
 - latLngToSphere(lat, lng, radius) — coordinate conversion utility
 - ~8 maritime routes (Shanghai→Rotterdam, Singapore→Hormuz, Long Beach→Yokohama, etc.) — cyan, slow, low arcs
 - ~8 air routes (NYC→London, Dubai→Singapore, LAX→Tokyo, etc.) — amber, faster, high arcs
 - ~4 military routes (Ukraine, Taiwan Strait, etc.) — red
 - ~35 hotspot points (major ports, airports, conflict zones)
 - Simplified continent outlines (~200-300 coordinate pairs, ~5-8 KB)

 Step 4: Globe sphere (Globe.tsx)

 - <Sphere args={[1, 64, 64]}> with dark material (#0a0f14)
 - Lat/lng grid lines every 30° as <Line> segments (#1a2a3a, lineWidth 0.3)
 - Continent outlines as <Line> segments (#1e3a5a, lineWidth 0.8)

 Step 5: Atmosphere glow (GlobeAtmosphere.tsx)

 - Slightly larger back-face sphere (radius 1.02)
 - Custom Fresnel shader: blue edge glow, transparent center
 - Uses drei's shaderMaterial factory

 Step 6: Hotspot points (GlobePoints.tsx)

 - <instancedMesh> for all ~35 points (single draw call)
 - useFrame pulsing animation (scale + opacity oscillation)
 - Color-coded: cyan (ports), amber (airports), red (conflict)

 Step 7: Animated arcs (GlobeArcs.tsx)

 - Each arc: <QuadraticBezierLine> from drei
 - Midpoint pushed outward from sphere by arcHeight
 - dashed={true} with animated dashOffset via useFrame — creates moving trail effect
 - All animation via refs (no React setState in render loop)

 Step 8: Canvas wrapper (GlobeCanvas.tsx)

 - <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
 - <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={false} enablePan={false}>
 - Ambient light (0.15) + directional light (0.4)
 - Suspense wrapper for child 3D components

 Step 9: Landing page layout (LandingPage.tsx)

 - Full viewport, bg-background
 - Globe as absolute-positioned background (z-0)
 - Gradient overlay for text readability: bg-gradient-to-b from-background/80 via-transparent to-background
 - Minimal nav bar: PolyMatic logo + Login/Sign Up links
 - Hero section centered over globe
 - GlobeCanvas lazy-loaded within LandingPage

 Step 10: Hero section (HeroSection.tsx)

 - framer-motion staggered reveal (h1, tagline, CTA)
 - Title: "Real-time Intelligence for Prediction Markets" (gradient text on last two words: blue→cyan)
 - Tagline: 1-2 sentences about OSINT + sentiment + prediction markets
 - CTA: <Button size="lg"> → <Link to="/dashboard">Get Started</Link>
 - Secondary: outline "Learn More" button

 Step 11: Feature highlights (FeatureHighlights.tsx)

 - 4 cards: OSINT Aggregation, Sentiment Engine, Market Correlation, Real-time Alerts
 - Glass-morphism style: bg-card/50 backdrop-blur-sm border border-border/50
 - lucide-react icons

 Performance

 - LandingPage lazy-loaded (Three.js chunk ~800KB-1MB, only loads at /)
 - GlobeCanvas also lazy within LandingPage (text renders first)
 - All 3D animation via refs + useFrame (no React re-renders)
 - Instanced mesh for points (single draw call for ~35 points)
 - No textures (procedural generation keeps GPU memory ~10-15MB)
 - dpr={[1, 2]} caps pixel density
 - No shadows (expensive + unnecessary for wireframe aesthetic)
 - ErrorBoundary around globe (graceful degradation if WebGL fails)

 Verification

 1. npm run build — zero errors, check code splitting (landing chunk separate from dashboard)
 2. http://localhost:*/ — landing page loads with animated globe
 3. Globe: dark sphere with continent outlines, grid lines, atmospheric glow
 4. Arcs: ~20 animated trails (cyan maritime, amber air, red military) with moving dash effect
 5. Points: ~35 pulsing hotspots on globe surface
 6. Globe auto-rotates slowly, drag to rotate manually, no zoom/pan
 7. "Get Started" navigates to /dashboard with full AppShell + HomeFeed
 8. Sidebar links still work correctly under /dashboard/*
 9. Text overlay readable over globe (gradient ensures contrast)
 10. No console errors, no WebGL warnings



## Epic 3A Plan

 Epic 3A: UI/UX Transformation — Supabase + Profound Aesthetic

 Context

 The current UI has two critical issues:
 1. Broken styling: Feed components use Tailwind classes (bg-bg-primary, text-text-primary, border-border-subtle) that are NOT registered in the @theme
  inline block of index.css. These utilities resolve to nothing — backgrounds, text colors, and borders are invisible/missing.
 2. Generic aesthetic: The layout is functional but lacks the premium, layered, dark SaaS feel of Supabase Docs and Profound.

 Design references:
 - Supabase Docs (supabase.com/docs): Clean three-column layout, subtle 1px borders at low opacity, icon-first sidebar, 150ms transitions, restrained
 color, no decorative rounded corners
 - Profound (tryprofound.com): Pure black backgrounds (#000, #0D0D0D), thin gray borders, hover opacity/scale transforms, gradient overlays, deep layer
  separation

 Goal: Fix all broken styling, transform the UI to a premium dark SaaS aesthetic.

 Scope

 In scope: Fix CSS tokens, restyle AppShell + Sidebar + TopBar + RightPanel + HomeFeed + FeedFilters + FeedItemRow + TrendCarousel, tune dark theme,
 fix 38 TS build errors
 Out of scope: New features, new routes, data model changes

 ---
 Step 1: Fix CSS Token System (src/index.css)

 Root cause of broken UI. Components use bg-bg-primary, text-text-secondary, etc. but these aren't in @theme inline.

 Add to @theme inline (alias old names to shadcn tokens):
 --color-bg-primary: var(--background);
 --color-bg-secondary: var(--muted);
 --color-bg-card: var(--card);
 --color-bg-elevated: var(--bg-elevated);
 --color-bg-hover: var(--bg-hover);
 --color-text-primary: var(--foreground);
 --color-text-secondary: var(--muted-foreground);
 --color-text-tertiary: var(--text-tertiary);
 --color-border-subtle: var(--border-subtle);
 --color-border-strong: var(--border-strong);
 --color-accent: var(--accent);

 Add to .dark block (new base tokens):
 --bg-elevated: #1a1a1a;
 --bg-hover: #1e1e1e;
 --text-tertiary: #525252;
 --border-subtle: rgba(255,255,255,0.06);
 --border-strong: rgba(255,255,255,0.12);

 Tune .dark values toward Profound's deeper blacks:

 ┌──────────────┬─────────┬─────────┐
 │    Token     │ Current │   New   │
 ├──────────────┼─────────┼─────────┤
 │ --background │ #0f0f0f │ #0a0a0a │
 ├──────────────┼─────────┼─────────┤
 │ --card       │ #141414 │ #111111 │
 ├──────────────┼─────────┼─────────┤
 │ --popover    │ #141414 │ #141414 │
 ├──────────────┼─────────┼─────────┤
 │ --secondary  │ #262626 │ #1a1a1a │
 ├──────────────┼─────────┼─────────┤
 │ --muted      │ #262626 │ #1a1a1a │
 ├──────────────┼─────────┼─────────┤
 │ --accent     │ #262626 │ #1a1a1a │
 ├──────────────┼─────────┼─────────┤
 │ --border     │ #262626 │ #1e1e1e │
 ├──────────────┼─────────┼─────────┤
 │ --input      │ #262626 │ #1e1e1e │
 ├──────────────┼─────────┼─────────┤
 │ --ring       │ #404040 │ #333333 │
 └──────────────┴─────────┴─────────┘

 Add to :root (shared tokens):
 --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
 --shadow-md: 0 4px 12px rgba(0,0,0,0.4);

 Update light theme correspondingly.

 File: src/index.css

 ---
 Step 2: AppShell Layout (src/app/AppShell.tsx)

 Remove decorative rounded borders. Go flush columns like Supabase.

 - Main content: remove rounded-tl-lg border-t border-l border-border/40 bg-card/30 shadow-sm mr-2 mt-2 mb-2 rounded-lg
 - Replace with: border-l border-border bg-background
 - No margins, no rounded corners, full-height flush panels

 File: src/app/AppShell.tsx

 ---
 Step 3: Sidebar (src/sidebar/Sidebar.tsx)

 Supabase-style clean navigation:
 - Width: w-56 (was w-64)
 - Background: bg-background (not bg-sidebar)
 - Section headers: text-xs font-medium text-muted-foreground (drop uppercase + tracking-widest)
 - Nav items: tighter py-1.5, hover bg-accent/50, 150ms transitions
 - Active indicator: bg-accent text-foreground instead of hardcoded hover:bg-white/5
 - Keyboard shortcut: text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded
 - User section: simplified

 File: src/sidebar/Sidebar.tsx

 ---
 Step 4: TopBar (src/app/TopBar.tsx)

 Minimal breadcrumb:
 - Height: h-12 (was h-14)
 - Breadcrumb: slash separators, not chevrons
 - Remove "02 / 145 Active Events" counter (noise)
 - Subtle border-b border-border
 - Plain bg-background, no backdrop blur

 File: src/app/TopBar.tsx

 ---
 Step 5: FeedFilters (src/feed/components/FeedFilters.tsx)

 Minimal filter bar:
 - Remove SlidersHorizontal icon and "FEED" uppercase label
 - Use clean button-like badges, no hover:scale-105 active:scale-95
 - transition-colors duration-150 only
 - py-2.5 px-5, sticky with bg-background/80 backdrop-blur-sm

 File: src/feed/components/FeedFilters.tsx

 ---
 Step 6: TrendCarousel (src/feed/components/TrendCarousel.tsx)

 Profound-style cards:
 - Replace "Trending Topics" + pulse dot with minimal "Trending" label
 - Cards: bg-card border border-border hover:border-border/80 transition
 - Remove active:scale-[0.98]
 - Tighter padding, clean typography

 File: src/feed/components/TrendCarousel.tsx

 ---
 Step 7: FeedItemRow (src/feed/components/FeedItemRow.tsx)

 Clean list rows:
 - Remove left accent bar (the w-0.5 bg-accent indicator)
 - border-b border-border separation
 - Hover: hover:bg-accent/30 (subtle, no accent bar)
 - Avatar: size-7
 - Source badge: muted text-muted-foreground text, drop outline badge
 - Content: text-muted-foreground, text-foreground on hover
 - Sparkline: opacity 40%, hover 80%
 - Fix all bg-bg-* and text-text-* classes to use theme tokens

 File: src/feed/components/FeedItemRow.tsx

 ---
 Step 8: RightPanel (src/panels/RightPanel.tsx)

 Clean detail sidebar:
 - Header: plain title, no heavy styling
 - Labels: text-xs text-muted-foreground font-medium (no uppercase tracking-widest)
 - Replace hardcoded bg-white/[0.01] with bg-background
 - Replace bg-white/5, bg-white/10, border-white/5 with theme tokens
 - Activity dots: smaller, use ring-background (not ring-card)
 - Input: use shadcn-compatible styling

 File: src/panels/RightPanel.tsx

 ---
 Step 9: Fix TypeScript Build Errors

 38 errors across 15 files. Approach:
 - Prefix unused params with _ in mockProvider, generators, hooks
 - Create stub src/state/authStore.ts for wsClient import
 - Fix type mismatches in seed data
 - Fix sample.test.tsx

 Files: src/services/mockProvider.ts, src/services/wsClient.ts, src/services/apiClient.ts, src/services/dataProvider.ts, src/mock-data/generators/*.ts,
  src/mock-data/seed/*.ts, src/hooks/*.ts, src/sample.test.tsx, src/state/authStore.ts (new stub)

 ---
 Critical Files

 ┌───────────────────────────────────────┬─────────────────────────────────────────────────┐
 │                 File                  │                     Action                      │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/index.css                         │ Fix token system, tune dark values, add shadows │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/app/AppShell.tsx                  │ Flush layout, remove rounded borders            │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/app/TopBar.tsx                    │ Minimal breadcrumb, remove clutter              │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/sidebar/Sidebar.tsx               │ Supabase-style clean nav                        │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/panels/RightPanel.tsx             │ Theme tokens, clean detail panel                │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/feed/HomeFeed.tsx                 │ Fix CSS class references                        │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/feed/components/FeedFilters.tsx   │ Minimal filter tabs                             │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/feed/components/FeedItemRow.tsx   │ Clean row design, fix tokens                    │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/feed/components/TrendCarousel.tsx │ Profound-style cards                            │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ src/state/authStore.ts                │ New stub (fix import error)                     │
 ├───────────────────────────────────────┼─────────────────────────────────────────────────┤
 │ 10+ service/mock files                │ Fix TS unused-var errors                        │
 └───────────────────────────────────────┴─────────────────────────────────────────────────┘

 TASKS.md Update

 Add Epic 3A before Epic 4 in tasks/TASKS.md with all 9 steps as tasks:

 # Epic 3A: UI/UX Transformation (P0)

 > Fix broken CSS tokens and transform to Supabase + Profound premium dark aesthetic.
 > **Depends on:** Epic 1, Epic 2, Epic 3 (partial).
 > **Reference:** supabase.com/docs, tryprofound.com

 ## Story 3A.1: CSS Token Fix + Dark Theme Tuning
 - [ ] E3A-S01-T01 — Fix @theme inline: register bg-primary/secondary/card/elevated/hover, text-primary/secondary/tertiary, border-subtle/strong
 aliases
 - [ ] E3A-S01-T02 — Tune .dark values to Profound depths (#0a0a0a bg, #111111 card, #1e1e1e border)
 - [ ] E3A-S01-T03 — Add shadow tokens and update light theme correspondingly

 ## Story 3A.2: Layout Shell Polish
 - [ ] E3A-S02-T01 — AppShell: flush columns, remove decorative rounded borders
 - [ ] E3A-S02-T02 — TopBar: minimal breadcrumb with slash separators, remove event counter
 - [ ] E3A-S02-T03 — Sidebar: Supabase-style clean nav, theme tokens, tighter spacing
 - [ ] E3A-S02-T04 — RightPanel: clean detail sidebar, replace hardcoded white/* with theme tokens

 ## Story 3A.3: Feed Visual Polish
 - [ ] E3A-S03-T01 — FeedFilters: minimal filter bar, remove bouncy animations
 - [ ] E3A-S03-T02 — TrendCarousel: Profound-style cards, subtle transitions
 - [ ] E3A-S03-T03 — FeedItemRow: clean rows, fix broken token classes, subtle hover

 ## Story 3A.4: Build Fix
 - [ ] E3A-S04-T01 — Fix 38 TypeScript errors (unused params, missing authStore stub, type mismatches)

 ---
 Verification

 1. npm run build — zero TypeScript errors
 2. npm run dev — app loads at localhost, no console errors
 3. Visual: background is near-black (#0a0a0a), clear layer separation
 4. Visual: borders are barely visible, subtle
 5. Visual: feed rows are clean, readable, no missing backgrounds
 6. Visual: sidebar matches Supabase's navigation pattern
 7. Visual: trend cards have subtle depth
 8. Visual: right panel has clean metadata + activity
 9. All hover states are 150ms, no bouncy scale effects
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌


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


## Epic 5 Plan

│ Plan: Implement Epic 5 — Sentiments Engine (P0)                                                                                                      │
│                                                                                                                                                      │
│ Context                                                                                                                                              │
│                                                                                                                                                      │
│ Epic 5 is the highest-priority feature after foundation. It implements the Sentiments Engine UI — the core intelligence product that surfaces        │
│ Twitter/X crowd sentiment for prediction market questions. All data infrastructure is already built (types, store, hooks, mock generator, mock       │
│ provider). Only UI components remain: 21 tasks across 6 stories.                                                                                     │
│                                                                                                                                                      │
│ What Already Exists                                                                                                                                  │
│                                                                                                                                                      │
│ ┌──────────────┬────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐  │
│ │    Layer     │                      File                      │                                     Status                                      │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Types        │ src/types/sentiment.types.ts                   │ Complete — SentimentQuestion, ClassifiedTweet, StanceBreakdown,                 │  │
│ │              │                                                │ SentimentDetail, PredictionBrief                                                │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Store        │ src/state/sentimentsStore.ts                   │ Complete — questions, trackedQuestionIds, expandedQuestionId,                   │  │
│ │              │                                                │ track/untrack/expand actions                                                    │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Hooks        │ src/hooks/useSentiments.ts                     │ Complete — useSentimentQuestions (10s refetch), useSentimentDetail (5s          │  │
│ │              │                                                │ refetch), useTrackQuestion                                                      │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Mock         │ src/mock-data/generators/sentimentGenerator.ts │ Complete — 20 questions, Brownian motion, batch tweets, scoring, getBrief()     │  │
│ │ Generator    │                                                │                                                                                 │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Mock         │ src/services/mockProvider.ts                   │ Complete — getSentimentQuestions, getSentimentDetail, subscribeSentimentUpdates │  │
│ │ Provider     │                                                │                                                                                 │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ View         │ src/views/SentimentsView.tsx                   │ Stub — placeholder text only                                                    │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Auth Store   │ src/state/authStore.ts                         │ Complete — user.tier available (dev user defaults to 'quant')                   │  │
│ ├──────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤  │
│ │ Base         │ src/components/*                               │ Complete — Card, Badge, Chip, ConfidenceBadge, DeltaIndicator,                  │  │
│ │ Components   │                                                │ ProbabilityDisplay, Sparkline, EmptyState, LoadingSkeleton, Tabs                │  │
│ └──────────────┴────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                                                      │
│ Note: PredictionBrief data is available via engine.sentiments.getBrief(id) but NOT exposed through the DataProvider interface. We'll access it       │
│ through the SentimentDetail data or add a hook that calls the generator directly via the mock engine for now.                                        │
│                                                                                                                                                      │
│ Files to Create                                                                                                                                      │
│                                                                                                                                                      │
│ All new files go in polymatic-frontend-webapp/src/sentiments/:                                                                                       │
│                                                                                                                                                      │
│ ┌─────┬──────────────────────────┬────────────────────────────┬───────────────────────────────────────────────────┐                                  │
│ │  #  │           File           │          Task IDs          │                    Description                    │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 1   │ SentimentsPanel.tsx      │ E05-S01-T01, T04           │ Main scrollable list with sort controls           │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 2   │ QuestionCard.tsx         │ E05-S01-T02                │ Collapsed question card with key metrics          │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 3   │ MarketDeltaBadge.tsx     │ E05-S01-T03                │ Sentiment-vs-market delta badge                   │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 4   │ QuestionCardExpanded.tsx │ E05-S02-T01                │ Expanded card with full breakdown                 │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 5   │ StanceDistribution.tsx   │ E05-S02-T02                │ Horizontal bar showing YES/NO/Neutral             │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 6   │ SentimentTimeline.tsx    │ E05-S02-T03                │ 24h sentiment line chart                          │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 7   │ KeyVoices.tsx            │ E05-S03-T01, T02, T03      │ Influential accounts per stance, tier-gated       │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 8   │ PredictionBrief.tsx      │ E05-S04-T01, T02, T03      │ AI intelligence summary card, tier-gated          │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 9   │ AddQuestionFlow.tsx      │ E05-S05-T01, T02, T03, T04 │ Add question modal/flow with suggestions + search │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 10  │ SentimentDetail.tsx      │ —                          │ Right panel detail view (wires into RightPanel)   │                                  │
│ ├─────┼──────────────────────────┼────────────────────────────┼───────────────────────────────────────────────────┤                                  │
│ │ 11  │ sentiments.utils.ts      │ —                          │ Sort helpers, formatting                          │                                  │
│ └─────┴──────────────────────────┴────────────────────────────┴───────────────────────────────────────────────────┘                                  │
│                                                                                                                                                      │
│ Files to Modify                                                                                                                                      │
│                                                                                                                                                      │
│ ┌──────────────────────────────┬─────────────────────────────────────────────────────────┐                                                           │
│ │             File             │                         Change                          │                                                           │
│ ├──────────────────────────────┼─────────────────────────────────────────────────────────┤                                                           │
│ │ src/views/SentimentsView.tsx │ Replace stub with SentimentsPanel + layout              │                                                           │
│ ├──────────────────────────────┼─────────────────────────────────────────────────────────┤                                                           │
│ │ src/app/RightPanel.tsx       │ Wire sentiment-detail kind to SentimentDetail component │                                                           │
│ ├──────────────────────────────┼─────────────────────────────────────────────────────────┤                                                           │
│ │ src/hooks/useSentiments.ts   │ Add usePredictionBrief(questionId) hook                 │                                                           │
│ ├──────────────────────────────┼─────────────────────────────────────────────────────────┤                                                           │
│ │ src/state/sentimentsStore.ts │ Add sortBy field (delta/velocity/volume/watchlist)      │                                                           │
│ └──────────────────────────────┴─────────────────────────────────────────────────────────┘                                                           │
│                                                                                                                                                      │
│ Implementation Steps                                                                                                                                 │
│                                                                                                                                                      │
│ Step 1: Utilities & Store Updates                                                                                                                    │
│                                                                                                                                                      │
│ - Create src/sentiments/sentiments.utils.ts — sort functions for questions by delta, velocity, volume, watchlist                                     │
│ - Update sentimentsStore.ts — add sortBy: 'delta' | 'velocity' | 'volume' | 'watchlist' and setSortBy action                                         │
│ - Add usePredictionBrief hook to useSentiments.ts — fetches brief data from mock engine                                                              │
│                                                                                                                                                      │
│ Step 2: MarketDeltaBadge (E05-S01-T03)                                                                                                               │
│                                                                                                                                                      │
│ - Green if gap > 10% (underpricing), amber if 5-10%, red if < -10% (overpricing)                                                                     │
│ - Format: "+23%" with directional arrow                                                                                                              │
│ - Reuses DeltaIndicator pattern but with sentiment-specific color thresholds                                                                         │
│                                                                                                                                                      │
│ Step 3: QuestionCard (E05-S01-T02)                                                                                                                   │
│                                                                                                                                                      │
│ - Card variant="interactive", onClick expands                                                                                                        │
│ - Market question text (2 lines max)                                                                                                                 │
│ - Two ProbabilityDisplay: market price + sentiment score                                                                                             │
│ - MarketDeltaBadge, ConfidenceBadge (opacity treatment), direction indicator                                                                         │
│ - Sparkline for 24h sentiment history                                                                                                                │
│ - Track/untrack toggle button                                                                                                                        │
│                                                                                                                                                      │
│ Step 4: StanceDistribution (E05-S02-T02)                                                                                                             │
│                                                                                                                                                      │
│ - Horizontal segmented bar (not pie) — YES green / NO red / Neutral gray                                                                             │
│ - Labels with counts: "YES: 342 (54%) · NO: 218 (35%) · NEUTRAL: 68 (11%)"                                                                           │
│ - Uses Recharts BarChart or pure CSS for simplicity                                                                                                  │
│                                                                                                                                                      │
│ Step 5: SentimentTimeline (E05-S02-T03)                                                                                                              │
│                                                                                                                                                      │
│ - 24h Recharts LineChart with area fill                                                                                                              │
│ - X: timestamps, Y: 0-100% sentiment probability                                                                                                     │
│ - Accent cyan line, subtle area fill below                                                                                                           │
│ - No axes labels (compact), tooltip on hover with value + time                                                                                       │
│                                                                                                                                                      │
│ Step 6: KeyVoices (E05-S03-T01, T02, T03)                                                                                                            │
│                                                                                                                                                      │
│ - Two columns: "Driving YES" / "Driving NO"                                                                                                          │
│ - Each entry: avatar placeholder, display name, handle (mono), tweet text, engagement, stance badge, confidence                                      │
│ - Tier gating: free → "Upgrade to Pro" message, pro → 5 per stance, quant → all + export button                                                      │
│ - Uses authStore.tier for gating                                                                                                                     │
│                                                                                                                                                      │
│ Step 7: PredictionBrief (E05-S04-T01, T02, T03)                                                                                                      │
│                                                                                                                                                      │
│ - Clean intelligence card with subtle left cyan border                                                                                               │
│ - Sections: Assessment (paragraph), Confidence note, Market delta + signal, Historical accuracy, Caveat, Timestamp                                   │
│ - Inter sans-serif for text, monospace for numbers only                                                                                              │
│ - Tier gating: free → "Upgrade to see AI analysis", pro/quant → visible                                                                              │
│                                                                                                                                                      │
│ Step 8: QuestionCardExpanded (E05-S02-T01)                                                                                                           │
│                                                                                                                                                      │
│ - AnimatePresence expand below collapsed card                                                                                                        │
│ - Contains: StanceDistribution, SentimentTimeline, KeyVoices, PredictionBrief                                                                        │
│ - Fetches detail data via useSentimentDetail(questionId)                                                                                             │
│ - Collapse on click or new selection                                                                                                                 │
│                                                                                                                                                      │
│ Step 9: SentimentsPanel (E05-S01-T01, T04)                                                                                                           │
│                                                                                                                                                      │
│ - Sort controls at top: Market delta (default), Velocity, Volume, Watchlist                                                                          │
│ - Scrollable list of QuestionCard components                                                                                                         │
│ - framer-motion layoutId for re-ordering animation                                                                                                   │
│ - Loading skeleton on initial load                                                                                                                   │
│ - Consumes useSentimentQuestions() hook                                                                                                              │
│                                                                                                                                                      │
│ Step 10: AddQuestionFlow (E05-S05-T01, T02, T03, T04)                                                                                                │
│                                                                                                                                                      │
│ - "Add Question" button at panel bottom                                                                                                              │
│ - Opens overlay/modal: Step 1 — trending-linked suggestions, Step 2 — search fallback (200ms debounce, autocomplete)                                 │
│ - Free tier: when 3 tracked → show "Upgrade to track more", disable action                                                                           │
│ - Click to track question                                                                                                                            │
│                                                                                                                                                      │
│ Step 11: SentimentDetail (Right Panel)                                                                                                               │
│                                                                                                                                                      │
│ - Full-page right panel detail for a selected question                                                                                               │
│ - Same content as expanded card but with more space                                                                                                  │
│ - Header: question text, score, market delta, track button                                                                                           │
│ - Body: StanceDistribution, SentimentTimeline, KeyVoices (full), PredictionBrief                                                                     │
│                                                                                                                                                      │
│ Step 12: Wire Everything                                                                                                                             │
│                                                                                                                                                      │
│ - Update SentimentsView.tsx — compose SentimentsPanel + AddQuestionFlow                                                                              │
│ - Update RightPanel.tsx — render SentimentDetail for sentiment-detail kind                                                                           │
│ - Wire card clicks to set rightPanelContent: { kind: 'sentiment-detail', questionId }                                                                │
│                                                                                                                                                      │
│ Step 13: Feed & Market Integration (E05-S06-T01, T02, T03)                                                                                           │
│                                                                                                                                                      │
│ - Add sentiment stance badges to FeedCard (when item has sentimentStance + relatedMarketIds)                                                         │
│ - Add sentiment delta to market cards (already have sentimentScore/sentimentDelta on MarketContract)                                                 │
│ - Create TopicSentiment stub for future Topic Pages integration                                                                                      │
│                                                                                                                                                      │
│ Key Patterns to Follow                                                                                                                               │
│                                                                                                                                                      │
│ - Views are thin — SentimentsView composes SentimentsPanel, doesn't contain logic                                                                    │
│ - Store for UI state — expanded question ID, sort mode, tracked IDs                                                                                  │
│ - Hooks for data — useSentimentQuestions, useSentimentDetail for server state                                                                        │
│ - Card composition — Card component wraps content, variant="interactive" for clickable                                                               │
│ - Right panel driven by store — set rightPanelContent kind to show detail                                                                            │
│ - framer-motion for animations — layoutId for reorder, AnimatePresence for expand/collapse                                                           │
│ - CSS custom properties — all colors via var(--color-*), never hardcoded                                                                             │
│ - Monospace only for numbers — Inter for labels, font-mono for percentages/deltas/timestamps                                                         │
│ - Tier gating — check useAuthStore(s => s.tier), dev user defaults to 'quant'                                                                        │
│                                                                                                                                                      │
│ Verification                                                                                                                                         │
│                                                                                                                                                      │
│ 1. npm run build — no type errors                                                                                                                    │
│ 2. npm run dev — navigate to Sentiments view, see 20 questions                                                                                       │
│ 3. Questions sort by delta/velocity/volume/watchlist                                                                                                 │
│ 4. Click question → expands with stance distribution, timeline, key voices, prediction brief                                                         │
│ 5. Click question → right panel shows full sentiment detail                                                                                          │
│ 6. Track/untrack questions, verify persistence                                                                                                       │
│ 7. Add Question flow shows suggestions + search fallback                                                                                             │
│ 8. Feed cards show sentiment stance badges when relevant                                                                                             │
│ 9. Animations are smooth (sort reorder, expand/collapse)                                                                                             │
│ 10. All text follows typography rules (no ALL CAPS, monospace numbers only)


## Epic 6 Plan

 Plan: Implement Epic 6 — Search (P0)

 Context

 Epic 6 implements global search: a command-palette-style dropdown in the TopBar and a full-page results view. All data infrastructure exists (types,
 store, hook with 200ms debounce, mock provider). Only UI components remain: 10 tasks across 3 stories.

 What Already Exists

 ┌───────────────┬───────────────────────────────────────┬───────────────────────────────────────────────────────────────────┐
 │     Layer     │                 File                  │                              Status                               │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Types         │ src/types/search.types.ts             │ Complete — SearchQuery, SearchOptions, SearchResults, SavedSearch │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Store         │ src/state/searchStore.ts              │ Complete — query, isOpen, results, recentSearches, savedSearches  │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Hook          │ src/hooks/useSearch.ts                │ Complete — 200ms debounce, ≥2 chars, syncs results to store       │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Mock Provider │ src/services/mockProvider.ts search() │ Complete — searches trends, markets, sentiments, feedItems        │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ View Stub     │ src/views/SearchResultsView.tsx       │ Stub — placeholder text                                           │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ TopBar        │ src/app/TopBar.tsx                    │ Has placeholder div (not a real input)                            │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Input         │ src/components/Input.tsx              │ Complete — variant="search" with icon + clear button              │
 ├───────────────┼───────────────────────────────────────┼───────────────────────────────────────────────────────────────────┤
 │ Routing       │ src/App.tsx                           │ /app/search route already configured                              │
 └───────────────┴───────────────────────────────────────┴───────────────────────────────────────────────────────────────────┘

 Files to Create

 All new files in src/search/:

 ┌─────┬──────────────────────┬────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────┐
 │  #  │         File         │                  Task IDs                  │                             Description                             │
 ├─────┼──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
 │ 1   │ search.utils.ts      │ E06-S01-T03, E06-S03-T01                   │ FlattenedResult type, flattenResults(), nav targets, section labels │
 ├─────┼──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
 │ 2   │ SearchResultItem.tsx │ E06-S02-T03                                │ Type-specific row rendering (Trend/Market/Sentiment/Event)          │
 ├─────┼──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
 │ 3   │ SearchSection.tsx    │ E06-S02-T02                                │ Section header + result list + empty state                          │
 ├─────┼──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
 │ 4   │ SearchDropdown.tsx   │ E06-S02-T01, T04, E06-S01-T03, E06-S03-T03 │ Overlay with sections, recent/saved, keyboard nav, click-outside    │
 ├─────┼──────────────────────┼────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
 │ 5   │ SearchBar.tsx        │ E06-S01-T01, T02                           │ Input + dropdown, Cmd+K shortcut, keyboard delegation               │
 └─────┴──────────────────────┴────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────┘

 Files to Modify

 ┌─────────────────────────────────┬───────────────────────────────────────────────────────────┐
 │              File               │                          Change                           │
 ├─────────────────────────────────┼───────────────────────────────────────────────────────────┤
 │ src/app/TopBar.tsx              │ Replace placeholder div with <SearchBar />                │
 ├─────────────────────────────────┼───────────────────────────────────────────────────────────┤
 │ src/views/SearchResultsView.tsx │ Full rewrite: URL query sync (?q=), sections, save action │
 ├─────────────────────────────────┼───────────────────────────────────────────────────────────┤
 │ src/state/searchStore.ts        │ Add deleteSavedSearch(id) and clearRecentSearches()       │
 └─────────────────────────────────┴───────────────────────────────────────────────────────────┘

 Implementation Steps

 Step 1: Store Update + Utilities

 - Add deleteSavedSearch and clearRecentSearches to searchStore.ts
 - Create search.utils.ts:
   - FlattenedResult type: { type, id, data } union over Trend/Market/Sentiment/FeedItem
   - flattenResults(results, limits) — ordered array: Trends→Markets→Sentiments→Events
   - DROPDOWN_LIMITS = { trends: 3, markets: 3, sentiments: 3, events: 5 }
   - getNavigationTarget(result) — react-router path per type
   - getSectionLabel/Icon/EmptyMessage(type) helpers

 Step 2: SearchResultItem (E06-S02-T03)

 - Four rendering variants:
   - Trend: hashtag + VelocityIndicator + TrendLifecycleBadge
   - Market: question text + ProbabilityDisplay + DeltaIndicator + platform Badge
   - Sentiment: question text + score % (mono) + ConfidenceBadge + direction arrow
   - Event: source icon + title + Timestamp
 - isActive prop for keyboard highlight (bg-hover + left accent border)
 - role="option", aria-selected

 Step 3: SearchSection (E06-S02-T02)

 - Section header: icon + label (sentence case, data-label class)
 - Maps results → SearchResultItem
 - Empty state per section: "No matching {type}"

 Step 4: SearchDropdown (E06-S02-T01, T04, E06-S01-T03, E06-S03-T03)

 - Three display modes:
   a. Recent/Saved: open + query < 2 chars → recent (Clock icon) + saved (Bookmark + delete X)
   b. Loading: isSearching → LoadingSkeleton list-row ×3
   c. Results: 4 SearchSections in fixed order + "View all results" footer
 - Keyboard nav: activeIndex state, ArrowDown/Up cycle flat list, Enter navigates, reset on results change
 - Click-outside: ref-based mousedown on document, excludes input ref
 - framer-motion: AnimatePresence, opacity+y(-4)+scale(0.98), 150ms
 - Position: absolute top-full, z-[60], max-h-[70vh] overflow-y-auto

 Step 5: SearchBar (E06-S01-T01, T02)

 - Uses Input variant="search", wired to searchStore query
 - Cmd+K / Ctrl+K global shortcut to focus
 - Keyboard: ArrowDown/Up → activeIndex, Enter → navigate, Escape → clear then close then blur
 - Calls useSearch() for debounced query
 - ⌘K hint badge when input empty + unfocused
 - Wraps Input + SearchDropdown in relative container

 Step 6: Wire TopBar

 - Replace placeholder div (lines 22-35) with <SearchBar />
 - Update imports, remove unused Search icon import

 Step 7: SearchResultsView (E06-S03-T02)

 - Read ?q= from URL via useSearchParams()
 - Sync URL query to store on mount
 - Full-page: header (query + count), sections with higher limits, richer cards
 - Empty state when 0 results
 - "Save this search" button
 - Click navigation same as dropdown

 Key Design Decisions

 - Keyboard nav ownership: SearchBar owns activeIndex, passes to dropdown
 - Click-outside: Custom ref-based mousedown (not Radix Popover — simpler, no keyboard nav conflicts)
 - No virtualization: Dropdown max 14 items, results page max ~50 — unnecessary
 - z-index: Dropdown z-[60], above TopBar z-50, below modals
 - Double-Escape: First clears query, second closes and blurs

 Verification

 1. npm run build — no type errors
 2. Click search bar or Cmd+K → input focuses
 3. Type ≥2 chars → dropdown with results in fixed-order sections
 4. Arrow keys navigate, Enter selects, Escape closes
 5. Click result → navigates to correct view
 6. "View all results" → /app/search?q=query with full results
 7. Empty input + focused → recent searches shown
 8. Save/delete searches works
 9. Click outside → closes dropdown
 10. Typography rules followed (no ALL CAPS, monospace numbers only)

 ## Epic 7 Plan

 ⏺ Updated Epic 7 with 10 new stories (7.3–7.12) containing 52 tasks for Linear-quality UI polish. Here's the summary:

  ┌───────┬─────────────────────────────────────────────────────────────────────────────┬───────┐
  │ Story │                                    Focus                                    │ Tasks │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.3   │ Install shadcn/ui + foundation                                              │ 5     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.4   │ Dark theme color overhaul (near-black neutrals, shadow tokens)              │ 7     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.5   │ Sidebar redesign (grouped sections, favorites dots, user footer, shortcuts) │ 7     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.6   │ Typography scale + spacing rhythm                                           │ 5     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.7   │ Component migration to shadcn/ui (Button, Card, Input, ScrollArea, Command) │ 10    │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.8   │ TopBar refinement (breadcrumbs, item nav counter, icon buttons)             │ 4     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.9   │ Interactive states + keyboard shortcut system                               │ 5     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.10  │ Activity timeline component (matches Linear's Activity feed)                │ 4     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.11  │ Right panel detail view polish (metadata, collapsible sections, chat input) │ 4     │
  ├───────┼─────────────────────────────────────────────────────────────────────────────┼───────┤
  │ 7.12  │ Micro-interactions + animation polish (page transitions, stagger, counters) │ 5     │
  └───────┴─────────────────────────────────────────────────────────────────────────────┴───────┘

  Key design shifts to match the Linear screenshot:
  - Colors: Blue-tinted darks (#1A1A2E) → desaturated near-blacks (#0F0F0F)
  - Borders: Prominent (#2A3A5C) → barely visible (#2A2A2A)
  - Depth: Flat (borders only) → subtle shadows for layering
  - Sidebar: Accent-colored active items → brightness-based, grouped sections with favorites
  - Components: Custom atoms → shadcn/ui primitives (focus rings, accessibility, polish)
  - Interactions: Basic hover → hover depth, pressed states, keyboard shortcuts, staggered animations

 Plan: Epic 7 Phase 1 — Foundation Polish (Stories 7.3, 7.4, 7.6, 7.7)

 Context

 The PolyMatic UI currently uses blue-tinted dark colors (#1A1A2E, #16213E) and flat borders with no shadow depth. The target is a Linear-quality
 premium dark SaaS aesthetic with near-black neutrals, barely-visible borders, subtle shadows, and polished interactive states. This phase lays the
 design system foundation that all subsequent stories (sidebar, topbar, animations) build upon.

 Scope

 In scope: Stories 7.3 (shadcn/ui), 7.4 (dark theme), 7.6 (typography), 7.7 (component migration)
 Out of scope: Stories 7.1-7.2 (topic pages), 7.5 (sidebar), 7.8-7.12 (topbar, interactions, animations) — these come in Phase 2

 Implementation Steps

 Step 1: Dark Theme Color Overhaul (Story 7.4)

 Pure CSS changes — zero JS, zero imports, immediate visual impact.

 Modify src/styles/themes/dark.css:
 - Replace blue-tinted colors with desaturated near-blacks
 - Add 3 new tokens: --color-bg-elevated, --color-border-subtle, --color-border-strong

 ┌────────────────────────┬─────────┬───────────────┐
 │         Token          │   Old   │      New      │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-bg-primary     │ #1A1A2E │ #0F0F0F       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-bg-secondary   │ #16213E │ #171717       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-bg-card        │ #1E2A45 │ #1C1C1C       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-bg-hover       │ #243354 │ #262626       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-bg-elevated    │ —       │ #222222 (new) │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-text-primary   │ #FFFFFF │ #F5F5F5       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-text-secondary │ #B0B0B0 │ #A0A0A0       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-text-tertiary  │ #666666 │ #5C5C5C       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-border         │ #2A3A5C │ #2A2A2A       │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-border-subtle  │ —       │ #1F1F1F (new) │
 ├────────────────────────┼─────────┼───────────────┤
 │ --color-border-strong  │ —       │ #3A3A3A (new) │
 └────────────────────────┴─────────┴───────────────┘

 Modify src/styles/themes/light.css:
 - Update to match new token hierarchy, add same 3 new tokens

 Modify src/styles/globals.css:
 - Register 3 new tokens in @theme block for Tailwind utility generation
 - Add shadow tokens to :root: --shadow-sm, --shadow-md, --shadow-lg, --shadow-glow
 - Add theme-specific shadow overrides in dark.css and light.css
 - Add typography scale tokens: --text-xs through --text-2xl
 - Set body { font-size: var(--text-base) /* 14px */; line-height: 1.6 }
 - Add .inline-code utility class

 Verify: npm run build, visual check both themes

 ---
 Step 2: Install shadcn/ui (Story 7.3)

 Run: npx shadcn@latest init in polymatic-frontend-webapp/
 - Style: New York
 - Base color: Neutral
 - Components dir: src/components/ui
 - Utils: point to existing @/lib/cn

 Post-init cleanup:
 - Delete any generated src/lib/utils.ts (we already have cn.ts)
 - Move shadcn's generated CSS variables from :root / .dark blocks → into our [data-theme='dark'] and [data-theme='light'] blocks in dark.css /
 light.css
 - Map shadcn variables to our token values:

 --background → #0F0F0F (= --color-bg-primary)
 --foreground → #F5F5F5 (= --color-text-primary)
 --card → #1C1C1C (= --color-bg-card)
 --popover → #222222 (= --color-bg-elevated)
 --primary → #00BCD4 (= --color-accent)
 --muted → #171717 (= --color-bg-secondary)
 --muted-foreground → #A0A0A0 (= --color-text-secondary)
 --destructive → #F44336 (= --color-danger)
 --border → #2A2A2A (= --color-border)
 --ring → #00BCD4 (= --color-accent)

 Theme toggle compatibility:
 - src/state/uiStore.ts: In toggleTheme and setTheme, add document.documentElement.classList.toggle('dark', next === 'dark') so shadcn's dark: variant
 works
 - src/main.tsx: Add matching class toggle in the initialization block

 Verify: npm run build, theme toggle works, no visual regressions

 ---
 Step 3: Install shadcn/ui Primitives (Story 7.3)

 npx shadcn@latest add button input badge card tooltip dropdown-menu dialog tabs separator scroll-area skeleton avatar command

 All land in src/components/ui/. No existing files touched.

 Verify: npm run build — all new files compile cleanly

 ---
 Step 4: Component Migration (Story 7.7)

 Rewrite each existing component in src/components/ to wrap the shadcn equivalent. Same file path, same export name, same props — zero consumer changes
  needed.

 Order by blast radius (lowest first):

 ┌─────┬─────────────────────┬───────────┬───────────────────────────────────────────────────────────────────────────────────────────────────┐
 │  #  │      Component      │ Consumers │                                             Strategy                                              │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4a  │ Input.tsx           │ 1 file    │ Wrap shadcn Input, keep search variant (icon + clear)                                             │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4b  │ Button.tsx          │ 3 files   │ Wrap shadcn Button, map variants (primary→default, danger→destructive), keep loading state        │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4c  │ Card.tsx            │ 3 files   │ Wrap shadcn Card, add --shadow-sm, keep interactive/selected variants                             │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4d  │ Tooltip.tsx         │ 3 files   │ Delegate to shadcn Tooltip, keep TooltipProvider export for main.tsx                              │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4e  │ LoadingSkeleton.tsx │ 5 files   │ Use shadcn Skeleton for pulse animation, keep variant layouts (card, list-row, chart, text-block) │
 ├─────┼─────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4f  │ Badge.tsx           │ 8 files   │ Wrap shadcn Badge, preserve severity/category/source color mapping                                │
 └─────┴─────────────────────┴───────────┴───────────────────────────────────────────────────────────────────────────────────────────────────┘

 Not migrated (no shadcn equivalent or 0 consumers): Chip, DataLabel, EmptyState, Sparkline, DeltaIndicator, ProbabilityDisplay, VelocityIndicator,
 ConfidenceBadge, SeverityDot, ErrorBoundary, FeatureGate, Tabs (0 consumers), Toggle

 Verify after each: npm run build, npm run test, visual spot-check

 ---
 Step 5: SectionHeader Component (Story 7.6)

 Create src/components/SectionHeader.tsx:
 - Props: title, icon?, subtitle?, action?, className?
 - Reusable section title for Topic Pages, feed, markets, etc.

 Verify: Build passes

 ---
 Critical Files

 ┌────────────────────────────────────┬──────────────────────────────────────────────────────┐
 │                File                │                        Action                        │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/styles/themes/dark.css         │ Rewrite colors + add shadcn variables                │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/styles/themes/light.css        │ Rewrite colors + add shadcn variables                │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/styles/globals.css             │ Add tokens, shadows, typography, merge shadcn @theme │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/state/uiStore.ts               │ Add .dark class toggle alongside data-theme          │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/main.tsx                       │ Add .dark class toggle in init block                 │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/Button.tsx          │ Wrap shadcn Button                                   │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/Card.tsx            │ Wrap shadcn Card                                     │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/Badge.tsx           │ Wrap shadcn Badge                                    │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/Input.tsx           │ Wrap shadcn Input                                    │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/Tooltip.tsx         │ Wrap shadcn Tooltip                                  │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/LoadingSkeleton.tsx │ Wrap shadcn Skeleton                                 │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/SectionHeader.tsx   │ New file                                             │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ src/components/ui/*.tsx            │ Generated by shadcn CLI                              │
 └────────────────────────────────────┴──────────────────────────────────────────────────────┘

 Key Decisions

 - Keep both CSS variable systems. Existing --color-* tokens stay (58 files reference them). shadcn's --background/--foreground/etc. are added
 alongside, resolving to the same values. No mass-rename.
 - Wrap, don't replace. Existing component files become thin wrappers around shadcn primitives. Consumer imports don't change.
 - Theme toggle emits both data-theme attribute (for PolyMatic tokens) and .dark class (for shadcn's dark: variant).
 - Body font-size → 14px. Tailwind rem utilities are unaffected (they're relative to <html> root). Only unstyled text inherits the smaller base.

 Verification

 1. npm run build — zero TypeScript errors
 2. npm run test — all tests pass
 3. Visual: body background is near-black (#0F0F0F), clear layer separation
 4. Visual: borders are barely visible, not prominent blue
 5. Theme toggle works in both directions, no flash
 6. Focus-visible rings appear on Button, Input when tabbing
 7. Card has subtle shadow depth
 8. Search bar + dropdown still fully functional
 9. All existing views render correctly (Home, Sentiments, etc.)



╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
## Story 2.4 Plan : ConflictSidebar Mobile Responsiveness

 Context

 The ConflictSidebar is hardcoded at absolute top-0 left-80 (320px from left), which works on desktop (sits beside the main sidebar) but is off-screen
 on mobile. We need to apply the same slide-in/backdrop pattern already used by Sidebar.tsx and EventFeed.tsx.

 Files to Modify

 ┌───────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
 │                           File                            │                          Change                          │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/store/useStore.ts              │ Add conflictSidebarOpen state + setter                   │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/components/ConflictSidebar.tsx │ Mobile slide-in overlay + backdrop + close button        │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/components/App.tsx             │ Mobile-only toggle button when conflicts layer is active │
 └───────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

 Implementation

 Step 1: useStore.ts — Add state

 - Add conflictSidebarOpen: boolean to interface + initial state (false)
 - Add setConflictSidebarOpen: (open: boolean) => void action

 Step 2: ConflictSidebar.tsx — Mobile responsive layout

 Desktop (md+): Keep current left-80 w-96 positioning, always visible when layers.conflicts is true.

 Mobile (<md): Full-width slide-in overlay from the left, controlled by conflictSidebarOpen.

 Specific changes:
 - Read conflictSidebarOpen and setConflictSidebarOpen from store
 - Add backdrop div before panel: fixed inset-0 bg-black/60 z-[11] md:hidden, onClick closes
 - Panel positioning classes:
   - left-0 w-full md:left-80 md:w-96 (full width on mobile, offset on desktop)
   - transition-transform duration-300 ease-in-out
   - Mobile: -translate-x-full / translate-x-0 based on conflictSidebarOpen
   - Desktop: md:translate-x-0 (always visible when mounted)
 - Z-index: z-[12] (above sidebar z-10 and backdrop z-[11])
 - Add X close button in header (mobile only, md:hidden), calls setConflictSidebarOpen(false)
 - Keep AnimatePresence wrapping the whole thing (controls mount/unmount based on layers.conflicts)
 - Keep framer-motion entrance animation for desktop; on mobile the CSS transition handles slide-in

 Auto-open/close:
 - In the existing useEffect that watches layers.conflicts:
   - When conflicts toggled ON → setConflictSidebarOpen(true)
   - When conflicts toggled OFF → setConflictSidebarOpen(false)

 Step 3: App.tsx — Mobile toggle button

 Add a button visible when layers.conflicts && !conflictSidebarOpen:
 - Position: fixed top-14 left-4 z-20 md:hidden (below the hamburger at top-4)
 - Icon: AlertTriangle (matches ConflictSidebar theme)
 - Same styling as existing toggle buttons (bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm text-zinc-300)
 - onClick: setConflictSidebarOpen(true)

 Verification

 1. npm run build — zero errors
 2. Desktop: ConflictSidebar still appears at left-80 when conflicts layer toggled on
 3. Mobile: toggling conflicts layer auto-opens ConflictSidebar as full-width overlay with backdrop
 4. Mobile: tap backdrop or X button to dismiss
 5. Mobile: toggle button appears below hamburger when conflicts active and panel closed
 6. Toggling conflicts layer OFF auto-closes the mobile overlay




## Story 2.4: ConflictSidebar Mobile Responsiveness

 Context

 The ConflictSidebar is hardcoded at absolute top-0 left-80 (320px from left), which works on desktop (sits beside the main sidebar) but is off-screen
 on mobile. We need to apply the same slide-in/backdrop pattern already used by Sidebar.tsx and EventFeed.tsx.

 Files to Modify

 ┌───────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
 │                           File                            │                          Change                          │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/store/useStore.ts              │ Add conflictSidebarOpen state + setter                   │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/components/ConflictSidebar.tsx │ Mobile slide-in overlay + backdrop + close button        │
 ├───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
 │ web/src/components/App.tsx             │ Mobile-only toggle button when conflicts layer is active │
 └───────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

 Implementation

 Step 1: useStore.ts — Add state

 - Add conflictSidebarOpen: boolean to interface + initial state (false)
 - Add setConflictSidebarOpen: (open: boolean) => void action

 Step 2: ConflictSidebar.tsx — Mobile responsive layout

 Desktop (md+): Keep current left-80 w-96 positioning, always visible when layers.conflicts is true.

 Mobile (<md): Full-width slide-in overlay from the left, controlled by conflictSidebarOpen.

 Specific changes:
 - Read conflictSidebarOpen and setConflictSidebarOpen from store
 - Add backdrop div before panel: fixed inset-0 bg-black/60 z-[11] md:hidden, onClick closes
 - Panel positioning classes:
   - left-0 w-full md:left-80 md:w-96 (full width on mobile, offset on desktop)
   - transition-transform duration-300 ease-in-out
   - Mobile: -translate-x-full / translate-x-0 based on conflictSidebarOpen
   - Desktop: md:translate-x-0 (always visible when mounted)
 - Z-index: z-[12] (above sidebar z-10 and backdrop z-[11])
 - Add X close button in header (mobile only, md:hidden), calls setConflictSidebarOpen(false)
 - Keep AnimatePresence wrapping the whole thing (controls mount/unmount based on layers.conflicts)
 - Keep framer-motion entrance animation for desktop; on mobile the CSS transition handles slide-in

 Auto-open/close:
 - In the existing useEffect that watches layers.conflicts:
   - When conflicts toggled ON → setConflictSidebarOpen(true)
   - When conflicts toggled OFF → setConflictSidebarOpen(false)

 Step 3: App.tsx — Mobile toggle button

 Add a button visible when layers.conflicts && !conflictSidebarOpen:
 - Position: fixed top-14 left-4 z-20 md:hidden (below the hamburger at top-4)
 - Icon: AlertTriangle (matches ConflictSidebar theme)
 - Same styling as existing toggle buttons (bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm text-zinc-300)
 - onClick: setConflictSidebarOpen(true)

 Verification

 1. npm run build — zero errors
 2. Desktop: ConflictSidebar still appears at left-80 when conflicts layer toggled on
 3. Mobile: toggling conflicts layer auto-opens ConflictSidebar as full-width overlay with backdrop
 4. Mobile: tap backdrop or X button to dismiss
 5. Mobile: toggle button appears below hamburger when conflicts active and panel closed
 6. Toggling conflicts layer OFF auto-closes the mobile overlay



## /demo Route — Live AIS Globe Demo Page

╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 /demo Route — Live AIS Globe Demo Page

 Context

 The landing page (/) has a "Watch Demo" button and a static SVG globe mock in the hero section. The user wants /demo to show the same landing page
 layout (ticker, nav, features strip, steps section) but with the hero replaced by a large, real Cesium globe displaying live open-source AIS maritime
 shipping data. This gives visitors a taste of the platform without entering the full dashboard.

 Files to Modify

 ┌───────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
 │                         File                          │                                          Change                                          │
 ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
 │ web/src/components/LandingPage.tsx │ Extract shared sections (TickerBar, TopNav, FeaturesStrip, StepsSection) into reusable   │
 │                                                       │ exports. Update "Watch Demo" button to <Link to="/demo">.                                │
 ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
 │ web/src/components/DemoPage.tsx    │ New file. Composes shared sections around a hero-sized Cesium globe showing AIS ship     │
 │                                                       │ data.                                                                                    │
 ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
 │                                                       │ New file. Standalone Cesium <Viewer> focused on maritime AIS — ships layer only, dark    │
 │ web/src/components/DemoGlobe.tsx   │ basemap, no sidebar/controls chrome. Connects to the existing WebSocket /stream for live │
 │                                                       │  ship entity updates.                                                                    │
 ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
 │ web/src/main.tsx                   │ Add /demo route → <DemoPage />.                                                          │
 └───────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘

 Implementation

 Step 1: Extract shared landing sections from LandingPage.tsx

 Move these existing sub-components/sections into named exports so both LandingPage and DemoPage can use them:
 - TickerBar — scrolling intel ticker
 - TopNav — logo + nav links + CTAs (already links to /dashboard)
 - Features strip JSX (the 4-cell grid below the hero)
 - Steps section JSX (the "Four steps to see the world" section)

 Also update the "Watch Demo" button: change from <button> to <Link to="/demo">.

 Step 2: Create DemoGlobe.tsx — Standalone AIS Cesium Globe

 A self-contained Cesium globe component purpose-built for the demo:
 - Uses Resium <Viewer> with CartoDB dark basemap (same as Globe.tsx)
 - Ships layer only — renders vessel entities as orange PointGraphics
 - Connects to the same WebSocket at /stream to receive ENTITY_UPDATE messages for the ships layer
 - Manages its own local state for ship entities (doesn't need the full Zustand store)
 - No sidebar, no layer toggles, no event feed — just the globe with ships
 - Subtle zoom controls (+/−) in corner
 - Initial camera position: global maritime view (centered on ~20°N, 40°E, alt 15M meters — showing Hormuz/Med shipping)
 - Container: width: 100%, height: 500px (hero-sized, not full-screen)

 Step 3: Create DemoPage.tsx — Assembled demo page

 Layout:
 1. <TickerBar /> (from LandingPage exports)
 2. <TopNav /> (from LandingPage exports)
 3. Demo hero section — replaces the landing page's hero:
   - Full-width Cesium globe (~500px tall) with a gradient overlay at the bottom edge
   - Overlaid headline text: "Live Maritime Intelligence" + brief description
   - Semi-transparent overlay label: "LIVE AIS · GLOBAL SHIPPING" badge
 4. Features strip (from LandingPage exports)
 5. Steps section (from LandingPage exports)

 Step 4: Add /demo route in main.tsx

 Add to the createBrowserRouter array:
 { path: '/demo', element: <DemoPage /> }

 Key Design Decisions

 - Own WebSocket connection: DemoGlobe manages its own WS connection rather than importing the full Zustand store. This keeps the demo lightweight and
 decoupled from the dashboard's 40-layer architecture.
 - Ships only: Only render the ships layer to keep the demo focused on "open source AIS data of maritime shipping" as requested.
 - Inline styles maintained: DemoPage follows the same inline-style pattern as LandingPage to avoid Tailwind v4 @theme conflicts with the dashboard.
 - Reuse via exports: Rather than duplicating the ticker/nav/features/steps, we export them from LandingPage and import in DemoPage.

 Verification

 1. npm run build — zero errors
 2. / — Landing page unchanged, "Watch Demo" button now links to /demo
 3. /demo — Shows ticker, nav, live Cesium globe with ships, features strip, steps section
 4. /demo globe — Ships render as orange dots, globe is interactive (pan/zoom)
 5. /dashboard — Unchanged, sidebar still visible
 6. "Launch Dashboard" buttons on /demo nav still link to /dashboard



## Landing Page & Demo Page — Mobile Responsiveness

╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

 Landing Page & Demo Page — Mobile Responsiveness

 Context

 The PolyMatic MVP landing page (/), demo page (/demo), and their shared components (TickerBar, TopNav, FeaturesStrip, StepsSection) are 100%
 desktop-only. All layouts use hardcoded inline styles with fixed pixel widths, multi-column grids, and large paddings that break on mobile viewports
 (<768px). This plan makes them fully responsive.

 Key constraint: These pages use inline style={{}} objects (not Tailwind classes) to avoid Tailwind v4 @theme conflicts with the dashboard CSS. So
 responsiveness must be achieved via a useIsMobile() hook that detects viewport width, with conditional style objects.

 Files to Modify

 ┌────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │              File              │                                                     Change                                                      │
 ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/LandingPage.tsx │ Add useIsMobile hook. Make TickerBar, TopNav, Hero, GlobeMock, FeaturesStrip, StepsSection responsive via       │
 │                                │ conditional inline styles.                                                                                      │
 ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/DemoPage.tsx    │ Responsive hero overlay positioning, metric ribbon stacking, headline sizing.                                   │
 ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/DemoGlobe.tsx   │ Responsive globe height (520px desktop → 320px mobile).                                                         │
 ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ tasks/TASKS.md                 │ Add Story 2.9 with task breakdown.                                                                              │
 ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ PRD.md                         │ Add mobile responsiveness note to Section 2.5.                                                                  │
 └────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 All paths relative to polymatic-mvp/web/.

 Implementation

 Step 1: Add useIsMobile hook inside LandingPage.tsx

 Simple hook using window.matchMedia('(max-width: 768px)') with resize listener. Defined inside LandingPage.tsx (not a separate file) since it's only
 used by landing/demo pages. Exported for DemoPage/DemoGlobe to import.

 export function useIsMobile(breakpoint = 768) {
   const [mobile, setMobile] = useState(false);
   useEffect(() => {
     const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
     setMobile(mql.matches);
     const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
     mql.addEventListener('change', handler);
     return () => mql.removeEventListener('change', handler);
   }, [breakpoint]);
   return mobile;
 }

 Step 2: Make TickerBar responsive

 - Reduce item padding: 0 28px → 0 12px on mobile
 - Font size stays 10px (already small enough)
 - Height stays 32px

 Step 3: Make TopNav responsive

 Desktop (current): Logo + 5 nav links + LIVE INTEL badge + SIGN IN + LAUNCH DASHBOARD — all in one row.

 Mobile: Logo + hamburger icon. Nav links hidden (or collapsed). Keep only LAUNCH DASHBOARD CTA visible alongside logo. Hide SIGN IN, nav links, LIVE
 INTEL badge.

 - Padding: 0 32px → 0 16px
 - Hide nav links array on mobile
 - Hide SIGN IN button on mobile
 - Keep logo + LAUNCH DASHBOARD

 Step 4: Make Hero section responsive

 Desktop (current): 2-column grid (1fr 1fr) — text left, globe right. H1 at 72px. Padding 80px.

 Mobile:
 - Grid: 1fr single column — text stacks above globe
 - H1: 72px → 36px
 - Padding: 80px 60px 80px 80px → 40px 20px
 - Eyebrow text: keep as-is (already small)
 - CTA buttons: stack vertically (flexDirection: 'column')
 - Metric pills: repeat(5, 1fr) → repeat(2, 1fr) with last pill spanning full width or repeat(3, 1fr) first row + repeat(2, 1fr) second row. Simplest:
 switch to repeat(2, 1fr) and let last one auto-flow.

 Step 5: Make GlobeMock responsive

 - Width/height: 360px → 260px on mobile
 - Remove borderLeft on mobile
 - Center within the single-column layout

 Step 6: Make FeaturesStrip responsive

 - Grid: repeat(4, 1fr) → repeat(1, 1fr) on mobile (stack cards)
 - Remove inter-card borderRight on mobile
 - Add borderBottom between cards on mobile instead
 - Padding: 36px 32px → 24px 20px

 Step 7: Make StepsSection responsive

 - Container padding: 64px 80px → 32px 20px
 - H2: 44px → 28px
 - Grid: repeat(4, 1fr) → repeat(1, 1fr) on mobile
 - Description paragraph: remove textAlign: 'right', stack below heading
 - Flex direction of header: column on mobile instead of row

 Step 8: Make DemoPage responsive

 - Headline overlay: fontSize: 48 → 32px, left: 40 → left: 20, bottom: 60 → bottom: 40
 - Metric ribbon: position: absolute, top: 16, right: 60 → stack vertically below badge or hide on mobile
 - Live badge: keep as-is, reduce padding slightly
 - CTA button: full width on mobile

 Step 9: Make DemoGlobe responsive

 - Container height: 520px → 320px on mobile
 - Zoom controls: same positioning, slightly smaller padding

 Step 10: Update TASKS.md

 Add Story 2.9 after Story 2.8 with tasks:

 ## Story 2.9: Landing Page & Demo Page Mobile Responsiveness

 > Make the marketing landing page (/), demo page (/demo), and all shared
 > sections (TickerBar, TopNav, FeaturesStrip, StepsSection) fully responsive
 > on mobile viewports (<768px).

 - [ ] **E02-S09-T01** — Add `useIsMobile` hook to LandingPage.tsx
 - [ ] **E02-S09-T02** — Make TickerBar and TopNav responsive (collapsible nav, reduced padding)
 - [ ] **E02-S09-T03** — Make Hero section responsive (single-column grid, reduced font sizes, stacked CTAs, 2-col metric pills)
 - [ ] **E02-S09-T04** — Make GlobeMock responsive (smaller diameter, no left border)
 - [ ] **E02-S09-T05** — Make FeaturesStrip responsive (single-column stack, border adjustments)
 - [ ] **E02-S09-T06** — Make StepsSection responsive (single-column stack, reduced padding/fonts)
 - [ ] **E02-S09-T07** — Make DemoPage hero overlays responsive (repositioned badge, headline, metrics)
 - [ ] **E02-S09-T08** — Make DemoGlobe container height responsive (520→320px on mobile)

 Step 11: Update PRD.md

 Add a bullet to Section 2.5 noting mobile responsiveness:
 - Mobile responsive: All marketing pages (landing, demo) are fully responsive for mobile viewports (<768px) with single-column layouts, reduced
 typography, and collapsible navigation.

 Key Design Decisions

 - useIsMobile hook + conditional inline styles — Since the landing pages use inline styles (not Tailwind), we can't use responsive utility classes. A
 hook-based approach keeps the pattern consistent.
 - 768px breakpoint — Matches Tailwind's md: breakpoint used in the dashboard, keeping the project consistent.
 - Hide nav links on mobile — Rather than building a full hamburger menu with slide-out drawer, we simply hide the secondary nav links and keep the
 primary CTA. This is appropriate for an MVP.
 - Single-column stacking — All multi-column grids (hero, features, steps) collapse to single column on mobile for readability.

 Verification

 1. npm run build — zero errors
 2. Chrome DevTools responsive mode at 375px (iPhone), 768px (tablet), 1440px (desktop)
 3. / at 375px — Single-column hero, stacked features/steps, nav collapsed, readable typography
 4. /demo at 375px — Globe renders at 320px height, overlays positioned correctly, no overflow
 5. /dashboard — Unchanged (uses Tailwind responsive classes, not affected)
 6. Test landscape orientation on mobile — no horizontal scroll
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
