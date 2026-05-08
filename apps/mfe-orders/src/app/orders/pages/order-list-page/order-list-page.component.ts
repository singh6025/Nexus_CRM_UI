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
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, STATUS_CONFIGS } from '../../models/order.models';

@Component({
  selector: 'orders-order-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    DataTableComponent,
  ],
  templateUrl: './order-list-page.component.html',
  styleUrl: './order-list-page.component.scss',
})
export class OrderListPageComponent implements OnInit {
  private readonly svc    = inject(OrderService);
  private readonly router = inject(Router);
  private readonly toast  = inject(ToastService);
  private readonly fb     = inject(FormBuilder);

  protected readonly orders   = signal<Order[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(20);

  protected readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['' as OrderStatus | ''],
  });

  protected readonly statusOptions = [
    { value: '' as const,            label: 'All Statuses' },
    ...STATUS_CONFIGS.map((c) => ({ value: c.id, label: c.label })),
  ];

  protected readonly columns: TableColumn<Order>[] = [
    { key: 'orderNumber',  label: 'Order #',    sortable: true,
      type: 'link', routerLink: (r) => ['/orders', r.id] },
    { key: 'buyerName',    label: 'Buyer',       sortable: true },
    { key: 'farmerName',   label: 'Farmer',      sortable: true },
    { key: 'totalAmount',  label: 'Amount',      type: 'currency', sortable: true },
    { key: 'status',       label: 'Status',      type: 'badge',
      badgeVariant: (r) => this.statusVariant(r.status as OrderStatus) },
    { key: 'expectedDelivery', label: 'Expected Delivery', type: 'date', sortable: true },
  ];

  protected readonly actions: TableAction<Order>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/orders', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/orders', r.id, 'edit']),
      hidden: (r) => (r.status as string) === 'delivered' || (r.status as string) === 'cancelled' },
    { label: 'Delete', icon: 'delete',     danger: true, action: (r) => this.deleteOrder(r as Order) },
  ];

  constructor() {
    this.filters.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(() => { this.page.set(0); this.load(); });
  }

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    const f = this.filters.getRawValue();
    this.svc.getAll({
      page:   this.page() + 1,
      size:   this.pageSize(),
      search: f.search || undefined,
      status: f.status  || undefined,
    } as Record<string, string | number>).subscribe({
      next: (res) => { this.orders.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load orders'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }

  protected onPage(e: PageEvent): void {
    this.page.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.load();
  }

  private deleteOrder(order: Order): void {
    if (!confirm(`Delete order ${order.orderNumber}?`)) return;
    this.svc.remove(order.id).subscribe({
      next: () => { this.toast.success('Order deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete order'),
    });
  }

  private statusVariant(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'neutral', confirmed: 'info', processing: 'warning',
      dispatched: 'warning', delivered: 'success', cancelled: 'danger',
    };
    return map[status] ?? 'neutral';
  }
}
