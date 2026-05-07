import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/analytics-list-page/analytics-list-page.component').then((m) => m.AnalyticsListPageComponent),
  },
];
