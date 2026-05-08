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
import { FarmerService } from '../../services/farmer.service';
import { Farmer, LandUnit } from '../../models/farmer.models';

@Component({
  selector: 'farmers-farmer-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './farmer-form-page.component.html',
  styleUrl: './farmer-form-page.component.scss',
})
export class FarmerFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(FarmerService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  private farmerId = '';

  protected readonly landUnits: LandUnit[] = ['acres', 'hectares'];

  protected readonly form = new FormGroup({
    name:           new FormControl('',       [Validators.required, Validators.minLength(2)]),
    phone:          new FormControl('',       [Validators.required, phoneValidator()]),
    email:          new FormControl('',       [Validators.email]),
    village:        new FormControl('',       [Validators.required]),
    district:       new FormControl('',       [Validators.required]),
    state:          new FormControl('',       [Validators.required]),
    landSize:       new FormControl<number>(0, [Validators.required, positiveNumberValidator()]),
    landUnit:       new FormControl<LandUnit>('acres', [Validators.required]),
    assignedAgentId: new FormControl('',     [Validators.required]),
  });

  ngOnInit(): void {
    this.farmerId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.farmerId) {
      this.isEdit.set(true);
      this.svc.getById(this.farmerId).subscribe({
        next: (f) => this.patchForm(f),
        error: () => this.toast.error('Failed to load farmer'),
      });
    }
  }

  private patchForm(f: Farmer): void {
    this.form.patchValue({
      name: f.name, phone: f.phone, email: f.email, village: f.village,
      district: f.district, state: f.state, landSize: f.landSize,
      landUnit: f.landUnit, assignedAgentId: f.assignedAgentId,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const payload = { ...raw, landSize: Number(raw.landSize) } as Parameters<FarmerService['create']>[0];

    const req$ = this.isEdit()
      ? this.svc.update(this.farmerId, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: (f) => {
        this.toast.success(`Farmer ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/farmers', f.id]);
      },
      error: () => { this.toast.error('Failed to save farmer'); this.loading.set(false); },
    });
  }
}
