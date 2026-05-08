import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '@farmeasy/ui-kit';
import { SettingsService } from '../../services/settings.service';
import { PipelineStage, CreateStageRequest } from '../../models/settings.models';

@Component({
  selector: 'settings-pipeline-stages-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatCardModule,
  ],
  templateUrl: './pipeline-stages-page.component.html',
  styleUrl: './pipeline-stages-page.component.scss',
})
export class PipelineStagesPageComponent implements OnInit {
  private readonly svc   = inject(SettingsService);
  private readonly toast = inject(ToastService);

  protected readonly stages   = signal<PipelineStage[]>([]);
  protected readonly loading  = signal(true);
  protected readonly showForm = signal(false);
  protected readonly saving   = signal(false);

  protected readonly form = new FormGroup({
    name:   new FormControl('', [Validators.required, Validators.minLength(2)]),
    color:  new FormControl('#1565c0', [Validators.required]),
    isWon:  new FormControl(false),
    isLost: new FormControl(false),
  });

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    this.svc.getStages().subscribe({
      next: (s) => { this.stages.set(s); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load stages'); this.loading.set(false); },
    });
  }

  protected submitStage(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload = this.form.getRawValue() as CreateStageRequest;
    this.svc.createStage(payload).subscribe({
      next: () => {
        this.toast.success('Stage created');
        this.form.reset({ color: '#1565c0', isWon: false, isLost: false });
        this.showForm.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => { this.toast.error('Failed to create stage'); this.saving.set(false); },
    });
  }

  protected deleteStage(stage: PipelineStage): void {
    if (!confirm(`Delete stage "${stage.name}"?`)) return;
    this.svc.deleteStage(stage.id).subscribe({
      next: () => { this.toast.success('Stage deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete stage'),
    });
  }
}
