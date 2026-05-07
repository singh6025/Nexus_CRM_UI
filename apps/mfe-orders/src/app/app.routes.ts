import { Routes } from '@angular/router';
import { ORDERS_ROUTES } from './orders/orders.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', children: ORDERS_ROUTES },
];
