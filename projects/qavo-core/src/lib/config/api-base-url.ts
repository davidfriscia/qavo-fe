import { InjectionToken } from '@angular/core';

/**
 * The API base URL (e.g. `/api/v1`), following the platform's path-based
 * versioning convention. Consumed by `@qavo/http` to resolve relative request
 * URLs and by the local auth strategy. Exposed as a dedicated token so the HTTP
 * layer need not depend on the full {@link QavoConfig}.
 */
export const QAVO_API_BASE_URL = new InjectionToken<string>('QAVO_API_BASE_URL');
