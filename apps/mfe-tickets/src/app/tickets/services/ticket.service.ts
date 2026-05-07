import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse, QueryParams } from '@farmeasy/shared-api';
import {
  Ticket, CreateTicketDto, UpdateTicketDto, TicketStatus,
} from '../models/ticket.models';

@Injectable({ providedIn: 'root' })
export class TicketService extends BaseApiService {
  private readonly path = '/tickets';

  getAll(params?: QueryParams): Observable<PaginatedResponse<Ticket>> {
    return this.getList<Ticket>(this.path, params);
  }

  getById(id: string): Observable<Ticket> {
    return this.get<Ticket>(`${this.path}/${id}`).pipe(map((r) => r.data));
  }

  create(dto: CreateTicketDto): Observable<Ticket> {
    return this.post<Ticket>(this.path, dto).pipe(map((r) => r.data));
  }

  update(dto: UpdateTicketDto): Observable<Ticket> {
    return this.put<Ticket>(`${this.path}/${dto.id}`, dto).pipe(map((r) => r.data));
  }

  updateStatus(id: string, status: TicketStatus): Observable<Ticket> {
    return this.patch<Ticket>(`${this.path}/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  addComment(ticketId: string, content: string): Observable<Ticket> {
    return this.post<Ticket>(`${this.path}/${ticketId}/comments`, { content }).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`${this.path}/${id}`).pipe(map(() => undefined));
  }
}
