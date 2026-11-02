# Task 001 — Nx Monorepo Init

## Objective
Initialise the Nx monorepo with an Angular (signals) frontend app, a NestJS backend app, and a shared-types library. Configure ESLint and Prettier. Verify that both apps build and lint cleanly from a fresh checkout.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md

## Scope

| Action | File |
|--------|------|
| Create | nx.json |
| Create | package.json |
| Create | tsconfig.base.json |
| Create | .eslintrc.json |
| Create | .prettierrc |
| Create | apps/web/ (Angular app scaffold) |
| Create | apps/api/ (NestJS app scaffold) |
| Create | libs/shared-types/ (Nx library) |

## Acceptance Criteria

- [ ] `nx build web` succeeds
- [ ] `nx build api` succeeds
- [ ] `nx lint web` passes with no errors
- [ ] `nx lint api` passes with no errors
- [ ] `nx test web --watch=false` passes (default spec)
- [ ] `nx test api --watch=false` passes (default spec)
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
None

## Notes
_Fill in after execution._
