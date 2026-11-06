import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./features/games/games.routes').then((m) => m.gamesRoutes),
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
