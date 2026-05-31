# Qavo Frontend (`qavo-fe`)

> **Qavo** — *the foundation your applications stand on.*

**Qavo Frontend** is a reusable, plugin-oriented **Angular application platform**.
It is **not** a business application — it is a versioned set of npm packages that
applications depend on to inherit, in a standardized and centralized way, every
common frontend concern: bootstrap, configuration, routing, HTTP, error handling,
logging, validation, authentication/authorization, theming, responsive layout and
a modular capability (plugin) system.

It is the frontend half of the **Qavo** platform. The authoritative architecture
specification lives in the backend repository:
<https://github.com/davidfriscia/qavo>. This repository (`qavo-fe`) implements the
frontend side of that architecture (§2.2, §5, §6, §7.2).

**Version:** `0.1.0` · **Status:** pre-1.0 platform (see the maturity disclaimer
below).

---

## Why Qavo Frontend

Angular is a complete, opinionated framework — the perfect base for a platform
whose goal is to *impose a shared standard*. Qavo configures each cross-cutting
concern **once**, in a shared library, so applications compose the platform they
need instead of reassembling infrastructure every time.

Eight principles drive the design (mirroring the reference architecture §1):
centralization of cross-cutting concerns · independent evolution · modularity by
composition · convention over configuration · clean separation · mobile-first &
responsive everywhere · secure by default · long-term maintainability.

---

## Architecture at a glance

```
┌──────────────────────────── Qavo Frontend (@qavo/*) ────────────────────────────┐
│  @qavo/theming   token engine · light/dark · runtime switching                  │
│  @qavo/core      provideQavo · config · plugins · errors · auth · routing        │
│  @qavo/http      interceptors: base-url · auth · trace · error · retry           │
│  @qavo/ui        responsive layout · components · forms · feedback · a11y         │
│  @qavo/testing   harness · mocks · fixtures                                      │
│  plugins ─►  @qavo/auth-login   @qavo/auth-registration                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                         │ referenced by version
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     App A            App B          qavo-reference-app  (in this repo)
   core + theming   core + theming + auth-login + auth-registration + ...
```

**Platform vs application.** Qavo packages are reusable code. Applications (like
the bundled `qavo-reference-app`) declare a Qavo version, import the core plus the
plugins they need, follow a few conventions, and get all the common behavior.

---

## Packages

| Package | Responsibility |
|---|---|
| [`@qavo/theming`](projects/qavo-theming) | Versioned design-token contract, built-in accessible light & dark themes, runtime switching, per-app extension. Foundation of the design system. |
| [`@qavo/core`](projects/qavo-core) | `provideQavo` bootstrap, typed configuration, plugin registry, feature flags, RFC 9457 error handling, structured logging + trace correlation, the pluggable auth abstraction, guards, and routing conventions. |
| [`@qavo/http`](projects/qavo-http) | Composable `HttpClient` configuration: base-URL resolution, auth-token injection, W3C trace propagation, error mapping with navigation side effects, and resilient retry (backoff + jitter). |
| [`@qavo/ui`](projects/qavo-ui) | Accessible, responsive, token-driven primitives: layout system (container/stack/grid/adaptive shell), components, form & validation infrastructure, toasts & dialogs, breakpoint service. |
| [`@qavo/auth-login`](projects/qavo-auth-login) | **Plugin.** Themed local login flow that self-registers its route and config. |
| [`@qavo/auth-registration`](projects/qavo-auth-registration) | **Plugin.** Themed self-service sign-up flow with cross-field & server-side validation. |
| [`@qavo/testing`](projects/qavo-testing) | Reusable test harness, mock auth strategy, recording notification service, and fixtures. |
| [`qavo-reference-app`](projects/qavo-reference-app) | A real application built on the platform — onboarding example and integration test bed. |

---

## Technology stack

- **Angular 21** (standalone components, signals, the modern control-flow syntax)
- **TypeScript** in strict mode
- **Angular CDK** (a11y, layout, overlay, dialog) and **Angular Material** as the
  optional themed component library — see [ADR&nbsp;0006](docs/adr/0006-component-library-choice.md)
  for why Material was chosen over PrimeNG.
- **CSS custom properties** as the theming substrate
- **RxJS** only where it earns its place (HTTP, strategy I/O)
- **Vitest** for unit tests (Angular CLI default), **Playwright** for E2E
- **openapi-generator** for the typed backend client (see the [generated client example](projects/qavo-reference-app/src/app/api/README.md))

---

## Quick start

```bash
# Node 20.19+ / 22.12+ recommended
npm install

# Build every library in dependency order, then the reference app
npm run build:libs
npm run build:app

# Run the reference application
npm start            # → http://localhost:4200
```

### Using Qavo in your own application

