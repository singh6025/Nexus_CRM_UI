import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
}

@Component({
  selector: 'crm-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Tickets', icon: 'confirmation_number', route: '/tickets', badge: 12 },
    { label: 'Contacts', icon: 'contacts', route: '/contacts' },
    { label: 'Accounts', icon: 'business', route: '/accounts' },
    { label: 'Leads', icon: 'leaderboard', route: '/leads' },
    { label: 'Opportunities', icon: 'trending_up', route: '/opportunities' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
  ];

  bottomNavItems: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Help & Support', icon: 'help', route: '/help' },
  ];
}
