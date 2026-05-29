/*
 * Public API Surface of @qavo/http
 *
 * Centralized, composable HttpClient configuration: base-URL resolution, auth
 * token injection, trace correlation, RFC 9457 error mapping with navigation
 * side effects, and resilient retry with backoff + jitter.
 */

export * from './lib/http-config';
export * from './lib/interceptors/base-url.interceptor';
export * from './lib/interceptors/auth-token.interceptor';
export * from './lib/interceptors/trace.interceptor';
export * from './lib/interceptors/retry.interceptor';
export * from './lib/interceptors/error.interceptor';
export * from './lib/provide-http';
