# PolyMatic — Backend Task Breakdown

**Version:** 1.0
**Date:** March 3, 2026
**Stack:** Python 3.12+ · FastAPI · PostgreSQL · Redis · Celery/ARQ
**Format:** Epic → Story → Task
**Total:** 14 Epics · 42 Stories · 169 Tasks

---

## Task ID Convention

```
BE{epic}-S{story}-T{task}
Example: BE01-S02-T03 = Backend Epic 1, Story 2, Task 3
```

## Priority Legend

- **P0** = Must ship (MVP). Epics BE01–BE11.
- **P1** = Ship if time permits. Epics BE12–BE13.
- **P0/Ops** = Infrastructure. Epic BE14.

## Status Legend

- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Complete
- `[—]` = Blocked

## Frontend Contract Reference

All Pydantic response schemas **must** match the frontend TypeScript interfaces field-for-field. Source of truth:

| Frontend File | Backend Pydantic Module |
|---|---|
| `src/types/common.types.ts` | `schemas/common.py` |
| `src/types/feed.types.ts` | `schemas/feed.py` |
| `src/types/sentiment.types.ts` | `schemas/sentiment.py` |
| `src/types/trend.types.ts` | `schemas/trend.py` |
| `src/types/market.types.ts` | `schemas/market.py` |
| `src/types/search.types.ts` | `schemas/search.py` |
| `src/types/alert.types.ts` | `schemas/alert.py` |
| `src/types/geo.types.ts` | `schemas/geo.py` |
| `src/types/auth.types.ts` | `schemas/auth.py` |
| `src/types/api.types.ts` | `schemas/api.py` |

**API response wrapper:** `{ "data": T, "status": "success", "timestamp": "<ISO 8601>" }` → matches `ApiResponse<T>`
**Paginated response:** `{ "data": T[], "page": int, "limit": int, "total": int, "hasMore": bool }` → matches `PaginatedResponse<T>`
**Error response:** `{ "status": "error", "code": str, "message": str, "details?": dict }` → matches `ErrorResponse`
**WebSocket message:** `{ "type": WSMessageType, "payload": T, "timestamp": str, "sequenceId": int }` → matches `WSMessage<T>`

---

## Dependency Graph

```
BE01 Foundation
 ├── BE02 Auth & Users
 ├── BE03 Data Models & Schemas
 │    ├── BE04 Feed Ingestion Pipeline
 │    │    └── BE06 Trend Engine ──────────┐
 │    ├── BE05 Sentiments Engine           │
 │    │    └── BE07 Market Data & ─────────┤
 │    │         Correlation                │
 │    └── BE08 REST API ◄──────────────────┘
 │         └── BE09 WebSocket Streaming
 │              └── BE10 Search Service
 │                   └── BE11 Alert Engine
 ├── BE12 Geo/OSINT Layer (P1)
 ├── BE13 Anomaly Detection (P1)
 └── BE14 Infrastructure & DevOps (parallel)
```

**Critical path:** BE01 → BE03 → BE04/BE05 → BE06/BE07 → BE08 → BE09

---

# Epic BE01: Foundation (P0)

> FastAPI scaffold, database, Redis, Docker, and test infrastructure.
> **Depends on:** Nothing. Starting point.
> **Blocks:** Everything else.

## Story 1.1: FastAPI Scaffold

> Initialize the Python project with FastAPI, settings, and middleware.

- [ ] **BE01-S01-T01** — Initialize FastAPI project with Poetry (or uv). Python 3.12+, `pyproject.toml` with strict dependency pinning. Create `src/` layout with `app/main.py` as entrypoint.
- [ ] **BE01-S01-T02** — Create project directory structure: `app/` (main, config), `routers/` (API route modules), `services/` (business logic), `models/` (SQLAlchemy ORM), `schemas/` (Pydantic), `core/` (auth, deps, middleware), `workers/` (background tasks), `tests/`.
- [ ] **BE01-S01-T03** — Set up settings management with `pydantic-settings`. `BaseSettings` class loading from `.env`: DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, ANTHROPIC_API_KEY, TWITTER_BEARER_TOKEN, POLYMARKET_API_URL, KALSHI_API_URL, CORS_ORIGINS. Create `.env.example`.
- [ ] **BE01-S01-T04** — Configure middleware stack: CORS (allow frontend origin `http://localhost:5173`), request-ID injection (`X-Request-ID` header), request timing (log duration), and GZip compression.
- [ ] **BE01-S01-T05** — Create `GET /health` endpoint returning `{ "status": "ok", "database": bool, "redis": bool, "version": str, "timestamp": ISO8601 }`. Check DB and Redis connectivity.

## Story 1.2: Database Setup

> PostgreSQL with SQLAlchemy 2.0 async and Alembic migrations.

- [ ] **BE01-S02-T01** — Install and configure SQLAlchemy 2.0 with async engine (`asyncpg` driver). Create `core/database.py` with `create_async_engine`, `async_sessionmaker`, and `AsyncSession` type.
- [ ] **BE01-S02-T02** — Set up Alembic for async migrations. Configure `alembic.ini` and `env.py` with auto-generation from SQLAlchemy models. Use `asyncpg` driver in migration context.
- [ ] **BE01-S02-T03** — Create `models/base.py` — Base model class with `id` (UUID, server-default), `created_at` (UTC timestamp, server-default), `updated_at` (UTC timestamp, auto-update). All models inherit from this.
- [ ] **BE01-S02-T04** — Configure connection pooling: `pool_size=10`, `max_overflow=20`, `pool_recycle=3600`, `pool_pre_ping=True`. Tune for expected concurrency.
- [ ] **BE01-S02-T05** — Create initial Alembic migration (empty baseline schema). Verify `alembic upgrade head` and `alembic downgrade base` both work cleanly.
- [ ] **BE01-S02-T06** — Implement `get_db` async dependency for FastAPI. Yields `AsyncSession` with proper context management (commit on success, rollback on exception, close always).

## Story 1.3: Redis & Caching

> Redis for caching, pub/sub event distribution, and session support.

- [ ] **BE01-S03-T01** — Install and configure `redis[hiredis]` with async support. Create `core/redis.py` with connection factory, async `get_redis` dependency.
- [ ] **BE01-S03-T02** — Create Redis connection manager with health check (`PING`), automatic reconnection on failure, and configurable connection pool size.
- [ ] **BE01-S03-T03** — Implement cache utility layer: `cache_get(key)`, `cache_set(key, value, ttl)`, `cache_delete(key)`, `cache_delete_pattern(pattern)`. JSON serialization for complex objects. Default TTL: 60s.
- [ ] **BE01-S03-T04** — Set up Redis pub/sub infrastructure. Create `PubSubManager` class with `publish(channel, message)` and `subscribe(channel, callback)` methods. Channels match WSMessageType: `feed:new_items`, `sentiment:batch`, `trend:update`, `market:price_update`, `alert:triggered`, `geo:event`.
- [ ] **BE01-S03-T05** — Create domain-specific cache invalidation helpers. E.g., `invalidate_feed_cache()`, `invalidate_trend_cache()`. Called by services after data mutations.

## Story 1.4: Testing & Dev Tooling

> Test infrastructure, fixtures, and code quality tooling.

- [ ] **BE01-S04-T01** — Configure `pytest` with `pytest-asyncio` (auto mode), `httpx` for `AsyncClient` test client, fixtures for DB session (transaction-scoped rollback), Redis mock, and FastAPI `TestClient`.
- [ ] **BE01-S04-T02** — Create test database setup: use separate test database, apply Alembic migrations before test suite, wrap each test in a transaction that rolls back on teardown.
- [ ] **BE01-S04-T03** — Set up test data factories (using `factory-boy` or manual builders) for all domain models: User, FeedItem, SentimentQuestion, ClassifiedTweet, Trend, MarketContract, AlertConfig, Alert, GeoEvent.
- [ ] **BE01-S04-T04** — Configure pre-commit hooks: `ruff` (linting + formatting), `mypy` (strict type checking, no `Any`), `ruff format` (code formatting). Add `Makefile` with `make lint`, `make test`, `make migrate` targets.

---

