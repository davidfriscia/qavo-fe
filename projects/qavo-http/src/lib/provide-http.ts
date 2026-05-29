import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { DEFAULT_HTTP_CONFIG, QAVO_HTTP_CONFIG, QavoHttpConfig } from './http-config';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';
import { traceInterceptor } from './interceptors/trace.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

/**
 * Configure `HttpClient` with the Qavo interceptor stack.
 *
 * Ordering is deliberate. On the way out: base-URL resolution, then error
 * handling (which therefore observes the *final* outcome), then retry, then the
 * per-attempt enrichment (trace + auth) so each retry carries a fresh token and
 * trace. Application/plugin interceptors run innermost. The whole stack is
 * reusable and composable — applications add their own concerns via
 * `extraInterceptors` without rewriting the platform behavior.
 */
export function provideQavoHttp(config: Partial<QavoHttpConfig> = {}): EnvironmentProviders {
  const merged: QavoHttpConfig = {
    ...DEFAULT_HTTP_CONFIG,
    ...config,
    retry: { ...DEFAULT_HTTP_CONFIG.retry, ...config.retry },
  };

  const interceptors: HttpInterceptorFn[] = [
    baseUrlInterceptor,
    errorInterceptor,
    retryInterceptor,
    traceInterceptor,
    authTokenInterceptor,
    ...merged.extraInterceptors,
  ];

  return makeEnvironmentProviders([
    { provide: QAVO_HTTP_CONFIG, useValue: merged },
    provideHttpClient(withInterceptors(interceptors)),
  ]);
}
