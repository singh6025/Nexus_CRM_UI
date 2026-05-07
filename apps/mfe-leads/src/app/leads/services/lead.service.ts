import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Lead, CreateLeadRequest, UpdateLeadRequest, LeadFilters, LeadActivity, FunnelStage } from '../models/lead.models';

@Injectable({ providedIn: 'root' })
export class LeadService extends BaseApiService {
  getAll(filters: LeadFilters = {}): Observable<PaginatedResponse<Lead>> {
    return this.getList<Lead>('/leads', filters as Record<string, string | number | boolean>);
  }

  getById(id: string): Observable<Lead> {
    return this.get<Lead>(`/leads/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateLeadRequest): Observable<Lead> {
    return this.post<Lead>('/leads', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateLeadRequest): Observable<Lead> {
    return this.put<Lead>(`/leads/${id}`, payload).pipe(map((r) => r.data));
  }

  updateStatus(id: string, status: string): Observable<Lead> {
    return this.patch<Lead>(`/leads/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/leads/${id}`).pipe(map(() => undefined));
  }

  getActivities(id: string): Observable<LeadActivity[]> {
    return this.get<LeadActivity[]>(`/leads/${id}/activities`).pipe(map((r) => r.data));
  }

  getFunnel(): Observable<FunnelStage[]> {
    return this.get<FunnelStage[]>('/leads/funnel').pipe(map((r) => r.data));
  }
}
