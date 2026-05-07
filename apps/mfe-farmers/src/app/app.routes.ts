import { Routes } from '@angular/router';
import { FARMERS_ROUTES } from './farmers/farmers.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'farmers', pathMatch: 'full' },
  { path: 'farmers', children: FARMERS_ROUTES },
];
