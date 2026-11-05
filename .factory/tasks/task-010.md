# Task 010 — Players Feature: List & CRUD Pages

## Objective
Build the Players feature: a searchable/paginated players list page and an add/edit player form. Wire up the PlayersService (Angular) that calls the Players REST API. All state managed with Angular signals.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/features/players/pages/players-list-page/ |
| Create | apps/web/src/app/features/players/pages/player-form-page/ |
| Create | apps/web/src/app/features/players/components/player-card/ |
| Create | apps/web/src/app/features/players/services/players.service.ts |
| Create | apps/web/src/app/features/players/models/player.model.ts |
| Create | apps/web/src/app/features/players/players.routes.ts |
| Modify | apps/web/src/app/app.routes.ts (add lazy players route) |

## Acceptance Criteria

- [ ] `/players` shows a list of all players fetched from `GET /players`
- [ ] Each player card shows name and position
- [ ] "Add Player" button opens the form page
- [ ] Submitting the form calls `POST /players` and navigates back to the list
- [ ] Clicking edit on a player opens the form pre-filled; submit calls `PATCH /players/:id`
- [ ] Delete action calls `DELETE /players/:id` and removes the player from the list
- [ ] PlayersService uses signals for state: `players` signal, `isLoading` signal
- [ ] Unit tests for PlayersService
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 009, Task 005

## Notes
Completed 2026-11-05. All files created as scoped. PlayersService uses `signal<Player[]>([])` and `signal<boolean>(false)`; mutations tap() to update the signal in-place (no reload). PlayerCardComponent uses `input.required<Player>()` with a `computed()` initials getter. PlayersListPageComponent drives search with a `searchQuery` signal and a `filteredPlayers` computed; uses `(input)` event binding (no FormsModule needed). PlayerFormPageComponent uses ReactiveFormsModule `fb.nonNullable.group`; edit mode detected via route `snapshot.paramMap.get('id')`. players.routes.ts uses `loadComponent` lazy loading; app.routes.ts switched from `loadComponent` to `loadChildren`. 54 tests green, build clean (lazy chunks visible in output), lint clean.
