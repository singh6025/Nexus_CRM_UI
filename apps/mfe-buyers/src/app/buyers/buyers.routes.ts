import { Routes } from '@angular/router';

export const BUYERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/buyers-list-page/buyers-list-page.component').then((m) => m.BuyersListPageComponent),
  },
];
