import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastService } from '@farmeasy/ui-kit';
import { positiveNumberValidator } from '@farmeasy/shared-utils';
import { OrderService } from '../../services/order.service';
import { Order, OrderItem } from '../../models/order.models';

@Component({
  selector: 'orders-order-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './order-form-page.component.html',
  styleUrl: './order-form-page.component.scss',
})
export class OrderFormPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc    = inject(OrderService);
  private readonly toast  = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  private orderId = '';

  protected readonly form = new FormGroup({
    buyerId:          new FormControl('', [Validators.required]),
    logisticsPartner: new FormControl('', [Validators.required]),
    expectedDelivery: new FormControl('', [Validators.required]),
    notes:            new FormControl(''),
    items:            new FormArray([this.newItemGroup()]),
  });

  get items(): FormArray { return this.form.controls.items; }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.orderId) {
      this.isEdit.set(true);
      this.svc.getById(this.orderId).subscribe({
        next: (o) => this.patchForm(o),
        error: () => this.toast.error('Failed to load order'),
      });
    }
  }

  private newItemGroup(item?: OrderItem): FormGroup {
    return new FormGroup({
      commodityName: new FormControl(item?.commodityName ?? '', [Validators.required]),
      grade:         new FormControl(item?.grade ?? '',         [Validators.required]),
      quantity:      new FormControl<number>(item?.quantity ?? 0,   [Validators.required, positiveNumberValidator()]),
      unitPrice:     new FormControl<number>(item?.unitPrice ?? 0,  [Validators.required, positiveNumberValidator()]),
      totalPrice:    new FormControl<number>({ value: item?.totalPrice ?? 0, disabled: true }),
    });
  }

  private patchForm(o: Order): void {
    this.form.patchValue({
      buyerId: o.buyerId, logisticsPartner: o.logisticsPartner,
      expectedDelivery: o.expectedDelivery, notes: o.notes,
    });
    this.items.clear();
    o.items.forEach((item) => this.items.push(this.newItemGroup(item)));
  }

  protected addItem(): void { this.items.push(this.newItemGroup()); }

  protected removeItem(i: number): void {
    if (this.items.length > 1) this.items.removeAt(i);
  }

  protected updateTotal(i: number): void {
    const grp = this.items.at(i) as FormGroup;
    const qty  = Number(grp.get('quantity')?.value ?? 0);
    const unit = Number(grp.get('unitPrice')?.value ?? 0);
    grp.get('totalPrice')?.setValue(qty * unit, { emitEvent: false });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const raw = this.form.getRawValue();
    const payload = {
      buyerId:          raw.buyerId!,
      logisticsPartner: raw.logisticsPartner!,
      expectedDelivery: raw.expectedDelivery!,
      notes:            raw.notes ?? '',
      items:            raw.items.map((i) => ({
        commodityName: i['commodityName'] as string,
        grade:         i['grade'] as string,
        quantity:      Number(i['quantity']),
        unitPrice:     Number(i['unitPrice']),
        totalPrice:    Number(i['quantity']) * Number(i['unitPrice']),
      })),
    };

    const req$ = this.isEdit()
      ? this.svc.update(this.orderId, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: (o) => {
        this.toast.success(`Order ${this.isEdit() ? 'updated' : 'created'}`);
        this.router.navigate(['/orders', o.id]);
      },
      error: () => { this.toast.error('Failed to save order'); this.loading.set(false); },
    });
  }
}