# Epic BE02: Auth & Users (P0)

> JWT authentication, refresh token rotation, user registration, and tier-based access gating.
> **Depends on:** BE01 (database, settings).
> **Blocks:** BE08 (protected API endpoints), BE11 (user-scoped alerts).

## Story 2.1: User Model & Registration

> User table, password hashing, and registration endpoint.

- [ ] **BE02-S01-T01** — Create `User` SQLAlchemy model: `id` (UUID), `email` (unique, indexed), `password_hash` (str), `name` (str), `tier` (enum: free/pro/quant, default free), `avatar_url` (nullable str), `onboarding_complete` (bool, default false), `preferences` (JSON: theme, defaultLayout, feedDensity, notificationsEnabled), `created_at`, `updated_at`. Matches `auth.types.ts → User`.
- [ ] **BE02-S01-T02** — Create Pydantic schemas: `UserCreate` (email, password, name), `UserResponse` matching frontend `User` interface field-for-field (id, email, name, tier, avatarUrl, onboardingComplete, preferences: UserPreferences, createdAt). Use `model_config = ConfigDict(from_attributes=True)` and field aliases for camelCase output.
- [ ] **BE02-S01-T03** — Implement password hashing with `passlib[bcrypt]`. Create `hash_password(plain)` and `verify_password(plain, hashed)` utilities in `core/security.py`.
- [ ] **BE02-S01-T04** — Create `POST /api/auth/register` endpoint. Validate email format (Pydantic EmailStr), check for duplicate email (409 Conflict), hash password, create User record, return `AuthResponse { user, token, refreshToken, expiresAt }`.

## Story 2.2: JWT Authentication

> Token generation, login, refresh rotation, and dependency injection.

- [ ] **BE02-S02-T01** — Implement JWT token generation in `core/security.py` using `python-jose` or `PyJWT`. Access token: 15-minute TTL, payload includes `sub` (user_id), `tier`, `exp`. Refresh token: 7-day TTL, payload includes `sub`, `jti` (unique token ID for rotation tracking), `exp`.
- [ ] **BE02-S02-T02** — Create `POST /api/auth/login` endpoint. Accept `LoginCredentials { email, password }` body. Verify credentials, generate token pair, return `AuthResponse { user: User, token: str, refreshToken: str, expiresAt: ISO8601 }` — matching frontend `AuthResponse` type exactly.
- [ ] **BE02-S02-T03** — Create `POST /api/auth/refresh` endpoint. Accept `{ refreshToken: str }`. Validate refresh token, check `jti` against revocation list (Redis set), generate new token pair, add old `jti` to revocation set (refresh rotation). Return new `AuthResponse`.
- [ ] **BE02-S02-T04** — Implement `get_current_user` FastAPI dependency. Extract Bearer token from `Authorization` header, decode JWT, fetch User from DB (or cache), raise 401 if invalid/expired. Inject `User` into route handlers.

## Story 2.3: Tier Gating

> Enforce feature access limits based on user subscription tier.

- [ ] **BE02-S03-T01** — Create `require_tier(min_tier: UserTier)` dependency factory. Tier hierarchy: `free < pro < quant`. Returns 403 Forbidden if `user.tier` is below required tier. Usage: `Depends(require_tier("pro"))`.
- [ ] **BE02-S03-T02** — Implement tier-specific response filtering utility. Configurable per endpoint: sentiment tweets visibility (free: aggregates only, pro: top 5 key voices per stance, quant: full drill-down), question browse limits (free: top 10, pro/quant: unlimited), prediction brief visibility (free: hidden, pro/quant: visible).
- [ ] **BE02-S03-T03** — Create `GET /api/auth/me` endpoint (returns current User). Create `PUT /api/auth/preferences` endpoint to update `UserPreferences { theme, defaultLayout, feedDensity, notificationsEnabled }`.

---

# Epic BE03: Data Models & Schemas (P0)

> All domain SQLAlchemy ORM models and Pydantic response schemas, matching frontend TypeScript types field-for-field.
> **Depends on:** BE01 (base model, database).
> **Blocks:** BE04–BE11 (all domain services and API endpoints).

## Story 3.1: Feed Models

> Feed items, clusters, and filtering schemas.

- [ ] **BE03-S01-T01** — Create `FeedItem` model: `id` (UUID), `type` (enum: signal/tweet/market_move/alert/classification), `title`, `summary`, `content`, `category` (enum: geopolitics/economics/technology/sports/culture), `severity` (enum: low/medium/high/critical), `velocity` (float), `timestamp` (UTC), `source` (enum: twitter/reddit/telegram/news/structured/market_signal), `source_handle`, `source_display_name`, `sentiment_stance` (nullable enum: supports_yes/supports_no/neutral), `confidence` (float 0-1), `cluster_id` (nullable FK), `geo_lat` (nullable float), `geo_lng` (nullable float).
- [ ] **BE03-S01-T02** — Create `FeedItemResponse` Pydantic schema matching `feed.types.ts → FeedItem` exactly: includes `entities: list[EntityResponse]`, `relatedTrendIds: list[str]`, `relatedMarketIds: list[str]`, `media: list[FeedMediaResponse]`, `geoCoords: { lat, lng } | None`. Create `FeedMediaResponse` (type, url, thumbnailUrl, caption). Association tables: `feed_item_entities`, `feed_item_trends`, `feed_item_markets`, `feed_item_media`.
- [ ] **BE03-S01-T03** — Create `FeedCluster` model: `id`, `lead_item_id` (FK), `title`, `category`, `severity`, `event_count`, `latest_timestamp`. Create `FeedFiltersSchema` and `FeedParamsSchema` matching frontend `FeedFilters` and `FeedParams` (categories[], types[], sources[], minSeverity, timeRange: 1h/6h/24h/7d/all, trendId, page, limit, sortBy, sortOrder).

## Story 3.2: Sentiment Models

> Sentiment questions, classified tweets, and aggregate scores.

- [ ] **BE03-S02-T01** — Create `SentimentQuestion` model: `id` (UUID), `text`, `category`, `yes_count` (int), `no_count` (int), `score` (float 0-100), `confidence` (float 0-1), `confidence_level` (enum: low/medium/high), `direction` (enum: rising/falling/stable), `market_probability` (nullable float), `market_delta` (nullable float), `tweet_volume` (int), `stance_breakdown` (JSON: {yes, no, neutral, ambiguous}), `sparkline_data` (JSON array), `timestamp`, `updated_at`. Matches `sentiment.types.ts → SentimentQuestion`.
- [ ] **BE03-S02-T02** — Create `ClassifiedTweet` model: `id` (UUID), `question_id` (FK → SentimentQuestion), `account_id`, `account_handle`, `account_display_name`, `account_avatar_url` (nullable), `account_credibility` (float 0-1), `content`, `stance` (enum: supports_yes/supports_no/neutral/ambiguous), `confidence_score` (float 0-1), `engagement_weight` (float 0-1), `recency_decay` (float 0-1), `diversity_factor` (float 0-1), `timestamp`. Matches `sentiment.types.ts → ClassifiedTweet`.
- [ ] **BE03-S02-T03** — Create `AggregateScore` model: `question_id` (FK), `score` (float 0-100), `sample_size` (int), `confidence` (float), `timestamp`. Create Pydantic schemas: `SentimentDetailResponse` (question, recentTweets[], scoreHistory[]), `PredictionBriefResponse` (questionId, headline, summary, keySignals[], sentimentScore, marketProbability, confidence, generatedAt). All matching frontend types.

## Story 3.3: Trend Models

> Trends, entities, and velocity scoring.

- [ ] **BE03-S03-T01** — Create `Trend` model: `id` (UUID), `hashtag`, `name`, `category` (enum), `lifecycle` (enum: emerging/trending/peaking/cooling), `velocity_current` (float), `velocity_delta` (float), `velocity_peak` (float), `velocity_history` (JSON array — last 24h), `event_count` (int), `sparkline_data` (JSON array), `created_at`, `updated_at`. Association tables: `trend_markets` (trend_id, market_id), `trend_entities` (trend_id, entity_id).
- [ ] **BE03-S03-T02** — Create `Entity` model: `id` (UUID), `name`, `type` (enum: person/organization/country/location/event/commodity). Association tables for linked trends and markets. Matches `common.types.ts → Entity`.
- [ ] **BE03-S03-T03** — Create `TrendResponse` Pydantic schema with nested `VelocityScore { current, delta, peak, history: list[float] }`, `topEntities: list[EntityResponse]`, `linkedMarketIds: list[str]`, `sparklineData: list[float]`. Matches `trend.types.ts → Trend` exactly.

