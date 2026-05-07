import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BadgeComponent, ToastService } from '@farmeasy/ui-kit';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus } from '../../models/ticket.models';

@Component({
  selector: 'tickets-ticket-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatDividerModule, MatFormFieldModule, MatInputModule,
    BadgeComponent,
  ],
  templateUrl: './ticket-detail-page.component.html',
  styleUrl: './ticket-detail-page.component.scss',
})
export class TicketDetailPageComponent implements OnInit {
  private readonly svc   = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly ticket  = signal<Ticket | null>(null);
  protected readonly loading = signal(true);
  protected newComment = '';

  readonly statusOptions: { value: TicketStatus; label: string }[] = [
    { value: 'open',        label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved',    label: 'Resolved' },
    { value: 'closed',      label: 'Closed' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.svc.getById(id).subscribe({
      next: (t) => { this.ticket.set(t); this.loading.set(false); },
      error: () => { this.toast.error('Ticket not found'); this.router.navigate(['/tickets']); },
    });
  }

  changeStatus(status: TicketStatus): void {
    const t = this.ticket();
    if (!t) return;
    this.svc.updateStatus(t.id, status).subscribe({
      next: (updated) => { this.ticket.set(updated); this.toast.success('Status updated'); },
      error: () => this.toast.error('Failed to update status'),
    });
  }

  addComment(): void {
    const t = this.ticket();
    if (!t || !this.newComment.trim()) return;
    this.svc.addComment(t.id, this.newComment.trim()).subscribe({
      next: (updated) => { this.ticket.set(updated); this.newComment = ''; this.toast.success('Comment added'); },
      error: () => this.toast.error('Failed to add comment'),
    });
  }

  delete(): void {
    const t = this.ticket();
    if (!t) return;
    this.svc.remove(t.id).subscribe({
      next: () => { this.toast.success('Ticket deleted'); this.router.navigate(['/tickets']); },
      error: () => this.toast.error('Failed to delete ticket'),
    });
  }
}
