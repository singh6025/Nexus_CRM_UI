import { Routes } from '@angular/router';
import { BUYERS_ROUTES } from './buyers/buyers.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'buyers', pathMatch: 'full' },
  { path: 'buyers', children: BUYERS_ROUTES },
];