## Story 3.4: Market Models

> Market contracts, price history, and cross-platform data.

- [ ] **BE03-S04-T01** — Create `MarketContract` model: `id` (UUID), `question_text`, `title`, `platform` (enum: polymarket/kalshi), `probability` (float), `previous_probability` (float), `probability_24h_ago` (float), `change_24h` (float), `delta` (float), `volume` (float), `category` (enum), `sentiment_score` (nullable float), `sentiment_delta` (nullable float), `expires_at` (timestamp), `timestamp`. Association table: `market_trends`.
- [ ] **BE03-S04-T02** — Create `PricePoint` model: `id`, `market_id` (FK → MarketContract), `timestamp`, `probability` (float), `volume` (float). Indexed on (market_id, timestamp) for efficient history queries.
- [ ] **BE03-S04-T03** — Create `MarketContractResponse` Pydantic schema with `priceHistory: list[PricePointResponse]`, `sparklineData: list[float]`, `linkedTrendIds: list[str]`. Create `MarketFiltersSchema` and `MarketParamsSchema` matching frontend `MarketFilters` (platforms[], categories[], minVolume, minDelta, sortBy) and `MarketParams`.

## Story 3.5: Alert & Geo Models

> Alert configs, triggered alerts, and geospatial event models.

- [ ] **BE03-S05-T01** — Create `AlertConfig` model: `id` (UUID), `user_id` (FK → User), `name`, `type` (enum: sentiment_reversal/velocity_spike/market_delta/poi_severity/new_trend/price_threshold), `trigger_type` (enum: threshold/velocity/sentiment_shift/market_move), `target_id` (nullable str), `threshold` (float), `channel` (enum: in_app/email/webhook), `conditions` (JSON), `enabled` (bool, default true), `created_at`, `updated_at`. Matches `alert.types.ts → AlertConfig`.
- [ ] **BE03-S05-T02** — Create `Alert` model: `id` (UUID), `config_id` (FK → AlertConfig), `title`, `message`, `severity` (enum: low/medium/high/critical), `read` (bool, default false), `triggered_at` (timestamp), `timestamp`. Matches `alert.types.ts → Alert`.
- [ ] **BE03-S05-T03** — Create `GeoEvent` model: `id`, `type` (enum: adsb/ais/conflict/earthquake/fire/protest/military), `title`, `description`, `latitude`, `longitude`, `altitude` (nullable), `severity` (enum), `timestamp`. Create `POI` model: `id`, `name`, `latitude`, `longitude`, `severity`, `velocity`, `event_count`, `centroid_lat`, `centroid_lng`. Create `MotionTrack` model: `id`, `type` (adsb/ais), `callsign`, `waypoints` (JSON), `heading`, `speed`, `active`. All matching `geo.types.ts` field-for-field.

---

# Epic BE04: Feed Ingestion Pipeline (P0)

> Data source ingestors, normalization, enrichment, and clustering — the RSDIP pipeline.
> **Depends on:** BE01 (infra), BE03 (models).
> **Blocks:** BE06 (trend detection), BE08 (feed endpoints).

## Story 4.1: Ingestor Framework

> Base ingestor interface and platform-specific implementations.

- [ ] **BE04-S01-T01** — Create `BaseIngestor` abstract class in `services/ingestors/base.py`. Interface: `async connect()`, `async poll() → list[RawEvent]`, `normalize(raw: RawEvent) → FeedItem`, `async health_check() → bool`. Each ingestor runs on a configurable poll interval.
- [ ] **BE04-S01-T02** — Implement `TwitterIngestor` — Twitter/X API v2 client with OAuth2 Bearer token. Filtered stream for curated OSINT accounts (@AuroraIntel, @BNONews, @sentdefender, @bellingcat, etc.) plus keyword-based search. Rate limit handling with exponential backoff.
- [ ] **BE04-S01-T03** — Implement `RedditIngestor` — Reddit API (PRAW async or httpx) monitoring target subreddits: r/geopolitics, r/OSINT, r/CredibleDefense, r/polymarket. Fetch hot/new posts, filter by upvote velocity. Deduplicate cross-posts.
- [ ] **BE04-S01-T04** — Implement `NewsIngestor` — GDELT API and/or news aggregator APIs. Fetch articles matching tracked topics and entities. Extract headline, summary, source, publication timestamp, and linked entities.

## Story 4.2: Normalization Layer

> Transform raw source data into the unified FeedItem schema.

- [ ] **BE04-S02-T01** — Create normalization pipeline in `services/pipeline/normalizer.py`. Each raw source event → unified `FeedItem` with: normalized timestamp (UTC), source classification, content extraction, entity placeholder slots, severity placeholder.
- [ ] **BE04-S02-T02** — Implement NER service using spaCy (`en_core_web_lg`) or LLM-based extraction. Extract named entities (person, organization, country, location) from event content. Create or link to existing `Entity` records. Batch processing for throughput.
- [ ] **BE04-S02-T03** — Implement geocoding service for entity-to-coordinate resolution. Use a geocoding API (Nominatim/Mapbox) with disambiguation cache (Redis). Resolve location entities to `geo_lat`/`geo_lng` on FeedItem.

## Story 4.3: Enrichment Pipeline

> NER tagging, topic classification, severity scoring, and entity resolution.

- [ ] **BE04-S03-T01** — Create enrichment pipeline orchestrator in `services/pipeline/enricher.py`. Processes normalized FeedItems through sequential stages: NER → geocoding → topic classification → severity scoring → entity resolution. Each stage is independently testable.
- [ ] **BE04-S03-T02** — Implement topic classification — assign `Category` (geopolitics/economics/technology/sports/culture) to each event. Use keyword-based rules initially, LLM-based classification for ambiguous cases. Category is required on every FeedItem.
- [ ] **BE04-S03-T03** — Implement severity scoring algorithm. Inputs: source credibility weight, entity importance (heads of state > local officials), keyword triggers ("breaking", "explosion", "sanctions"), corroboration count (multiple sources = higher severity). Output: `Severity` enum (low/medium/high/critical).
- [ ] **BE04-S03-T04** — Implement entity resolution — deduplicate entities across events. Merge aliases ("Iran", "Islamic Republic of Iran", "IRI") into canonical Entity records. Use string similarity + LLM disambiguation for edge cases. Maintain alias lookup table.

## Story 4.4: Feed Clustering

> Group related events into clusters with lead item selection.

- [ ] **BE04-S04-T01** — Implement event clustering using a combination of: entity overlap (Jaccard similarity on entity sets), keyword co-occurrence, semantic similarity (sentence embeddings via `sentence-transformers`), and temporal proximity (events within 2h window). Configurable similarity threshold.
- [ ] **BE04-S04-T02** — Create cluster management: select lead item (highest severity or most informative), assign `cluster_id` to member items, handle cluster merging (when two clusters converge on same topic) and splitting (when a cluster drifts into separate subtopics). Maintain `FeedCluster` records.
- [ ] **BE04-S04-T03** — Implement feed ranking for "For You" mode: blended score = `0.7 * velocity_score + 0.3 * recency_score`. Velocity score normalized 0-1 based on event's cluster velocity. Recency score = exponential decay from current time. Return items sorted by blended score descending. (Binding decision: 70% velocity + 30% recency.)

---

# Epic BE05: Sentiments Engine (P0)

> Tweet collection for prediction questions, LLM stance classification, weighted scoring, and prediction generation.
> **Depends on:** BE01 (infra), BE03 (sentiment models), BE04 (Twitter ingestor).
> **Blocks:** BE07 (market correlation uses sentiment delta), BE08 (sentiment endpoints).

