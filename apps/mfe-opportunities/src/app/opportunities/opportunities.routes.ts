import { Routes } from '@angular/router';

export const OPPORTUNITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/opportunities-kanban-page/opportunities-kanban-page.component')
        .then((m) => m.OpportunitiesKanbanPageComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/opportunity-form-page/opportunity-form-page.component')
        .then((m) => m.OpportunityFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/opportunity-detail-page/opportunity-detail-page.component')
        .then((m) => m.OpportunityDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/opportunity-form-page/opportunity-form-page.component')
        .then((m) => m.OpportunityFormPageComponent),
  },
];
