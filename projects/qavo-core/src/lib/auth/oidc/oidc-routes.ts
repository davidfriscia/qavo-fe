import { EnvironmentProviders, Type, makeEnvironmentProviders } from '@angular/core';
import { ROUTES, Route } from '@angular/router';
import { QavoOidcCallbackComponent } from './oidc-callback.component';

/**
 * Register the OIDC callback route.
 *
 * Add this to the application's providers alongside `provideRouter(...)` when
 * the OIDC strategy is in use. The default mounts {@link QavoOidcCallbackComponent}
 * at `auth/callback`; a host that wants a branded callback page passes its own
 * component (and may override the path).
 *
 * @example
 * provideOidcCallbackRoute();
 * provideOidcCallbackRoute({ component: MyCallback, path: 'auth/cb' });
 */
export function provideOidcCallbackRoute(
  options: { component?: Type<unknown>; path?: string } = {},
): EnvironmentProviders {
  const route: Route = {
    path: options.path ?? 'auth/callback',
    component: options.component ?? QavoOidcCallbackComponent,
    title: 'Signing in',
  };
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: [route], multi: true }]);
}
