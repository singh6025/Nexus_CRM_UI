import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/settings-overview-page/settings-overview-page.component').then((m) => m.SettingsOverviewPageComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-page/users-page.component').then((m) => m.UsersPageComponent),
  },
  {
    path: 'pipeline-stages',
    loadComponent: () =>
      import('./pages/pipeline-stages-page/pipeline-stages-page.component').then((m) => m.PipelineStagesPageComponent),
  },
  {
    path: 'tenant',
    loadComponent: () =>
      import('./pages/tenant-config-page/tenant-config-page.component').then((m) => m.TenantConfigPageComponent),
  },
];
