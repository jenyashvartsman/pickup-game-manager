import { Routes } from '@angular/router';

export const gamesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/games-calendar-page/games-calendar-page.component'
      ).then((m) => m.GamesCalendarPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/game-form-page/game-form-page.component').then(
        (m) => m.GameFormPageComponent
      ),
  },
];
