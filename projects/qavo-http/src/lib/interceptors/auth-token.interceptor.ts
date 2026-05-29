import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@qavo/core';

/**
 * Injects the current access token as a Bearer `Authorization` header on
 * outbound requests, regardless of the active authentication strategy. Requests
 * that already carry an `Authorization` header are left untouched.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService, { optional: true });
  const token = auth?.getAccessToken();
  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
