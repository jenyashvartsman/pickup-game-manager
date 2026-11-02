# Architecture — pickup-game-manager

## System Overview
Three main moving parts:
- **Angular frontend** (signals-based) — serves the calendar, dashboards, and CRUD forms
- **NestJS API** — REST backend, handles all business logic and database access
- **PostgreSQL database** — persistent storage for players, games, results, and stats

All three live in a single Nx monorepo. A Docker Compose file runs PostgreSQL locally.

## Stack Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Repository structure | Monorepo | Nx |
| Frontend framework | Angular (signals) | Latest Angular with signals for state |
| Backend runtime + framework | Node.js / NestJS | |
| API style | REST | |
| Database | PostgreSQL | |
| ORM / query builder | TypeORM | NestJS-native; decorators + migrations |
| Auth strategy | None | No login — single open admin interface |
| Real-time strategy | None | CRUD-only |
| Docker (local dev) | Yes | docker-compose.yml at project root |
| Code style enforcement | ESLint + Prettier | Nx ships both pre-configured |

## Project Structure

```
pickup-game-manager/
├── apps/
│   ├── web/                        ← Angular frontend (signals)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── core/           ← app-wide services, interceptors, layout
│   │       │   ├── features/       ← one folder per feature domain
│   │       │   └── shared/         ← reusable components, pipes, directives
│   │       ├── assets/
│   │       └── environments/
│   └── api/                        ← NestJS backend
│       └── src/
│           ├── modules/            ← one NestJS module per domain entity
│           ├── common/             ← guards, interceptors, filters, decorators
│           └── main.ts
├── libs/
│   └── shared-types/               ← DTOs and interfaces shared between apps
├── docker-compose.yml
├── nx.json
├── package.json
└── tsconfig.base.json
```

## Open Questions

- [ ] Confirm TypeORM as the ORM choice (alternative: Prisma)
- [ ] Confirm docker-compose.yml at project root (default assumed)
- [ ] Confirm Nx as monorepo tool (default chosen — most natural for Angular + NestJS)
