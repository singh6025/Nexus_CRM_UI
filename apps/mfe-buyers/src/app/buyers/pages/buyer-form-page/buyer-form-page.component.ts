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
import { phoneValidator, gstValidator } from '@farmeasy/shared-utils';
import { BuyerService } from '../../services/buyer.service';
import { Buyer, BuyerTier, TIER_CONFIG } from '../../models/buyer.models';

@Component({
  selector: 'buyers-buyer-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './buyer-form-page.component.html',
  styleUrl: './buyer-form-page.component.scss',
})
export class BuyerFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(BuyerService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  protected readonly tiers   = Object.entries(TIER_CONFIG).map(([v, c]) => ({ value: v as BuyerTier, label: c.label }));
  private buyerId = '';

  protected readonly form = new FormGroup({
    name:            new FormControl('',           [Validators.required, Validators.minLength(2)]),
    companyName:     new FormControl('',           [Validators.required]),
    phone:           new FormControl('',           [Validators.required, phoneValidator()]),
    email:           new FormControl('',           [Validators.required, Validators.email]),
    city:            new FormControl('',           [Validators.required]),
    state:           new FormControl('',           [Validators.required]),
    tier:            new FormControl<BuyerTier>('bronze', [Validators.required]),
    assignedAgentId: new FormControl('',           [Validators.required]),
    gstNumber:       new FormControl('',           [gstValidator()]),
  });

  ngOnInit(): void {
    this.buyerId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.buyerId) {
      this.isEdit.set(true);
      this.svc.getById(this.buyerId).subscribe({
        next: (b) => this.patchForm(b),
        error: () => this.toast.error('Failed to load buyer'),
      });
    }
  }

  private patchForm(b: Buyer): void {
    this.form.patchValue({
      name: b.name, companyName: b.companyName, phone: b.phone, email: b.email,
      city: b.city, state: b.state, tier: b.tier,
      assignedAgentId: b.assignedAgentId, gstNumber: b.gstNumber,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.getRawValue() as Parameters<BuyerService['create']>[0];
    const req$ = this.isEdit() ? this.svc.update(this.buyerId, payload) : this.svc.create(payload);
    req$.subscribe({
      next: (b) => {
        this.toast.success(`Buyer ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/buyers', b.id]);
      },
      error: () => { this.toast.error('Failed to save buyer'); this.loading.set(false); },
    });
  }
}
