import { Routes } from '@angular/router';

export const BUYERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/buyer-list-page/buyer-list-page.component').then((m) => m.BuyerListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/buyer-form-page/buyer-form-page.component').then((m) => m.BuyerFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/buyer-detail-page/buyer-detail-page.component').then((m) => m.BuyerDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/buyer-form-page/buyer-form-page.component').then((m) => m.BuyerFormPageComponent),
  },
];
