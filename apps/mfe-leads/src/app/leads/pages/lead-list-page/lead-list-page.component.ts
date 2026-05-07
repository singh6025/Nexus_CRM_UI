import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataTableComponent, ToastService, TableColumn, TableAction } from '@farmeasy/ui-kit';
import { LeadService } from '../../services/lead.service';
import { Lead, LeadStatus, LeadSource } from '../../models/lead.models';

@Component({
  selector: 'leads-lead-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule,
    DataTableComponent,
  ],
  templateUrl: './lead-list-page.component.html',
  styleUrl: './lead-list-page.component.scss',
})
export class LeadListPageComponent implements OnInit {
  private readonly svc    = inject(LeadService);
  private readonly router = inject(Router);
  private readonly toast  = inject(ToastService);
  private readonly fb     = inject(FormBuilder);

  protected readonly leads    = signal<Lead[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(20);

  protected readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['' as LeadStatus | ''],
    source: ['' as LeadSource | ''],
  });

  protected readonly statusOptions: { value: LeadStatus | ''; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  protected readonly sourceOptions: { value: LeadSource | ''; label: string }[] = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'trade_show', label: 'Trade Show' },
    { value: 'other', label: 'Other' },
  ];

  protected readonly columns: TableColumn<Lead>[] = [
    { key: 'name',           label: 'Name',        sortable: true, type: 'link', routerLink: (r) => ['/leads', r.id] },
    { key: 'company',        label: 'Company',      sortable: true },
    { key: 'email',          label: 'Email' },
    { key: 'phone',          label: 'Phone' },
    { key: 'status',         label: 'Status',       type: 'badge', badgeVariant: (r) => this.statusVariant(r.status as LeadStatus) },
    { key: 'estimatedValue', label: 'Est. Value',   type: 'currency', sortable: true },
    { key: 'createdAt',      label: 'Created',      type: 'date', sortable: true },
  ];

  protected readonly actions: TableAction<Lead>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/leads', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/leads', r.id, 'edit']) },
    { label: 'Delete', icon: 'delete',     danger: true, action: (r) => this.deleteLead(r as Lead) },
  ];

  constructor() {
    this.filters.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(() => { this.page.set(0); this.load(); });
  }

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    const f = this.filters.getRawValue();
    this.svc.getAll({
      page:   this.page() + 1,
      pageSize: this.pageSize(),
      search: f.search || undefined,
      status: f.status || undefined,
      source: f.source || undefined,
    }).subscribe({
      next: (res) => { this.leads.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load leads'); this.loading.set(false); },
    });
  }

  protected onSort(_sort: Sort): void { this.load(); }

  protected onPage(e: PageEvent): void {
    this.page.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.load();
  }

  private deleteLead(lead: Lead): void {
    if (!confirm(`Delete lead "${lead.name}"?`)) return;
    this.svc.remove(lead.id).subscribe({
      next: () => { this.toast.success('Lead deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete lead'),
    });
  }

  private statusVariant(status: LeadStatus): string {
    const map: Record<LeadStatus, string> = {
      new: 'info', contacted: 'neutral', qualified: 'warning',
      proposal: 'warning', negotiation: 'warning', won: 'success', lost: 'danger',
    };
    return map[status] ?? 'neutral';
  }
}
