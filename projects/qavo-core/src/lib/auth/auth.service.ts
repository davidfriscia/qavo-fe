import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthCredentials, OidcCallbackResult, QavoSession } from './auth-models';
import { QAVO_AUTH_STRATEGY } from './auth-config';

/**
 * Uniform authentication state and operations.
 *
 * Exposes the security context as signals (user, roles, permissions) and
 * delegates the actual mechanism to the active {@link AuthStrategy}. UI code,
 * guards and the permission directive read from here and stay strategy-agnostic.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly strategy = inject(QAVO_AUTH_STRATEGY);

  private readonly sessionSignal = signal<QavoSession | null>(null);

  /** The current session, or `null` when anonymous. */
  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly roles = computed<readonly string[]>(() => this.user()?.roles ?? []);
  readonly permissions = computed<readonly string[]>(() => this.user()?.permissions ?? []);

  /** The active strategy id (`local`, `oidc`, ...). */
  get strategyId(): string {
    return this.strategy.id;
  }

  /** Restore an existing session at startup. */
  restore(): Observable<QavoSession | null> {
    return this.strategy.restore().pipe(tap((session) => this.sessionSignal.set(session)));
  }

  /** Credential login (local/hybrid strategies). */
  login(credentials: AuthCredentials): Observable<QavoSession> {
    if (!this.strategy.login) {
      throw new Error(`Strategy '${this.strategy.id}' does not support credential login.`);
    }
    return this.strategy.login(credentials).pipe(tap((session) => this.sessionSignal.set(session)));
  }

  /** Begin an interactive redirect login (OIDC). */
  loginRedirect(targetUrl?: string): void {
    this.strategy.loginRedirect?.(targetUrl);
  }

  /**
   * Complete an interactive login after redirect back to the app.
   * Returns the original return URL the strategy persisted across the redirect.
   */
  completeRedirect(callback: { code: string; state: string }): Observable<string | null> {
    if (!this.strategy.completeRedirect) {
      throw new Error(`Strategy '${this.strategy.id}' does not support redirect login.`);
    }
    return this.strategy.completeRedirect(callback).pipe(
      tap((result: OidcCallbackResult) => this.sessionSignal.set(result.session)),
      map((result) => result.returnUrl),
    );
  }

  logout(): Observable<void> {
    return this.strategy.logout().pipe(tap(() => this.sessionSignal.set(null)));
  }

  getAccessToken(): string | null {
    return this.strategy.getAccessToken();
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: readonly string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: readonly string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /** Test seam: directly set the session (used by `@qavo/testing` mocks). */
  setSessionForTesting(session: QavoSession | null): void {
    this.sessionSignal.set(session);
  }
}
