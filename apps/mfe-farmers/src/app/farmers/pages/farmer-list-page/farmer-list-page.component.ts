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
import { KgFormatPipe, CurrencyInrPipe } from '@farmeasy/shared-utils';
import { FarmerService } from '../../services/farmer.service';
import { Farmer, FarmerStatus, STATUS_CONFIG } from '../../models/farmer.models';

@Component({
  selector: 'farmers-farmer-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    DataTableComponent, KgFormatPipe, CurrencyInrPipe,
  ],
  templateUrl: './farmer-list-page.component.html',
  styleUrl: './farmer-list-page.component.scss',
})
export class FarmerListPageComponent implements OnInit {
  private readonly svc    = inject(FarmerService);
  private readonly router = inject(Router);
  private readonly toast  = inject(ToastService);
  private readonly fb     = inject(FormBuilder);

  protected readonly farmers  = signal<Farmer[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(20);

  protected readonly filters = this.fb.nonNullable.group({
    search:   [''],
    status:   ['' as FarmerStatus | ''],
    district: [''],
  });

  protected readonly statusOptions = [
    { value: '' as const,       label: 'All Statuses' },
    { value: 'active',          label: 'Active' },
    { value: 'inactive',        label: 'Inactive' },
    { value: 'onboarding',      label: 'Onboarding' },
    { value: 'suspended',       label: 'Suspended' },
  ];

  protected readonly columns: TableColumn<Farmer>[] = [
    { key: 'name',                 label: 'Name',            sortable: true,
      type: 'link', routerLink: (r) => ['/farmers', r.id] },
    { key: 'phone',                label: 'Phone' },
    { key: 'district',             label: 'District',        sortable: true },
    { key: 'state',                label: 'State',           sortable: true },
    { key: 'landSize',             label: 'Land',
      format: (r) => `${r.landSize} ${r.landUnit}` },
    { key: 'status',               label: 'Status',          type: 'badge',
      badgeVariant: (r) => this.statusVariant(r.status as FarmerStatus) },
    { key: 'totalSupplyKg',        label: 'Total Supply',
      format: (r) => `${(r.totalSupplyKg as number / 1000).toFixed(1)} MT` },
    { key: 'assignedAgentName',    label: 'Agent' },
  ];

  protected readonly actions: TableAction<Farmer>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/farmers', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/farmers', r.id, 'edit']) },
    { label: 'Delete', icon: 'delete',     danger: true, action: (r) => this.deleteFarmer(r as Farmer) },
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
      search: f.search || undefined, status: f.status || undefined,
      district: f.district || undefined,
    } as Record<string, string | number>).subscribe({
      next: (res) => { this.farmers.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load farmers'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }
  protected onPage(e: PageEvent): void { this.page.set(e.pageIndex); this.pageSize.set(e.pageSize); this.load(); }

  private deleteFarmer(farmer: Farmer): void {
    if (!confirm(`Delete farmer "${farmer.name}"?`)) return;
    this.svc.remove(farmer.id).subscribe({
      next: () => { this.toast.success('Farmer deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete farmer'),
    });
  }

  private statusVariant(status: FarmerStatus): string {
    const map: Record<FarmerStatus, string> = {
      active: 'success', inactive: 'neutral', onboarding: 'warning', suspended: 'danger',
    };
    return map[status] ?? 'neutral';
  }
}
