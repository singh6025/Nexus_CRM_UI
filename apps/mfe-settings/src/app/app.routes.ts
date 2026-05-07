import { Routes } from '@angular/router';
import { SETTINGS_ROUTES } from './settings/settings.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'settings', children: SETTINGS_ROUTES },
];
