import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './features/dashboard/pages/dashboard-page/dashboard-page.component'
      ).then((m) => m.DashboardPageComponent),
  },
  {
    path: 'games',
    loadComponent: () =>
      import(
        './features/games/pages/games-calendar-page/games-calendar-page.component'
      ).then((m) => m.GamesCalendarPageComponent),
  },
  {
    path: 'players',
    loadComponent: () =>
      import(
        './features/players/pages/players-list-page/players-list-page.component'
      ).then((m) => m.PlayersListPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
