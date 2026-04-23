import { Injectable, signal, computed } from '@angular/core';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketFilter,
  CreateTicketDto,
  UpdateTicketDto,
  TEAM_MEMBERS,
} from '../models/ticket.model';

let idCounter = 1043;

function generateId(): string {
  return `TKT-${idCounter++}`;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-1001',
    title: 'Login page not loading on Safari',
    description: 'Users on Safari 17+ report that the login page fails to render. The page shows a blank screen after the loading spinner. This affects approximately 15% of our user base.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'u1',
    assigneeName: 'Alex Johnson',
    reporterId: 'u3',
    reporterName: 'Tom Kim',
    tags: ['frontend', 'safari', 'authentication'],
    createdAt: new Date('2026-04-18T09:30:00'),
    updatedAt: new Date('2026-04-22T14:00:00'),
    comments: [
      {
        id: 'c1',
        authorId: 'u1',
        authorName: 'Alex Johnson',
        content: 'Reproduced locally. The issue is related to a Safari-specific CSS bug with flexbox. Working on a fix.',
        createdAt: new Date('2026-04-19T10:15:00'),
      },
      {
        id: 'c2',
        authorId: 'u3',
        authorName: 'Tom Kim',
        content: 'Thanks for confirming. Please prioritize as this is affecting production users.',
        createdAt: new Date('2026-04-19T11:00:00'),
      },
    ],
  },
  {
    id: 'TKT-1002',
    title: 'Export to CSV fails for large datasets',
    description: 'When exporting more than 10,000 records to CSV, the operation times out and returns a 504 error. Smaller exports work fine.',
    status: 'open',
    priority: 'critical',
    assigneeId: 'u2',
    assigneeName: 'Sarah Mitchell',
    reporterId: 'u4',
    reporterName: 'Nina Patel',
    tags: ['backend', 'export', 'performance'],
    createdAt: new Date('2026-04-20T11:00:00'),
    updatedAt: new Date('2026-04-20T11:00:00'),
    comments: [],
  },
  {
    id: 'TKT-1003',
    title: 'Email notifications not being sent',
    description: 'Automated email notifications for ticket updates stopped working after the v2.3 deployment. Manual emails still work.',
    status: 'resolved',
    priority: 'medium',
    assigneeId: 'u3',
    assigneeName: 'Tom Kim',
    reporterId: 'u5',
    reporterName: 'Carlos Rivera',
    tags: ['email', 'notifications', 'backend'],
    createdAt: new Date('2026-04-15T14:00:00'),
    updatedAt: new Date('2026-04-21T16:30:00'),
    comments: [
      {
        id: 'c3',
        authorId: 'u3',
        authorName: 'Tom Kim',
        content: 'Found the issue – SMTP config was overwritten during deployment. Fixed and deployed to production.',
        createdAt: new Date('2026-04-21T16:30:00'),
      },
    ],
  },
  {
    id: 'TKT-1004',
    title: 'Dashboard chart colors incorrect in dark mode',
    description: 'The pie chart on the main dashboard shows incorrect colors when dark mode is enabled. The legend colors do not match the chart segments.',
    status: 'open',
    priority: 'low',
    assigneeId: 'u4',
    assigneeName: 'Nina Patel',
    reporterId: 'u2',
    reporterName: 'Sarah Mitchell',
    tags: ['frontend', 'dark-mode', 'charts'],
    createdAt: new Date('2026-04-21T09:00:00'),
    updatedAt: new Date('2026-04-21T09:00:00'),
    comments: [],
  },
  {
    id: 'TKT-1005',
    title: 'API rate limit errors on bulk operations',
    description: 'When performing bulk updates on more than 100 records, API calls start getting 429 rate limit errors. Need to implement request queuing or batching.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'u1',
    assigneeName: 'Alex Johnson',
    reporterId: 'u6',
    reporterName: 'Emma Wilson',
    tags: ['api', 'performance', 'backend'],
    createdAt: new Date('2026-04-19T15:30:00'),
    updatedAt: new Date('2026-04-22T10:00:00'),
    comments: [],
  },
  {
    id: 'TKT-1006',
    title: 'Search results not paginated correctly',
    description: 'When searching with filters, the pagination does not reflect the filtered result count. Users see incorrect "Page X of Y" information.',
    status: 'open',
    priority: 'medium',
    assigneeId: 'u5',
    assigneeName: 'Carlos Rivera',
    reporterId: 'u1',
    reporterName: 'Alex Johnson',
    tags: ['frontend', 'search', 'pagination'],
    createdAt: new Date('2026-04-22T08:00:00'),
    updatedAt: new Date('2026-04-22T08:00:00'),
    comments: [],
  },
  {
    id: 'TKT-1007',
    title: 'Two-factor authentication enrollment flow broken',
    description: 'The 2FA setup wizard shows a blank QR code for some users. This appears to affect users with email addresses containing special characters.',
    status: 'open',
    priority: 'critical',
    assigneeId: 'u6',
    assigneeName: 'Emma Wilson',
    reporterId: 'u3',
    reporterName: 'Tom Kim',
    tags: ['security', 'authentication', '2fa'],
    createdAt: new Date('2026-04-22T10:30:00'),
    updatedAt: new Date('2026-04-22T10:30:00'),
    comments: [],
  },
  {
    id: 'TKT-1008',
    title: 'Mobile app crashes on Android 14',
    description: 'The mobile companion app crashes on launch for users running Android 14. Stacktrace points to a deprecated API call in the camera module.',
    status: 'closed',
    priority: 'high',
    assigneeId: 'u2',
    assigneeName: 'Sarah Mitchell',
    reporterId: 'u4',
    reporterName: 'Nina Patel',
    tags: ['mobile', 'android', 'crash'],
    createdAt: new Date('2026-04-10T13:00:00'),
    updatedAt: new Date('2026-04-17T11:00:00'),
    comments: [],
  },
];