## Story 5.1: Tweet Collection

> Map prediction questions to Twitter search queries and collect relevant tweets.

- [ ] **BE05-S01-T01** — Create tweet collector service in `services/sentiments/collector.py`. For each active `SentimentQuestion`, generate a set of Twitter/X search queries: extract keywords from question text, entity names, related hashtags, and semantic variants. Store query templates per question.
- [ ] **BE05-S01-T02** — Implement Twitter/X API polling for sentiment collection. Use search/recent endpoint with question-specific queries. Apply engagement threshold filtering (min 5 likes OR min 2 retweets) to reduce bot noise and low-signal content. Respect rate limits with backoff.
- [ ] **BE05-S01-T03** — Implement tweet deduplication. Exact duplicate detection (by tweet ID). Retweets: count as amplification signal (increment engagement weight on original) rather than independent opinions. Quote tweets: treat as independent opinions if they add commentary.
- [ ] **BE05-S01-T04** — Create account registry in `services/sentiments/accounts.py`. Maintain credibility scores per account: verification status → +0.2, follower count (log-scaled) → 0-0.3, domain expertise tags → +0.2, bot detection flags → -1.0. Match seed accounts from frontend mock data (AuroraIntel, BNONews, sentdefender, etc.).

## Story 5.2: Stance Classification

> LLM-based classification of tweets into stance categories.

- [ ] **BE05-S02-T01** — Implement LLM stance classifier in `services/sentiments/classifier.py` using Anthropic Claude (primary). Prompt structure: system prompt defining task + question context + tweet content → structured output: `{ stance: supports_yes | supports_no | neutral | ambiguous, confidence: 0.0-1.0 }`. Use Claude's structured output mode.
- [ ] **BE05-S02-T02** — Create Gemini Pro fallback classifier. Same interface, different LLM provider. Activated when Claude is unavailable (rate limited, 5xx, timeout > 5s). Log fallback events for monitoring.
- [ ] **BE05-S02-T03** — Implement classification batching. Accumulate unclassified tweets in a Redis queue. Every 5-10 seconds, dequeue a batch (up to 50 tweets), classify in parallel (concurrent LLM calls with semaphore limit), persist results. **Binding decision:** batch delivery, NOT real-time per-tweet.
- [ ] **BE05-S02-T04** — Create `ClassifiedTweet` records with all weighting fields: `confidence_score` (from LLM), `engagement_weight` (normalized likes+retweets), `recency_decay` (1.0 = now, 0.5 = 6h ago, exponential decay with 6h half-life), `diversity_factor` (1.0 if account is in diverse cluster, penalized if echo chamber). Matches frontend `ClassifiedTweet` type.

## Story 5.3: Scoring & Aggregation

> Weighted ratio scoring formula, confidence calculation, and market delta.

- [ ] **BE05-S03-T01** — Implement weighted ratio sentiment scoring in `services/sentiments/scorer.py`. Formula: filter out `ambiguous` tweets. For each remaining tweet: `weight = confidenceScore * accountCredibility * engagementWeight * recencyDecay * diversityFactor`. Sum weights by stance: `yesWeight`, `noWeight`. Score = `round(yesWeight / (yesWeight + noWeight) * 100)`. If no signal → 50%. **Binding decision:** weighted ratio, NOT Bayesian.
- [ ] **BE05-S03-T02** — Implement confidence level calculation. Inputs: `volume` (non-ambiguous tweet count), `avgDiversity` (mean diversityFactor), `avgConfidence` (mean confidenceScore). Rules: if volume < 20 OR avgDiversity < 0.3 OR avgConfidence < 0.5 → `low`. If volume < 100 OR avgDiversity < 0.6 OR avgConfidence < 0.7 → `medium`. Else → `high`.
- [ ] **BE05-S03-T03** — Implement sentiment direction calculation. Compare current score to score N minutes ago (configurable, default 30min). If delta > +3 → `rising`. If delta < -3 → `falling`. Else → `stable`. Store direction on `SentimentQuestion.direction`.
- [ ] **BE05-S03-T04** — Calculate market delta for each question: `marketDelta = score - marketProbability` (where marketProbability comes from linked MarketContract). Positive delta = sentiment higher than market (potential underpricing). Store on `SentimentQuestion.market_delta`.
- [ ] **BE05-S03-T05** — Implement echo-chamber/diversity detection. For each question's tweet set, cluster accounts by follower overlap, shared hashtag usage, and follow graph similarity. If > 60% of sentiment weight comes from a single cluster → penalize `diversityFactor` for those accounts (reduce to 0.3). Log echo chamber warnings.

## Story 5.4: Prediction Generation

> AI-powered prediction summaries and historical accuracy tracking.

- [ ] **BE05-S04-T01** — Create AI prediction summary generator in `services/sentiments/prediction.py`. Use Claude to generate a natural language intelligence brief: what Twitter sentiment indicates, key drivers, notable voices, caveats. Structured as `PredictionBrief` with: headline (1 line), summary (2-3 sentences), keySignals (bullet points), confidence context.
- [ ] **BE05-S04-T02** — Create `PredictionBrief` records matching frontend type: `questionId`, `headline`, `summary`, `keySignals: list[str]`, `sentimentScore`, `marketProbability`, `confidence` (ConfidenceLevel), `generatedAt` (ISO8601). Regenerate on every scoring cycle. Cache in Redis (5min TTL) to avoid redundant LLM calls.
- [ ] **BE05-S04-T03** — Implement historical accuracy tracking. When a market resolves (expires with known outcome), compare the sentiment engine's prediction against the actual result. Track: total predictions, directionally correct count, accuracy percentage. Surface as "Historical accuracy: X% directionally correct" in prediction briefs.

---

# Epic BE06: Trend Engine (P0)

> Real-time trend detection from event streams, velocity scoring, lifecycle management, and market linkage.
> **Depends on:** BE03 (trend models), BE04 (enriched feed items with entities).
> **Blocks:** BE08 (trend endpoints), BE07 (trends link to markets).

## Story 6.1: Trend Detection

> Cluster incoming events into topic trends with generated hashtags.

- [ ] **BE06-S01-T01** — Implement real-time event clustering for trend detection in `services/trends/detector.py`. On each new enriched FeedItem: compute entity overlap and keyword similarity against active trend clusters. If similarity > threshold (0.6) → assign to existing trend. If no match → create new trend candidate (promote to active after 5+ events in 30min).
- [ ] **BE06-S01-T02** — Create hashtag generation in `services/trends/hashtag.py`. For each trend cluster: if organic Twitter hashtags dominate (> 50% of events share same hashtag) → use that. Otherwise → generate AI label using Claude: input = top entities + sample event titles → output = concise hashtag label (e.g., `#IranStraitCrisis`, `#FedRateHold`, `#TrumpTariffEscalation`).
- [ ] **BE06-S01-T03** — Implement category assignment for trends. Derive from dominant entity types: military/political entities → geopolitics, financial/economic entities → economics, tech companies/products → technology, sports entities → sports, entertainment → culture. Fallback to LLM classification.

## Story 6.2: Velocity & Lifecycle

> Velocity scoring and lifecycle state machine for trend aging.

- [ ] **BE06-S02-T01** — Implement velocity scoring in `services/trends/velocity.py`. Velocity = rate of new events entering the cluster per minute, normalized to 0-100 scale. Compute `VelocityScore { current, delta (change since last tick), peak (all-time max), history (last 24h hourly data points) }`. Update on every scoring tick (every 30s).
- [ ] **BE06-S02-T02** — Implement lifecycle state machine. States: `emerging` (new, velocity building) → `trending` (velocity > growth threshold) → `peaking` (velocity at or near peak, delta near 0) → `cooling` (velocity declining, delta negative). Transition thresholds configurable. Allow re-acceleration: if a `cooling` trend's velocity increases by > 20% → transition back to `emerging` (2% probability check per tick, per binding decision).
- [ ] **BE06-S02-T03** — Create trend retirement logic. Trends with velocity < 5 for > 2 hours → mark as `retired` (excluded from active trend list but searchable). Archive retired trends. Generate new trends periodically as new event clusters emerge. Target: 10-15 active trends at any time.

