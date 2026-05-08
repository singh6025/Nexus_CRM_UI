import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Farmer, CreateFarmerRequest, UpdateFarmerRequest, FarmerStatus, CommodityLink } from '../models/farmer.models';

@Injectable({ providedIn: 'root' })
export class FarmerService extends BaseApiService {
  getAll(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<Farmer>> {
    return this.getList<Farmer>('/farmers', params);
  }

  getById(id: string): Observable<Farmer> {
    return this.get<Farmer>(`/farmers/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateFarmerRequest): Observable<Farmer> {
    return this.post<Farmer>('/farmers', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateFarmerRequest): Observable<Farmer> {
    return this.put<Farmer>(`/farmers/${id}`, payload).pipe(map((r) => r.data));
  }

  updateStatus(id: string, status: FarmerStatus): Observable<Farmer> {
    return this.patch<Farmer>(`/farmers/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  linkCommodity(id: string, link: Omit<CommodityLink, 'lastSupplyDate'>): Observable<Farmer> {
    return this.post<Farmer>(`/farmers/${id}/commodities`, link).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/farmers/${id}`).pipe(map(() => undefined));
  }
}
