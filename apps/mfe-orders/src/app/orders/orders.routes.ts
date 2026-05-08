import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order-list-page/order-list-page.component').then((m) => m.OrderListPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/order-form-page/order-form-page.component').then((m) => m.OrderFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order-detail-page/order-detail-page.component').then((m) => m.OrderDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/order-form-page/order-form-page.component').then((m) => m.OrderFormPageComponent),
  },
];
