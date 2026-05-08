import {
  Component, inject, signal, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, STATUS_CONFIGS, ACTIVE_STATUSES } from '../../models/order.models';

@Component({
  selector: 'orders-order-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatProgressBarModule,
    BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './order-detail-page.component.html',
  styleUrl: './order-detail-page.component.scss',
})
export class OrderDetailPageComponent implements OnInit {
  @ViewChild('podInput') podInput!: ElementRef<HTMLInputElement>;

  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(OrderService);
  private readonly toast  = inject(ToastService);

  protected readonly order       = signal<Order | null>(null);
  protected readonly loading     = signal(true);
  protected readonly uploading   = signal(false);

  protected readonly statusConfigs = STATUS_CONFIGS;
  protected readonly activeStatuses = ACTIVE_STATUSES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (o) => { this.order.set(o); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load order'); this.loading.set(false); },
    });
  }

  protected statusLabel(status: OrderStatus): string {
    return STATUS_CONFIGS.find((c) => c.id === status)?.label ?? status;
  }

  protected statusColor(status: OrderStatus): string {
    return STATUS_CONFIGS.find((c) => c.id === status)?.color ?? '#78909c';
  }

  protected statusVariant(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'neutral', confirmed: 'info', processing: 'warning',
      dispatched: 'warning', delivered: 'success', cancelled: 'danger',
    };
    return map[status] ?? 'neutral';
  }

  protected isStepDone(stepId: OrderStatus, currentStatus: OrderStatus): boolean {
    const idx = ACTIVE_STATUSES.indexOf(stepId);
    const cur = ACTIVE_STATUSES.indexOf(currentStatus);
    return idx < cur;
  }

  protected isStepActive(stepId: OrderStatus, currentStatus: OrderStatus): boolean {
    return stepId === currentStatus;
  }

  protected advanceStatus(): void {
    const o = this.order();
    if (!o) return;
    const idx = ACTIVE_STATUSES.indexOf(o.status);
    if (idx < 0 || idx >= ACTIVE_STATUSES.length - 1) return;
    const next = ACTIVE_STATUSES[idx + 1];
    this.svc.updateStatus(o.id, next).subscribe({
      next: (updated) => { this.order.set(updated); this.toast.success(`Status updated to ${this.statusLabel(next)}`); },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  protected cancelOrder(): void {
    const o = this.order();
    if (!o || !confirm('Cancel this order?')) return;
    this.svc.updateStatus(o.id, 'cancelled').subscribe({
      next: (updated) => { this.order.set(updated); this.toast.success('Order cancelled'); },
      error: () => this.toast.error('Failed to cancel order'),
    });
  }

  protected triggerPodUpload(): void {
    this.podInput.nativeElement.click();
  }

  protected onPodFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.order()) return;
    this.uploading.set(true);
    this.svc.uploadPod(this.order()!.id, file).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.uploading.set(false);
        this.toast.success('POD uploaded successfully');
      },
      error: () => { this.uploading.set(false); this.toast.error('Failed to upload POD'); },
    });
  }

  protected deleteOrder(): void {
    const o = this.order();
    if (!o || !confirm(`Delete order ${o.orderNumber}?`)) return;
    this.svc.remove(o.id).subscribe({
      next: () => { this.toast.success('Order deleted'); this.router.navigate(['/orders']); },
      error: () => this.toast.error('Failed to delete order'),
    });
  }

  protected stepIcon(status: OrderStatus): string {
    return STATUS_CONFIGS.find((c) => c.id === status)?.icon ?? 'radio_button_unchecked';
  }

  protected canAdvance(status: OrderStatus): boolean {
    const idx = ACTIVE_STATUSES.indexOf(status);
    return idx >= 0 && idx < ACTIVE_STATUSES.length - 1;
  }
}
