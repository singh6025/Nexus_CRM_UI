import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import { AnalyticsDashboard, SupplyDemandRow } from '../models/analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService extends BaseApiService {
  getDashboard(): Observable<AnalyticsDashboard> {
    return this.get<AnalyticsDashboard>('/analytics/dashboard').pipe(map((r) => r.data));
  }

  getSupplyDemand(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<SupplyDemandRow>> {
    return this.getList<SupplyDemandRow>('/analytics/supply-demand', params);
  }
}
