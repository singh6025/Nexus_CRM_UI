import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataTableComponent, TableColumn, TableAction, ToastService } from '@farmeasy/ui-kit';
import { BuyerService } from '../../services/buyer.service';
import { Buyer, BuyerStatus, BuyerTier, STATUS_CONFIG, TIER_CONFIG } from '../../models/buyer.models';

@Component({
  selector: 'buyers-buyer-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    DataTableComponent,
  ],
  templateUrl: './buyer-list-page.component.html',
  styleUrl: './buyer-list-page.component.scss',
})
export class BuyerListPageComponent implements OnInit {
  private readonly svc    = inject(BuyerService);
  private readonly router = inject(Router);
  private readonly toast  = inject(ToastService);
  private readonly fb     = inject(FormBuilder);

  protected readonly buyers   = signal<Buyer[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(20);

  protected readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['' as BuyerStatus | ''],
    tier:   ['' as BuyerTier | ''],
  });

  protected readonly statusOptions = [
    { value: '' as const, label: 'All Statuses' },
    ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v as BuyerStatus, label: c.label })),
  ];

  protected readonly tierOptions = [
    { value: '' as const, label: 'All Tiers' },
    ...Object.entries(TIER_CONFIG).map(([v, c]) => ({ value: v as BuyerTier, label: c.label })),
  ];

  protected readonly columns: TableColumn<Buyer>[] = [
    { key: 'name',            label: 'Name',         sortable: true,
      type: 'link', routerLink: (r) => ['/buyers', r.id] },
    { key: 'companyName',     label: 'Company',       sortable: true },
    { key: 'phone',           label: 'Phone' },
    { key: 'city',            label: 'City',          sortable: true },
    { key: 'tier',            label: 'Tier',          type: 'badge',
      badgeVariant: (r) => this.tierVariant(r.tier as BuyerTier) },
    { key: 'status',          label: 'Status',        type: 'badge',
      badgeVariant: (r) => STATUS_CONFIG[r.status as BuyerStatus].variant },
    { key: 'gmvCurrentYear',  label: 'GMV (YTD)',     type: 'currency', sortable: true },
    { key: 'totalOrders',     label: 'Orders',        sortable: true },
  ];

  protected readonly actions: TableAction<Buyer>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/buyers', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/buyers', r.id, 'edit']) },
    { label: 'Delete', icon: 'delete',     danger: true, action: (r) => this.deleteBuyer(r as Buyer) },
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
    this.svc.getAll({
      page: this.page() + 1, size: this.pageSize(),
      search: f.search || undefined,
      status: f.status || undefined,
      tier: f.tier || undefined,
    } as Record<string, string | number>).subscribe({
      next: (res) => { this.buyers.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load buyers'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }
  protected onPage(e: PageEvent): void { this.page.set(e.pageIndex); this.pageSize.set(e.pageSize); this.load(); }

  private deleteBuyer(buyer: Buyer): void {
    if (!confirm(`Delete buyer "${buyer.name}"?`)) return;
    this.svc.remove(buyer.id).subscribe({
      next: () => { this.toast.success('Buyer deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete buyer'),
    });
  }

  private tierVariant(tier: BuyerTier): string {
    const map: Record<BuyerTier, string> = {
      platinum: 'info', gold: 'warning', silver: 'neutral', bronze: 'neutral',
    };
    return map[tier];
  }
}
