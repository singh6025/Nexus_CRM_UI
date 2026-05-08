import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService, PaginatedResponse } from '@farmeasy/shared-api';
import {
  AppUser, InviteUserRequest, UserRole, UserStatus,
  PipelineStage, CreateStageRequest,
  TenantConfig,
} from '../models/settings.models';

@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseApiService {
  // Users
  getUsers(params: Record<string, string | number | boolean> = {}): Observable<PaginatedResponse<AppUser>> {
    return this.getList<AppUser>('/settings/users', params);
  }

  inviteUser(payload: InviteUserRequest): Observable<AppUser> {
    return this.post<AppUser>('/settings/users/invite', payload).pipe(map((r) => r.data));
  }

  updateUserRole(id: string, role: UserRole): Observable<AppUser> {
    return this.patch<AppUser>(`/settings/users/${id}/role`, { role }).pipe(map((r) => r.data));
  }

  updateUserStatus(id: string, status: UserStatus): Observable<AppUser> {
    return this.patch<AppUser>(`/settings/users/${id}/status`, { status }).pipe(map((r) => r.data));
  }

  // Pipeline Stages
  getStages(): Observable<PipelineStage[]> {
    return this.get<PipelineStage[]>('/settings/pipeline-stages').pipe(map((r) => r.data));
  }

  createStage(payload: CreateStageRequest): Observable<PipelineStage> {
    return this.post<PipelineStage>('/settings/pipeline-stages', payload).pipe(map((r) => r.data));
  }

  updateStage(id: string, payload: Partial<CreateStageRequest>): Observable<PipelineStage> {
    return this.put<PipelineStage>(`/settings/pipeline-stages/${id}`, payload).pipe(map((r) => r.data));
  }

  deleteStage(id: string): Observable<void> {
    return this.delete<void>(`/settings/pipeline-stages/${id}`).pipe(map(() => undefined));
  }

  // Tenant
  getTenantConfig(): Observable<TenantConfig> {
    return this.get<TenantConfig>('/settings/tenant').pipe(map((r) => r.data));
  }

  updateTenantConfig(payload: Partial<TenantConfig>): Observable<TenantConfig> {
    return this.put<TenantConfig>('/settings/tenant', payload).pipe(map((r) => r.data));
  }
}
