import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { AlertItem } from '../../models/dashboard.models';

@Component({
  selector: 'dashboard-alerts-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './alerts-feed.component.html',
  styleUrl: './alerts-feed.component.scss',
})
export class AlertsFeedComponent {
  readonly alerts = input.required<AlertItem[]>();
  readonly markRead = output<string>();

  readonly iconMap: Record<AlertItem['type'], string> = {
    lead: 'person_add',
    opportunity: 'trending_up',
    order: 'shopping_cart',
    ticket: 'confirmation_number',
    system: 'settings',
  };

  readonly colorMap: Record<AlertItem['type'], string> = {
    lead: '#1565c0',
    opportunity: '#e65100',
    order: '#6a1b9a',
    ticket: '#c62828',
    system: '#37474f',
  };
}
