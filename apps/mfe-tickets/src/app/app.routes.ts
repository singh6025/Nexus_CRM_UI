import { Routes } from '@angular/router';
import { TICKETS_ROUTES } from './tickets/tickets.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', children: TICKETS_ROUTES },
];
