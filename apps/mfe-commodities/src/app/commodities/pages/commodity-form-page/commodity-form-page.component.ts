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
import { positiveNumberValidator } from '@farmeasy/shared-utils';
import { CommodityService } from '../../services/commodity.service';
import { Commodity, CommodityCategory, CommodityGrade, CATEGORY_CONFIG, GRADE_CONFIG, CreateCommodityRequest } from '../../models/commodity.models';

@Component({
  selector: 'commodities-commodity-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './commodity-form-page.component.html',
  styleUrl: './commodity-form-page.component.scss',
})
export class CommodityFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(CommodityService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  private commodityId = '';

  protected readonly categories = Object.entries(CATEGORY_CONFIG).map(([v, c]) => ({ value: v as CommodityCategory, label: c.label }));
  protected readonly grades     = Object.entries(GRADE_CONFIG).map(([v, c]) => ({ value: v as CommodityGrade, label: c.label }));

  protected readonly form = new FormGroup({
    name:         new FormControl('',              [Validators.required, Validators.minLength(2)]),
    category:     new FormControl<CommodityCategory>('grain', [Validators.required]),
    grade:        new FormControl<CommodityGrade>('A',        [Validators.required]),
    unit:         new FormControl('',              [Validators.required]),
    currentPrice: new FormControl<number | null>(null, [Validators.required, positiveNumberValidator()]),
  });

  ngOnInit(): void {
    this.commodityId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.commodityId) {
      this.isEdit.set(true);
      this.svc.getById(this.commodityId).subscribe({
        next: (c) => this.patchForm(c),
        error: () => this.toast.error('Failed to load commodity'),
      });
    }
  }

  private patchForm(c: Commodity): void {
    this.form.patchValue({
      name: c.name, category: c.category, grade: c.grade,
      unit: c.unit, currentPrice: c.currentPrice,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.getRawValue() as CreateCommodityRequest;
    const req$ = this.isEdit()
      ? this.svc.update(this.commodityId, payload)
      : this.svc.create(payload);
    req$.subscribe({
      next: (c) => {
        this.toast.success(`Commodity ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/commodities', c.id]);
      },
      error: () => { this.toast.error('Failed to save commodity'); this.loading.set(false); },
    });
  }
}
