import { Routes } from '@angular/router';

export const COMMODITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/commodities-list-page/commodities-list-page.component').then((m) => m.CommoditiesListPageComponent),
  },
];
