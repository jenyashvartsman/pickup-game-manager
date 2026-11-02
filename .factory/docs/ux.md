# UX Design — pickup-game-manager

## Design Language
Sporty bold — high contrast, strong typography, clear data hierarchy. Feels like a sports stats app: prominent numbers, bold headings, card-based layouts with clear visual separation between sections. Energy and clarity over decoration.

## Theme
Both dark and light themes. Dark theme is the primary/default; light theme is a switchable alternative. Theme preference stored in localStorage.

## Responsive Strategy
Fully responsive. No fixed breakpoint priority — layouts adapt cleanly across mobile, tablet, and desktop. Calendar and dashboard cards reflow to single-column on small screens.

## Libraries

| Concern | Choice |
|---------|--------|
| UI components | Custom component library (Nx lib: `libs/ui`) — built as needed |
| Animation | GSAP |
| Data visualization | Chart.js |

## Core Screens

1. **Main Dashboard** — Overview of upcoming games this week, recent results, and top player stats summary cards.
2. **Games Calendar** — Weekly calendar view of all scheduled games. Click a date to add a game; click a game to open its detail.
3. **Game Dashboard** — Detail view for a single game: roster, result (score), and per-player stats. Includes the stat entry form for completed games.
4. **Player Dashboard** — Detail view for a single player: career stats totals, game history table, and performance charts.
5. **Players List / CRUD** — Paginated/searchable list of all players with add, edit, and delete actions.

## Color & Typography
_To be defined during the scaffold task._

## References
None — UX defined from scratch.

## Open Questions
- [ ] Should the calendar support month view as well as week view, or week-only for v1?
- [ ] Define the exact stat categories to display on the Game Dashboard (goals, assists, yellow/red cards, minutes — confirm in database phase).
- [ ] Dark/light theme toggle placement (header vs. settings panel).
