import { Observable, of } from 'rxjs';
import { AuthCredentials, AuthStrategy, QavoSession } from '@qavo/core';
import { createTestSession } from './fixtures';

/**
 * In-memory authentication strategy for tests. Seed it with a session to start
 * authenticated, or `null` to start anonymous; `login` resolves to the seeded
 * session (or a default test session).
 */
export class MockAuthStrategy implements AuthStrategy {
  readonly id = 'mock';

  constructor(private session: QavoSession | null = null) {}

  restore(): Observable<QavoSession | null> {
    return of(this.session);
  }

  login(_credentials: AuthCredentials): Observable<QavoSession> {
    this.session ??= createTestSession();
    return of(this.session);
  }

  logout(): Observable<void> {
    this.session = null;
    return of(void 0);
  }

  getAccessToken(): string | null {
    return this.session?.accessToken ?? null;
  }
}
