import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { FarmerService } from '../../services/farmer.service';
import { Farmer, FarmerStatus, STATUS_CONFIG } from '../../models/farmer.models';

@Component({
  selector: 'farmers-farmer-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatSelectModule,
    BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './farmer-detail-page.component.html',
  styleUrl: './farmer-detail-page.component.scss',
})
export class FarmerDetailPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(ToastService);
  private readonly farmerSvc = inject(FarmerService);
  private readonly toast  = inject(ToastService);

  protected readonly farmer  = signal<Farmer | null>(null);
  protected readonly loading = signal(true);
  protected readonly statusConfig = STATUS_CONFIG;
  protected readonly statusOptions: FarmerStatus[] = ['active', 'inactive', 'onboarding', 'suspended'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.farmerSvc.getById(id).subscribe({
      next: (f) => { this.farmer.set(f); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load farmer'); this.loading.set(false); },
    });
  }

  protected statusVariant(status: FarmerStatus): string {
    const map: Record<FarmerStatus, string> = {
      active: 'success', inactive: 'neutral', onboarding: 'warning', suspended: 'danger',
    };
    return map[status];
  }

  protected onStatusChange(status: FarmerStatus): void {
    const f = this.farmer();
    if (!f) return;
    this.farmerSvc.updateStatus(f.id, status).subscribe({
      next: (updated) => { this.farmer.set(updated); this.toast.success('Status updated'); },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  protected delete(): void {
    const f = this.farmer();
    if (!f || !confirm(`Delete farmer "${f.name}"?`)) return;
    this.farmerSvc.remove(f.id).subscribe({
      next: () => { this.toast.success('Farmer deleted'); this.router.navigate(['/farmers']); },
      error: () => this.toast.error('Failed to delete farmer'),
    });
  }
}
