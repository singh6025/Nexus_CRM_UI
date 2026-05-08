import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataTableComponent, TableColumn, ToastService } from '@farmeasy/ui-kit';
import { AnalyticsService } from '../../services/analytics.service';
import { SupplyDemandRow } from '../../models/analytics.models';

@Component({
  selector: 'analytics-supply-demand-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    DataTableComponent,
  ],
  templateUrl: './supply-demand-page.component.html',
  styleUrl: './supply-demand-page.component.scss',
})
export class SupplyDemandPageComponent implements OnInit {
  private readonly svc   = inject(AnalyticsService);
  private readonly toast = inject(ToastService);
  private readonly fb    = inject(FormBuilder);

  protected readonly rows     = signal<SupplyDemandRow[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(20);

  protected readonly filters = this.fb.nonNullable.group({ search: [''] });

  protected readonly columns: TableColumn<SupplyDemandRow>[] = [
    { key: 'name',      label: 'Commodity', sortable: true },
    { key: 'supplyKg',  label: 'Supply (kg)',  sortable: true },
    { key: 'demandKg',  label: 'Demand (kg)',  sortable: true },
    { key: 'variance',  label: 'Variance (kg)', sortable: true },
  ];

  constructor() {
    this.filters.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(),
    ).subscribe(() => { this.page.set(0); this.load(); });
  }

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    const f = this.filters.getRawValue();
    this.svc.getSupplyDemand({
      page: this.page() + 1, size: this.pageSize(),
      search: f.search || undefined,
    } as Record<string, string | number>).subscribe({
      next: (res) => { this.rows.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load supply/demand data'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }
  protected onPage(e: PageEvent): void { this.page.set(e.pageIndex); this.pageSize.set(e.pageSize); this.load(); }
}
