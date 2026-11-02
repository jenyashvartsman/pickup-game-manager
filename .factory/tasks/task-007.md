# Task 007 — Game Result & Player Stats API

## Objective
Implement the REST API for entering and updating a game's result (final score) and per-player stats. Setting a result must also update the game status to `completed`. Writes AuditLog entries on all mutations.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/modules/game-results/game-results.module.ts |
| Create | apps/api/src/modules/game-results/game-results.controller.ts |
| Create | apps/api/src/modules/game-results/game-results.service.ts |
| Create | apps/api/src/modules/game-results/dto/create-game-result.dto.ts |
| Create | apps/api/src/modules/game-results/dto/update-game-result.dto.ts |
| Create | apps/api/src/modules/player-stats/player-stats.module.ts |
| Create | apps/api/src/modules/player-stats/player-stats.controller.ts |
| Create | apps/api/src/modules/player-stats/player-stats.service.ts |
| Create | apps/api/src/modules/player-stats/dto/upsert-player-stat.dto.ts |
| Modify | libs/shared-types/src/index.ts (export GameResult + PlayerStat DTO types) |

## Acceptance Criteria

- [ ] `POST /games/:id/result` creates a GameResult and sets game status to `completed`
- [ ] `PATCH /games/:id/result` updates the GameResult
- [ ] `GET /games/:id/result` returns the result (404 if not yet entered)
- [ ] `PUT /games/:id/stats` accepts an array of PlayerStat objects and upserts them (one row per player)
- [ ] `GET /games/:id/stats` returns all PlayerStats for the game
- [ ] Cannot add a result to a `cancelled` game (returns 400)
- [ ] Stats can only be entered for players on the game roster (returns 400 otherwise)
- [ ] All mutations write AuditLog rows
- [ ] Unit tests for both services
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 006

## Notes
_Fill in after execution._