```bash
npm install @qavo/core @qavo/ui @qavo/theming @qavo/http
npm install @qavo/auth-login @qavo/auth-registration   # only if needed
```

```typescript
bootstrapApplication(App, {
  providers: [
    provideQavo({
      apiBaseUrl: '/api/v1',
      appName: 'Catalog',
      auth: { strategy: 'local' },                 // 'local' | 'oidc'
      theming: { defaultTheme: 'system', allowUserSwitch: true },
    }),
    provideQavoHttp(),
    provideQavoUi(),
    provideAuthLogin({ registrationRoute: '/auth/register' }),
    provideAuthRegistration({ selfService: true }),
    provideRouter(appRoutes),
    provideForbiddenRoute(ForbiddenComponent),
    provideNotFoundRoute(NotFoundComponent),       // keep the wildcard last
  ],
});
```

The full walkthrough is in the [Frontend Integration Guide](docs/integration-guide.md).

---

## Development

| Task | Command |
|---|---|
| Build one library | `ng build qavo-core` |
| Build all libraries (correct order) | `npm run build:libs` |
| Build the reference app | `npm run build:app` |
| Serve the reference app | `npm start` |
| Unit tests | `npm test` |
| E2E tests | `npm run e2e` |
| Generate the API client | `npx @openapitools/openapi-generator-cli generate` (see [openapitools.json](openapitools.json)) |

Libraries build to `dist/<name>` and are consumed via the `@qavo/*` TypeScript
path mappings in [`tsconfig.json`](tsconfig.json). Because some libraries depend on
others (e.g. `@qavo/http` → `@qavo/core` → `@qavo/theming`), build order matters;
`npm run build:libs` encodes it.

---

## Building & publishing

Each package is independently versioned and tree-shakeable, exposes a clean public
API (`public-api.ts`), and is built with **ng-packagr**. Inter-package dependencies
are declared as **peer dependencies**, so an application controls a single copy of
Angular and of each Qavo package. See
[ADR 0002](docs/adr/0002-monorepo-and-packaging.md).

Releases are **tag-triggered**: pushing a `vX.Y.Z` tag runs the workflow in
[`.github/workflows/release.yml`](.github/workflows/release.yml), which verifies
that every `@qavo/*` `package.json` declares the same version, builds and tests
the libraries, publishes each one to npm with provenance under the `@qavo` scope,
and creates a matching GitHub Release. Pre-1.0 packages are released in
lockstep. See [docs/releasing.md](docs/releasing.md) for the maintainer workflow
and [ADR 0009](docs/adr/0009-release-automation.md) for the rationale.

---

## Documentation

- [Frontend Integration Guide](docs/integration-guide.md) — install, bootstrap, theme, plugins, routing, auth, responsive usage.
- [Frontend Capabilities Matrix](docs/capabilities-matrix.md) — every centralized concern, its maturity, and known limitations.
- [Roadmap & TODO](docs/roadmap.md) — implemented / partial / planned, prioritized.
- [Best Practices](docs/best-practices.md) — plugins, theming, responsive, a11y, testing, performance, anti-patterns.
- [Token Reference](docs/token-reference.md) — every CSS custom property `@qavo/theming` exposes, auto-generated from the typed contract.
- [Release Process](docs/releasing.md) — versioning, tagging and the publish pipeline.
- [Architecture Decision Records](docs/adr/) — the significant choices and their rationale.

---

## Roadmap (high level)

Implemented foundation: theming engine, core bootstrap, HTTP stack, UI primitives,
auth abstraction + two plugins, testing utilities, reference app, end-to-end OIDC
Authorization Code + PKCE flow, CI + tag-triggered npm publishing, token
reference generator, baseline unit-test suite. Planned: SSR mode, more plugins
(user management, notifications, file storage), expanded component set and a11y
audits. The detailed, prioritized list is in the [roadmap](docs/roadmap.md).

---

## Contributing

Contributions are welcome under the project's standards — see
[CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and
the [Security Policy](SECURITY.md). Qavo is **AI-assisted, human-owned**: every
change is understood, tested and owned by a human reviewer (architecture §12).

---

## Maturity disclaimer

Qavo Frontend is at version **`0.1.0`** — an **early but credible foundation**. The
architecture, extension points and public APIs are in place; the workspace builds
end to end; CI runs unit and smoke tests on every change; releases publish to npm
from a tag. The platform is **not yet production-ready**: APIs may still change
before `1.0.0`, the OIDC strategy is provider-agnostic but has not been validated
against every IdP in the wild, and broad real-world usage is still pending. Treat
it as a reference implementation and a starting point, not a finished product.
See the [capabilities matrix](docs/capabilities-matrix.md) for the precise,
per-feature status.

---

## License

[MIT](LICENSE).
