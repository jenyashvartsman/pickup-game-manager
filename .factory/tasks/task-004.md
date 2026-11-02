# Task 004 — Database Seed Fixtures

## Objective
Write a seed script that inserts fixture data: ~15 players with positions, 4 weeks of games (2 completed, 2 upcoming), game results for the completed games, and per-player stats for those games. Wire it as an Nx target (`nx run api:seed`). The script must be idempotent-safe: it drops all rows before inserting (destructive seed).

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | apps/api/src/database/seeds/seed.ts |
| Create | apps/api/src/database/seeds/players.fixture.ts |
| Create | apps/api/src/database/seeds/games.fixture.ts |
| Modify | apps/api/project.json (add seed target) |

## Acceptance Criteria

- [ ] `nx run api:seed` runs to completion without error
- [ ] Database contains exactly 15 players after seeding
- [ ] Database contains exactly 4 games after seeding (2 completed, 2 scheduled)
- [ ] Each completed game has a GameResult row
- [ ] Each completed game has PlayerStat rows for all rostered players
- [ ] Running the seed a second time does not produce duplicates (truncates first)
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 003

## Notes
_Fill in after execution._
