import { InjectionToken } from '@angular/core';
import { QavoThemingConfig } from '@qavo/theming';
import { QavoAuthConfig } from '../auth/auth-config';
import { FeatureFlagMap } from '../features/feature-flags';
import { LogLevel } from '../logging/logger';
import { QavoEnvironmentName } from './environment';

/**
 * The single, typed configuration surface for a Qavo application.
 *
 * Passed once to {@link provideQavo}; everything cross-cutting is derived from
 * it. Convention over configuration: only `apiBaseUrl` is required, everything
 * else has sensible enterprise defaults.
 */
export interface QavoConfig {
  /** API base URL, e.g. `/api/v1`. */
  apiBaseUrl: string;

  /** Application name (used in titles and log enrichment). */
  appName?: string;

  /** Runtime environment; drives logging verbosity and dev diagnostics. */
  environment?: QavoEnvironmentName;

  /** Authentication strategy and behavior. Defaults to local. */
  auth?: QavoAuthConfig;

  /** Theming setup (themes, default, persistence). */
  theming?: QavoThemingConfig;

  /** Initial feature-flag values. */
  features?: FeatureFlagMap;

  /** Logging configuration. */
  logging?: {
    minLevel?: LogLevel;
    remoteEndpoint?: string;
  };
}

/** The fully-resolved configuration (defaults applied), available for injection. */
export const QAVO_CONFIG = new InjectionToken<Required<Pick<QavoConfig, 'apiBaseUrl' | 'appName' | 'environment'>> & QavoConfig>(
  'QAVO_CONFIG',
);
