import { Routes } from '@angular/router';

export const COMMODITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/commodity-list-page/commodity-list-page.component').then((m) => m.CommodityListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/commodity-form-page/commodity-form-page.component').then((m) => m.CommodityFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/commodity-detail-page/commodity-detail-page.component').then((m) => m.CommodityDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/commodity-form-page/commodity-form-page.component').then((m) => m.CommodityFormPageComponent),
  },
];
