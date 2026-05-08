import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { OpportunityService } from '../../services/opportunity.service';
import { Opportunity, OpportunityStage, STAGE_CONFIGS } from '../../models/opportunity.models';

@Component({
  selector: 'opportunities-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatIconModule, MatCardModule, MatSelectModule, MatFormFieldModule,
    BadgeComponent, CurrencyInrPipe,
  ],
  templateUrl: './opportunity-detail-page.component.html',
  styleUrl: './opportunity-detail-page.component.scss',
})
export class OpportunityDetailPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(OpportunityService);
  private readonly toast  = inject(ToastService);

  protected readonly opportunity = signal<Opportunity | null>(null);
  protected readonly loading     = signal(true);
  protected readonly stageConfigs = STAGE_CONFIGS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (o) => { this.opportunity.set(o); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load opportunity'); this.loading.set(false); },
    });
  }

  protected stageLabel(stage: OpportunityStage): string {
    return STAGE_CONFIGS.find((c) => c.id === stage)?.label ?? stage;
  }

  protected stageColor(stage: OpportunityStage): string {
    return STAGE_CONFIGS.find((c) => c.id === stage)?.color ?? '#78909c';
  }

  protected onStageChange(stage: OpportunityStage): void {
    const opp = this.opportunity();
    if (!opp) return;
    this.svc.updateStage(opp.id, stage).subscribe({
      next: (updated) => { this.opportunity.set(updated); this.toast.success('Stage updated'); },
      error: () => this.toast.error('Failed to update stage'),
    });
  }

  protected isBeforeCurrentStage(stageId: OpportunityStage, currentStage: OpportunityStage): boolean {
    const stageOrder = STAGE_CONFIGS.map((c) => c.id);
    return stageOrder.indexOf(stageId) < stageOrder.indexOf(currentStage);
  }

  protected delete(): void {
    const opp = this.opportunity();
    if (!opp || !confirm(`Delete "${opp.name}"?`)) return;
    this.svc.remove(opp.id).subscribe({
      next: () => { this.toast.success('Opportunity deleted'); this.router.navigate(['/opportunities']); },
      error: () => this.toast.error('Failed to delete opportunity'),
    });
  }
}
