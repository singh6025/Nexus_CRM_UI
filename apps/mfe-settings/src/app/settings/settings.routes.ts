import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/settings-list-page/settings-list-page.component').then((m) => m.SettingsListPageComponent),
  },
];
