import { Routes } from '@angular/router';
import { COMMODITIES_ROUTES } from './commodities/commodities.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'commodities', pathMatch: 'full' },
  { path: 'commodities', children: COMMODITIES_ROUTES },
];
