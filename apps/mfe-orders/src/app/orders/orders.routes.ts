import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/orders-list-page/orders-list-page.component').then((m) => m.OrdersListPageComponent),
  },
];
