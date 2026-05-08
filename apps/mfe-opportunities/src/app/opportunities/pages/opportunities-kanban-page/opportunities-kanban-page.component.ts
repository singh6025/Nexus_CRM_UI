import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KanbanBoardComponent, KanbanLane, KanbanDropEvent, ToastService } from '@farmeasy/ui-kit';
import { OpportunityService } from '../../services/opportunity.service';
import { Opportunity, OpportunityStage, STAGE_CONFIGS } from '../../models/opportunity.models';

@Component({
  selector: 'opportunities-kanban-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, KanbanBoardComponent],
  templateUrl: './opportunities-kanban-page.component.html',
  styleUrl: './opportunities-kanban-page.component.scss',
})
export class OpportunitiesKanbanPageComponent implements OnInit {
  private readonly svc   = inject(OpportunityService);
  private readonly toast = inject(ToastService);

  protected readonly opportunities = signal<Opportunity[]>([]);
  protected readonly loading       = signal(true);

  protected readonly lanes = computed<KanbanLane<Opportunity>[]>(() => {
    const all = this.opportunities();
    return STAGE_CONFIGS.map((cfg) => {
      const items = all.filter((o) => o.stage === cfg.id);
      return {
        id:         cfg.id,
        label:      cfg.label,
        color:      cfg.color,
        items,
        totalValue: items.reduce((sum, o) => sum + o.dealValue, 0),
      };
    });
  });

  protected readonly totalPipelineValue = computed(() =>
    this.opportunities()
      .filter((o) => o.stage !== 'closed_lost')
      .reduce((sum, o) => sum + o.dealValue, 0)
  );

  protected readonly routerLinkFn = (item: Opportunity) => ['/opportunities', item.id];

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    this.svc.getAll({ size: 200 }).subscribe({
      next: (res) => { this.opportunities.set(res.items); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load opportunities'); this.loading.set(false); },
    });
  }

  protected onDrop(event: KanbanDropEvent<Opportunity>): void {
    const opp = event.item;
    const newStage = event.toLaneId as OpportunityStage;

    // Optimistic update — already done by CDK drag-drop in place
    this.svc.updateStage(opp.id, newStage).subscribe({
      error: () => {
        this.toast.error('Failed to move opportunity');
        this.load(); // revert by reloading
      },
    });
  }
}