## Story 6.3: Market Linkage

> Bidirectional linking between trends and prediction market contracts.

- [ ] **BE06-S03-T01** — Implement trend-to-market entity matching. Extract entities from trend cluster → match against entities extracted from MarketContract question text. Score: Jaccard similarity on entity sets. Threshold > 0.3 → create link.
- [ ] **BE06-S03-T02** — Implement semantic similarity matching. Compute sentence embedding for trend cluster centroid (average of top-10 event titles) and market question text. Cosine similarity > 0.5 → boost link score. Combine with entity match for composite relevance.
- [ ] **BE06-S03-T03** — Maintain bidirectional linkage. On each scoring tick: update `trend.linked_market_ids` and `market.linked_trend_ids` arrays. Publish `trend:update` events via Redis pub/sub when linkages change. Clean up stale links when trends retire or markets expire.

---

# Epic BE07: Market Data & Correlation (P0)

> Ingest market data from Polymarket and Kalshi, normalize to unified schema, and run the correlation engine.
> **Depends on:** BE03 (market models), BE05 (sentiment scores for delta), BE06 (trends for linkage).
> **Blocks:** BE08 (market endpoints).

## Story 7.1: Market Data Ingestion

> Fetch and normalize market contracts from prediction market platforms.

- [ ] **BE07-S01-T01** — Create Polymarket API client in `services/markets/polymarket.py`. Fetch active market contracts from CLOB API: question text, current probability (YES token price), total volume, expiration date, category. Handle pagination and rate limits.
- [ ] **BE07-S01-T02** — Create Kalshi API client in `services/markets/kalshi.py`. Fetch active market contracts from REST API: question text, probability, volume, expiration. Authenticate with API credentials. Handle pagination.
- [ ] **BE07-S01-T03** — Implement market normalization in `services/markets/normalizer.py`. Transform platform-specific responses → unified `MarketContract` schema matching frontend `market.types.ts` exactly. Assign stable internal UUID. Map platform categories to PolyMatic categories.
- [ ] **BE07-S01-T04** — Implement price history tracking. On each poll (every 60s): record `PricePoint { market_id, timestamp, probability, volume }`. Generate `sparklineData` array (last 24h, ~288 points downsampled to 48). Calculate `probability_24h_ago` and `change_24h` from history.
- [ ] **BE07-S01-T05** — Calculate derived fields on each tick: `delta` = current - previous probability. `sentiment_score` = linked SentimentQuestion score (or null). `sentiment_delta` = sentiment_score - probability (or null). `previous_probability` = probability from last tick.

## Story 7.2: Correlation Engine

> Match markets to OSINT events, trends, and sentiment signals.

- [ ] **BE07-S02-T01** — Implement Market Text NER in `services/markets/correlation.py`. Extract entities (person, organization, country, event type) from market `question_text` using the same NER pipeline as BE04. Cache results (market text rarely changes).
- [ ] **BE07-S02-T02** — Implement semantic matching between market questions and OSINT content. Generate sentence embeddings for market question text. On new events: compute cosine similarity against all active markets. Score > 0.5 → candidate correlation. Use vector store (pgvector or FAISS) for efficient similarity search.
- [ ] **BE07-S02-T03** — Implement spatial correlation. Geocode market entities → coordinates. Compute distance to GeoEvent coordinates and POI centroids. Nearby events (< 500km) → boost correlation score. Use haversine distance.
- [ ] **BE07-S02-T04** — Implement composite relevance ranking. Final score = `0.35 * entity_match + 0.30 * semantic_similarity + 0.20 * temporal_proximity + 0.15 * spatial_correlation`. Temporal proximity = inverse time distance between event and market probability shift. Rank all event-market pairs, surface top correlations on MarketContract response.

---

# Epic BE08: REST API (P0)

> All HTTP endpoints matching the frontend `DataProvider` contract. Every response must match the exact wire format the frontend expects.
> **Depends on:** BE02 (auth), BE03 (schemas), BE04-BE07 (domain services).
> **Blocks:** BE09 (WebSocket reuses services), BE10 (search endpoint).

## Story 8.1: Response Framework

> Standardized response wrappers and error handling.

- [ ] **BE08-S01-T01** — Create `ApiResponse[T]` generic response model in `schemas/api.py`: `{ data: T, status: Literal["success"], timestamp: str }`. Create response helper: `def success_response(data: T) -> ApiResponse[T]` that auto-populates timestamp with current UTC ISO8601.
- [ ] **BE08-S01-T02** — Create `PaginatedResponse[T]` model: `{ data: list[T], page: int, limit: int, total: int, hasMore: bool }`. `hasMore = (page * limit) < total`. Create pagination utility that accepts SQLAlchemy query, page, limit → returns `PaginatedResponse`.
- [ ] **BE08-S01-T03** — Create `ErrorResponse` model: `{ status: Literal["error"], code: str, message: str, details: dict | None }`. Implement FastAPI exception handlers for: `400 BAD_REQUEST`, `401 AUTH_EXPIRED` (matches frontend token-expired handling), `403 FORBIDDEN`, `404 NOT_FOUND`, `422 VALIDATION_ERROR`, `429 RATE_LIMITED`, `500 INTERNAL_ERROR`. All errors return `ErrorResponse` JSON.

## Story 8.2: Feed Endpoints

> Feed list, detail, and cluster endpoints.

- [ ] **BE08-S02-T01** — `GET /api/feed` — Accept query params matching `FeedParams`: `page`, `limit`, `sortBy`, `sortOrder`, filter params (`categories`, `types`, `sources`, `minSeverity`, `timeRange`, `trendId`). Apply filters to DB query. Return `ApiResponse[PaginatedResponse[FeedItemResponse]]`. Requires auth.
- [ ] **BE08-S02-T02** — `GET /api/feed/{id}` — Return `ApiResponse[FeedItemResponse]` with full detail including entities, related trends, related markets, and media. 404 if not found.
- [ ] **BE08-S02-T03** — `GET /api/feed/clusters` — Return `ApiResponse[list[FeedClusterResponse]]` for currently active clusters. Each cluster includes `leadItemId`, `itemIds`, `title`, `category`, `severity`, `eventCount`, `latestTimestamp`.

## Story 8.3: Sentiment Endpoints

> Sentiment questions, detail, and prediction briefs with tier gating.

- [ ] **BE08-S03-T01** — `GET /api/sentiments` — Accept `PaginationParams` (page, limit, sortBy, sortOrder). Return `ApiResponse[list[SentimentQuestionResponse]]`. Tier gating: free users receive top 10 questions only (sorted by tweet volume), pro/quant receive all. Sortable by: delta, velocity, volume, updatedAt.
- [ ] **BE08-S03-T02** — `GET /api/sentiments/{id}` — Return `ApiResponse[SentimentDetailResponse]` with `{ question, recentTweets, scoreHistory }`. Tweet tier gating: free → empty `recentTweets` (aggregates only, return counts in question), pro → top 5 tweets per stance (by engagement weight), quant → all tweets.
- [ ] **BE08-S03-T03** — `GET /api/sentiments/{id}/prediction` — Return `ApiResponse[PredictionBriefResponse]`. Tier gating: free → 403 Forbidden, pro/quant → full prediction brief. Cache in Redis (5min TTL, invalidate on score update).

## Story 8.4: Trend & Market Endpoints

> Trend list and market list/detail with filtering.

- [ ] **BE08-S04-T01** — `GET /api/trends` — Return `ApiResponse[list[TrendResponse]]` sorted by velocity descending. Each trend includes full `VelocityScore`, `linkedMarketIds`, `topEntities`, `sparklineData`. No pagination (always return all active trends, typically 10-15).
- [ ] **BE08-S04-T02** — `GET /api/markets` — Accept query params matching `MarketParams`: `page`, `limit`, filter params (`platforms`, `categories`, `minVolume`, `minDelta`, `sortBy`). Return `ApiResponse[PaginatedResponse[MarketContractResponse]]`. Requires auth.
- [ ] **BE08-S04-T03** — `GET /api/markets/{id}` — Return `ApiResponse[MarketContractResponse]` with full `priceHistory` array, `sparklineData`, `linkedTrendIds`, `sentimentScore`, `sentimentDelta`. 404 if not found.

