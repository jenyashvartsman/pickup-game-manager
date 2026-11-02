# Task 008 — Dashboard Stats API

## Objective
Implement a read-only API endpoint that returns the aggregated data needed to power the Main Dashboard: upcoming games (next 7 days), recent results (last 5 completed games), and top-player stat summaries (goals + assists leaderboard). No new tables — queries only.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/modules/dashboard/dashboard.module.ts |
| Create | apps/api/src/modules/dashboard/dashboard.controller.ts |
| Create | apps/api/src/modules/dashboard/dashboard.service.ts |
| Modify | libs/shared-types/src/index.ts (export DashboardSummary DTO) |

## Acceptance Criteria

- [ ] `GET /dashboard` returns: `upcomingGames[]`, `recentResults[]`, `topPlayers[]`
- [ ] `upcomingGames` contains games with status `scheduled` within the next 7 days, ordered by date asc
- [ ] `recentResults` contains the last 5 completed games with scores, ordered by date desc
- [ ] `topPlayers` contains the top 5 players by total goals, with goals + assists totals
- [ ] All data comes from efficient TypeORM queries (no N+1 queries)
- [ ] Unit tests for DashboardService query methods
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 007

## Notes
_Fill in after execution._
