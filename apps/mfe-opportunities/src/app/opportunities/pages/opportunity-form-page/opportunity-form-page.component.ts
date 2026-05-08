import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastService } from '@farmeasy/ui-kit';
import { positiveNumberValidator } from '@farmeasy/shared-utils';
import { OpportunityService } from '../../services/opportunity.service';
import { Opportunity, OpportunityStage, STAGE_CONFIGS } from '../../models/opportunity.models';

@Component({
  selector: 'opportunities-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  ],
  templateUrl: './opportunity-form-page.component.html',
  styleUrl: './opportunity-form-page.component.scss',
})
export class OpportunityFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(OpportunityService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  protected readonly stageConfigs = STAGE_CONFIGS;
  private oppId = '';

  protected readonly form = new FormGroup({
    name:               new FormControl('',           [Validators.required, Validators.minLength(2)]),
    company:            new FormControl('',           [Validators.required]),
    dealValue:          new FormControl<number>(0,    [Validators.required, positiveNumberValidator()]),
    stage:              new FormControl<OpportunityStage>('prospecting', [Validators.required]),
    probability:        new FormControl<number>(10,   [Validators.required, Validators.min(0), Validators.max(100)]),
    assignedTo:         new FormControl('',           [Validators.required]),
    expectedCloseDate:  new FormControl('',           [Validators.required]),
    notes:              new FormControl(''),
  });

  ngOnInit(): void {
    this.oppId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.oppId) {
      this.isEdit.set(true);
      this.svc.getById(this.oppId).subscribe({
        next: (o) => this.patchForm(o),
        error: () => this.toast.error('Failed to load opportunity'),
      });
    }
  }

  private patchForm(o: Opportunity): void {
    this.form.patchValue({
      name: o.name, company: o.company, dealValue: o.dealValue,
      stage: o.stage, probability: o.probability, assignedTo: o.assignedTo,
      expectedCloseDate: o.expectedCloseDate, notes: o.notes,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      dealValue:  Number(raw.dealValue),
      probability: Number(raw.probability),
    } as Parameters<OpportunityService['create']>[0];

    const req$ = this.isEdit()
      ? this.svc.update(this.oppId, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: (o) => {
        this.toast.success(`Opportunity ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/opportunities', o.id]);
      },
      error: () => { this.toast.error('Failed to save opportunity'); this.loading.set(false); },
    });
  }
}
