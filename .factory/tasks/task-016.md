# Task 016 — Polish: Empty States, Error States & HTTP Interceptor

## Objective
Add polish across the app: meaningful empty states for all list views (no players, no games, no stats), a global HTTP error interceptor that shows user-facing error messages on API failures, and a loading skeleton pattern for async data.

## Context

- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/core/interceptors/http-error.interceptor.ts |
| Create | apps/web/src/app/shared/components/empty-state/ |
| Create | apps/web/src/app/shared/components/skeleton-card/ |
| Modify | apps/web/src/app/app.config.ts (register HTTP interceptor) |
| Modify | apps/web/src/app/features/players/pages/players-list-page/ (add empty state + skeleton) |
| Modify | apps/web/src/app/features/games/pages/games-calendar-page/ (add empty state + skeleton) |
| Modify | apps/web/src/app/features/players/pages/player-detail-page/ (add empty state) |

## Acceptance Criteria

- [ ] Players list shows empty state component when no players exist
- [ ] Calendar shows empty state when no games are scheduled in the current week
- [ ] Player Dashboard shows empty state when player has no game history
- [ ] All list/page components show skeleton cards while data is loading
- [ ] HTTP interceptor catches 4xx/5xx errors and surfaces a visible error message (toast or inline)
- [ ] Empty state and skeleton components are in `shared/components/` and reusable
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 014

## Notes
_Fill in after execution._
