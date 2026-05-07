import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, QueryParams } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = '/api/v1';

  protected buildParams(query?: QueryParams): HttpParams {
    let params = new HttpParams();
    if (!query) return params;
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }

  protected get<T>(path: string, query?: QueryParams): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, {
      params: this.buildParams(query),
    });
  }

  protected getList<T>(path: string, query?: QueryParams): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${path}`, {
      params: this.buildParams(query),
    });
  }

  protected post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  protected put<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  protected patch<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  protected delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  protected postFormData<T>(path: string, formData: FormData): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, formData);
  }
}
