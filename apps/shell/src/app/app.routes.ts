import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { authGuard } from '@farmeasy/shared-auth';
import { ShellLayoutComponent } from './layout/shell-layout/shell-layout.component';

const remote = (name: string, entry: string, mod: string) =>
  loadRemoteModule({ type: 'module', remoteEntry: entry, exposedModule: mod });

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page.component').then((m) => m.LoginPageComponent),
    title: 'Login – FarmEasy CRM',
  },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          remote('mfeDashboard', 'http://localhost:4202/remoteEntry.js', './Module')
            .then((m) => m.DASHBOARD_ROUTES),
        title: 'Dashboard – FarmEasy CRM',
      },
      {
        path: 'leads',
        loadChildren: () =>
          remote('mfeLeads', 'http://localhost:4203/remoteEntry.js', './Module')
            .then((m) => m.LEADS_ROUTES),
        title: 'Leads – FarmEasy CRM',
      },
      {
        path: 'opportunities',
        loadChildren: () =>
          remote('mfeOpportunities', 'http://localhost:4204/remoteEntry.js', './Module')
            .then((m) => m.OPPORTUNITIES_ROUTES),
        title: 'Opportunities – FarmEasy CRM',
      },
      {
        path: 'orders',
        loadChildren: () =>
          remote('mfeOrders', 'http://localhost:4205/remoteEntry.js', './Module')
            .then((m) => m.ORDERS_ROUTES),
        title: 'Orders – FarmEasy CRM',
      },
      {
        path: 'buyers',
        loadChildren: () =>
          remote('mfeBuyers', 'http://localhost:4206/remoteEntry.js', './Module')
            .then((m) => m.BUYERS_ROUTES),
        title: 'Buyers – FarmEasy CRM',
      },
      {
        path: 'farmers',
        loadChildren: () =>
          remote('mfeFarmers', 'http://localhost:4207/remoteEntry.js', './Module')
            .then((m) => m.FARMERS_ROUTES),
        title: 'Farmers – FarmEasy CRM',
      },
      {
        path: 'commodities',
        loadChildren: () =>
          remote('mfeCommodities', 'http://localhost:4208/remoteEntry.js', './Module')
            .then((m) => m.COMMODITIES_ROUTES),
        title: 'Commodities – FarmEasy CRM',
      },
      {
        path: 'tickets',
        loadChildren: () =>
          remote('mfeTickets', 'http://localhost:4201/remoteEntry.js', './Module')
            .then((m) => m.TICKETS_ROUTES),
        title: 'Tickets – FarmEasy CRM',
      },
      {
        path: 'analytics',
        loadChildren: () =>
          remote('mfeAnalytics', 'http://localhost:4209/remoteEntry.js', './Module')
            .then((m) => m.ANALYTICS_ROUTES),
        title: 'Analytics – FarmEasy CRM',
      },
      {
        path: 'settings',
        loadChildren: () =>
          remote('mfeSettings', 'http://localhost:4210/remoteEntry.js', './Module')
            .then((m) => m.SETTINGS_ROUTES),
        title: 'Settings – FarmEasy CRM',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
