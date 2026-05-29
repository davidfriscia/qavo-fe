# Frontend Capabilities Matrix

Every frontend concern Qavo manages centrally, its implementation status, and its
known limitations. This is the honest, per-feature companion to the README's
maturity disclaimer.

**Maturity legend**

| Level | Meaning |
|---|---|
| 🟢 Implemented | Built, with extension points; usable today (subject to pre-1.0 API change). |
| 🟡 Partial | Foundation/abstraction present; some depth deliberately deferred. |
| 🔵 Planned | Designed for, not yet built. |

---

## Platform foundation

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| `provideQavo` central bootstrap | `@qavo/core` | 🟢 | Single composition root; sensible defaults, full override. |
| Typed configuration (`QavoConfig`) | `@qavo/core` | 🟢 | `apiBaseUrl` required; rest defaulted. |
| Environment-aware config | `@qavo/core` | 🟢 | `development`/`test`/`production` drive log level & diagnostics. |
| Plugin registry & self-registration | `@qavo/core` | 🟢 | `provideQavoPlugin` contributes providers + routes; `PluginRegistry` for introspection. |
| Feature flags | `@qavo/core` | 🟡 | Config-seeded + runtime override (signals). Not a full flag platform; no remote provider. |

## HTTP & resilience

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| Centralized `HttpClient` config | `@qavo/http` | 🟢 | One interceptor stack, composable. |
| Base-URL resolution | `@qavo/http` | 🟢 | Logical paths → `/api/v{n}`; absolute/prefixed URLs pass through. |
| Auth token injection | `@qavo/http` | 🟢 | Bearer header from the active strategy; strategy-agnostic. |
| Trace correlation (W3C `traceparent`) | `@qavo/http` + `@qavo/core` | 🟢 | Per-request id; echoed in error logs & Problem Details. |
| Error mapping with navigation | `@qavo/http` | 🟢 | RFC 9457 parsing; 401→login, 403→forbidden. |
| Retry (backoff + jitter) | `@qavo/http` | 🟢 | Idempotent methods only; tunable. |
| Circuit breaker (client-side) | `@qavo/http` | 🔵 | Backend owns the canonical circuit breaker; a client mirror is planned. |

## Error handling, logging, notifications

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| Global `ErrorHandler` | `@qavo/core` | 🟢 | Normalizes everything to `QavoError`; single notification path. |
| RFC 9457 Problem Details model | `@qavo/core` | 🟢 | Parser, type guard, field-error extraction. |
| Extensible error mapping | `@qavo/core` | 🟢 | `QAVO_ERROR_MAPPERS` multi-token. |
| Structured logging + trace | `@qavo/core` | 🟢 | Console sink; `appName`/`traceId` enrichment; pluggable sinks. |
| Remote log forwarding | `@qavo/core` | 🔵 | Config field reserved; HTTP sink not yet shipped. |
| Toast / dialog notifications | `@qavo/ui` | 🟢 | Themed, accessible; overrides the core console default. |

## Authentication & authorization

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| Pluggable auth abstraction | `@qavo/core` | 🟢 | Uniform `AuthService` + strategy interface. |
| Local (DB) login flow | `@qavo/core` + `@qavo/auth-login` | 🟢 | Calls backend local-auth endpoints. |
| OIDC strategy | `@qavo/core` | 🟡 | Authorize redirect + uniform token surface; **PKCE code exchange delegated** to an OIDC client you provide. |
| Route guards (`authGuard`, `permissionGuard`) | `@qavo/core` | 🟢 | Redirect to login / forbidden; role+permission rules via route `data`. |
| Permission-aware rendering | `@qavo/core` | 🟢 | `*qavoHasPermission` reactive structural directive. |
| Secure token handling | `@qavo/core` | 🟢 | In-memory by default; opt-in `localStorage`. |
| Registration flow | `@qavo/auth-registration` | 🟢 | Self-service; cross-field + server validation; config-gated. |

## Theming & design system

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| Token contract (typed) | `@qavo/theming` | 🟢 | Color, typography, spacing, radius, elevation, motion, z-index, border. |
| CSS-variable engine | `@qavo/theming` | 🟢 | Runtime application to document root. |
| Built-in light & dark themes | `@qavo/theming` | 🟢 | WCAG-aware contrast targets. |
| Runtime switching + `prefers-color-scheme` | `@qavo/theming` | 🟢 | `system` mode tracks OS until user chooses. |
| Custom themes / token overrides | `@qavo/theming` | 🟢 | `extendTheme` or author from scratch. |
| Preference persistence | `@qavo/theming` | 🟢 | `localStorage`; backend user-profile sync is a backend concern. |
| Material theming via tokens | `@qavo/ui` | 🟡 | Tokens are the source of truth; a Material token bridge is planned. |

## UI, responsive & accessibility

| Capability | Package | Status | Notes / limitations |
|---|---|:---:|---|
| Breakpoint tokens + service | `@qavo/theming` + `@qavo/ui` | 🟢 | Shared tiers; signal-based `BreakpointService`. |
| Layout primitives (container/stack/grid) | `@qavo/ui` | 🟢 | Token-driven, mobile-first. |
| Adaptive shell (side nav ⇄ drawer) | `@qavo/ui` | 🟢 | One component, all devices; skip link + focusable main. |
| Components (button/card/input/form-field/spinner/empty-state) | `@qavo/ui` | 🟢 | Accessible, token-driven. Set grows over time. |
| Dialogs (CDK) | `@qavo/ui` | 🟢 | Focus-trapped confirm dialog + generic `open`. |
| Forms & validators | `@qavo/ui` | 🟢 | Reusable validators, message resolver, server reconciliation. |
| Data-table responsive patterns | `@qavo/ui` | 🔵 | Column-collapse / card patterns planned. |
| Keyboard nav, focus mgmt, ARIA, reduced motion, scalable type | `@qavo/ui` | 🟢 | Built into components; autofocus directive; `prefers-reduced-motion` honored. |
| Formal a11y audit (axe/WCAG sweep) | — | 🔵 | Components are a11y-aware by construction; a full audit is planned. |

## Tooling

| Capability | Status | Notes / limitations |
|---|:---:|---|
| Unit testing (Vitest) + harness | 🟢 | `@qavo/testing` harness, mocks, fixtures; example specs included. |
| E2E testing (Playwright) | 🟢 | Config + desktop/mobile projects + smoke specs. |
| OpenAPI client integration | 🟡 | `openapitools.json` + illustrative generated client; live generation needs a running backend. |
| Independent package publishing | 🟡 | Packaging ready (ng-packagr, peer deps, clean APIs); CI publish pipeline not yet wired. |
| SSR | 🔵 | Starts as SPA; SSR kept available per architecture §5.8. |
| i18n | 🔵 | Validation messages are override-ready; full i18n integration planned. |

---

## Summary of intentional limitations (pre-1.0)

- **OIDC PKCE exchange** is delegated, not bundled — keeps the platform
  provider-agnostic and avoids shipping a half-built OIDC client.
- **Publishing pipeline** is not yet automated.
- **Client-side circuit breaker**, **remote log sink**, **responsive data tables**,
  **i18n** and **SSR** are designed-for but not yet built.
- **APIs may change** before `1.0.0`.
