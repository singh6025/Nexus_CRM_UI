import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from '@farmeasy/ui-kit';
import { SettingsService } from '../../services/settings.service';
import { TenantConfig } from '../../models/settings.models';

@Component({
  selector: 'settings-tenant-config-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule,
  ],
  templateUrl: './tenant-config-page.component.html',
  styleUrl: './tenant-config-page.component.scss',
})
export class TenantConfigPageComponent implements OnInit {
  private readonly svc   = inject(SettingsService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly saving  = signal(false);

  protected readonly timezones = [
    'Asia/Kolkata', 'Asia/Dubai', 'UTC', 'America/New_York', 'Europe/London',
  ];

  protected readonly form = new FormGroup({
    name:                  new FormControl('', [Validators.required]),
    domain:                new FormControl('', [Validators.required]),
    timezone:              new FormControl('Asia/Kolkata', [Validators.required]),
    currency:              new FormControl('INR', [Validators.required]),
    defaultLeadAssigneeId: new FormControl(''),
  });

  ngOnInit(): void {
    this.svc.getTenantConfig().subscribe({
      next: (cfg) => { this.patchForm(cfg); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load tenant config'); this.loading.set(false); },
    });
  }

  private patchForm(cfg: TenantConfig): void {
    this.form.patchValue({
      name: cfg.name, domain: cfg.domain, timezone: cfg.timezone,
      currency: cfg.currency, defaultLeadAssigneeId: cfg.defaultLeadAssigneeId,
    });
  }

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload = this.form.getRawValue() as Partial<TenantConfig>;
    this.svc.updateTenantConfig(payload).subscribe({
      next: () => { this.toast.success('Configuration saved'); this.saving.set(false); },
      error: () => { this.toast.error('Failed to save configuration'); this.saving.set(false); },
    });
  }
}
