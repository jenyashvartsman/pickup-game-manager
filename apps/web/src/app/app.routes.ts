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
    loadChildren: () =>
      import('./features/players/players.routes').then(
        (m) => m.playersRoutes
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
