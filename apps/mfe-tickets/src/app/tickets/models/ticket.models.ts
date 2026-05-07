export type TicketStatus   = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

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
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TicketFilter {
  search?: string;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
}

export interface CreateTicketDto {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string;
  tags: string[];
}

export type UpdateTicketDto = Partial<CreateTicketDto> & { id: string };
