# Task 003 — Database Schema Migration

## Objective
Create TypeORM entities for all six database tables — Player, Game, GameRoster, GameResult, PlayerStat, and AuditLog — and generate the initial migration. Run the migration to create all tables in PostgreSQL.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/modules/players/entities/player.entity.ts |
| Create | apps/api/src/modules/games/entities/game.entity.ts |
| Create | apps/api/src/modules/game-results/entities/game-result.entity.ts |
| Create | apps/api/src/modules/player-stats/entities/player-stat.entity.ts |
| Create | apps/api/src/modules/audit-logs/entities/audit-log.entity.ts |
| Create | apps/api/src/database/migrations/001-InitialSchema.ts |
| Create | libs/shared-types/src/lib/enums.ts (GameStatus, AuditAction) |

## Acceptance Criteria

- [ ] All six entities match the schema in database.md exactly (columns, types, constraints, foreign keys)
- [ ] `npx typeorm migration:run -d apps/api/src/database/data-source.ts` creates all tables without error
- [ ] `npx typeorm migration:show` shows the migration as applied
- [ ] All UUIDs use `@PrimaryGeneratedColumn('uuid')`
- [ ] `game_roster` uses a composite primary key
- [ ] `player_stats` has a UNIQUE constraint on `(game_id, player_id)`
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 002

## Notes
_Fill in after execution._
