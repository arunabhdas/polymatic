# PolyMatic — Backend Task Breakdown

**Version:** 2.0
**Date:** March 4, 2026
**Stack:** Python 3.12+ · FastAPI · PostgreSQL · Redis · Celery/ARQ
**Format:** Epic → Story → Task

---

## Task ID Convention

```
BE{epic}-S{story}-T{task}
Example: BE01-S02-T03 = Backend Epic 1, Story 2, Task 3
```

## Priority Legend

- **P0** = Must ship (MVP). Epics BE01–BE10.
- **P1** = Ship if time permits. Epics BE11–BE15.
- **P0/Polish** = Final pass. Epic BE16.

## Status Legend

- `[ ]` = Not started
- `[🏗️]` = In progress
- `[🚀]` = TBD
- `[⏰]` = Defer
- `[✅]` = Complete
- `[🛑]` = Blocked

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

# Epic BE01: Foundation (P0)

> FastAPI scaffold, database, Redis, Docker, test infrastructure, REST framework wrapper, and WebSocket server setup.
> **Corresponds to:** Frontend Epic 1 (Foundation)

## Story 1.1: FastAPI Scaffold
- [ ] **BE01-S01-T01** — Initialize FastAPI project with Poetry (or uv). Python 3.12+, `pyproject.toml` with strict dependency pinning. Create `src/` layout with `app/main.py` as entrypoint.
- [ ] **BE01-S01-T02** — Create project directory structure: `app/` (main, config), `routers/` (API route modules), `services/` (business logic), `models/` (SQLAlchemy ORM), `schemas/` (Pydantic), `core/` (auth, deps, middleware), `workers/` (background tasks), `tests/`.
- [ ] **BE01-S01-T03** — Set up settings management with `pydantic-settings`. `BaseSettings` class loading from `.env`: DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, ANTHROPIC_API_KEY, TWITTER_BEARER_TOKEN, POLYMARKET_API_URL, KALSHI_API_URL, CORS_ORIGINS. Create `.env.example`.
- [ ] **BE01-S01-T04** — Configure middleware stack: CORS (allow frontend origin `http://localhost:5173`), request-ID injection (`X-Request-ID` header), request timing (log duration), and GZip compression.
- [ ] **BE01-S01-T05** — Create `GET /health` endpoint returning `{ "status": "ok", "database": bool, "redis": bool, "version": str, "timestamp": ISO8601 }`. Check DB and Redis connectivity.

## Story 1.2: Database Setup
- [ ] **BE01-S02-T01** — Install and configure SQLAlchemy 2.0 with async engine (`asyncpg` driver). Create `core/database.py` with `create_async_engine`, `async_sessionmaker`, and `AsyncSession` type.
- [ ] **BE01-S02-T02** — Set up Alembic for async migrations. Configure `alembic.ini` and `env.py` with auto-generation from SQLAlchemy models. Use `asyncpg` driver in migration context.
- [ ] **BE01-S02-T03** — Create `models/base.py` — Base model class with `id` (UUID, server-default), `created_at` (UTC timestamp, server-default), `updated_at` (UTC timestamp, auto-update). All models inherit from this.
- [ ] **BE01-S02-T04** — Configure connection pooling: `pool_size=10`, `max_overflow=20`, `pool_recycle=3600`, `pool_pre_ping=True`. Tune for expected concurrency.
- [ ] **BE01-S02-T05** — Create initial Alembic migration (empty baseline schema). Verify `alembic upgrade head` and `alembic downgrade base` both work cleanly.
- [ ] **BE01-S02-T06** — Implement `get_db` async dependency for FastAPI. Yields `AsyncSession` with proper context management (commit on success, rollback on exception, close always).

