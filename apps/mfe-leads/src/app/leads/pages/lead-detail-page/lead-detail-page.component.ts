import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { LeadService } from '../../services/lead.service';
import { Lead, LeadActivity, LeadStatus } from '../../models/lead.models';

@Component({
  selector: 'leads-lead-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatCardModule, MatDividerModule, BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './lead-detail-page.component.html',
  styleUrl: './lead-detail-page.component.scss',
})
export class LeadDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly svc   = inject(LeadService);
  private readonly toast = inject(ToastService);

  protected readonly lead       = signal<Lead | null>(null);
  protected readonly activities = signal<LeadActivity[]>([]);
  protected readonly loading    = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (l) => { this.lead.set(l); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load lead'); this.loading.set(false); },
    });
    this.svc.getActivities(id).subscribe({
      next: (a) => this.activities.set(a),
    });
  }

  protected statusVariant(status: LeadStatus) {
    const map: Record<LeadStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      new: 'info', contacted: 'neutral', qualified: 'warning',
      proposal: 'warning', negotiation: 'warning', won: 'success', lost: 'danger',
    };
    return map[status];
  }
}
