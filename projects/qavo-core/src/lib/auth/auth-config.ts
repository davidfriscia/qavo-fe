import { InjectionToken } from '@angular/core';
import { AuthStrategy } from './auth-models';

export type AuthStrategyId = 'local' | 'oidc' | 'hybrid';

/**
 * Provider-agnostic OIDC configuration.
 *
 * Designed so a deployment can typically supply only `issuerUri` and
 * `clientId`; the strategy resolves authorization/token endpoints by
 * convention (`<issuer>/authorize`, `<issuer>/token`, `<issuer>/end_session`)
 * and lets explicit fields override that resolution when the IdP exposes
 * non-standard paths.
 */
export interface OidcConfig {
  /** Issuer (provider) base URL, e.g. `https://login.example.com/realms/qavo`. */
  issuerUri: string;
  /** Public client id registered with the IdP. */
  clientId: string;
  /** Callback URL the IdP redirects to. Defaults to `<origin>/auth/callback`. */
  redirectUri?: string;
  /** Scopes requested. Defaults to `['openid', 'profile', 'email']`. */
  scopes?: string[];
  /** Explicit authorization endpoint (overrides the issuer-based convention). */
  authorizationEndpoint?: string;
  /** Explicit token endpoint (overrides the issuer-based convention). */
  tokenEndpoint?: string;
  /** Explicit end-session endpoint, called on logout when present. */
  endSessionEndpoint?: string;
  /** Where the IdP should send the user after end-session. Defaults to `<origin>/`. */
  postLogoutRedirectUri?: string;
  /**
   * Schedule a refresh-token grant a short window before the access token
   * expires. Defaults to `true` when the IdP issues refresh tokens.
   */
  silentRenewal?: boolean;
  /** Seconds before expiry to attempt silent renewal. Defaults to `60`. */
  renewalLeewaySeconds?: number;
  /**
   * Callback path mounted by {@link provideOidcCallbackRoute}.
   * Defaults to `auth/callback`.
   */
  callbackPath?: string;
}

export interface QavoAuthConfig {
  /** Selected strategy. Defaults to `local`. */
  strategy: AuthStrategyId;
  /** Required for `oidc` / `hybrid`. */
  oidc?: OidcConfig;
  /** Backend paths for the local strategy, relative to the API base URL. */
  endpoints?: {
    login?: string;
    logout?: string;
    session?: string;
  };
  /** Route to send unauthenticated users to. Defaults to `/auth/login`. */
  loginRoute?: string;
  /** Route shown on authorization failure. Defaults to `/forbidden`. */
  forbiddenRoute?: string;
  /** Persist the access token across reloads. Defaults to `false` (in-memory). */
  persistToken?: boolean;
}

export const DEFAULT_AUTH_CONFIG: Required<Pick<QavoAuthConfig, 'strategy' | 'loginRoute' | 'forbiddenRoute' | 'persistToken'>> &
  QavoAuthConfig = {
  strategy: 'local',
  loginRoute: '/auth/login',
  forbiddenRoute: '/forbidden',
  persistToken: false,
  endpoints: {
    login: '/auth/login',
    logout: '/auth/logout',
    session: '/auth/session',
  },
};

export const QAVO_AUTH_CONFIG = new InjectionToken<QavoAuthConfig>('QAVO_AUTH_CONFIG');

/** The active authentication strategy implementation. */
export const QAVO_AUTH_STRATEGY = new InjectionToken<AuthStrategy>('QAVO_AUTH_STRATEGY');
