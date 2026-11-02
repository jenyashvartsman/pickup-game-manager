# Task 013 — Player Dashboard Page

## Objective
Build the Player Dashboard page for a single player. Shows the player's career stat totals, a game-by-game history table, and a Chart.js chart for goals and assists over time.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/features/players/pages/player-detail-page/ |
| Create | apps/web/src/app/features/players/components/player-stats-chart/ |
| Create | apps/web/src/app/features/players/components/player-history-table/ |

## Acceptance Criteria

- [ ] `/players/:id` loads the player from `GET /players/:id`
- [ ] Career totals section shows sum of goals, assists, yellow cards, red cards across all games
- [ ] Game history table lists every game the player appeared in, with per-game stats
- [ ] Chart.js line/bar chart shows goals and assists per game over time
- [ ] Page handles the case where the player has no game history (empty state)
- [ ] Unit tests for the player stat aggregation logic
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 010, Task 007

## Notes
_Fill in after execution._
