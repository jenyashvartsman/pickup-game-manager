# Task 015 — GSAP Animations & Page Transitions

## Objective
Add GSAP animations to the app: page entrance animations (stagger cards into view), stat counter animations on the dashboards (numbers count up on load), and a smooth transition between calendar weeks (slide left/right).

## Context

- [ ] Read .factory/docs/frontend.md
- [ ] Read .factory/docs/ux.md

## Scope

| Action | File |
|--------|------|
| Create | apps/web/src/app/core/services/animation.service.ts |
| Modify | apps/web/src/app/features/dashboard/pages/dashboard-page/ (add entrance animation) |
| Modify | apps/web/src/app/features/games/components/calendar-week/ (add week-slide animation) |
| Modify | apps/web/src/app/features/players/pages/player-detail-page/ (add stat counter animation) |

## Acceptance Criteria

- [ ] Dashboard cards animate in with a stagger effect on page load (GSAP timeline)
- [ ] Stat number counters on the Player Dashboard count up from 0 to their final value on load
- [ ] Calendar week navigation slides the week view left (next) or right (previous) with GSAP
- [ ] Animations do not block interactivity (all use `gsap.to()` with short durations ≤ 400ms)
- [ ] Animations are skipped when `prefers-reduced-motion` media query is active
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
Task 012, Task 013, Task 014

## Notes
_Fill in after execution._
