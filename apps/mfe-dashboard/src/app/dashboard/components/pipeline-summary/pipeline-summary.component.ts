import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyInrPipe } from '@farmeasy/shared-utils';
import { PipelineSummary } from '../../models/dashboard.models';

@Component({
  selector: 'dashboard-pipeline-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule, CurrencyInrPipe],
  templateUrl: './pipeline-summary.component.html',
  styleUrl: './pipeline-summary.component.scss',
})
export class PipelineSummaryComponent {
  readonly pipeline = input.required<PipelineSummary>();
}
