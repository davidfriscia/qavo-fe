import { HttpInterceptorFn } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

/** Resilience/retry tuning for transient outbound failures. */
export interface RetryConfig {
  /** Total attempts including the first. */
  maxAttempts: number;
  /** First backoff interval in ms. */
  initialIntervalMs: number;
  /** Exponential growth factor between attempts. */
  multiplier: number;
  /** Random jitter ratio (0..1) applied to each delay to avoid thundering herds. */
  jitter: number;
  /** HTTP statuses considered transient and therefore retryable. */
  retryableStatuses: number[];
  /** Methods safe to retry (idempotent by default; POST excluded). */
  retryableMethods: string[];
}

export interface QavoHttpConfig {
  /** Retry policy for transient failures. */
  retry: RetryConfig;
  /** Redirect to the login route on 401. */
  handleAuthRedirect: boolean;
  /** Navigate to the forbidden route on 403. */
  handleForbidden: boolean;
  /** Application/plugin interceptors appended after the platform ones. */
  extraInterceptors: HttpInterceptorFn[];
}

export const DEFAULT_HTTP_CONFIG: QavoHttpConfig = {
  retry: {
    maxAttempts: 3,
    initialIntervalMs: 200,
    multiplier: 2,
    jitter: 0.5,
    retryableStatuses: [0, 408, 429, 502, 503, 504],
    retryableMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'],
  },
  handleAuthRedirect: true,
  handleForbidden: true,
  extraInterceptors: [],
};

export const QAVO_HTTP_CONFIG = new InjectionToken<QavoHttpConfig>('QAVO_HTTP_CONFIG');
