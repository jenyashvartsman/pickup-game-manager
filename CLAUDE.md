# pickup-game-manager — Project Context

This file is loaded by Claude Code each session.

## Project
A pickup soccer game management tool for a single admin. The admin creates and manages players, schedules games on a weekly calendar, records game results and per-player stats, and monitors performance through game and player dashboards. Players can browse schedules and their own stats without any login. Built with Angular (signals) frontend, NestJS REST API, and PostgreSQL — all in an Nx monorepo.

## AI Factory Method
This project uses the AI Factory Method:
- Docs define context and decisions (`.factory/docs/`)
- Tasks are numbered, discrete, testable units (`.factory/tasks/`)
- A factory log tracks every completed order (`.factory/logs/factory.log`)
- Commands automate repetitive factory operations (`.factory/commands/`)

## Active Docs

| Domain | File |
|--------|------|
| Product | .factory/docs/app.md — read first |
| Architecture | .factory/docs/architecture.md |
| UX | .factory/docs/ux.md |
| Frontend | .factory/docs/frontend.md |
| Backend | .factory/docs/backend.md |
| Database | .factory/docs/database.md |

## Core Development Rule — Domain-Focused Code

All code must be named after domain concepts from app.md:
- `Player`, `Game`, `GameResult`, `PlayerStat`, `GameRoster`, `AuditLog`

No generic names: no `DataService`, `ItemList`, `handleSubmit`, `processData`.
Business logic lives in domain services, not in route handlers or components.
This rule applies from task 001 onwards and is never relaxed.

## AI Autonomy

The AI may execute the following without asking for approval:

### Test & Build
| Command | When to use |
|---------|------------|
| `nx test web` | Run Angular unit tests |
| `nx test api` | Run NestJS unit tests |
| `nx test web --watch=false` | Run Angular tests once (CI mode) |
| `nx test api --watch=false` | Run NestJS tests once (CI mode) |
| `nx build web` | Build Angular frontend |
| `nx build api` | Build NestJS backend |
| `nx build` | Build all projects |
| `nx lint web` | Lint Angular app |
| `nx lint api` | Lint NestJS app |
| `nx lint` | Lint all projects |

### Infrastructure
| Command | When to use |
|---------|------------|
| `docker compose up -d` | Start PostgreSQL in background (docker-compose.yml at root) |
| `docker compose down` | Stop all containers |
| `docker compose logs postgres` | View PostgreSQL logs |

### Database Migrations
| Command | When to use |
|---------|------------|
| `TS_NODE_PROJECT=tsconfig.typeorm.json TS_NODE_TRANSPILE_ONLY=true node -r tsconfig-paths/register node_modules/typeorm/cli-ts-node-commonjs.js migration:run -d apps/api/src/database/data-source.ts` | Apply all pending migrations |
| `TS_NODE_PROJECT=tsconfig.typeorm.json TS_NODE_TRANSPILE_ONLY=true node -r tsconfig-paths/register node_modules/typeorm/cli-ts-node-commonjs.js migration:revert -d apps/api/src/database/data-source.ts` | Revert last migration |
| `TS_NODE_PROJECT=tsconfig.typeorm.json TS_NODE_TRANSPILE_ONLY=true node -r tsconfig-paths/register node_modules/typeorm/cli-ts-node-commonjs.js migration:generate apps/api/src/database/migrations/<Name> -d apps/api/src/database/data-source.ts` | Generate migration from entity changes |
| `TS_NODE_PROJECT=tsconfig.typeorm.json TS_NODE_TRANSPILE_ONLY=true node -r tsconfig-paths/register node_modules/typeorm/cli-ts-node-commonjs.js migration:show -d apps/api/src/database/data-source.ts` | Show applied/pending migrations |

### File Operations
Read and write any file within the workspace: source code, docs, task files, status.md, factory.log.

### Requires Developer Approval
- Installing or removing packages (`npm install`, `nx add`, etc.)
- Destructive git operations (reset --hard, force push, branch delete)
- Running `nx run api:seed` against a non-empty database
- Running `docker compose down -v` (destroys database volume)
- Any command not listed above

## Task Rules
- Tasks live in `.factory/tasks/task-NNN.md`
- Execute one task at a time
- Do not start a task without reading its file
- Mark completion in `status.md` and append `factory.log`

## Task Execution Cycle

  1. Write code
  2. Run unit tests (`nx test <project> --watch=false`)
  3. Review output — fix any failures
  4. Run tests again — must be green
  5. Run build (`nx build <project>`) — must succeed
  6. Run lint (`nx lint <project>`) — must pass

A task is not complete until tests are green AND the build passes AND lint is clean.

Loop limit: If fix → retest repeats more than 3 times without resolving, stop immediately.
Report what failed, what was tried, and why it is not resolving. Never loop silently.

## Factory Log Rule
Every completed task must produce a log entry:
  [YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary>

## Status Dashboard
Current state: `.factory/status.md`
