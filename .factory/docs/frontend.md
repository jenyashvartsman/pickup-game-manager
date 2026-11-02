# Frontend — pickup-game-manager

## Folder Structure

```
apps/web/src/
├── app/
│   ├── core/                        ← app-wide concerns
│   │   ├── layout/                  ← shell, header, sidebar, theme toggle
│   │   ├── interceptors/            ← HTTP interceptors (error handling, loading)
│   │   └── services/                ← app-level services (theme, navigation)
│   ├── features/                    ← one folder per domain
│   │   ├── dashboard/
│   │   │   ├── pages/               ← routed page component(s)
│   │   │   └── components/          ← feature-specific UI blocks
│   │   ├── games/
│   │   │   ├── pages/               ← games-calendar-page, game-detail-page
│   │   │   ├── components/          ← game-card, game-stats-form, roster-list
│   │   │   ├── services/            ← games.service.ts (HttpClient calls)
│   │   │   └── models/              ← game.model.ts, game-result.model.ts
│   │   └── players/
│   │       ├── pages/               ← players-list-page, player-detail-page
│   │       ├── components/          ← player-card, player-stats-chart
│   │       ├── services/            ← players.service.ts
│   │       └── models/              ← player.model.ts, player-stat.model.ts
│   ├── shared/                      ← reusable across features
│   │   ├── components/              ← custom UI lib components (button, card, badge…)
│   │   ├── pipes/
│   │   └── directives/
│   └── app.routes.ts
├── assets/
├── environments/
└── styles/                          ← global SCSS entry point + BEM partials
    ├── _variables.scss
    ├── _typography.scss
    ├── _themes.scss                  ← dark/light theme CSS custom properties
    └── main.scss
```

## File Naming Conventions

Angular defaults throughout:
- Components: `kebab-case.component.ts` / `.html` / `.scss`
- Services: `kebab-case.service.ts`
- Models/interfaces: `kebab-case.model.ts`
- Guards: `kebab-case.guard.ts`
- Pipes: `kebab-case.pipe.ts`
- Spec files: `kebab-case.*.spec.ts` (co-located)

## Domain Boundaries

Each feature domain (`games/`, `players/`, `dashboard/`) contains its own:
- **`pages/`** — routed entry-point components; compose feature components; own minimal logic
- **`components/`** — domain-specific presentational and smart components
- **`services/`** — one service per domain; owns all HttpClient calls for that domain
- **`models/`** — TypeScript interfaces matching the shared-types lib DTOs

Pages are lazy-loaded via Angular router. No page imports from another feature's pages or components — cross-feature composition goes through `shared/`.

## State Management

Angular signals throughout. No NgRx or external state library.

Pattern per feature service:
- `signal<T[]>()` for collections
- `computed()` for derived/filtered views
- `effect()` for side-effects (e.g., persisting filter preferences)
- Services expose readonly signals; components call service methods to mutate

## API Layer

Angular `HttpClient` called only from feature services (`games.service.ts`, `players.service.ts`). No direct HttpClient usage in components.

- Base API URL configured in `environments/`
- A core HTTP interceptor handles global error responses
- Response types use DTOs from `libs/shared-types`

## Test Co-location

Angular default: spec files sit next to the source file they test.

```
game-card.component.ts
game-card.component.spec.ts
games.service.ts
games.service.spec.ts
```

## CSS Methodology

Global SCSS with BEM. Component-scoped SCSS files reference global variables and mixins but define their own block styles.

- BEM naming: `.game-card__title--highlighted`
- Design tokens (colors, spacing, typography) live in `styles/_variables.scss`
- Dark/light theme values use CSS custom properties defined in `styles/_themes.scss`, toggled via a class on `<html>` (`theme-dark` / `theme-light`)
- GSAP animations are applied in component TypeScript, not in SCSS

## Open Questions

- [ ] Confirm lazy loading strategy: one route-level chunk per feature, or per page?
- [ ] Confirm shared UI component location: `apps/web/src/app/shared/components/` vs. a separate Nx lib `libs/ui/`
