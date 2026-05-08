import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Opportunity, CreateOpportunityRequest, UpdateOpportunityRequest, OpportunityStage } from '../models/opportunity.models';

@Injectable({ providedIn: 'root' })
export class OpportunityService extends BaseApiService {
  getAll(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<Opportunity>> {
    return this.getList<Opportunity>('/opportunities', params);
  }

  getById(id: string): Observable<Opportunity> {
    return this.get<Opportunity>(`/opportunities/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateOpportunityRequest): Observable<Opportunity> {
    return this.post<Opportunity>('/opportunities', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateOpportunityRequest): Observable<Opportunity> {
    return this.put<Opportunity>(`/opportunities/${id}`, payload).pipe(map((r) => r.data));
  }

  updateStage(id: string, stage: OpportunityStage): Observable<Opportunity> {
    return this.patch<Opportunity>(`/opportunities/${id}/stage`, { stage }).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/opportunities/${id}`).pipe(map(() => undefined));
  }
}
