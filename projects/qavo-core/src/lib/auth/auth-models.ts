import { Observable } from 'rxjs';

/** The authenticated principal, uniform across every authentication strategy. */
export interface QavoUser {
  readonly id: string;
  readonly username: string;
  readonly displayName?: string;
  readonly email?: string;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
}

/** An active authenticated session. */
export interface QavoSession {
  readonly user: QavoUser;
  /** Bearer token injected into outbound requests, when the strategy issues one. */
  readonly accessToken?: string;
  readonly refreshToken?: string;
  /** Epoch millis at which the access token expires. */
  readonly expiresAt?: number;
}

export interface AuthCredentials {
  readonly username: string;
  readonly password: string;
}

/**
 * Pluggable authentication strategy.
 *
 * The platform never binds to a single identity provider. A strategy adapts a
 * concrete mechanism (local DB login, OIDC redirect, ...) to one uniform
 * contract; everything above {@link AuthService} is unaware of which is active,
 * so swapping the strategy never touches business code.
 */
export interface AuthStrategy {
  readonly id: string;

  /** Restore a session at startup (stored token, silent SSO). Resolves `null` if none. */
  restore(): Observable<QavoSession | null>;

  /** Credential-based login. Present on local/hybrid strategies. */
  login?(credentials: AuthCredentials): Observable<QavoSession>;

  /** Begin an interactive redirect login (OIDC Authorization Code + PKCE). */
  loginRedirect?(targetUrl?: string): void;

  /** Complete an interactive login after redirect back to the app. */
  completeRedirect?(): Observable<QavoSession>;

  logout(): Observable<void>;

  /** The current access token for HTTP injection, or `null`. */
  getAccessToken(): string | null;
}

/**
 * Token storage abstraction.
 *
 * The default is in-memory (most resistant to XSS token theft). Applications may
 * opt into persistence explicitly, accepting the trade-off.
 */
export abstract class TokenStore {
  abstract get(): string | null;
  abstract set(token: string | null): void;
  abstract clear(): void;
}

/** Default, secure-by-default in-memory token store. Tokens never touch disk. */
export class MemoryTokenStore extends TokenStore {
  private token: string | null = null;
  get(): string | null {
    return this.token;
  }
  set(token: string | null): void {
    this.token = token;
  }
  clear(): void {
    this.token = null;
  }
}
