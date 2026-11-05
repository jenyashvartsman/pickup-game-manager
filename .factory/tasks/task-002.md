# Task 002 — Docker + PostgreSQL Local Setup

## Objective
Create the `docker-compose.yml` at the project root to run a local PostgreSQL instance. Create the `.env` and `.env.example` files with database connection variables. Verify that `docker compose up -d` starts the container and that the API can connect to it.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/backend.md
- [ ] Read .factory/docs/database.md

## Scope

| Action | File |
|--------|------|
| Create | docker-compose.yml |
| Create | .env.example |
| Create | .env (gitignored) |
| Create | apps/api/src/database/data-source.ts |
| Modify | apps/api/src/app.module.ts (add TypeOrmModule.forRoot) |

## Acceptance Criteria

- [ ] `docker compose up -d` starts PostgreSQL on port 5432 without error
- [ ] `docker compose ps` shows the postgres container as running
- [ ] TypeORM `DataSource` in `data-source.ts` connects to the database successfully
- [ ] `nx build api` succeeds with TypeORM configured
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 001

## Notes
_Fill in after execution._
