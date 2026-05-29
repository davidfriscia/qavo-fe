import { InjectionToken } from '@angular/core';

/** Runtime behavior of the registration plugin. */
export interface AuthRegistrationConfig {
  /** Route path the registration screen mounts at. Defaults to `auth/register`. */
  routePath: string;
  /** Whether self-service sign-up is currently open. */
  selfService: boolean;
  /** Backend endpoint (relative to the API base URL). */
  endpoint: string;
  /** Whether the backend requires email verification before activation. */
  requireEmailVerification: boolean;
  /** Minimum password length enforced client-side (mirror the backend policy). */
  passwordMinLength: number;
  /** Where to send users after a successful sign-up. */
  successRoute: string;
}

export const DEFAULT_AUTH_REGISTRATION_CONFIG: AuthRegistrationConfig = {
  routePath: 'auth/register',
  selfService: true,
  endpoint: '/auth/register',
  requireEmailVerification: true,
  passwordMinLength: 10,
  successRoute: '/auth/login',
};

export const AUTH_REGISTRATION_CONFIG = new InjectionToken<AuthRegistrationConfig>(
  'AUTH_REGISTRATION_CONFIG',
);
