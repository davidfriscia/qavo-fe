import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { QAVO_API_BASE_URL } from '../config/api-base-url';
import { AuthCredentials, AuthStrategy, QavoSession, QavoUser, TokenStore } from './auth-models';
import { DEFAULT_AUTH_CONFIG, QAVO_AUTH_CONFIG } from './auth-config';

interface SessionResponse {
  user: QavoUser;
  accessToken?: string;
  expiresAt?: number;
}

/**
 * Local, DB-backed authentication against the Qavo backend's local-auth
 * endpoints. This is the default strategy: an application is fully functional
 * with no external identity provider.
 */
@Injectable()
export class LocalAuthStrategy implements AuthStrategy {
  readonly id = 'local';

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(QAVO_API_BASE_URL);
  private readonly tokenStore = inject(TokenStore);
  private readonly config = inject(QAVO_AUTH_CONFIG, { optional: true });

  private endpoint(key: 'login' | 'logout' | 'session'): string {
    const path = this.config?.endpoints?.[key] ?? DEFAULT_AUTH_CONFIG.endpoints![key]!;
    return `${this.baseUrl}${path}`;
  }

  login(credentials: AuthCredentials): Observable<QavoSession> {
    return this.http.post<SessionResponse>(this.endpoint('login'), credentials).pipe(
      map((response) => this.toSession(response)),
      tap((session) => this.tokenStore.set(session.accessToken ?? null)),
    );
  }

  restore(): Observable<QavoSession | null> {
    // The backend resolves the session from the cookie/token; no token means anonymous.
    return this.http.get<SessionResponse>(this.endpoint('session')).pipe(
      map((response) => this.toSession(response)),
      tap((session) => this.tokenStore.set(session.accessToken ?? null)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.endpoint('logout'), {}).pipe(
      tap(() => this.tokenStore.clear()),
      map(() => void 0),
    );
  }

  getAccessToken(): string | null {
    return this.tokenStore.get();
  }

  private toSession(response: SessionResponse): QavoSession {
    return {
      user: response.user,
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
    };
  }
}

/**
 * Convenience factory returning a strategy that reports no session — useful as
 * an anonymous baseline in tests or SSO-completes-elsewhere setups.
 */
export function anonymousRestore(): Observable<QavoSession | null> {
  return of(null);
}
