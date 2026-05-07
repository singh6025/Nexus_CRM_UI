import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '@farmeasy/shared-api';
import { DashboardData, AlertItem } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  getDashboard(): Observable<DashboardData> {
    return this.get<DashboardData>('/analytics/dashboard').pipe(map((r) => r.data));
  }

  markAlertRead(id: string): Observable<void> {
    return this.patch<void>(`/analytics/dashboard/alerts/${id}/read`, {}).pipe(map(() => undefined));
  }
}
