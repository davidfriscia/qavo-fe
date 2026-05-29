import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { QAVO_HTTP_CONFIG } from '../http-config';

/**
 * Retries transient outbound failures with exponential backoff and jitter,
 * mirroring the backend resilience baseline. Only idempotent methods and
 * transient statuses are retried; non-idempotent calls (POST) are never retried
 * automatically. This is the frontend half of the platform's resilience story.
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const { retry: config } = inject(QAVO_HTTP_CONFIG);

  if (!config.retryableMethods.includes(req.method.toUpperCase())) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: config.maxAttempts - 1,
      delay: (error, attempt) => {
        const status = error instanceof HttpErrorResponse ? error.status : -1;
        if (!config.retryableStatuses.includes(status)) {
          return throwError(() => error);
        }
        const base = config.initialIntervalMs * Math.pow(config.multiplier, attempt - 1);
        const jitter = base * config.jitter * Math.random();
        return timer(base + jitter);
      },
    }),
  );
};
