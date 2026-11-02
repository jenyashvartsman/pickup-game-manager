# Task 011 — Games Calendar Page

## Objective
Build the Games Calendar page with a weekly calendar view. Each week shows all scheduled and completed games. Clicking a date slot opens the game creation form. Clicking a game card navigates to the Game Dashboard. Wire up the GamesService (Angular) that calls the Games REST API.

## Context

- [ ] Read .factory/docs/app.md
- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/features/games/pages/games-calendar-page/ |
| Create | apps/web/src/app/features/games/pages/game-form-page/ |
| Create | apps/web/src/app/features/games/components/calendar-week/ |
| Create | apps/web/src/app/features/games/components/game-card/ |
| Create | apps/web/src/app/features/games/services/games.service.ts |
| Create | apps/web/src/app/features/games/models/game.model.ts |
| Create | apps/web/src/app/features/games/games.routes.ts |
| Modify | apps/web/src/app/app.routes.ts (add lazy games route) |

## Acceptance Criteria

- [ ] `/games` shows the current week by default with previous/next week navigation
- [ ] Games are loaded from `GET /games?from=<date>&to=<date>` and displayed on the correct day
- [ ] Clicking an empty day slot opens the game creation form pre-filled with that date
- [ ] Submitting the form calls `POST /games` and adds the game to the calendar
- [ ] Game cards show date, time, location, and status badge
- [ ] Clicking a game card navigates to `/games/:id`
- [ ] GamesService uses signals: `games` signal, `selectedWeek` signal
- [ ] Unit tests for GamesService
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 009, Task 006

## Notes
_Fill in after execution._