## Story 1.3: Redis & Caching
- [ ] **BE01-S03-T01** — Install and configure `redis[hiredis]` with async support. Create `core/redis.py` with connection factory, async `get_redis` dependency.
- [ ] **BE01-S03-T02** — Create Redis connection manager with health check (`PING`), automatic reconnection on failure, and configurable connection pool size.
- [ ] **BE01-S03-T03** — Implement cache utility layer: `cache_get(key)`, `cache_set(key, value, ttl)`, `cache_delete(key)`, `cache_delete_pattern(pattern)`. JSON serialization for complex objects. Default TTL: 60s.
- [ ] **BE01-S03-T04** — Set up Redis pub/sub infrastructure. Create `PubSubManager` class with `publish(channel, message)` and `subscribe(channel, callback)` methods. Channels match WSMessageType: `feed:new_items`, `sentiment:batch`, `trend:update`, `market:price_update`, `alert:triggered`, `geo:event`.
- [ ] **BE01-S03-T05** — Create domain-specific cache invalidation helpers. E.g., `invalidate_feed_cache()`, `invalidate_trend_cache()`. Called by services after data mutations.

## Story 1.4: Testing & Dev Tooling
- [ ] **BE01-S04-T01** — Configure `pytest` with `pytest-asyncio` (auto mode), `httpx` for `AsyncClient` test client, fixtures for DB session (transaction-scoped rollback), Redis mock, and FastAPI `TestClient`.
- [ ] **BE01-S04-T02** — Create test database setup: use separate test database, apply Alembic migrations before test suite, wrap each test in a transaction that rolls back on teardown.
- [ ] **BE01-S04-T03** — Set up test data factories (using `factory-boy` or manual builders) for all domain models: User, FeedItem, SentimentQuestion, ClassifiedTweet, Trend, MarketContract, AlertConfig, Alert, GeoEvent.
- [ ] **BE01-S04-T04** — Configure pre-commit hooks: `ruff` (linting + formatting), `mypy` (strict type checking, no `Any`), `ruff format` (code formatting). Add `Makefile` with `make lint`, `make test`, `make migrate` targets.

## Story 1.5: REST API Response Framework
- [ ] **BE01-S05-T01** — Create `ApiResponse[T]` generic response model in `schemas/api.py`: `{ data: T, status: Literal["success"], timestamp: str }`. Create response helper: `def success_response(data: T) -> ApiResponse[T]` that auto-populates timestamp with current UTC ISO8601.
- [ ] **BE01-S05-T02** — Create `PaginatedResponse[T]` model: `{ data: list[T], page: int, limit: int, total: int, hasMore: bool }`. `hasMore = (page * limit) < total`. Create pagination utility that accepts SQLAlchemy query, page, limit → returns `PaginatedResponse`.
- [ ] **BE01-S05-T03** — Create `ErrorResponse` model: `{ status: Literal["error"], code: str, message: str, details: dict | None }`. Implement FastAPI exception handlers for HTTP errors (400, 401, 403, 404, 422, 429, 500). All errors return `ErrorResponse` JSON.

## Story 1.6: WebSocket Server Foundation
- [ ] **BE01-S06-T01** — Create WebSocket endpoint `ws://localhost:8000/ws` in `routers/websocket.py`. Validate token from query param. Implement `ConnectionManager` class. Track active connections.
- [ ] **BE01-S06-T02** — Implement server-side message batching (100ms flush) and heartbeat mechanism (`system:ping` every 30s).
- [ ] **BE01-S06-T03** — Implement Redis Pub/Sub Bridge: subscriber forwards messages to connected WS clients, utilizing the fast serialization `WSMessage` layer.

## Story 1.7: Infrastructure & DevOps
- [ ] **BE01-S07-T01** — Create `Dockerfile` with multi-stage build. Create `docker-compose.yml` (api, postgres, redis, worker) and `docker-compose.dev.yml` for local hot-reload.
- [ ] **BE01-S07-T02** — Configure background task queue (Celery/ARQ) and create `workers/` module infrastructure.
- [ ] **BE01-S07-T03** — Configure structured logging with `structlog` and set up API rate limiting middleware using `slowapi` or Redis.

---

# Epic BE02: Data Models & Schemas (P0)

