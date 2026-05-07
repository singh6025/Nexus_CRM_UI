import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const tenantId = authStore.tenantId();

  if (!tenantId || req.url.includes('/auth/')) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { 'X-Tenant-ID': tenantId } }));
};
