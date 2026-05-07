import { Routes } from '@angular/router';

export const FARMERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/farmers-list-page/farmers-list-page.component').then((m) => m.FarmersListPageComponent),
  },
];
