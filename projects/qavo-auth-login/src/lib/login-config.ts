import { InjectionToken } from '@angular/core';

/** Runtime behavior of the login plugin (the "config for behavior" half of the model). */
export interface AuthLoginConfig {
  /** Route path the login screen mounts at. Defaults to `auth/login`. */
  routePath: string;
  /** Where to send users after a successful login when no `returnUrl` is present. */
  defaultRedirect: string;
  /** Route to the registration screen, if the registration plugin is present. */
  registrationRoute?: string;
  /** Show a "forgot password" affordance. */
  showForgotPassword: boolean;
}

export const DEFAULT_AUTH_LOGIN_CONFIG: AuthLoginConfig = {
  routePath: 'auth/login',
  defaultRedirect: '/',
  showForgotPassword: false,
};

export const AUTH_LOGIN_CONFIG = new InjectionToken<AuthLoginConfig>('AUTH_LOGIN_CONFIG');
