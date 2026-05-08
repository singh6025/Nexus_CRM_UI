import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Buyer, CreateBuyerRequest, UpdateBuyerRequest, BuyerStatus } from '../models/buyer.models';

@Injectable({ providedIn: 'root' })
export class BuyerService extends BaseApiService {
  getAll(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<Buyer>> {
    return this.getList<Buyer>('/buyers', params);
  }

  getById(id: string): Observable<Buyer> {
    return this.get<Buyer>(`/buyers/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateBuyerRequest): Observable<Buyer> {
    return this.post<Buyer>('/buyers', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateBuyerRequest): Observable<Buyer> {
    return this.put<Buyer>(`/buyers/${id}`, payload).pipe(map((r) => r.data));
  }

  updateStatus(id: string, status: BuyerStatus): Observable<Buyer> {
    return this.patch<Buyer>(`/buyers/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/buyers/${id}`).pipe(map(() => undefined));
  }
}
