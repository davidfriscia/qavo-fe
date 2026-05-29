import { InjectionToken } from '@angular/core';
import { AuthStrategy } from './auth-models';

export type AuthStrategyId = 'local' | 'oidc' | 'hybrid';

/** OIDC provider configuration (any standard OIDC/OAuth2 provider). */
export interface OidcConfig {
  issuerUri: string;
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
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
