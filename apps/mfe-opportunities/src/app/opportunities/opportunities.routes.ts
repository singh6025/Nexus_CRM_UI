import { Routes } from '@angular/router';

export const OPPORTUNITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/opportunities-list-page/opportunities-list-page.component').then((m) => m.OpportunitiesListPageComponent),
  },
];
