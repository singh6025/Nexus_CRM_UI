import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsDashboard } from '../../models/analytics.models';

@Component({
  selector: 'analytics-analytics-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MatButtonModule, MatIconModule, MatCardModule,
    CurrencyInrPipe,
  ],
  templateUrl: './analytics-dashboard-page.component.html',
  styleUrl: './analytics-dashboard-page.component.scss',
})
export class AnalyticsDashboardPageComponent implements OnInit {
  private readonly svc   = inject(AnalyticsService);
  private readonly toast = inject(ToastService);

  protected readonly dashboard = signal<AnalyticsDashboard | null>(null);
  protected readonly loading   = signal(true);

  ngOnInit(): void {
    this.svc.getDashboard().subscribe({
      next: (d) => { this.dashboard.set(d); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load analytics'); this.loading.set(false); },
    });
  }

  protected maxRevenue(d: AnalyticsDashboard): number {
    return Math.max(...d.revenueTrends.map((t) => t.revenue), 1);
  }

  protected maxFunnelCount(d: AnalyticsDashboard): number {
    return Math.max(...d.funnelStages.map((s) => s.count), 1);
  }

  protected maxCommodityRevenue(d: AnalyticsDashboard): number {
    return Math.max(...d.topCommodities.map((c) => c.revenue), 1);
  }

  protected growthIcon(pct: number): string {
    return pct >= 0 ? 'trending_up' : 'trending_down';
  }

  protected growthClass(pct: number): string {
    return pct >= 0 ? 'positive' : 'negative';
  }
}
