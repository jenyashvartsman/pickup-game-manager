# Backend — pickup-game-manager

## Folder Structure

```
apps/api/src/
├── modules/                         ← one NestJS module per domain entity
│   ├── games/
│   │   ├── games.module.ts
│   │   ├── games.controller.ts
│   │   ├── games.service.ts
│   │   ├── entities/
│   │   │   └── game.entity.ts
│   │   └── dto/
│   │       ├── create-game.dto.ts
│   │       └── update-game.dto.ts
│   ├── players/
│   │   ├── players.module.ts
│   │   ├── players.controller.ts
│   │   ├── players.service.ts
│   │   ├── entities/
│   │   │   └── player.entity.ts
│   │   └── dto/
│   ├── game-results/
│   │   ├── game-results.module.ts
│   │   ├── game-results.controller.ts
│   │   ├── game-results.service.ts
│   │   ├── entities/
│   │   │   └── game-result.entity.ts
│   │   └── dto/
│   └── player-stats/
│       ├── player-stats.module.ts
│       ├── player-stats.controller.ts
│       ├── player-stats.service.ts
│       ├── entities/
│       │   └── player-stat.entity.ts
│       └── dto/
├── common/                          ← cross-cutting concerns
│   ├── filters/
│   │   └── http-exception.filter.ts ← global exception filter
│   ├── interceptors/                ← e.g. logging, response transform
│   └── decorators/
├── database/
│   ├── migrations/                  ← TypeORM generated migration files
│   ├── seeds/                       ← seed scripts (one file per entity)
│   └── data-source.ts               ← TypeORM DataSource config (used by CLI)
└── main.ts
```

## Layer Architecture

NestJS default three-layer flow:

```
HTTP Request
  → Controller   (validates input via DTOs + class-validator, routes to service)
  → Service      (all business logic lives here; calls TypeORM repository)
  → TypeORM Repo (database queries via Entity repository or QueryBuilder)
  → HTTP Response
```

- Controllers are thin: no business logic, only input validation and delegation.
- Services own all logic: they may call other module services via NestJS DI.
- No custom repository classes needed for v1 — use TypeORM's built-in `Repository<Entity>` injected into services.

## Validation

`class-validator` + `class-transformer` (NestJS default).

- Every controller method that accepts a body uses a typed DTO class.
- `ValidationPipe` registered globally in `main.ts` with `whitelist: true` and `transform: true`.
- DTOs live in the `dto/` folder of each module.

## Error Handling

Global `HttpExceptionFilter` registered in `main.ts`.

- Catches all `HttpException` instances and formats a consistent JSON error response: `{ statusCode, message, timestamp, path }`.
- Unhandled errors fall through to NestJS's default handler.
- Services throw NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.) — no raw Error throws.

## Database Connection

TypeORM `DataSource` configured in `apps/api/src/database/data-source.ts`.

- Imported into `AppModule` via `TypeOrmModule.forRoot()` — single shared connection for the whole app.
- Entity repositories are injected into services via `TypeOrmModule.forFeature([Entity])` in each domain module.
- The same `data-source.ts` is used by the TypeORM CLI for migrations.

## Simulation / Background Jobs
None. CRUD-only application.

## Seeder Strategy

**Destructive drop + migrate + seed** — recommended for this project.

Rationale: single-user, no sensitive data, no auth. The seeder script drops all tables, re-runs all migrations, and inserts fixture data. This gives a clean, predictable state in one command — ideal for local dev and onboarding.

Seed script lives in `apps/api/src/database/seeds/`. Run via an npm script:
```
nx run api:seed
```

The seed populates: a roster of ~15 sample players, 4 weeks of scheduled games, and results + stats for past games.

## Open Questions
- [ ] Confirm seed data volume (15 players, 4 weeks of games — adjust as needed)
