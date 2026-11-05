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
`.factory/ux/image.png` — Goal Weight fitness dashboard (design reference).

Key patterns to adopt:
- **Card grid** — stats and content in bordered cards with subtle elevation; consistent padding; rounded corners (~8–12px)
- **Metric prominence** — large bold numbers (2–3rem) for key stats (goals, games played, win rate); secondary label below in muted color
- **Section headers** — bold heading left + "View all" link right; consistent vertical rhythm between sections
- **Sidebar nav** (desktop) — icon + label; active item uses accent color fill; collapsed to icons only on narrow screens. Note: current shell uses a top header — reconsider sidebar for tasks 010+.
- **Accent color** — bright green (#00d4aa dark / #0969da light) used sparingly: active nav, CTAs, positive stat highlights
- **Charts** — bar charts for activity over time; ring/donut for ratios; muted gridlines; no chart borders
- **Avatar / player cards** — circular avatar placeholder, name + position, inline stat badges
- **Dark default** — dark background (#0d1117) with elevated card surfaces (#1c2128); light theme inverts to white cards on grey bg

## Open Questions
- [ ] Should the calendar support month view as well as week view, or week-only for v1?
- [ ] Define the exact stat categories to display on the Game Dashboard (goals, assists, yellow/red cards, minutes — confirm in database phase).
- [ ] Dark/light theme toggle placement (header vs. settings panel).
- [x] Switch from top-header nav to sidebar nav for desktop — **done**: HeaderComponent replaced with SidebarComponent; 240px sticky sidebar on desktop, slide-in overlay on mobile.
