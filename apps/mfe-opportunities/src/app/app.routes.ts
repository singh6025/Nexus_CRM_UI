import { Routes } from '@angular/router';
import { OPPORTUNITIES_ROUTES } from './opportunities/opportunities.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'opportunities', pathMatch: 'full' },
  { path: 'opportunities', children: OPPORTUNITIES_ROUTES },
];
