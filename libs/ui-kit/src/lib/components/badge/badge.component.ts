import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'open' | 'in-progress' | 'resolved' | 'closed'
  | 'low' | 'medium' | 'high' | 'critical'
  | 'new' | 'qualified' | 'won' | 'lost'
  | 'pending' | 'shipped' | 'delivered'
  | 'default';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ui-badge badge-{{ variant }}">{{ label }}</span>`,
  styles: [`
    .ui-badge {
      display: inline-flex; align-items: center; padding: 3px 10px;
      border-radius: 12px; font-size: 12px; font-weight: 600;
      white-space: nowrap; text-transform: capitalize;
    }
    .badge-open         { background: #e3f2fd; color: #1565c0; }
    .badge-in-progress  { background: #fff3e0; color: #e65100; }
    .badge-resolved     { background: #e8f5e9; color: #2e7d32; }
    .badge-closed       { background: #f5f5f5; color: #616161; }
    .badge-low          { background: #f3e5f5; color: #6a1b9a; }
    .badge-medium       { background: #fff9c4; color: #f57f17; }
    .badge-high         { background: #fce4ec; color: #c62828; }
    .badge-critical     { background: #b71c1c; color: #fff; }
    .badge-new          { background: #e8f5e9; color: #1b5e20; }
    .badge-qualified    { background: #e3f2fd; color: #0d47a1; }
    .badge-won          { background: #e8f5e9; color: #2e7d32; }
    .badge-lost         { background: #fce4ec; color: #b71c1c; }
    .badge-pending      { background: #fff8e1; color: #f9a825; }
    .badge-shipped      { background: #e0f2f1; color: #00695c; }
    .badge-delivered    { background: #e8f5e9; color: #2e7d32; }
    .badge-default      { background: #eeeeee; color: #424242; }
  `],
})
export class BadgeComponent {
  @Input() label = '';
  @Input() variant: BadgeVariant = 'default';
}
