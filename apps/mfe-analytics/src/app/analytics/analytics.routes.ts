import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/analytics-dashboard-page/analytics-dashboard-page.component').then((m) => m.AnalyticsDashboardPageComponent),
  },
  {
    path: 'supply-demand',
    loadComponent: () =>
      import('./pages/supply-demand-page/supply-demand-page.component').then((m) => m.SupplyDemandPageComponent),
  },
];
