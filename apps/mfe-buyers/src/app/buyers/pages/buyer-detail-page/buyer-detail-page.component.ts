import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { BuyerService } from '../../services/buyer.service';
import { Buyer, BuyerStatus, STATUS_CONFIG, TIER_CONFIG } from '../../models/buyer.models';

@Component({
  selector: 'buyers-buyer-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatCardModule, MatSelectModule,
    BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './buyer-detail-page.component.html',
  styleUrl: './buyer-detail-page.component.scss',
})
export class BuyerDetailPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(BuyerService);
  private readonly toast  = inject(ToastService);

  protected readonly buyer   = signal<Buyer | null>(null);
  protected readonly loading = signal(true);

  protected readonly statusConfig  = STATUS_CONFIG;
  protected readonly tierConfig    = TIER_CONFIG;
  protected readonly statusOptions = Object.keys(STATUS_CONFIG) as BuyerStatus[];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (b) => { this.buyer.set(b); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load buyer'); this.loading.set(false); },
    });
  }

  protected onStatusChange(status: BuyerStatus): void {
    const b = this.buyer();
    if (!b) return;
    this.svc.updateStatus(b.id, status).subscribe({
      next: (updated) => { this.buyer.set(updated); this.toast.success('Status updated'); },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  protected delete(): void {
    const b = this.buyer();
    if (!b || !confirm(`Delete buyer "${b.name}"?`)) return;
    this.svc.remove(b.id).subscribe({
      next: () => { this.toast.success('Buyer deleted'); this.router.navigate(['/buyers']); },
      error: () => this.toast.error('Failed to delete buyer'),
    });
  }
}
