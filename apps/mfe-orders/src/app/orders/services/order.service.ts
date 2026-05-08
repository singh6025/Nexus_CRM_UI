import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseApiService {
  getAll(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<Order>> {
    return this.getList<Order>('/orders', params);
  }

  getById(id: string): Observable<Order> {
    return this.get<Order>(`/orders/${id}`).pipe(map((r) => r.data));
  }

  create(payload: CreateOrderRequest): Observable<Order> {
    return this.post<Order>('/orders', payload).pipe(map((r) => r.data));
  }

  update(id: string, payload: UpdateOrderRequest): Observable<Order> {
    return this.put<Order>(`/orders/${id}`, payload).pipe(map((r) => r.data));
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.patch<Order>(`/orders/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  uploadPod(id: string, file: File): Observable<Order> {
    const form = new FormData();
    form.append('pod', file);
    return this.postFormData<Order>(`/orders/${id}/pod`, form).pipe(map((r) => r.data));
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/orders/${id}`).pipe(map(() => undefined));
  }
}