@Injectable({ providedIn: 'root' })
export class TicketService {
  private ticketsSignal = signal<Ticket[]>(MOCK_TICKETS);
  private filterSignal = signal<TicketFilter>({});

  readonly tickets = this.ticketsSignal.asReadonly();

  readonly filteredTickets = computed(() => {
    const tickets = this.ticketsSignal();
    const filter = this.filterSignal();

    return tickets.filter((t) => {
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) &&
            !t.description.toLowerCase().includes(q) &&
            !t.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filter.status && t.status !== filter.status) return false;
      if (filter.priority && t.priority !== filter.priority) return false;
      if (filter.assigneeId && t.assigneeId !== filter.assigneeId) return false;
      return true;
    });
  });

  setFilter(filter: TicketFilter): void {
    this.filterSignal.set(filter);
  }

  getTicketById(id: string): Ticket | undefined {
    return this.ticketsSignal().find((t) => t.id === id);
  }

  createTicket(dto: CreateTicketDto): Ticket {
    const assignee = TEAM_MEMBERS.find((m) => m.id === dto.assigneeId);
    const newTicket: Ticket = {
      id: generateId(),
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      assigneeId: dto.assigneeId,
      assigneeName: assignee?.name ?? 'Unassigned',
      reporterId: 'u1',
      reporterName: 'Alex Johnson',
      tags: dto.tags,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ticketsSignal.update((tickets) => [newTicket, ...tickets]);
    return newTicket;
  }

  updateTicket(dto: UpdateTicketDto): void {
    this.ticketsSignal.update((tickets) =>
      tickets.map((t) => {
        if (t.id !== dto.id) return t;
        const assignee = dto.assigneeId
          ? TEAM_MEMBERS.find((m) => m.id === dto.assigneeId)
          : undefined;
        return {
          ...t,
          ...dto,
          assigneeName: assignee?.name ?? t.assigneeName,
          updatedAt: new Date(),
        };
      })
    );
  }

  updateStatus(id: string, status: TicketStatus): void {
    this.updateTicket({ id, status });
  }

  deleteTicket(id: string): void {
    this.ticketsSignal.update((tickets) => tickets.filter((t) => t.id !== id));
  }

  addComment(ticketId: string, content: string): void {
    this.ticketsSignal.update((tickets) =>
      tickets.map((t) => {
        if (t.id !== ticketId) return t;
        const comment = {
          id: `c${Date.now()}`,
          authorId: 'u1',
          authorName: 'Alex Johnson',
          content,
          createdAt: new Date(),
        };
        return { ...t, comments: [...t.comments, comment], updatedAt: new Date() };
      })
    );
  }
}