## Story 8.5: Alert Endpoints

> Alert config CRUD and alert management.

- [ ] **BE08-S05-T01** — `GET /api/alerts/configs` — Return `ApiResponse[list[AlertConfigResponse]]` for authenticated user. Only returns configs belonging to current user.
- [ ] **BE08-S05-T02** — `POST /api/alerts/configs` — Accept `AlertConfigCreate` body (name, type, triggerType, targetId, threshold, channel, conditions, enabled). Auto-assign `id`, `createdAt`, `updatedAt`. Set `user_id` from auth. Return `ApiResponse[AlertConfigResponse]`. Validate tier limits: free → 0 alerts, pro → 10 active, quant → unlimited.
- [ ] **BE08-S05-T03** — `DELETE /api/alerts/configs/{id}` — Delete config if owned by current user, 403 otherwise. `GET /api/alerts` — Return active (unread) alerts for current user. `POST /api/alerts/{id}/dismiss` — Set `alert.read = true`.

## Story 8.6: Search & Auth Endpoints

> Global search and remaining auth endpoint wiring.

- [ ] **BE08-S06-T01** — `GET /api/search` — Accept `q` (string, min 2 chars), optional `limit` (default 14: 3 trends + 3 markets + 3 sentiments + 5 events), optional `categories`, optional `includeExpired`. Fan out to all indices. Return `ApiResponse[SearchResultsResponse]` with `{ trends, markets, sentiments, feedItems, totalCount }` in fixed section order.
- [ ] **BE08-S06-T02** — `GET /api/search/autocomplete` — Accept `q` (min 2 chars). Return quick suggestions from trend hashtags/names and market question text. Limit: 8 suggestions. Target response time < 50ms (use Redis-cached trigram index or PostgreSQL pg_trgm).
- [ ] **BE08-S06-T03** — `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/refresh`, `GET /api/auth/me`, `PUT /api/auth/preferences` — Wire to BE02 auth service. All response shapes match frontend `AuthResponse`, `User`, and `UserPreferences` types. (Routing module only — logic implemented in BE02.)

---

# Epic BE09: WebSocket Streaming (P0)

> Real-time push to frontend clients via WebSocket, backed by Redis pub/sub.
> **Depends on:** BE01 (Redis pub/sub), BE02 (JWT for WS auth), BE08 (services to publish events).
> **Blocks:** None directly (enhances real-time UX).

## Story 9.1: WebSocket Server

> FastAPI WebSocket endpoint with auth, connection management, and batching.

- [ ] **BE09-S01-T01** — Create WebSocket endpoint `ws://localhost:8000/ws` in `routers/websocket.py`. On connection upgrade: extract JWT from query param (`?token=...`) or first message. Validate token. Reject with 4001 close code if invalid.
- [ ] **BE09-S01-T02** — Implement `ConnectionManager` class. Track active connections in a dict keyed by user_id. Support subscription rooms: user subscribes to specific channels (e.g., `sentiment:batch`, `trend:update`, specific question IDs). Handle concurrent connections from same user.
- [ ] **BE09-S01-T03** — Create message serialization matching `WSMessage` format: `{ "type": WSMessageType, "payload": T, "timestamp": ISO8601, "sequenceId": int }`. Sequence ID increments per connection for ordering. All `WSMessageType` values: `feed:new_items`, `feed:update`, `sentiment:batch`, `trend:update`, `market:price_update`, `alert:triggered`, `geo:event`, `system:ping`, `system:error`.
- [ ] **BE09-S01-T04** — Implement server-side message batching. Buffer outgoing messages per connection. Flush every 100ms (matching frontend `WSClient.batchInterval`). During flush: serialize buffered messages and send as individual WebSocket frames in sequence.
- [ ] **BE09-S01-T05** — Implement heartbeat mechanism. Send `system:ping` message every 30 seconds to each connected client. If no pong/activity for 90 seconds → close connection, clean up subscriptions. Track last-activity timestamp per connection.
- [ ] **BE09-S01-T06** — Handle connection lifecycle: graceful disconnect (client close frame → clean up subscriptions, remove from ConnectionManager), ungraceful disconnect (network drop → detected by heartbeat timeout → same cleanup), server shutdown (close all connections with 1001 Going Away).

## Story 9.2: Redis Pub/Sub Bridge

> Domain services publish events → Redis channels → WebSocket server forwards to clients.

- [ ] **BE09-S02-T01** — Define Redis pub/sub channel structure matching `WSMessageType`: `ws:feed:new_items`, `ws:feed:update`, `ws:sentiment:batch`, `ws:trend:update`, `ws:market:price_update`, `ws:alert:triggered`, `ws:geo:event`. Each message serialized as JSON with `WSMessage` shape.
- [ ] **BE09-S02-T02** — Implement publisher service. Domain services (feed pipeline, sentiment scorer, trend engine, market ingester, alert engine) call `await pubsub.publish(channel, payload)` after processing. Each publish creates a `WSMessage` with auto-incremented `sequenceId` and current timestamp.
- [ ] **BE09-S02-T03** — Implement subscriber bridge in WebSocket server. On startup: subscribe to all `ws:*` channels. On message received: deserialize, determine which connected clients are subscribed to that channel, enqueue message to their send buffers. Use asyncio task per subscription.
- [ ] **BE09-S02-T04** — Implement `sentiment:batch` delivery pattern. Sentiment scoring service accumulates classified tweets and score updates. Every 5-10 seconds: publish a single `sentiment:batch` message containing all updated `SentimentQuestion` objects for that window. Matches frontend polling cadence.
- [ ] **BE09-S02-T05** — Implement backpressure handling. If a client's send buffer exceeds 100 messages (matching frontend `spikeThreshold: 50` with 2x server headroom): drop `system:ping` messages first, then drop lowest-severity `feed:new_items`. Log backpressure events. If buffer exceeds 500 → disconnect client with 4002 close code (backpressure).

---

# Epic BE10: Search Service (P0)

> PostgreSQL full-text search with GIN indexes, autocomplete, and saved searches.
> **Depends on:** BE03 (models with text fields), BE08 (endpoint wiring).
> **Blocks:** None directly.

## Story 10.1: Full-Text Search

> Indexed search across all domain entities with autocomplete.

- [ ] **BE10-S01-T01** — Configure PostgreSQL full-text search. Add `tsvector` columns (auto-generated) and GIN indexes on: `feed_items.content`, `feed_items.title`, `trends.hashtag`, `trends.name`, `market_contracts.question_text`, `market_contracts.title`, `sentiment_questions.text`. Create Alembic migration for indexes.
- [ ] **BE10-S01-T02** — Implement search service in `services/search.py`. Accept query string (min 2 chars). Fan out to 4 queries in parallel (asyncio.gather): trends, markets, sentiments, feedItems. Each query uses `ts_rank` for relevance scoring. Return `SearchResults { trends, markets, sentiments, feedItems, totalCount }` in fixed section order.
- [ ] **BE10-S01-T03** — Implement autocomplete in `services/search.py`. Use PostgreSQL `pg_trgm` extension with trigram similarity index for prefix matching. Query trend hashtags/names and market question text. Return top 8 suggestions ranked by similarity score. Target < 50ms response time. Cache popular queries in Redis (30s TTL).
- [ ] **BE10-S01-T04** — Implement search result ranking within sections. Trends: by velocity (highest first). Markets: by volume (highest first). Sentiments: by tweet volume (highest first). FeedItems: by timestamp (most recent first). Cross-section limits: 3 trends, 3 markets, 3 sentiments, 5 events (matching frontend search dropdown spec).
- [ ] **BE10-S01-T05** — Create saved search CRUD. `POST /api/search/saved` — save query + optional category filter for current user. `GET /api/search/saved` — list user's saved searches. `DELETE /api/search/saved/{id}` — delete. Saved searches used by alert engine for new-content notifications.

---

# Epic BE11: Alert Engine (P0)

