# Task 009 — Angular App Shell & Routing

## Objective
Set up the Angular app shell: global layout (header with nav and theme toggle, main content area), app-level routing with lazy-loaded feature routes, global SCSS design tokens (colours, spacing, typography) for both dark and light themes, and HTTP client configuration pointing to the NestJS API.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/architecture.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/app.routes.ts |
| Create | apps/web/src/app/core/layout/layout.component.ts/.html/.scss |
| Create | apps/web/src/app/core/layout/header.component.ts/.html/.scss |
| Create | apps/web/src/app/core/services/theme.service.ts |
| Create | apps/web/src/styles/_variables.scss |
| Create | apps/web/src/styles/_typography.scss |
| Create | apps/web/src/styles/_themes.scss |
| Create | apps/web/src/styles/main.scss |
| Modify | apps/web/src/app/app.config.ts (provideHttpClient, provideRouter) |

## Acceptance Criteria

- [ ] App loads at `/` and shows the layout shell without errors
- [ ] Navigation links to Dashboard, Calendar, Players routes (pages can be empty stubs)
- [ ] Dark/light theme toggle switches `class="theme-dark"` / `class="theme-light"` on `<html>`
- [ ] Theme preference persists in localStorage across page refresh
- [ ] CSS custom properties for colour and spacing are defined in `_themes.scss` and `_variables.scss`
- [ ] HttpClient is configured with the API base URL from `environments/`
- [ ] `nx build web` succeeds
- [ ] `nx lint web` passes
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 001

## Notes
_Fill in after execution._
