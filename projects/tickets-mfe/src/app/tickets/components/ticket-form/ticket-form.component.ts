import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketService } from '../../services/ticket.service';
import {
  TicketStatus,
  TicketPriority,
  TICKET_STATUS_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  TEAM_MEMBERS,
  Ticket,
} from '../../models/ticket.model';

@Component({
  selector: 'tickets-ticket-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.scss',
})
export class TicketFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = signal(false);
  editTicketId = signal<string | null>(null);
  pageTitle = signal('Create Ticket');
  tagInput = '';

  statusOptions = TICKET_STATUS_OPTIONS.filter((o) => o.value !== '');
  priorityOptions = TICKET_PRIORITY_OPTIONS.filter((o) => o.value !== '');
  teamMembers = TEAM_MEMBERS;

  tags = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['open' as TicketStatus, Validators.required],
      priority: ['medium' as TicketPriority, Validators.required],
      assigneeId: ['', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const ticket = this.ticketService.getTicketById(id);
      if (ticket) {
        this.isEditMode.set(true);
        this.editTicketId.set(id);
        this.pageTitle.set(`Edit – ${id}`);
        this.tags.set([...ticket.tags]);
        this.form.patchValue({
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          assigneeId: ticket.assigneeId,
        });
      }
    }
  }

  addTag(): void {
    const tag = this.tagInput.trim().toLowerCase();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update((tags) => [...tags, tag]);
    }
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.isEditMode()) {
      this.ticketService.updateTicket({
        id: this.editTicketId()!,
        ...value,
        tags: this.tags(),
      });
      this.snackBar.open('Ticket updated successfully', 'Dismiss', { duration: 3000 });
      this.router.navigate(['..'], { relativeTo: this.route });
    } else {
      const ticket = this.ticketService.createTicket({
        ...value,
        tags: this.tags(),
      });
      this.snackBar.open(`Ticket ${ticket.id} created`, 'View', {
        duration: 4000,
      });
      this.router.navigate(['/']);
    }
  }

  cancel(): void {
    this.router.navigate([this.isEditMode() ? '..' : '/'], { relativeTo: this.route });
  }
}