> All domain SQLAlchemy ORM models and Pydantic response schemas.
> **Corresponds to:** Frontend Epic 2 (Mock Data Engine)

## Story 2.1: Feed Models
- [ ] **BE02-S01-T01** — Create `FeedItem` model: `id`, `type`, `title`, `summary`, `content`, `category`, `severity`, `velocity`, `timestamp`, `source`, `source_handle`, `source_display_name`, `sentiment_stance`, `confidence`, `cluster_id`, `geo_lat`, `geo_lng`.
- [ ] **BE02-S01-T02** — Create `FeedItemResponse` Pydantic schema exactly matching `feed.types.ts → FeedItem` (with entities, related trends, related markets, media). Association tables: `feed_item_entities`, `feed_item_trends`, `feed_item_markets`, `feed_item_media`.
- [ ] **BE02-S01-T03** — Create `FeedCluster` model. Create `FeedFiltersSchema` and `FeedParamsSchema` matching frontend structs.

## Story 2.2: Sentiment Models
- [ ] **BE02-S02-T01** — Create `SentimentQuestion` model: `id`, `text`, `category`, `yes_count`, `no_count`, `score`, `confidence`, `confidence_level`, `direction`, `market_probability`, `market_delta`, `tweet_volume`, `stance_breakdown`, `sparkline_data`.
- [ ] **BE02-S02-T02** — Create `ClassifiedTweet` model: `id`, `question_id`, `account_id`, `account_handle`, `account_display_name`, `account_credibility`, `content`, `stance`, `confidence_score`, `engagement_weight`, `recency_decay`, `diversity_factor`, `timestamp`.
- [ ] **BE02-S02-T03** — Create `AggregateScore` model and matching Pydantic schemas (`SentimentDetailResponse`, `PredictionBriefResponse`).

## Story 2.3: Trend Models
- [ ] **BE02-S03-T01** — Create `Trend` model: `id`, `hashtag`, `name`, `category`, `lifecycle`, `velocity_current`, `velocity_delta`, `velocity_peak`, `velocity_history`, `event_count`, `sparkline_data`. Association tables: `trend_markets`, `trend_entities`.
- [ ] **BE02-S03-T02** — Create `Entity` model: `id`, `name`, `type`.
- [ ] **BE02-S03-T03** — Create `TrendResponse` Pydantic schema with nested `VelocityScore`.

## Story 2.4: Market Models
- [ ] **BE02-S04-T01** — Create `MarketContract` model: `id`, `question_text`, `title`, `platform`, `probability`, `probability_24h_ago`, `change_24h`, `delta`, `volume`, `category`, `sentiment_score`, `sentiment_delta`.
- [ ] **BE02-S04-T02** — Create `PricePoint` model for history tracking.
- [ ] **BE02-S04-T03** — Create `MarketContractResponse` schema with nested price history and sparkline data.

## Story 2.5: Alert & Geo Models
- [ ] **BE02-S05-T01** — Create `AlertConfig` and `Alert` models for background evaluation logging.
- [ ] **BE02-S05-T02** — Create `GeoEvent`, `POI`, and `MotionTrack` models matching frontend geo types.

---

# Epic BE03: Home Feed Engine (P0)

> Data source ingestors, normalization, enrichment, and feed endpoints.
> **Corresponds to:** Frontend Epic 3 (Home Feed)

## Story 3.1: Ingestor Framework
- [ ] **BE03-S01-T01** — Create `BaseIngestor` abstract class (`async connect()`, `async poll()`).
- [ ] **BE03-S01-T02** — Implement `TwitterIngestor` and `RedditIngestor`.
- [ ] **BE03-S01-T03** — Implement `NewsIngestor` (GDELT / News APIs). Build corresponding background worker tasks.

## Story 3.2: Normalization Layer
- [ ] **BE03-S02-T01** — Create normalization pipeline converting raw source events to unified `FeedItem`.
- [ ] **BE03-S02-T02** — Implement NER service (spaCy or LLM) to extract named entities.
- [ ] **BE03-S02-T03** — Implement geocoding cache for entities.

