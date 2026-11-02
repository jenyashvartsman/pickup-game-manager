# Command: db-migrate

Run pending TypeORM migrations against the PostgreSQL database.

## Prerequisite
PostgreSQL must be running: `docker compose up -d`

## Commands

```bash
# Run all pending migrations
npx typeorm migration:run -d apps/api/src/database/data-source.ts

# Generate a new migration from entity changes
npx typeorm migration:generate apps/api/src/database/migrations/<MigrationName> -d apps/api/src/database/data-source.ts

# Revert the last applied migration
npx typeorm migration:revert -d apps/api/src/database/data-source.ts

# Show migration status (applied vs pending)
npx typeorm migration:show -d apps/api/src/database/data-source.ts
```

## Success
`migration:run` output ends with:
```
All migrations have been successfully applied.
```

## On Failure
1. Read the full error — most migration failures are schema conflicts or connection issues
2. Check that Docker is running: `docker compose ps`
3. Check that `apps/api/src/database/data-source.ts` has correct DB credentials (from `.env`)
4. If the schema is in a broken state during development, run `db-reset` to start clean
5. Never edit a migration file that has already been applied — generate a new one instead
