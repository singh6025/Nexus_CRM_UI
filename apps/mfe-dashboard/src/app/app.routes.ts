import { Routes } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', children: DASHBOARD_ROUTES },
];
