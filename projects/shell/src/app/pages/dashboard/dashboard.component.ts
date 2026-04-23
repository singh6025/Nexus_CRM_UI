import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  trend: number;
  color: string;
}

interface RecentTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  created: Date;
}

@Component({
  selector: 'crm-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  stats: StatCard[] = [
    { label: 'Total Tickets', value: 284, icon: 'confirmation_number', trend: 12, color: '#3f51b5' },
    { label: 'Open', value: 47, icon: 'radio_button_unchecked', trend: -3, color: '#f44336' },
    { label: 'In Progress', value: 93, icon: 'pending', trend: 8, color: '#ff9800' },
    { label: 'Resolved', value: 144, icon: 'check_circle', trend: 21, color: '#4caf50' },
  ];

  recentTickets: RecentTicket[] = [
    { id: 'TKT-1042', title: 'Login page not loading on Safari', status: 'in-progress', priority: 'high', assignee: 'Alex J.', created: new Date('2026-04-22') },
    { id: 'TKT-1041', title: 'Export to CSV fails for large datasets', status: 'open', priority: 'critical', assignee: 'Sarah M.', created: new Date('2026-04-22') },
    { id: 'TKT-1040', title: 'Email notifications not being sent', status: 'resolved', priority: 'medium', assignee: 'Tom K.', created: new Date('2026-04-21') },
    { id: 'TKT-1039', title: 'Dashboard chart colors incorrect in dark mode', status: 'open', priority: 'low', assignee: 'Nina P.', created: new Date('2026-04-21') },
    { id: 'TKT-1038', title: 'API rate limit errors on bulk operations', status: 'in-progress', priority: 'high', assignee: 'Alex J.', created: new Date('2026-04-20') },
  ];

  displayedColumns = ['id', 'title', 'status', 'priority', 'assignee', 'created'];
}
