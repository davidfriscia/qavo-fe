import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CorrelationService, TRACEPARENT_HEADER } from '@qavo/core';

/**
 * Stamps every outbound request with a W3C `traceparent` header, so a user
 * action is traceable end to end: the same trace id flows to the backend logs
 * and is echoed back in any Problem Details error body. Honors an existing
 * header if a caller set one explicitly.
 */
export const traceInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has(TRACEPARENT_HEADER)) {
    return next(req);
  }
  const correlation = inject(CorrelationService);
  return next(req.clone({ setHeaders: { [TRACEPARENT_HEADER]: correlation.newTraceparent() } }));
};
