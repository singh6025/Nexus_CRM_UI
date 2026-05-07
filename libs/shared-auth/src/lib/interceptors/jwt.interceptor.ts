import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshSubject$ = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !req.url.includes('/auth/')) {
        return handle401(req, next, authService);
      }
      return throwError(() => err);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject$.next(null);

    return authService.refresh().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshSubject$.next(res.access_token);
        return next(addToken(req, res.access_token));
      }),
      catchError((err: unknown) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  }

  return refreshSubject$.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token)))
  );
}
