import { Routes } from '@angular/router';

export const TICKETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/ticket-list/ticket-list.component').then(
        (m) => m.TicketListComponent
      ),
    title: 'Tickets',
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/ticket-form/ticket-form.component').then(
        (m) => m.TicketFormComponent
      ),
    title: 'Create Ticket',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/ticket-detail/ticket-detail.component').then(
        (m) => m.TicketDetailComponent
      ),
    title: 'Ticket Detail',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/ticket-form/ticket-form.component').then(
        (m) => m.TicketFormComponent
      ),
    title: 'Edit Ticket',
  },
];
