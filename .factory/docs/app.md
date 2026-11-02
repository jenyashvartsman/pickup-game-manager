# App Design — pickup-game-manager

## Vision
A pickup soccer game management tool for a single admin to organize recurring weekly games. The admin can create and manage players, schedule games on a weekly calendar, record game results and per-player stats, and monitor performance through game and player dashboards. Players can browse the app to check schedules and their own stats without any login.

## Target User
Two audiences, no authentication distinction:
- **Admin (primary):** The organizer who creates players, schedules games, assigns players to games, and enters results and stats after each match.
- **Players (secondary):** Participants who check the calendar to see upcoming games, confirm who is playing, and review their own stats and history.

Without this app, the admin coordinates over group chat or spreadsheets, and there is no central place for players to check schedules or stats.

## Problem Statement
**Before:** Game scheduling is done through messaging apps or spreadsheets. Player availability, results, and stats are tracked manually — if at all. There is no single source of truth for who played, what the score was, or how individual players performed over time.

**After:** One app handles the full lifecycle — schedule a game, assign players, record the result and stats, and instantly see updated dashboards for the team and individual players.

## Core User Journey

1. Admin opens the app and lands on the **Main Dashboard** — sees upcoming games and a summary of recent results.
2. Admin navigates to the **Calendar** and picks a date to schedule a new game.
3. Admin fills in game details (date, time, location, player roster).
4. Game appears on the calendar. Players can see it listed.
5. After the match, admin opens the **Game Dashboard** for that game and enters the result (score) and per-player stats.
6. Admin or player navigates to a **Player Dashboard** to review individual performance over time.
7. Admin can add, edit, or remove players from the **Players** section at any time.

## Domain Model

- A **Player** has a name, position, and stats history.
- A **Game** has a date, time, location, status (scheduled / completed / cancelled), and a roster of Players.
- A **GameResult** belongs to one Game and records the final score.
- A **PlayerStat** belongs to one Game and one Player and records per-player performance metrics (goals, assists, etc.).
- A Game has many Players (through a roster/lineup). A Player can appear in many Games.
- A Game has at most one GameResult. A Game has many PlayerStats (one per rostered player).

## Core Features (v1)

1. User can create, edit, and delete players (name, position).
2. User can schedule a game (date, time, location) and assign players to it.
3. User can view all games in a weekly calendar view.
4. User can edit or cancel a scheduled game.
5. User can enter a game result (final score) after the match.
6. User can enter per-player stats for a completed game (goals, assists, etc.).
7. User can view a Game Dashboard showing result, stats, and roster for a specific game.
8. User can view a Player Dashboard showing a player's history, total stats, and game appearances.
9. User can view a Main Dashboard with upcoming games and recent results summary.

## Out of Scope (v1)

- User accounts, login, or authentication
- Role-based permissions (admin vs. player views are not enforced)
- Player availability / RSVP system
- Push notifications or email reminders
- Team or league management (multi-team support)
- Photo uploads or media attachments
- Payment tracking or dues management
- Advanced analytics or AI-generated insights

## Success Criteria

- Admin can schedule a game and add players to it without reading documentation.
- Admin can enter a result and stats after a game completes.
- Any user can open the calendar and see all upcoming games at a glance.
- Any user can open a player's dashboard and see their season stats and game history.
- All data persists across page refreshes and browser sessions.

## Constraints

| Constraint | Decision |
|-----------|---------|
| Single user or multi-user? | Single user (no account separation) |
| Auth required? | No |
| Online only or offline capable? | Online only |
| Desktop, mobile, or both? | Both (responsive) |
| Real-time, event-driven, or CRUD-only? | CRUD-only |
| Persistent data or ephemeral? | Persistent data |

## Open Questions

- [ ] What stat categories should be tracked per player per game? (goals, assists, yellow cards, red cards, minutes played — confirm before database phase)
- [ ] Should the calendar show a monthly or weekly view by default?
- [ ] Is "location" a free-text field or a predefined list of venues?
