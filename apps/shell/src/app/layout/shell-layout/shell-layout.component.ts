import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AppStore } from '@farmeasy/shared-state';
import { AuthStore, AuthService } from '@farmeasy/shared-auth';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: () => number;
}

@Component({
  selector: 'crm-shell-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, MatSidenavModule, MatToolbarModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule,
    MatListModule, MatTooltipModule, MatDividerModule,
  ],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
})
export class ShellLayoutComponent {
  protected readonly appStore = inject(AppStore);
  protected readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: 'dashboard',           route: '/dashboard' },
    { label: 'Leads',         icon: 'leaderboard',         route: '/leads' },
    { label: 'Opportunities', icon: 'trending_up',         route: '/opportunities' },
    { label: 'Orders',        icon: 'local_shipping',      route: '/orders' },
    { label: 'Buyers',        icon: 'store',               route: '/buyers' },
    { label: 'Farmers',       icon: 'agriculture',         route: '/farmers' },
    { label: 'Commodities',   icon: 'grain',               route: '/commodities' },
    { label: 'Tickets',       icon: 'confirmation_number', route: '/tickets' },
    { label: 'Analytics',     icon: 'bar_chart',           route: '/analytics' },
  ];

  bottomNavItems: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
