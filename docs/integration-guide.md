# Frontend Integration Guide

How to build an Angular application on **Qavo Frontend**. This mirrors the
onboarding flow in the reference architecture (§7.2) and assumes Angular 21+.

> The bundled [`qavo-reference-app`](../projects/qavo-reference-app) is a complete,
> working example of everything below.

---

## 1. Install the packages

From the public npm registry — the core trio plus HTTP, then any plugins:

```bash
npm install @qavo/core @qavo/ui @qavo/theming @qavo/http
npm install @qavo/auth-login @qavo/auth-registration   # only if needed
```

`@qavo/*` packages declare Angular and each other as **peer dependencies**, so your
application owns a single copy of each.

---

## 2. Bootstrap the platform

`provideQavo` is the single entry point that wires every cross-cutting concern.
Add the HTTP and UI integrations, then the plugins, then the router.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideForbiddenRoute, provideNotFoundRoute, provideQavo } from '@qavo/core';
import { provideQavoHttp } from '@qavo/http';
import { provideQavoUi } from '@qavo/ui';
import { provideAuthLogin } from '@qavo/auth-login';
import { provideAuthRegistration } from '@qavo/auth-registration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideQavo({
      apiBaseUrl: '/api/v1',          // path-based API versioning (architecture §5.1)
      appName: 'Catalog',
      environment: 'production',      // 'development' | 'test' | 'production'
      auth: { strategy: 'local' },    // 'local' | 'oidc' | 'hybrid'
      theming: { defaultTheme: 'system', allowUserSwitch: true },
      features: { 'catalog.promotions': true },
    }),
    provideQavoHttp(),                // interceptor stack
    provideQavoUi(),                  // themed toast/notification surface

    provideAuthLogin({ registrationRoute: '/auth/register' }),
    provideAuthRegistration({ selfService: true }),

    provideRouter(appRoutes, withComponentInputBinding()),
    provideForbiddenRoute(ForbiddenComponent),
    provideNotFoundRoute(NotFoundComponent),   // registered last → wildcard stays last
  ],
};
```

What you get with no further code: centralized error handling (global
`ErrorHandler` + HTTP error mapping), structured logging with trace correlation,
the authentication abstraction and guards, theming with two built-in themes, and
the responsive UI layer.

---

## 3. Theming setup

Theming is token-based and switches at runtime — no rebuild. Configure it through
`provideQavo({ theming })`:

```typescript
theming: {
  defaultTheme: 'system',     // 'light' | 'dark' | 'system' | <custom id>
  allowUserSwitch: true,
  persistence: 'local',       // remember the user's choice across sessions
}
```

Add the ready-made toggle anywhere (e.g. in your shell header):

```html
<qavo-theme-toggle />
```

### Brand it with a custom theme

Override only the tokens you care about — usually brand colors:

```typescript
import { extendTheme, LIGHT_THEME } from '@qavo/theming';

export const acmeTheme = extendTheme(LIGHT_THEME, 'acme', 'Acme', {
  color: { primary: '#7c3aed', primaryHover: '#6d28d9', primaryActive: '#5b21b6' },
});

// register it and make it the default
provideQavo({ theming: { customThemes: [acmeTheme], defaultTheme: 'acme' } });
```

Consume tokens in your own component styles via CSS custom properties — never
hardcode values:

```css
.panel {
  background: var(--qavo-color-surface);
  color: var(--qavo-color-on-surface);
  border-radius: var(--qavo-radius-radius-lg);
  padding: var(--qavo-spacing-space6);
  box-shadow: var(--qavo-elevation-elevation1);
}
```

---

## 4. Routing & plugins

Application routes are plain Angular routes. Attach platform guards as needed:

```typescript
import { authGuard, permissionGuard } from '@qavo/core';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [permissionGuard],
    data: { security: { permissions: ['admin:access'], roles: ['admin'], match: 'all' } },
  },
];
```

**Plugins mount themselves.** `provideAuthLogin()` / `provideAuthRegistration()`
contribute their routes via Angular's `ROUTES` multi-token, so `provideRouter`
picks them up automatically. Keep your wildcard fallback last by registering it
with `provideNotFoundRoute(...)` after `provideRouter`. Remove a plugin's
`provideXxx()` call and the feature — routes, providers and all — disappears.

Page titles are centralized: declare `title` on a route and the platform composes
`"<page> · <app>"`.

---

## 5. Auth integration

The strategy is selected in configuration; the rest of your UI is unaware of which
is active.

```typescript
// Local (default)
auth: { strategy: 'local' }