> Evaluate alert rules against live data, trigger alerts, and deliver via multiple channels.
> **Depends on:** BE02 (user-scoped), BE03 (alert models), BE05-BE07 (data to evaluate against).
> **Blocks:** None directly.

## Story 11.1: Alert Evaluation

> Periodic rule evaluation across all alert trigger types.

- [ ] **BE11-S01-T01** — Create alert evaluation scheduler in `services/alerts/evaluator.py`. Background task running every 10 seconds. For each enabled `AlertConfig`: fetch current data for `target_id`, evaluate trigger condition, fire alert if threshold crossed.
- [ ] **BE11-S01-T02** — Implement `sentiment_reversal` trigger. Detect when a SentimentQuestion's score crosses the 50% threshold (YES → NO or NO → YES) OR when direction changes (rising → falling or falling → rising). Compare against previous evaluation state (cached in Redis).
- [ ] **BE11-S01-T03** — Implement `velocity_spike` trigger. Detect when a Trend's `velocity.current` exceeds the configured threshold. Also trigger when velocity delta is positive and velocity > threshold (acceleration alert). Track last-triggered velocity to avoid re-alerting on same spike.
- [ ] **BE11-S01-T04** — Implement `market_delta` trigger. Detect when a MarketContract's `change_24h` or rolling-window probability change exceeds the configured percentage. E.g., threshold = 10 → alert when probability moves +/-10% within the configured time window.
- [ ] **BE11-S01-T05** — Implement `poi_severity` trigger. Detect when a POI's severity rating crosses the configured threshold (e.g., > 70 = critical). Only evaluated when geo data is active (P1 dependency — gracefully skip if no geo data).
- [ ] **BE11-S01-T06** — Implement `new_trend` trigger. Detect when a new Trend emerges in a category matching the config's `conditions.category`. Alert includes trend hashtag, velocity, and linked markets.
- [ ] **BE11-S01-T07** — Implement `price_threshold` trigger. Detect when a MarketContract's probability crosses a specific level (e.g., alert when "Will X happen?" goes above 80% or below 20%). Support both upward and downward crossing directions.

## Story 11.2: Alert Delivery

> Create alert records and deliver via in-app, email, and webhook channels.

- [ ] **BE11-S02-T01** — Create `Alert` record on trigger: generate descriptive `title` and `message` from config type and trigger data. Set `severity` based on trigger magnitude (small threshold cross → medium, large → high, extreme → critical). Set `triggered_at` to current UTC. Publish `alert:triggered` to Redis pub/sub for WebSocket delivery.
- [ ] **BE11-S02-T02** — Implement in-app delivery. Insert `Alert` record into database with `read = false`. Push via WebSocket `alert:triggered` channel to connected user. Frontend receives and displays in NotificationCenter.
- [ ] **BE11-S02-T03** — Implement email delivery in `services/alerts/email.py`. Configure SMTP or transactional email service (SendGrid / AWS SES). Support delivery modes from `AlertConfig.conditions`: `realtime` (send immediately), `hourly` (batch and send every hour), `daily` (digest at configured time). Template: professional, concise, includes alert title, message, and deep link to relevant page.
- [ ] **BE11-S02-T04** — Implement webhook delivery (Quant tier only) in `services/alerts/webhook.py`. `POST` alert payload to user-configured webhook URL from `AlertConfig.conditions.webhookUrl`. Payload: `{ alert: Alert, config: AlertConfig, data: relevant_entity }`. Retry logic: 3 attempts with exponential backoff (1s, 5s, 30s). Log delivery status.
- [ ] **BE11-S02-T05** — Implement alert deduplication. Before creating an Alert: check if an alert with same `config_id` + `target_id` was triggered within the cooldown window (configurable per config, default 5 minutes). If within cooldown → suppress. Store last-triggered timestamps in Redis hash.

---

# Epic BE12: Geo/OSINT Layer (P1)

> Geospatial data source ingestors, POI clustering, and geo API endpoints.
> **Depends on:** BE01 (infra), BE03 (geo models), BE04 (enrichment pipeline).
> **Blocks:** None (P1 feature, behind feature flag).

## Story 12.1: Geospatial Data Sources

> Ingestors for ADS-B, AIS, ACLED, and seismic data.

- [ ] **BE12-S01-T01** — Create ADS-B ingestor in `services/geo/adsb.py`. Connect to ADS-B Exchange / OpenSky Network API. Poll for aircraft positions within tracked regions. Generate `MotionTrack` records with waypoints (lat, lng, altitude, timestamp), heading, speed, callsign. Update interval: 10s.
- [ ] **BE12-S01-T02** — Create AIS ingestor in `services/geo/ais.py`. Connect to AIS data feeds (MarineTraffic API or raw AIS stream). Track vessel positions, generate `MotionTrack` records with waypoints, heading, speed, vessel type classification. Update interval: 30s.
- [ ] **BE12-S01-T03** — Create ACLED ingestor in `services/geo/acled.py`. Fetch conflict incidents from ACLED API: event type, coordinates, fatalities, actors, notes. Transform to `GeoEvent` records with severity derived from fatality count and event type.
- [ ] **BE12-S01-T04** — Create seismic ingestor in `services/geo/seismic.py`. Fetch earthquake events from USGS API: magnitude, depth, coordinates, timestamp. Transform to `GeoEvent` records with severity derived from magnitude (< 4.0 → low, 4-6 → medium, 6-7 → high, 7+ → critical).
- [ ] **BE12-S01-T05** — Create `GeoEvent` normalization layer. All geo source ingestors produce `GeoEvent` objects matching `geo.types.ts` exactly: `id`, `type`, `title`, `description`, `coords { latitude, longitude, altitude? }`, `severity`, `entities[]`, `linkedTrendIds[]`, `linkedMarketIds[]`, `timestamp`. Run through entity linker from BE04.

## Story 12.2: POI Clustering

> Spatial clustering and POI management endpoints.

- [ ] **BE12-S02-T01** — Implement spatial clustering in `services/geo/poi.py`. Use DBSCAN (scikit-learn) with haversine distance metric. Cluster geographically proximate GeoEvents (epsilon = 50km, min_samples = 3). Each cluster becomes a POI.
- [ ] **BE12-S02-T02** — Calculate POI attributes: `name` (from dominant entity in cluster or AI-generated from event titles), `severity` (max severity of member events), `velocity` (event arrival rate), `eventCount` (24h), `centroid` (geographic centroid of member events). Update on each clustering tick.
- [ ] **BE12-S02-T03** — Implement POI-to-market linking. Extract entities from POI → match against MarketContract entities. Populate `linkedMarketIds` and `linkedTrendIds` on POI records. Same entity/semantic matching as BE06/BE07.
- [ ] **BE12-S02-T04** — Create geo API endpoints: `GET /api/geo/events` — accept `GeoBounds { north, south, east, west }` and `layers: list[LayerType]` as query params. Return `ApiResponse[list[GeoEventResponse]]` filtered by bounds and layer type. `GET /api/geo/pois` — return `ApiResponse[list[POIResponse]]` within bounds.

---

# Epic BE13: Anomaly Detection (P1)

> Statistical and pattern-based anomaly detection across events, sentiment, and markets.
> **Depends on:** BE04 (event data), BE05 (sentiment data), BE07 (market data).
> **Blocks:** None (P1 feature).

## Story 13.1: Statistical Detection

> Pluggable anomaly detectors for different signal types.

