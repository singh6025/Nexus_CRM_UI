import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Commodity, CreateCommodityRequest, UpdateCommodityRequest } from '../models/commodity.models';

@Injectable({ providedIn: 'root' })
export class CommodityService extends BaseApiService {
  getAll(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<Commodity>> {
    return this.getList<Commodity>('/commodities', params);
  }

  getById(id: string): Observable<Commodity> {
    return this.get<Commodity>(`/commodities/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateCommodityRequest): Observable<Commodity> {
    return this.post<Commodity>('/commodities', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateCommodityRequest): Observable<Commodity> {
    return this.put<Commodity>(`/commodities/${id}`, payload).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/commodities/${id}`).pipe(map(() => undefined));
  }
}
