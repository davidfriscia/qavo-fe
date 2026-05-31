import { EnvironmentProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { provideQavoPlugin } from '@qavo/core';
import { AUTH_LOGIN_CONFIG, AuthLoginConfig, DEFAULT_AUTH_LOGIN_CONFIG } from './login-config';
import { QavoLoginComponent } from './login.component';

/**
 * Register the login plugin.
 *
 * Self-contained: it contributes its config, its descriptor, and a lazily
 * resolved route (mounted via the platform's `ROUTES` multi-token) in one call.
 * Removing this call removes the plugin entirely — no other code changes.
 *
 * @example
 * providers: [provideQavo({...}), provideAuthLogin({ registrationRoute: '/auth/register' })]
 */
export function provideAuthLogin(config: Partial<AuthLoginConfig> = {}): EnvironmentProviders {
  const merged: AuthLoginConfig = { ...DEFAULT_AUTH_LOGIN_CONFIG, ...config };

  const routes: Routes = [
    {
      path: merged.routePath,
      component: QavoLoginComponent,
      title: 'Sign in',
    },
  ];

  return provideQavoPlugin({
    plugin: { id: 'auth-login', version: '0.1.0', description: 'Local login flow.' },
    providers: [{ provide: AUTH_LOGIN_CONFIG, useValue: merged }],
    routes,
  });
}
