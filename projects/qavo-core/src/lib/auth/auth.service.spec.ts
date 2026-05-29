import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { QAVO_AUTH_STRATEGY } from './auth-config';
import { AuthCredentials, AuthStrategy, QavoSession, QavoUser } from './auth-models';

/**
 * Unit test for the core authentication state machine.
 *
 * `qavo-core` is the root of the dependency graph, so its own tests stay
 * self-contained: they provide an in-memory strategy directly against the
 * source {@link QAVO_AUTH_STRATEGY} token rather than reaching for the built
 * `@qavo/testing` package (which depends on this library, and whose compiled
 * token identity would not match the source under test).
 */
class InMemoryStrategy implements AuthStrategy {
  readonly id = 'in-memory';
  constructor(private session: QavoSession | null) {}
  restore(): Observable<QavoSession | null> {
    return of(this.session);
  }
  login(_credentials: AuthCredentials): Observable<QavoSession> {
    return of(this.session as QavoSession);
  }
  logout(): Observable<void> {
    this.session = null;
    return of(void 0);
  }
  getAccessToken(): string | null {
    return this.session?.accessToken ?? null;
  }
}

function session(permissions: readonly string[]): QavoSession {
  const user: QavoUser = {
    id: 'user-1',
    username: 'test.user',
    roles: ['user'],
    permissions,
  };
  return { user, accessToken: 'test-token' };
}

describe('AuthService', () => {
  function setup(permissions: readonly string[]): AuthService {
    TestBed.configureTestingModule({
      providers: [
        { provide: QAVO_AUTH_STRATEGY, useValue: new InMemoryStrategy(session(permissions)) },
      ],
    });
    return TestBed.inject(AuthService);
  }

  it('exposes the restored security context as signals', () => {
    const auth = setup(['orders:read']);
    auth.restore().subscribe();
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.hasPermission('orders:read')).toBe(true);
    expect(auth.hasPermission('orders:write')).toBe(false);
  });

  it('clears the context on logout', () => {
    const auth = setup([]);
    auth.restore().subscribe();
    auth.logout().subscribe();
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.user()).toBeNull();
  });
});
