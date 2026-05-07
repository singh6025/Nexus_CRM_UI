export interface JwtPayload {
  sub: string;
  tenant_id: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  currency: string;
  timezone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
