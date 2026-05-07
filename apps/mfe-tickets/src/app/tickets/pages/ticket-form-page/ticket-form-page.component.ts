import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '@farmeasy/ui-kit';
import { TicketService } from '../../services/ticket.service';
import { TicketStatus, TicketPriority } from '../../models/ticket.models';

const TEAM_MEMBERS = [
  { id: 'u1', name: 'Alex Johnson' }, { id: 'u2', name: 'Sarah Mitchell' },
  { id: 'u3', name: 'Tom Kim' },      { id: 'u4', name: 'Nina Patel' },
  { id: 'u5', name: 'Carlos Rivera' },
];

@Component({
  selector: 'tickets-ticket-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './ticket-form-page.component.html',
  styleUrl: './ticket-form-page.component.scss',
})
export class TicketFormPageComponent implements OnInit {
  private readonly fb    = inject(FormBuilder);
  private readonly svc   = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly isEdit  = signal(false);
  protected readonly loading = signal(false);
  protected readonly ticketId = signal<string | null>(null);

  protected readonly teamMembers = TEAM_MEMBERS;

  protected readonly form = this.fb.nonNullable.group({
    title:       ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    status:      ['open' as TicketStatus, Validators.required],
    priority:    ['medium' as TicketPriority, Validators.required],
    assigneeId:  ['', Validators.required],
    tags:        [''],
  });

  readonly statusOptions    = ['open', 'in-progress', 'resolved', 'closed'];
  readonly priorityOptions  = ['low', 'medium', 'high', 'critical'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.ticketId.set(id);
      this.svc.getById(id).subscribe({
        next: (t) => this.form.patchValue({ ...t, tags: t.tags.join(', ') }),
        error: () => { this.toast.error('Ticket not found'); this.router.navigate(['/tickets']); },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const v = this.form.getRawValue();
    const dto = { ...v, tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean) };

    const obs = this.isEdit()
      ? this.svc.update({ id: this.ticketId()!, ...dto })
      : this.svc.create(dto);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit() ? 'Ticket updated' : 'Ticket created');
        this.router.navigate(['/tickets']);
      },
      error: () => { this.toast.error('Save failed'); this.loading.set(false); },
    });
  }
}
