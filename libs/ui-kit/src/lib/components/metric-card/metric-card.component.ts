import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ui-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="metric-card">
      <div class="metric-body">
        <div class="metric-info">
          <span class="metric-label">{{ label }}</span>
          <span class="metric-value">{{ value }}</span>
          @if (trend !== null) {
            <span class="metric-trend" [class.positive]="trend >= 0" [class.negative]="trend < 0">
              <mat-icon>{{ trend >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ trend >= 0 ? '+' : '' }}{{ trend }}%
            </span>
          }
        </div>
        <div class="metric-icon" [style.background]="iconBg">
          <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
        </div>
      </div>
      @if (subtitle) {
        <p class="metric-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [`
    .metric-card { background: var(--surface-card); border-radius: 12px;
      padding: 20px; box-shadow: var(--shadow-sm); }
    .metric-body { display: flex; justify-content: space-between; align-items: center; }
    .metric-info { display: flex; flex-direction: column; gap: 4px; }
    .metric-label { font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--text-secondary); }
    .metric-value { font-size: 28px; font-weight: 700; color: var(--text-primary); line-height: 1; }
    .metric-trend { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &.positive { color: var(--color-success); }
      &.negative { color: var(--color-error); }
    }
    .metric-icon { width: 52px; height: 52px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 26px; width: 26px; height: 26px; }
    }
    .metric-subtitle { margin: 10px 0 0; font-size: 12px; color: var(--text-secondary); }
  `],
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = 'analytics';
  @Input() iconColor = 'var(--color-primary)';
  @Input() iconBg = 'var(--color-primary-light)';
  @Input() trend: number | null = null;
  @Input() subtitle: string | null = null;
}
