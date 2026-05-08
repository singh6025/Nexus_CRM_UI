import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { CommodityService } from '../../services/commodity.service';
import { Commodity, CATEGORY_CONFIG, GRADE_CONFIG } from '../../models/commodity.models';

@Component({
  selector: 'commodities-commodity-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MatButtonModule, MatIconModule, MatCardModule,
    BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './commodity-detail-page.component.html',
  styleUrl: './commodity-detail-page.component.scss',
})
export class CommodityDetailPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(CommodityService);
  private readonly toast  = inject(ToastService);

  protected readonly commodity = signal<Commodity | null>(null);
  protected readonly loading   = signal(true);

  protected readonly categoryConfig = CATEGORY_CONFIG;
  protected readonly gradeConfig    = GRADE_CONFIG;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (c) => { this.commodity.set(c); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load commodity'); this.loading.set(false); },
    });
  }

  protected delete(): void {
    const c = this.commodity();
    if (!c || !confirm(`Delete commodity "${c.name}"?`)) return;
    this.svc.remove(c.id).subscribe({
      next: () => { this.toast.success('Commodity deleted'); this.router.navigate(['/commodities']); },
      error: () => this.toast.error('Failed to delete commodity'),
    });
  }

  protected priceChangeIcon(pct: number): string {
    if (pct > 0) return 'trending_up';
    if (pct < 0) return 'trending_down';
    return 'trending_flat';
  }

  protected priceChangeClass(pct: number): string {
    if (pct > 0) return 'positive';
    if (pct < 0) return 'negative';
    return '';
  }
}
