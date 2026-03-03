# PolyMatic Project Memory

## Project Status
- **Phase 1 (Interview):** Complete — all 40+ design decisions resolved
- **Phase 2 (Plan):** Complete — IMPLEMENTATION-PLAN.md and TASKS.md written
- **Phase 3 (Implementation):** Not started
- **Current state:** Pre-implementation. No frontend code exists yet. `polymatic-frontend-webapp/` is empty.

## Repository Structure
```
polymatic/
├── PRD.md              # Product requirements v2.2 (36 KB, 655 lines)
├── PROMPT.md           # Implementation brief (12 KB, 200 lines)
├── PLAN.md             # Interview questions + resolved answers (58 KB)
├── CLAUDE.md           # Project instructions for Claude
├── MEMORY.md           # This file
├── docs/               # 53 planning screenshots (plan_1–33.png + others)
├── mocks/              # 7 high-fidelity UI mockups (mock_1–7.png)
├── spec/               # Empty — reserved for specs
├── tasks/
│   ├── IMPLEMENTATION-PLAN.md  # 16-section architecture plan (1621 lines)
│   └── TASKS.md                # 16 epics, 49 stories, 217 tasks (671 lines)
└── polymatic-frontend-webapp/  # Empty — the app will be built here
```

## Key Decisions Log
See `tasks/IMPLEMENTATION-PLAN.md` Section 16 for the full binding constraints table.
See `CLAUDE.md` for the summarized list.

## User Preferences
- Prefers interactive multi-choice interview format for decision-making
- Wants comprehensive documentation before implementation begins
- Values production-grade quality: no shortcuts, no placeholders
- Brand identity: PolyMatic (evolved from WORLDVIEW)
- Dark + light theme support (not dark-only)
- Wide device range including low-end laptops
- CesiumJS from day one (ambitious geo strategy)

## Build Order (Recommended)
1. E01: Foundation (scaffold, theming, shell, routing, base components)
2. E02: Mock Data Engine (types, providers, generators, hooks)
3. E03 + E04 + E05 in parallel (Home Feed, Trending Bar, Sentiments Engine)
4. E06 + E08 in parallel (Search, Markets Panel)
5. E07: Topic Pages
6. E09 + E10 in parallel (Alerts, Auth & Onboarding)
7. E11–E15: P1 features (if time permits)
8. E16: Polish pass

## Notes
- The mocks in `mocks/` show the older WORLDVIEW iteration with heavy geo focus. The v2.2 PRD repositioned the product to be feed+sentiments first. Mocks are reference for aesthetic DNA only, not layout.
- Task IDs follow the convention `E{epic}-S{story}-T{task}` (e.g., E01-S02-T03).
- Estimated build time: ~31 days across 14 phases.