// External OIDC provider (Entra ID, Keycloak, any compliant provider)
auth: {
  strategy: 'oidc',
  oidc: { issuerUri: 'https://login.example.com/', clientId: 'catalog-spa', scopes: ['openid','profile'] },
}
```

Read the security context anywhere via signals, and gate UI declaratively:

```typescript
private readonly auth = inject(AuthService);
// auth.isAuthenticated(), auth.user(), auth.roles(), auth.permissions()
```

```html
<button *qavoHasPermission="'orders:write'">New order</button>
<section *qavoHasPermission="['reports:read','reports:export']; match: 'any'">…</section>
```

Restore the session at startup (e.g. in the root component or an initializer):

```typescript
inject(AuthService).restore().subscribe();
```

> **OIDC note.** The OIDC strategy provides the platform seam (authorize redirect,
> uniform token surface) but delegates the PKCE code exchange to a dedicated OIDC
> client you wire in by replacing `QAVO_AUTH_STRATEGY`. See the
> [capabilities matrix](capabilities-matrix.md).

---

## 6. HTTP & API client

Make requests against logical paths; the interceptors handle the rest:

```typescript
this.http.get<Order[]>('/orders');        // → GET /api/v1/orders, with auth + traceparent
```

Generate the typed client from the backend OpenAPI document and let the platform
interceptors handle base URL, auth and tracing — see the
[generated client example](../projects/qavo-reference-app/src/app/api/README.md)
and [`openapitools.json`](../openapitools.json).

Tune resilience or add your own interceptors:

```typescript
provideQavoHttp({
  retry: { maxAttempts: 4, initialIntervalMs: 250 },
  extraInterceptors: [myTenantHeaderInterceptor],
});
```

---

## 7. Forms & validation

Use reactive forms with the shared validators and field UI; reconcile backend
validation errors into the form:

```typescript
form = inject(NonNullableFormBuilder).group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, QavoValidators.strongPassword(10)]],
});
```

```html
<qavo-form-field label="Email" [control]="form.controls.email" [required]="true">
  <input qavoInput type="email" formControlName="email" />
</qavo-form-field>
```

```typescript
// On a 400/422 with Problem Details, attach server messages to the right fields:
applyServerErrors(this.form, qavoError.problem!);
```

---

## 8. Responsive design usage

Compose the responsive primitives — you get mobile-first behavior for free:

```html
<qavo-shell [items]="navItems">     <!-- side nav on desktop, drawer on phones -->
  <span shell-brand>Catalog</span>
  <qavo-theme-toggle shell-actions />
  <qavo-container size="lg">
    <qavo-grid minColumnWidth="18rem" [gap]="4">
      <qavo-card heading="…">…</qavo-card>
    </qavo-grid>
  </qavo-container>
  <router-outlet />
</qavo-shell>
```

Read breakpoint state reactively when you need bespoke behavior:

```typescript
private readonly bp = inject(BreakpointService);
// bp.isHandset(), bp.isDesktopUp(), bp.active()
```

---

## 9. Testing

Use the platform harness to test platform-aware code without a backend:

```typescript
TestBed.configureTestingModule({
  providers: [
    provideQavoTesting({ session: createTestSession({ permissions: ['orders:write'] }) }),
    provideQavoTheming({ persistence: 'none' }),
    provideRouter([]),
  ],
});
```

See [Best Practices → Testing](best-practices.md#testing-strategies) for more.
