import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus, TICKET_STATUS_OPTIONS } from '../../models/ticket.model';

@Component({
  selector: 'tickets-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailComponent implements OnInit {
  ticket = signal<Ticket | undefined>(undefined);
  newComment = '';
  statusOptions = TICKET_STATUS_OPTIONS.filter((o) => o.value !== '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const t = this.ticketService.getTicketById(id);
      if (t) {
        this.ticket.set(t);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  changeStatus(status: TicketStatus): void {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.updateStatus(t.id, status);
    this.ticket.set(this.ticketService.getTicketById(t.id));
    this.snackBar.open('Status updated', 'Dismiss', { duration: 2000 });
  }

  addComment(): void {
    const t = this.ticket();
    if (!t || !this.newComment.trim()) return;
    this.ticketService.addComment(t.id, this.newComment.trim());
    this.ticket.set(this.ticketService.getTicketById(t.id));
    this.newComment = '';
    this.snackBar.open('Comment added', 'Dismiss', { duration: 2000 });
  }

  deleteTicket(): void {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.deleteTicket(t.id);
    this.snackBar.open(`Ticket ${t.id} deleted`, 'Dismiss', { duration: 3000 });
    this.router.navigate(['/']);
  }
}
