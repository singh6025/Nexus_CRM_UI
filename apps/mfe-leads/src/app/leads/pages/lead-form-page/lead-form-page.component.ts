import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastService } from '@farmeasy/ui-kit';
import { phoneValidator, positiveNumberValidator } from '@farmeasy/shared-utils';
import { LeadService } from '../../services/lead.service';
import { Lead, LeadStatus, LeadSource } from '../../models/lead.models';

@Component({
  selector: 'leads-lead-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './lead-form-page.component.html',
  styleUrl: './lead-form-page.component.scss',
})
export class LeadFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(LeadService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  private leadId = '';

  readonly statusOptions: LeadStatus[] = [
    'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost',
  ];

  readonly sourceOptions: LeadSource[] = [
    'website', 'referral', 'cold_call', 'social_media', 'trade_show', 'other',
  ];

  readonly form = new FormGroup({
    name:           new FormControl('', [Validators.required, Validators.minLength(2)]),
    company:        new FormControl('', [Validators.required]),
    email:          new FormControl('', [Validators.required, Validators.email]),
    phone:          new FormControl('', [Validators.required, phoneValidator()]),
    status:         new FormControl<LeadStatus>('new', [Validators.required]),
    source:         new FormControl<LeadSource>('website', [Validators.required]),
    assignedTo:     new FormControl('', [Validators.required]),
    estimatedValue: new FormControl<number>(0, [Validators.required, positiveNumberValidator()]),
    notes:          new FormControl(''),
  });

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.leadId) {
      this.isEdit.set(true);
      this.svc.getById(this.leadId).subscribe({
        next: (l) => this.patchForm(l),
        error: () => this.toast.error('Failed to load lead'),
      });
    }
  }

  private patchForm(l: Lead): void {
    this.form.patchValue({
      name: l.name, company: l.company, email: l.email, phone: l.phone,
      status: l.status, source: l.source, assignedTo: l.assignedTo,
      estimatedValue: l.estimatedValue, notes: l.notes,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.getRawValue() as Parameters<LeadService['create']>[0];
    const req$ = this.isEdit()
      ? this.svc.update(this.leadId, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: (l) => {
        this.toast.success(`Lead ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/leads', l.id]);
      },
      error: () => { this.toast.error('Failed to save lead'); this.loading.set(false); },
    });
  }
}
