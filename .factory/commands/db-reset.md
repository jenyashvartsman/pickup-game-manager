# Command: db-reset

Destructive reset: drops all tables, re-runs all migrations, then seeds with fixture data. Returns the database to a clean known state.

## Command

```bash
# Drop the database volume and recreate
docker compose down -v
docker compose up -d

# Wait for PostgreSQL to be ready, then migrate and seed
npx typeorm migration:run -d apps/api/src/database/data-source.ts
nx run api:seed
```

## Success
- `docker compose up -d` starts cleanly
- All migrations apply without error
- Seed output ends with `Seed complete.`

## Warning
**This is a destructive operation.** All data in the database will be permanently deleted.

`docker compose down -v` requires **developer approval** (listed in CLAUDE.md Requires Developer Approval). Always confirm with the developer before running this command.

## When to use
- Local development: resetting to a clean fixture state
- After a migration conflict that cannot be resolved by `migration:revert`
- Onboarding a new developer to the project
