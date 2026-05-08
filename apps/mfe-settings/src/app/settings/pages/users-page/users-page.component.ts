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
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { DataTableComponent, TableColumn, TableAction, BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { SettingsService } from '../../services/settings.service';
import { AppUser, UserRole, UserStatus, ROLE_CONFIG, STATUS_CONFIG } from '../../models/settings.models';

@Component({
  selector: 'settings-users-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule,
    DataTableComponent, BadgeComponent,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  private readonly svc   = inject(SettingsService);
  private readonly toast = inject(ToastService);

  protected readonly users      = signal<AppUser[]>([]);
  protected readonly total      = signal(0);
  protected readonly loading    = signal(false);
  protected readonly page       = signal(0);
  protected readonly pageSize   = signal(20);
  protected readonly showInvite = signal(false);
  protected readonly inviting   = signal(false);

  protected readonly roleConfig   = ROLE_CONFIG;
  protected readonly statusConfig = STATUS_CONFIG;
  protected readonly roleOptions  = Object.entries(ROLE_CONFIG).map(([v, c]) => ({ value: v as UserRole, label: c.label }));

  protected readonly inviteForm = new FormGroup({
    name:  new FormControl('',        [Validators.required]),
    email: new FormControl('',        [Validators.required, Validators.email]),
    role:  new FormControl<UserRole>('agent', [Validators.required]),
  });

  protected readonly columns: TableColumn<AppUser>[] = [
    { key: 'name',      label: 'Name',      sortable: true },
    { key: 'email',     label: 'Email' },
    { key: 'role',      label: 'Role',      type: 'badge',
      badgeVariant: (r) => ROLE_CONFIG[r.role as UserRole].variant },
    { key: 'status',    label: 'Status',    type: 'badge',
      badgeVariant: (r) => STATUS_CONFIG[r.status as UserStatus].variant },
    { key: 'createdAt', label: 'Joined',    type: 'date', sortable: true },
  ];

  protected readonly actions: TableAction<AppUser>[] = [
    { label: 'Disable', icon: 'block', danger: true,
      action: (r) => this.setStatus(r as AppUser, 'disabled'),
      hidden: (r) => (r as AppUser).status === 'disabled' },
    { label: 'Enable', icon: 'check_circle',
      action: (r) => this.setStatus(r as AppUser, 'active'),
      hidden: (r) => (r as AppUser).status !== 'disabled' },
  ];

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    this.svc.getUsers({ page: this.page() + 1, size: this.pageSize() }).subscribe({
      next: (res) => { this.users.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load users'); this.loading.set(false); },
    });
  }

  protected onSort(_: Sort): void { this.load(); }
  protected onPage(e: PageEvent): void { this.page.set(e.pageIndex); this.pageSize.set(e.pageSize); this.load(); }

  protected submitInvite(): void {
    if (this.inviteForm.invalid) { this.inviteForm.markAllAsTouched(); return; }
    this.inviting.set(true);
    const payload = this.inviteForm.getRawValue() as { name: string; email: string; role: UserRole };
    this.svc.inviteUser(payload).subscribe({
      next: () => {
        this.toast.success('Invitation sent');
        this.inviteForm.reset({ role: 'agent' });
        this.showInvite.set(false);
        this.inviting.set(false);
        this.load();
      },
      error: () => { this.toast.error('Failed to send invitation'); this.inviting.set(false); },
    });
  }

  private setStatus(user: AppUser, status: UserStatus): void {
    this.svc.updateUserStatus(user.id, status).subscribe({
      next: () => { this.toast.success('User updated'); this.load(); },
      error: () => this.toast.error('Failed to update user'),
    });
  }
}
