# Task 006 — Games API (CRUD + Roster)

## Objective
Implement the REST API for Games: create, read, update, cancel, and delete games. Include a roster sub-resource to add and remove players from a game. Writes AuditLog entries on all mutations.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/modules/games/games.module.ts |
| Create | apps/api/src/modules/games/games.controller.ts |
| Create | apps/api/src/modules/games/games.service.ts |
| Create | apps/api/src/modules/games/dto/create-game.dto.ts |
| Create | apps/api/src/modules/games/dto/update-game.dto.ts |
| Modify | libs/shared-types/src/index.ts (export Game DTO types) |

## Acceptance Criteria

- [ ] `GET /games` returns all games (optionally filtered by date range via query params)
- [ ] `GET /games/:id` returns a single game with its roster
- [ ] `POST /games` creates a game with status `scheduled`
- [ ] `PATCH /games/:id` updates game details
- [ ] `DELETE /games/:id` hard-deletes the game
- [ ] `POST /games/:id/roster` adds a player to the game roster
- [ ] `DELETE /games/:id/roster/:playerId` removes a player from the roster
- [ ] Cannot add a player to a `completed` or `cancelled` game (returns 400)
- [ ] Every mutating operation writes one AuditLog row
- [ ] Unit tests for GamesService cover all methods
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 005

## Notes
_Fill in after execution._
