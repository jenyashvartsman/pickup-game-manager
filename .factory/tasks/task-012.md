# Task 012 — Game Dashboard Page

## Objective
Build the Game Dashboard page for a single game. Shows game details (date, time, location, status), the player roster with add/remove capability, the result (score) if the game is completed, and the stat entry form for entering per-player stats after a game is completed.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/features/games/pages/game-detail-page/ |
| Create | apps/web/src/app/features/games/components/roster-list/ |
| Create | apps/web/src/app/features/games/components/game-result-form/ |
| Create | apps/web/src/app/features/games/components/player-stats-form/ |
| Create | apps/web/src/app/features/games/services/game-result.service.ts |
| Create | apps/web/src/app/features/games/services/player-stats.service.ts |

## Acceptance Criteria

- [ ] `/games/:id` loads the game from `GET /games/:id`
- [ ] Roster section lists rostered players; "Add Player" dropdown calls `POST /games/:id/roster`
- [ ] Remove button on each roster row calls `DELETE /games/:id/roster/:playerId`
- [ ] Result section shows score if game is `completed`; shows "Enter Result" form otherwise
- [ ] Submitting the result form calls `POST /games/:id/result` and updates game status to `completed`
- [ ] Stats section shows a table; "Enter Stats" form allows per-player stat input calling `PUT /games/:id/stats`
- [ ] Roster and result controls are hidden/disabled for `cancelled` games
- [ ] Unit tests for GameResultService and PlayerStatsService
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 011, Task 007

## Notes
_Fill in after execution._
