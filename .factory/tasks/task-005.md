# Task 005 — Players API (CRUD)

## Objective
Implement the full CRUD REST API for Players. Create the NestJS module, controller, service, DTOs, and wire in the global ValidationPipe and HttpExceptionFilter. All endpoints must validate input and write an AuditLog entry on create, update, and delete.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/modules/players/players.module.ts |
| Create | apps/api/src/modules/players/players.controller.ts |
| Create | apps/api/src/modules/players/players.service.ts |
| Create | apps/api/src/modules/players/dto/create-player.dto.ts |
| Create | apps/api/src/modules/players/dto/update-player.dto.ts |
| Create | apps/api/src/modules/audit-logs/audit-log.service.ts |
| Create | apps/api/src/common/filters/http-exception.filter.ts |
| Modify | apps/api/src/main.ts (register ValidationPipe + HttpExceptionFilter globally) |
| Modify | libs/shared-types/src/index.ts (export Player DTO types) |

## Acceptance Criteria

- [ ] `GET /players` returns all players
- [ ] `GET /players/:id` returns a single player or 404
- [ ] `POST /players` creates a player; rejects invalid input with 400
- [ ] `PATCH /players/:id` updates a player; returns 404 for unknown id
- [ ] `DELETE /players/:id` deletes a player; returns 404 for unknown id
- [ ] Every mutating operation writes one AuditLog row
- [ ] Unit tests for PlayersService cover all methods
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 004

## Notes
_Fill in after execution._
