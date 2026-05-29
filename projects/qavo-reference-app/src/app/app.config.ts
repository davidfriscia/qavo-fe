import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideForbiddenRoute, provideNotFoundRoute, provideQavo } from '@qavo/core';
import { provideQavoHttp } from '@qavo/http';
import { provideQavoUi } from '@qavo/ui';
import { provideAuthLogin } from '@qavo/auth-login';
import { provideAuthRegistration } from '@qavo/auth-registration';
import { routes } from './app.routes';
import { ForbiddenComponent } from './pages/forbidden.component';
import { NotFoundComponent } from './pages/not-found.component';

/**
 * The application's composition root.
 *
 * `provideQavo` wires every cross-cutting concern; the HTTP and UI layers add
 * the interceptor stack and the themed notification surface; the auth plugins
 * self-register their routes. The fallback routes are registered last so the
 * wildcard never shadows plugin or application routes.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideQavo({
      apiBaseUrl: '/api/v1',
      appName: 'Qavo Reference',
      environment: 'development',
      auth: { strategy: 'local' },
      theming: { defaultTheme: 'system', allowUserSwitch: true },
      features: { 'demo.beta': true },
    }),
    provideQavoHttp(),
    provideQavoUi(),

    // Plugins — imported only where needed; remove a line to remove the feature.
    provideAuthLogin({ registrationRoute: '/auth/register' }),
    provideAuthRegistration({ selfService: true }),

    provideRouter(routes, withComponentInputBinding()),
    provideForbiddenRoute(ForbiddenComponent),
    provideNotFoundRoute(NotFoundComponent),
  ],
};
