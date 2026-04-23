import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard – Nexus CRM',
  },
  {
    path: 'tickets',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Module',
      }).then((m) => m.TICKETS_ROUTES),
    title: 'Tickets – Nexus CRM',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
