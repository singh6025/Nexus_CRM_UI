import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MetricCardComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { DashboardService } from '../../services/dashboard.service';
import { KpiData, PipelineSummary, AlertItem } from '../../models/dashboard.models';
import { AlertsFeedComponent } from '../../components/alerts-feed/alerts-feed.component';
import { PipelineSummaryComponent } from '../../components/pipeline-summary/pipeline-summary.component';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MetricCardComponent, CurrencyInrPipe,
    AlertsFeedComponent, PipelineSummaryComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly svc   = inject(DashboardService);
  private readonly toast = inject(ToastService);

  protected readonly kpis     = signal<KpiData | null>(null);
  protected readonly pipeline = signal<PipelineSummary | null>(null);
  protected readonly alerts   = signal<AlertItem[]>([]);
  protected readonly loading  = signal(true);

  ngOnInit(): void {
    this.svc.getDashboard().subscribe({
      next: (data) => {
        this.kpis.set(data.kpis);
        this.pipeline.set(data.pipeline);
        this.alerts.set(data.alerts);
        this.loading.set(false);
      },
      error: () => { this.toast.error('Failed to load dashboard'); this.loading.set(false); },
    });
  }
}
