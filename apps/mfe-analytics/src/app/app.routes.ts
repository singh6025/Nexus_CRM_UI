import { Routes } from '@angular/router';
import { ANALYTICS_ROUTES } from './analytics/analytics.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'analytics', pathMatch: 'full' },
  { path: 'analytics', children: ANALYTICS_ROUTES },
];