## Story 3.3: Enrichment Pipeline
- [ ] **BE03-S03-T01** — Topic classification — assign `Category`.
- [ ] **BE03-S03-T02** — Severity scoring based on source credibility, corroboration, and keywords.
- [ ] **BE03-S03-T03** — Entity resolution and deduplication.

## Story 3.4: Feed Clustering
- [ ] **BE03-S04-T01** — Implement event clustering via entity overlap and semantic similarity.
- [ ] **BE03-S04-T02** — Select lead item per cluster and manage `FeedCluster` mappings.
- [ ] **BE03-S04-T03** — Implement feed ranking blending velocity and recency.

## Story 3.5: Feed Endpoints & Streaming
- [ ] **BE03-S05-T01** — `GET /api/feed` — Paginated list conforming to `FeedParams` filters.
- [ ] **BE03-S05-T02** — `GET /api/feed/{id}` — Full single FeedItem detail.
- [ ] **BE03-S05-T03** — Publish `feed:new_items` to Redis WS pub/sub on ingestion.

---

# Epic BE04: Trend Engine (P0)

> Trend detection, clustering, velocity lifecycle, and endpoints.
> **Corresponds to:** Frontend Epic 4 (Trending Bar)

## Story 4.1: Trend Detection
- [ ] **BE04-S01-T01** — Clustered trend generation using entity overlap on enriched events.
- [ ] **BE04-S01-T02** — Hashtag generation using dominant hashtags or LLM label creation.
- [ ] **BE04-S01-T03** — Assign proper category based on dominant entities.

## Story 4.2: Velocity & Lifecycle
- [ ] **BE04-S02-T01** — Implement velocity scoring tracking rolling rates of event entry.
- [ ] **BE04-S02-T02** — Lifecycle state machine: `emerging` → `trending` → `peaking` → `cooling`.
- [ ] **BE04-S02-T03** — Implement trend retirement (archive non-active trends). Create background scoring worker.

## Story 4.3: Trend Endpoints & Streaming
- [ ] **BE04-S03-T01** — `GET /api/trends` — Return current active trends sorted by velocity descending.
- [ ] **BE04-S03-T02** — Publish `trend:update` socket events periodically via Redis pub/sub.

---

# Epic BE05: Sentiments Engine (P0)

> Tweet evaluation, automated LLM stance testing, and weighted scoring.
> **Corresponds to:** Frontend Epic 5 (Sentiments & Predictions)

## Story 5.1: Tweet Collection
- [ ] **BE05-S01-T01** — Map prediction questions to search queries and execute fetches.
- [ ] **BE05-S01-T02** — Deduplicate tweets, filter based on engagement threshold.
- [ ] **BE05-S01-T03** — Handle account reputation parsing based on predefined OSINT seeds.

## Story 5.2: Stance Classification
- [ ] **BE05-S02-T01** — Implement LLM classifier (Claude primary, Gemini fallback).
- [ ] **BE05-S02-T02** — Async queue batching. Process up to 50 tweets concurrently via classification worker.

## Story 5.3: Scoring & Aggregation
- [ ] **BE05-S03-T01** — Weighted ratio scoring formula incorporating account credibility, confidence, and diversity.
- [ ] **BE05-S03-T02** — Confidence and sentiment direction calculation.
- [ ] **BE05-S03-T03** — Echo-chamber tracking and penalization.

## Story 5.4: Prediction Generation
- [ ] **BE05-S04-T01** — Generate structured `PredictionBriefResponse` via LLM summary generation.
- [ ] **BE05-S04-T02** — Add historical accuracy tracking compared against correct market resolutions.

## Story 5.5: Sentiment Endpoints & Streaming
- [ ] **BE05-S05-T01** — `GET /api/sentiments` and `GET /api/sentiments/{id}` including nested drill-down.
- [ ] **BE05-S05-T02** — `GET /api/sentiments/{id}/prediction` to serve the AI Prediction Brief.
- [ ] **BE05-S05-T03** — Publish `sentiment:batch` via WS bridge matching frontend polling timing.

