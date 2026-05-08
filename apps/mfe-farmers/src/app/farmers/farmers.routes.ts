import { Routes } from '@angular/router';

export const FARMERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/farmer-list-page/farmer-list-page.component').then((m) => m.FarmerListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/farmer-form-page/farmer-form-page.component').then((m) => m.FarmerFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/farmer-detail-page/farmer-detail-page.component').then((m) => m.FarmerDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/farmer-form-page/farmer-form-page.component').then((m) => m.FarmerFormPageComponent),
  },
];
