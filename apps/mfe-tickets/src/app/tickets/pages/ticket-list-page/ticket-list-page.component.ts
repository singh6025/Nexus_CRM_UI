import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus, TicketPriority } from '../../models/ticket.models';
import { DataTableComponent, TableColumn, TableAction, ToastService } from '@farmeasy/ui-kit';

@Component({
  selector: 'tickets-ticket-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, DataTableComponent,
  ],
  templateUrl: './ticket-list-page.component.html',
  styleUrl: './ticket-list-page.component.scss',
})
export class TicketListPageComponent implements OnInit {
  private readonly svc     = inject(TicketService);
  private readonly router  = inject(Router);
  private readonly toast   = inject(ToastService);
  private readonly fb      = inject(FormBuilder);

  protected readonly tickets  = signal<Ticket[]>([]);
  protected readonly total    = signal(0);
  protected readonly loading  = signal(false);
  protected readonly page     = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly filters = this.fb.nonNullable.group({
    search:   [''],
    status:   ['' as TicketStatus | ''],
    priority: ['' as TicketPriority | ''],
  });

  protected readonly columns: TableColumn<Ticket>[] = [
    { key: 'id',           label: 'ID',       sortable: true,  width: '110px', type: 'link', routerLink: (r) => [r.id] },
    { key: 'title',        label: 'Title',    sortable: true,  type: 'text' },
    { key: 'status',       label: 'Status',   sortable: true,  type: 'badge', badgeVariant: (r) => r.status },
    { key: 'priority',     label: 'Priority', sortable: true,  type: 'badge', badgeVariant: (r) => r.priority },
    { key: 'assigneeName', label: 'Assignee', sortable: false, type: 'text' },
    { key: 'createdAt',    label: 'Created',  sortable: true,  type: 'date' },
  ];

  protected readonly actions: TableAction<Ticket>[] = [
    { label: 'View',   icon: 'visibility', action: (r) => this.router.navigate(['/tickets', r.id]) },
    { label: 'Edit',   icon: 'edit',       action: (r) => this.router.navigate(['/tickets', r.id, 'edit']) },
    {
      label: 'Delete', icon: 'delete', danger: true,
      action: (r) => {
        this.svc.remove(r.id).subscribe({
          next: () => { this.toast.success('Ticket deleted'); this.load(); },
          error: () => this.toast.error('Failed to delete ticket'),
        });
      },
    },
  ];

  readonly statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  readonly priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  constructor() {
    this.filters.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(() => { this.page.set(0); this.load(); });
  }

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    const f = this.filters.getRawValue();
    this.svc.getAll({
      page:     this.page() + 1,
      size:     this.pageSize(),
      search:   f.search || undefined,
      status:   f.status  || undefined,
      priority: f.priority || undefined,
    }).subscribe({
      next: (res) => { this.tickets.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load tickets'); this.loading.set(false); },
    });
  }

  protected onSort(_sort: Sort): void { this.load(); }

  protected onPage(e: PageEvent): void {
    this.page.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.load();
  }
}
