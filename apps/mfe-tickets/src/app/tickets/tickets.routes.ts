import { Routes } from '@angular/router';

export const TICKETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ticket-list-page/ticket-list-page.component').then((m) => m.TicketListPageComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/ticket-form-page/ticket-form-page.component').then((m) => m.TicketFormPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/ticket-detail-page/ticket-detail-page.component').then((m) => m.TicketDetailPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/ticket-form-page/ticket-form-page.component').then((m) => m.TicketFormPageComponent),
  },
];
