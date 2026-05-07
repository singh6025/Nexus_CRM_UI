import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authStore.isAuthenticated()) return true;

  const token = authService.getAccessToken();
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return authService.loadCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
