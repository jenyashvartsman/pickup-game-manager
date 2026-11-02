# Task 014 — Main Dashboard Page

## Objective
Build the Main Dashboard page — the app's home screen. Shows three sections: upcoming games this week, recent game results, and a top-player leaderboard. All data loaded from the `GET /dashboard` endpoint.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/features/dashboard/pages/dashboard-page/ |
| Create | apps/web/src/app/features/dashboard/components/upcoming-games-card/ |
| Create | apps/web/src/app/features/dashboard/components/recent-results-card/ |
| Create | apps/web/src/app/features/dashboard/components/top-players-card/ |
| Create | apps/web/src/app/features/dashboard/services/dashboard.service.ts |
| Create | apps/web/src/app/features/dashboard/dashboard.routes.ts |
| Modify | apps/web/src/app/app.routes.ts (default route → dashboard) |

## Acceptance Criteria

- [ ] `/` redirects to `/dashboard` and loads the dashboard page
- [ ] Upcoming Games section shows the next games (up to 7 days), each linking to `/games/:id`
- [ ] Recent Results section shows the last 5 completed games with scores
- [ ] Top Players section shows the top 5 players by goals with goals + assists totals, each linking to `/players/:id`
- [ ] Page shows empty-state messages when no data is available
- [ ] DashboardService uses a signal for the dashboard summary response
- [ ] Unit tests for DashboardService
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 009, Task 008

## Notes
_Fill in after execution._
