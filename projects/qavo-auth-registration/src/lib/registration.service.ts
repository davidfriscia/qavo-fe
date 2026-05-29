import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_REGISTRATION_CONFIG, DEFAULT_AUTH_REGISTRATION_CONFIG } from './registration-config';

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegistrationResult {
  /** True when the account requires email verification before it is active. */
  pendingVerification: boolean;
}

/**
 * Posts a registration request to the backend. The base-URL and trace
 * interceptors from `@qavo/http` apply automatically; errors surface as the
 * platform's normalized {@link QavoError}, which the component reconciles with
 * the form.
 */
@Injectable()
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly config =
    inject(AUTH_REGISTRATION_CONFIG, { optional: true }) ?? DEFAULT_AUTH_REGISTRATION_CONFIG;

  register(request: RegistrationRequest): Observable<RegistrationResult> {
    return this.http.post<RegistrationResult>(this.config.endpoint, request);
  }
}
