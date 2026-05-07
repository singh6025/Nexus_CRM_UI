import { Routes } from '@angular/router';
import { LEADS_ROUTES } from './leads/leads.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'leads', pathMatch: 'full' },
  { path: 'leads', children: LEADS_ROUTES },
];
