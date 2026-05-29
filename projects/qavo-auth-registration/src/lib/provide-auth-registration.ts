import { EnvironmentProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { provideQavoPlugin } from '@qavo/core';
import {
  AUTH_REGISTRATION_CONFIG,
  AuthRegistrationConfig,
  DEFAULT_AUTH_REGISTRATION_CONFIG,
} from './registration-config';
import { QavoRegistrationComponent } from './registration.component';
import { RegistrationService } from './registration.service';

/**
 * Register the registration plugin. An application that authenticates purely via
 * corporate SSO simply omits this call and the plugin does not exist in the app.
 *
 * @example
 * providers: [provideQavo({...}), provideAuthRegistration({ selfService: true })]
 */
export function provideAuthRegistration(
  config: Partial<AuthRegistrationConfig> = {},
): EnvironmentProviders {
  const merged: AuthRegistrationConfig = { ...DEFAULT_AUTH_REGISTRATION_CONFIG, ...config };

  const routes: Routes = [
    {
      path: merged.routePath,
      component: QavoRegistrationComponent,
      title: 'Create account',
    },
  ];

  return provideQavoPlugin({
    plugin: {
      id: 'auth-registration',
      version: '0.0.0',
      description: 'Self-service registration flow.',
    },
    providers: [
      { provide: AUTH_REGISTRATION_CONFIG, useValue: merged },
      RegistrationService,
    ],
    routes,
  });
}
