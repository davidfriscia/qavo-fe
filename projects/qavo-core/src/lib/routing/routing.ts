import { EnvironmentProviders, Type, makeEnvironmentProviders } from '@angular/core';
import { ROUTES, Route, Routes } from '@angular/router';

/**
 * Reserved route namespaces, mirroring the backend's reserved API namespaces
 * (e.g. `/api/v1/auth/**`). Plugins mount under these so applications get a
 * predictable URL surface.
 */
export const QAVO_ROUTE_NAMESPACES = {
  auth: 'auth',
  forbidden: 'forbidden',
  notFound: 'not-found',
} as const;

/**
 * Register a global not-found (wildcard) route.
 *
 * Provided via the `ROUTES` multi-token and intended to be placed LAST in the
 * application's bootstrap providers, so it never shadows plugin- or
 * application-contributed routes.
 */
export function provideNotFoundRoute(component: Type<unknown>): EnvironmentProviders {
  const route: Route = { path: '**', component, title: 'Page not found' };
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: [route], multi: true }]);
}

/**
 * Register an access-denied route at the conventional `/forbidden` path.
 */
export function provideForbiddenRoute(component: Type<unknown>): EnvironmentProviders {
  const route: Route = {
    path: QAVO_ROUTE_NAMESPACES.forbidden,
    component,
    title: 'Access denied',
  };
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: [route], multi: true }]);
}

/** Helper to contribute an arbitrary set of application routes via the multi-token. */
export function provideRoutesProvider(routes: Routes): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ROUTES, useValue: routes, multi: true }]);
}