---

# Epic BE06: Markets & Calibration Engine (P0)

> Ingest prediction market data and execute correlations.
> **Corresponds to:** Frontend Epic 6 (Markets & Calibration)

## Story 6.1: Market Data Ingestion
- [ ] **BE06-S01-T01** — Polymarket and Kalshi REST API clients fetching active contracts.
- [ ] **BE06-S01-T02** — Normalize contracts and track historical `PricePoint` arrays.
- [ ] **BE06-S01-T03** — Calculate delta, `change_24h`, and internal `sentiment_delta`.

## Story 6.2: Market Correlation
- [ ] **BE06-S02-T01** — Extract NER entities from Market Contracts.
- [ ] **BE06-S02-T02** — Calculate semantic embeddings cosine similarity between market questions and inbound OSINT.
- [ ] **BE06-S02-T03** — Aggregate spatial/temporal match scores to produce relevance ranking per event.

## Story 6.3: Trend Market Linkage
- [ ] **BE06-S03-T01** — Link trends bidirectionally to correlated markets via similar entity presence.

## Story 6.4: Market Endpoints & Streaming
- [ ] **BE06-S04-T01** — `GET /api/markets` (paginated list) and `GET /api/markets/{id}`.
- [ ] **BE06-S04-T02** — Publish `market:price_update` over real-time WS.

---

# Epic BE07: Topic Pages & Discovery (P0)

> APIs supporting the deep-dive topic and entity discovery UI.
> **Corresponds to:** Frontend Epic 7 (Topic Pages & Discovery)

> *Note: This Epic is primarily served dynamically through combinations of Feed, Trend, and Market endpoints filtered by category or entity on the frontend. Explicit composite routes may be added here during implementation as needed.*

---

# Epic BE08: Search Service (P0)

> PostgreSQL Full-Text index and global autocomplete.
> **Corresponds to:** Frontend Epic 8 (Right Panel & Global Search)

## Story 8.1: Full-Text Search
- [ ] **BE08-S01-T01** — Add PostgreSQL GIN/Trigram indexes to all text fields.
- [ ] **BE08-S01-T02** — Implement multi-domain `ts_rank` text search engine across all indices.
- [ ] **BE08-S01-T03** — Create autocomplete pipeline for <50ms keystroke responses via Redis/pg_trgm.

## Story 8.2: Search Endpoints
- [ ] **BE08-S02-T01** — `GET /api/search` yielding grouped responses (Trends, Markets, Sentiments, Feed).
- [ ] **BE08-S02-T02** — `GET /api/search/autocomplete` for fast prefix matching.

---

# Epic BE09: AI Topic Explainer (P0)

> Background anomaly detection and summarization features.
> **Corresponds to:** Frontend Epic 9 (AI Topic Explainer)

## Story 9.1: Statistical Anomaly Detection
- [ ] **BE09-S01-T01** — Create pluggable anomaly detector to flag statistical Z-score spikes.
- [ ] **BE09-S01-T02** — Detect sentiment reversals and sudden market probability shifts.
- [ ] **BE09-S01-T03** — Track coordinated astroturf activity, surface as AI insights.

---

# Epic BE10: Auth & Users (P0)

> JWT, tier gating, preference storage.
> **Corresponds to:** Frontend Epic 10 (Auth & Onboarding)

## Story 10.1: User Model & Registration
- [ ] **BE10-S01-T01** — Create `User` table, complete with `passlib[bcrypt]` security wrapper.
- [ ] **BE10-S01-T02** — Implement user registration (email uniqueness, password hashing).

## Story 10.2: JWT Authentication
- [ ] **BE10-S02-T01** — Issue JWT pairs (15m access, 7d refresh) matching `AuthResponse` schema.
- [ ] **BE10-S02-T02** — Track refresh rotation state via Redis revocation list.

