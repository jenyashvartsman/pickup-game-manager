import { Routes } from '@angular/router';

export const playersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/players-list-page/players-list-page.component').then(
        (m) => m.PlayersListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/player-form-page/player-form-page.component').then(
        (m) => m.PlayerFormPageComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/player-form-page/player-form-page.component').then(
        (m) => m.PlayerFormPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/player-detail-page/player-detail-page.component').then(
        (m) => m.PlayerDetailPageComponent
      ),
  },
];
