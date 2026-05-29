import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {
  DEFAULT_AUTH_CONFIG,
  QAVO_AUTH_CONFIG,
  QavoLogger,
  mapToQavoError,
} from '@qavo/core';
import { QAVO_HTTP_CONFIG } from '../http-config';

/**
 * Centralized HTTP error handling.
 *
 * Normalizes every failed response into a {@link QavoError} (interpreting the
 * RFC 9457 Problem Details body), performs the platform's navigation side
 * effects — redirect to login on 401, access-denied page on 403 — logs the
 * failure with its `traceId`, and rethrows the normalized error so callers can
 * react (e.g. reconcile field errors) and, if unhandled, the global
 * `ErrorHandler` surfaces a single notification.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(QavoLogger);
  const httpConfig = inject(QAVO_HTTP_CONFIG);
  const authConfig = inject(QAVO_AUTH_CONFIG, { optional: true });

  return next(req).pipe(
    catchError((error: unknown) => {
      const qavoError = mapToQavoError(error);

      logger.error(
        `HTTP ${req.method} ${req.urlWithParams} failed`,
        { status: qavoError.status, kind: qavoError.kind },
        qavoError.traceId,
      );

      if (qavoError.kind === 'unauthorized' && httpConfig.handleAuthRedirect) {
        const loginRoute = authConfig?.loginRoute ?? DEFAULT_AUTH_CONFIG.loginRoute;
        void router.navigate([loginRoute], { queryParams: { returnUrl: router.url } });
      } else if (qavoError.kind === 'forbidden' && httpConfig.handleForbidden) {
        const forbiddenRoute = authConfig?.forbiddenRoute ?? DEFAULT_AUTH_CONFIG.forbiddenRoute;
        void router.navigate([forbiddenRoute]);
      }

      return throwError(() => qavoError);
    }),
  );
};
