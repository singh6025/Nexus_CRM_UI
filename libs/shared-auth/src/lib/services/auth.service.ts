import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  CurrentUser,
  Tenant,
  TokenPair,
} from '../models/auth.models';
import { AuthStore } from '../store/auth.store';

const ACCESS_TOKEN_KEY = 'crm_access_token';
const REFRESH_TOKEN_KEY = 'crm_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly base = '/api/v1';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, credentials).pipe(
      tap((res) => {
        this.storeTokens({ accessToken: res.access_token, refreshToken: res.refresh_token });
      })
    );
  }

  loadCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.base}/auth/me`).pipe(
      tap((user) => {
        const tokens = this.getStoredTokens();
        const tenant: Tenant = {
          id: user.tenantId,
          name: '',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
        };
        if (tokens) {
          this.authStore.setAuth(user, tenant, tokens);
        }
      })
    );
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return this.http
      .post<LoginResponse>(`${this.base}/auth/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap((res) => {
          const tokens: TokenPair = { accessToken: res.access_token, refreshToken: res.refresh_token };
          this.storeTokens(tokens);
          this.authStore.updateTokens(tokens);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.authStore.clearAuth();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private storeTokens(tokens: TokenPair): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private getStoredTokens(): TokenPair | null {
    const access = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!access || !refresh) return null;
    return { accessToken: access, refreshToken: refresh };
  }
}
