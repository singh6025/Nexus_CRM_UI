import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TicketService } from '../../services/ticket.service';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TICKET_STATUS_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
} from '../../models/ticket.model';

@Component({
  selector: 'tickets-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent implements OnInit {
  searchControl = new FormControl('');
  statusControl = new FormControl<TicketStatus | ''>('');
  priorityControl = new FormControl<TicketPriority | ''>('');

  statusOptions = TICKET_STATUS_OPTIONS;
  priorityOptions = TICKET_PRIORITY_OPTIONS;

  displayedColumns = ['id', 'title', 'status', 'priority', 'assignee', 'createdAt', 'actions'];

  pageSize = signal(10);
  pageIndex = signal(0);
  sortActive = signal('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  pagedTickets = computed(() => {
    const tickets = this.sortTickets(this.ticketService.filteredTickets());
    const start = this.pageIndex() * this.pageSize();
    return tickets.slice(start, start + this.pageSize());
  });

  totalTickets = computed(() => this.ticketService.filteredTickets().length);

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => this.applyFilter());

    this.statusControl.valueChanges.subscribe(() => this.applyFilter());
    this.priorityControl.valueChanges.subscribe(() => this.applyFilter());
  }

  private applyFilter(): void {
    this.pageIndex.set(0);
    this.ticketService.setFilter({
      search: this.searchControl.value ?? '',
      status: (this.statusControl.value as TicketStatus) ?? '',
      priority: (this.priorityControl.value as TicketPriority) ?? '',
    });
  }

  private sortTickets(tickets: Ticket[]): Ticket[] {
    const field = this.sortActive() as keyof Ticket;
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    return [...tickets].sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (av instanceof Date && bv instanceof Date) {
        return (av.getTime() - bv.getTime()) * dir;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return 0;
    });
  }

  onSortChange(sort: Sort): void {
    this.sortActive.set(sort.active);
    this.sortDirection.set(sort.direction as 'asc' | 'desc' || 'desc');
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusControl.setValue('');
    this.priorityControl.setValue('');
    this.ticketService.setFilter({});
  }

  closeTicket(ticket: Ticket): void {
    this.ticketService.updateStatus(ticket.id, 'closed');
    this.snackBar.open(`Ticket ${ticket.id} closed`, 'Dismiss', { duration: 3000 });
  }

  deleteTicket(ticket: Ticket): void {
    this.ticketService.deleteTicket(ticket.id);
    this.snackBar.open(`Ticket ${ticket.id} deleted`, 'Dismiss', { duration: 3000 });
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchControl.value || this.statusControl.value || this.priorityControl.value);
  }
}
