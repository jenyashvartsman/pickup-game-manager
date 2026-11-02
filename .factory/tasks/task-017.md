# Task 017 — Production Readiness & README

## Objective
Final production pass: add Angular error boundaries (global error handler), verify lazy loading is working (check bundle chunks), ensure the NestJS API has CORS configured for the Angular dev server, and write the project README covering setup, running locally, and the Nx commands reference.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/backend.md

## Scope

| Action | File |
|--------|------|
| Create | README.md |
| Create | apps/web/src/app/core/handlers/global-error-handler.ts |
| Modify | apps/web/src/app/app.config.ts (register ErrorHandler) |
| Modify | apps/api/src/main.ts (enable CORS for Angular dev origin) |

## Acceptance Criteria

- [ ] `nx build web --configuration=production` produces a bundle with lazy-loaded feature chunks (verify in `dist/`)
- [ ] `nx build api` produces a runnable dist bundle
- [ ] CORS is configured on the API to allow requests from `http://localhost:4200`
- [ ] Unhandled Angular errors are caught by the global error handler and logged (not shown as blank screen)
- [ ] README covers: prerequisites, `docker compose up -d`, `npx typeorm migration:run`, `nx run api:seed`, `nx serve web`, `nx serve api`, and the full Nx commands reference
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 016, Task 015

## Notes
_Fill in after execution._