## Story 10.3: Tier Gating
- [ ] **BE10-S03-T01** — Implement `require_tier(UserTier)` FastAPI dependencies.
- [ ] **BE10-S03-T02** — Perform dynamic Pydantic dump exclusions to truncate payloads for `free` users versus `quant` users.

## Story 10.4: Auth Endpoints
- [ ] **BE10-S04-T01** — `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/refresh`.
- [ ] **BE10-S04-T02** — `GET /api/auth/me` and `PUT /api/auth/preferences`.

---

# Epic BE11: Geo View Layer (P1)

> 3D globe and geostreaming ingestion.
> **Corresponds to:** Frontend Epic 11 (Geo View)

## Story 11.1: Geospatial Data Sources
- [ ] **BE11-S01-T01** — ADS-B ingestor targeting flight API, creating `MotionTrack` records.
- [ ] **BE11-S01-T02** — AIS ingestor for maritime vessel data.
- [ ] **BE11-S01-T03** — ACLED & Seismic data sources for background event tracking.

## Story 11.2: POI Clustering
- [ ] **BE11-S02-T01** — Cluster events using DBSCAN into geographically grouped points of interest (POI).
- [ ] **BE11-S02-T02** — Aggregate severity and velocity bounding boxes to cluster POIs.

## Story 11.3: Geo Endpoints & Streaming
- [ ] **BE11-S03-T01** — `GET /api/geo/events` via bounds bounding box calculation.
- [ ] **BE11-S03-T02** — Real-time telemetry broadcast over WS via `ws:geo:event` channel.

---

# Epic BE12: Alerts & Notifications (P1)

> Delivery engine for real-time state alerts.
> **Corresponds to:** Frontend Epic 12 (Alerts & Notifications)

## Story 12.1: Alert Evaluation
- [ ] **BE12-S01-T01** — Create evaluator scheduled background worker checking conditionals (sentiment crosses threshold).
- [ ] **BE12-S01-T02** — Construct triggers: `velocity_spike`, `market_delta`, `new_trend`, `poi_severity`.

## Story 12.2: Alert Delivery
- [ ] **BE12-S02-T01** — Real-time WebSocket delivery logic matching `WSMessageType.alert:triggered`.
- [ ] **BE12-S02-T02** — Email summary engine with template digests (SendGrid / SES).
- [ ] **BE12-S02-T03** — JSON Webhook outbound delivery queue with exponential backoff (for Quant tier).

## Story 12.3: Alert Endpoints
- [ ] **BE12-S03-T01** — `GET /api/alerts/configs` & `POST /api/alerts/configs` for managing alert thresholds.
- [ ] **BE12-S03-T02** — `GET /api/alerts` reading active unseen alerts, with a `POST /dismiss` toggle.

---

# Epic BE13: Watchlist & Collections (P1)

> API storage for saved dashboard combinations.
> **Corresponds to:** Frontend Epic 13 (Watchlist & Collections)

> *Backend implementation pending detailed scoping.*

---

# Epic BE14: Responsive & Mobile Polish (P1)

> Viewport adjustments and touch UX.
> **Corresponds to:** Frontend Epic 14 (Responsive & Mobile Polish)

> *This is primarily a frontend Epic. No net-new backend service architecture resides here.*

---

# Epic BE15: Admin & Curation Tools (P1)

> Tooling to tweak internal ranking thresholds.
> **Corresponds to:** Frontend Epic 15 (Admin & Curation Tools)

> *Backend implementation pending detailed scoping.*

---

# Epic BE16: Final Polish & Launch Prep (P0/Polish)

> Readiness, server security lockdown, and load-test preparation.
> **Corresponds to:** Frontend Epic 16 (Final Polish & Launch)

## Story 16.1: Security & Optimization
- [ ] **BE16-S01-T01** — Add Prometheus metrics endpoint `GET /metrics`.
- [ ] **BE16-S01-T02** — Add API Key support for programmatic Quant tier data access.
- [ ] **BE16-S01-T03** — Performance review of all slow `EXPLAIN ANALYZE` queries across the full text indices.
