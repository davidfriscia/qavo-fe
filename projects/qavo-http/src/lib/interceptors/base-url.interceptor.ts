import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { QAVO_API_BASE_URL } from '@qavo/core';

function isAbsolute(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

/**
 * Prefixes relative request URLs with the configured API base URL, so services
 * issue requests against logical paths (`'users'`, `'/orders/42'`) and the
 * version segment lives in one place. Absolute URLs and already-prefixed URLs
 * pass through untouched.
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(QAVO_API_BASE_URL, { optional: true });
  if (!baseUrl || isAbsolute(req.url)) {
    return next(req);
  }
  const base = baseUrl.replace(/\/$/, '');
  if (req.url === base || req.url.startsWith(`${base}/`)) {
    return next(req);
  }
  const path = req.url.startsWith('/') ? req.url : `/${req.url}`;
  return next(req.clone({ url: `${base}${path}` }));
};