- [ ] **BE13-S01-T01** — Create anomaly detection framework in `services/detect/engine.py`. Base `AnomalyDetector` class with `async detect(window: timedelta) → list[AnomalySignal]`. Registry pattern: register detector implementations, run all on configurable schedule (every 60s).
- [ ] **BE13-S01-T02** — Implement event frequency spike detector. For each active trend: compute Z-score of current event rate vs. rolling 24h baseline. Z-score > 3.0 → spike anomaly. Include: trend ID, current rate, baseline rate, Z-score, and timestamp window.
- [ ] **BE13-S01-T03** — Implement sentiment reversal detector. For each SentimentQuestion: detect when score changes by > 15 points within 1 hour. Also detect direction flip (rising → falling or vice versa) with high confidence. Include: question ID, old score, new score, direction change, tweet volume during window.
- [ ] **BE13-S01-T04** — Implement market probability delta detector. For each MarketContract: detect when probability changes by > 10 points within 30 minutes, especially when correlated with a concurrent event spike or sentiment shift. Include: market ID, probability change, correlated events.
- [ ] **BE13-S01-T05** — Implement coordinated activity detector. For each SentimentQuestion: analyze account clustering in recent tweet set. If > 60% of weighted sentiment comes from accounts with high follow-graph overlap or synchronized posting times → flag as potential astroturfing. Include: question ID, cluster size, overlap score.
- [ ] **BE13-S01-T06** — Create signal card output. Each detected anomaly → structured signal report: `{ type, severity, title, description, affectedEntities, relatedTrends, relatedMarkets, confidence, detectedAt }`. Publish as feed items (type: `alert`) and optionally trigger alerts via BE11.

---

# Epic BE14: Infrastructure & DevOps (P0/Ops)

> Docker, background workers, CI/CD, monitoring, rate limiting, and security.
> **Depends on:** BE01 (project scaffold).
> **Blocks:** Nothing (runs in parallel with feature development).

## Story 14.1: Docker & Deployment

> Containerization and deployment configuration.

- [ ] **BE14-S01-T01** — Create `Dockerfile` with multi-stage build. Stage 1: install Poetry + dependencies. Stage 2: production image (Python 3.12-slim, copy only installed packages + app code). Expose port 8000. Entrypoint: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- [ ] **BE14-S01-T02** — Create `docker-compose.yml` with services: `api` (FastAPI app), `postgres` (PostgreSQL 16 with volume mount), `redis` (Redis 7 with persistence), `worker` (background task worker sharing app codebase). Network: shared bridge.
- [ ] **BE14-S01-T03** — Create `docker-compose.dev.yml` extending base. Add: uvicorn `--reload` for hot-reload, debug port (5678 for debugpy), PostgreSQL port exposed (5432), Redis port exposed (6379), volume mount for live code changes.
- [ ] **BE14-S01-T04** — Configure Alembic to run `upgrade head` automatically on API service startup in production (via entrypoint script). In development: manual `make migrate` command.
- [ ] **BE14-S01-T05** — Create deployment configuration for cloud hosting (Fly.io, Railway, or Render). Include: Procfile or fly.toml, environment variable management, health check configuration, auto-scaling rules (min 1, max 4 instances).

## Story 14.2: Background Workers

> Task queue for ingestion, classification, scoring, and alert evaluation.

- [ ] **BE14-S02-T01** — Set up background task queue. Choose Celery (with Redis broker) or ARQ (lightweight, async-native). Configure task routing: separate queues for `ingestion`, `classification`, `scoring`, `alerts`. Create `workers/` module with shared app configuration.
- [ ] **BE14-S02-T02** — Create ingestion worker. Runs all registered ingestors (Twitter, Reddit, News, Polymarket, Kalshi) on configurable intervals. Twitter: 15s, Reddit: 60s, News: 120s, Markets: 60s. Each ingestor run is an independent task with error isolation.
- [ ] **BE14-S02-T03** — Create classification worker. Processes tweet classification batches. Poll Redis queue every 5-10 seconds (matching binding decision). Dequeue up to 50 unclassified tweets per batch. Run LLM classification with concurrency limit (semaphore, max 5 parallel calls). Persist results. Trigger score recalculation.
- [ ] **BE14-S02-T04** — Create scoring worker. Recalculates on each tick (30s): sentiment scores for all active questions, trend velocities and lifecycle transitions, market-trend linkages, market derived fields (delta, change_24h). Publishes updates to Redis pub/sub channels.
- [ ] **BE14-S02-T05** — Create alert evaluation worker. Runs every 10 seconds. Iterates all enabled `AlertConfig` records. Evaluates trigger conditions against current data. Creates `Alert` records and publishes to `alert:triggered` channel on trigger.

## Story 14.3: Monitoring & Security

> Logging, rate limiting, metrics, and API key management.

- [ ] **BE14-S03-T01** — Configure structured logging with `structlog`. JSON output in production, colored console in development. Log fields: `request_id`, `user_id`, `method`, `path`, `status_code`, `duration_ms`, `level`. Log all API requests, background task execution, and error events.
- [ ] **BE14-S03-T02** — Implement rate limiting middleware using `slowapi` or custom Redis-based limiter. Per-user, per-tier limits: free → 100 requests/min, pro → 500 requests/min, quant → 2000 requests/min. Return 429 with `Retry-After` header when exceeded. Separate limits for WebSocket messages.
- [ ] **BE14-S03-T03** — Add Prometheus metrics endpoint `GET /metrics`. Expose: HTTP request count/latency by endpoint, error rates by status code, WebSocket active connections, Redis pub/sub message throughput, background worker queue depths, database connection pool utilization.
- [ ] **BE14-S03-T04** — Implement API key management for Quant tier programmatic access. `POST /api/auth/api-keys` — generate API key (separate from JWT). `GET /api/auth/api-keys` — list keys. `DELETE /api/auth/api-keys/{id}` — revoke. API keys authenticate via `X-API-Key` header (alternative to Bearer JWT). Rate limited separately.

---

## Summary

| Epic | Description | Stories | Tasks | Priority |
|------|-------------|---------|-------|----------|
| BE01 | Foundation (FastAPI scaffold, DB, Redis, Docker, tests) | 4 | 20 | P0 |
| BE02 | Auth & Users (JWT, refresh tokens, tier gating) | 3 | 11 | P0 |
| BE03 | Data Models & Schemas (all domain ORM + Pydantic) | 5 | 15 | P0 |
| BE04 | Feed Ingestion Pipeline (ingestors, normalization, enrichment) | 4 | 14 | P0 |
| BE05 | Sentiments Engine (collection, LLM classification, scoring) | 4 | 16 | P0 |
| BE06 | Trend Engine (detection, velocity, lifecycle, market linkage) | 3 | 9 | P0 |
| BE07 | Market Data & Correlation (Polymarket/Kalshi, entity matching) | 2 | 9 | P0 |
| BE08 | REST API (all endpoints matching DataProvider contract) | 6 | 18 | P0 |
| BE09 | WebSocket Streaming (real-time push, Redis pub/sub) | 2 | 11 | P0 |
| BE10 | Search Service (PostgreSQL FTS, autocomplete) | 1 | 5 | P0 |
| BE11 | Alert Engine (evaluation, delivery, deduplication) | 2 | 12 | P0 |
| BE12 | Geo/OSINT Layer (ADS-B, AIS, ACLED, POI clustering) | 2 | 9 | P1 |
| BE13 | Anomaly Detection (statistical spike/reversal detection) | 1 | 6 | P1 |
| BE14 | Infrastructure & DevOps (CI/CD, monitoring, rate limiting) | 3 | 14 | P0/Ops |
| **Total** | | **42** | **169** | |

## Binding Decisions Reflected

These backend decisions are locked and match the frontend contract:

1. **Sentiment scoring:** Weighted ratio `YES/(YES+NO)` — NOT Bayesian (BE05-S03-T01)
2. **Classification delivery:** Batch every 5-10s — NOT real-time streaming (BE05-S02-T03)
3. **LLM provider:** Anthropic Claude (primary), Gemini Pro (fallback) (BE05-S02-T01/T02)
4. **Auth:** Custom JWT with refresh rotation, 15min access / 7d refresh (BE02-S02)
5. **Tier gating:** free < pro < quant with specific feature limits per tier (BE02-S03)
6. **Feed ranking:** 70% velocity + 30% recency for "For You" mode (BE04-S04-T03)
7. **API response format:** `{ data, status, timestamp }` wrapper on all endpoints (BE08-S01-T01)
8. **WebSocket format:** `{ type, payload, timestamp, sequenceId }` matching `WSMessage` (BE09-S01-T03)
9. **WS batching:** 100ms server-side flush, 5-10s sentiment batch delivery (BE09-S01-T04, BE09-S02-T04)
10. **Pydantic schemas:** Field-for-field match with frontend TypeScript types, camelCase output (BE03)
