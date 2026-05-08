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
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { CommodityService } from '../../services/commodity.service';
import { Commodity, CommodityCategory, CommodityGrade, CATEGORY_CONFIG, GRADE_CONFIG } from '../../models/commodity.models';

@Component({
  selector: 'commodities-commodity-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    DataTableComponent, CurrencyInrPipe,
  ],
  templateUrl: './commodity-list-page.component.html',
  styleUrl: './commodity-list-page.component.scss',
})
export class CommodityListPageComponent implements OnInit {
  private readonly svc    = inject(CommodityService);
  private readonly router = inject(Router);
  private readonly toast  = inject(ToastService);
  private readonly fb     = inject(FormBuilder);

  protected readonly commodities = signal<Commodity[]>([]);
  protected readonly total       = signal(0);
  protected readonly loading     = signal(false);
  protected readonly page        = signal(0);
  protected readonly pageSize    = signal(20);

  protected readonly filters = this.fb.nonNullable.group({
    search:   [''],
    category: ['' as CommodityCategory | ''],
    grade:    ['' as CommodityGrade | ''],
  });

  protected readonly categoryOptions = [
    { value: '' as const,              label: 'All Categories' },
    ...Object.entries(CATEGORY_CONFIG).map(([v, c]) => ({ value: v as CommodityCategory, label: c.label })),
  ];

  protected readonly gradeOptions = [
    { value: '' as const,           label: 'All Grades' },
    ...Object.entries(GRADE_CONFIG).map(([v, c]) => ({ value: v as CommodityGrade, label: c.label })),
  ];

  protected readonly columns: TableColumn<Commodity>[] = [
    { key: 'name',         label: 'Commodity',   sortable: true,
      type: 'link', routerLink: (r) => ['/commodities', r.id] },
    { key: 'category',     label: 'Category',    type: 'badge',
      badgeVariant: (r) => CATEGORY_CONFIG[r.category as CommodityCategory].variant },
    { key: 'grade',        label: 'Grade',       type: 'badge',
      badgeVariant: (r) => GRADE_CONFIG[r.grade as CommodityGrade].variant },
    { key: 'unit',         label: 'Unit' },
    { key: 'currentPrice', label: 'Price',       type: 'currency', sortable: true },
    { key: 'weeklyHigh',   label: 'Weekly High', type: 'currency', sortable: true },
    { key: 'weeklyLow',    label: 'Weekly Low',  type: 'currency', sortable: true },
    { key: 'activeOrders', label: 'Orders',      sortable: true },
  ];

  protected readonly actions: TableAction<Commodity>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/commodities', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/commodities', r.id, 'edit']) },
    { label: 'Delete', icon: 'delete',     danger: true, action: (r) => this.deleteCommodity(r as Commodity) },
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
      search:   f.search   || undefined,
      category: f.category || undefined,
      grade:    f.grade    || undefined,
    } as Record<string, string | number>).subscribe({
      next: (res) => { this.commodities.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load commodities'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }
  protected onPage(e: PageEvent): void { this.page.set(e.pageIndex); this.pageSize.set(e.pageSize); this.load(); }

  private deleteCommodity(commodity: Commodity): void {
    if (!confirm(`Delete commodity "${commodity.name}"?`)) return;
    this.svc.remove(commodity.id).subscribe({
      next: () => { this.toast.success('Commodity deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete commodity'),
    });
  }
}
