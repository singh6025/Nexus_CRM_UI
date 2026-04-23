export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string;
  assigneeName: string;
  reporterId: string;
  reporterName: string;
  tags: string[];
  comments: TicketComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketFilter {
  search?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  assigneeId?: string;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string;
  tags: string[];
}

export interface UpdateTicketDto extends Partial<CreateTicketDto> {
  id: string;
}

export const TICKET_STATUS_OPTIONS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const TICKET_PRIORITY_OPTIONS: { value: TicketPriority | ''; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const TEAM_MEMBERS = [
  { id: 'u1', name: 'Alex Johnson' },
  { id: 'u2', name: 'Sarah Mitchell' },
  { id: 'u3', name: 'Tom Kim' },
  { id: 'u4', name: 'Nina Patel' },
  { id: 'u5', name: 'Carlos Rivera' },
  { id: 'u6', name: 'Emma Wilson' },
];
