import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KanbanBoardComponent } from '@farmeasy/ui-kit';

@Component({
  selector: 'opportunities-opportunities-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, KanbanBoardComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Opportunities</h1>
      </div>
      <p style="color: var(--color-text-secondary)">Sales pipeline Kanban board — under development.</p>
      <kanban-board></kanban-board>
    </div>
  `,
  styles: ['.page-container{padding:24px}.page-header{margin-bottom:16px}.page-title{font-size:24px;font-weight:700;margin:0}'],
})
export class OpportunitiesListPageComponent {}
