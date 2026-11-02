# Command: db-seed

Run the seed script to populate the database with fixture data.

## Prerequisite
PostgreSQL must be running and all migrations applied:
```bash
docker compose up -d
npx typeorm migration:run -d apps/api/src/database/data-source.ts
```

## Command

```bash
nx run api:seed
```

## What it inserts
- ~15 sample players with positions
- 4 weeks of scheduled games (2 past, 2 upcoming)
- Game results and per-player stats for the 2 completed games

## Success
Output ends with:
```
Seed complete.
```

## On Failure
1. Check that migrations have been applied (`db-migrate`)
2. Check database connectivity (`docker compose ps`)
3. If data already exists and causes unique constraint errors, run `db-reset` first — the seeder is designed to run on an empty database

## Warning
Running the seed on a non-empty database **requires developer approval** (listed in CLAUDE.md Requires Developer Approval). Always confirm before running against a database with real data.
