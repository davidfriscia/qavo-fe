import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { DEFAULT_AUTH_CONFIG, QAVO_AUTH_CONFIG } from './auth-config';

/**
 * Route data conventions read by the platform guards.
 * `permissions` / `roles` requirements may be attached per route via `data`.
 */
export interface QavoRouteSecurity {
  permissions?: string[];
  roles?: string[];
  /** When multiple are listed: require `all` (default) or `any`. */
  match?: 'all' | 'any';
}

function loginRedirect(state: RouterStateSnapshot): UrlTree {
  const router = inject(Router);
  const config = inject(QAVO_AUTH_CONFIG, { optional: true });
  const loginRoute = config?.loginRoute ?? DEFAULT_AUTH_CONFIG.loginRoute;
  return router.createUrlTree([loginRoute], { queryParams: { returnUrl: state.url } });
}

function forbiddenRedirect(): UrlTree {
  const router = inject(Router);
  const config = inject(QAVO_AUTH_CONFIG, { optional: true });
  return router.createUrlTree([config?.forbiddenRoute ?? DEFAULT_AUTH_CONFIG.forbiddenRoute]);
}

/** Allow activation only for authenticated users; otherwise redirect to login. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? true : loginRedirect(state);
};

/**
 * Authorize a route against `data.permissions` / `data.roles`.
 * Unauthenticated users are sent to login; authenticated-but-unauthorized users
 * are sent to the forbidden page.
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const auth = inject(AuthService);
  if (!auth.isAuthenticated()) {
    return loginRedirect(state);
  }
  const security = (route.data?.['security'] as QavoRouteSecurity | undefined) ?? {};
  const requiredPermissions = security.permissions ?? [];
  const requiredRoles = security.roles ?? [];
  const matchAll = (security.match ?? 'all') === 'all';

  const permissionsOk =
    requiredPermissions.length === 0 ||
    (matchAll
      ? auth.hasAllPermissions(requiredPermissions)
      : auth.hasAnyPermission(requiredPermissions));

  const rolesOk =
    requiredRoles.length === 0 ||
    (matchAll
      ? requiredRoles.every((role) => auth.hasRole(role))
      : requiredRoles.some((role) => auth.hasRole(role)));

  return permissionsOk && rolesOk ? true : forbiddenRedirect();
};

/** Build a guard requiring a specific set of permissions, for inline use. */
export function requirePermissions(
  permissions: string[],
  match: 'all' | 'any' = 'all',
): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    if (!auth.isAuthenticated()) {
      return loginRedirect(state);
    }
    const ok =
      match === 'all'
        ? auth.hasAllPermissions(permissions)
        : auth.hasAnyPermission(permissions);
    return ok ? true : forbiddenRedirect();
  };
}
