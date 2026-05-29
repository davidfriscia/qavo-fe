# Roadmap & TODO

Prioritized plan for evolving Qavo Frontend from the current `0.0.0` foundation.
Status reflects the [capabilities matrix](capabilities-matrix.md).

**Legend:** ✅ implemented · 🟡 partial · ⬜ planned.

---

## Implemented (the `0.0.0` foundation)

- ✅ Angular 21 monorepo with seven `@qavo/*` libraries + reference app.
- ✅ `@qavo/theming`: token contract, light/dark themes, runtime switching, custom themes.
- ✅ `@qavo/core`: `provideQavo`, config, plugin registry, feature flags, RFC 9457 errors, global `ErrorHandler`, structured logging + trace, auth abstraction, guards, `*qavoHasPermission`, routing helpers.
- ✅ `@qavo/http`: base-url / auth / trace / error / retry interceptors, tunable resilience.
- ✅ `@qavo/ui`: breakpoint service, layout primitives, adaptive shell, components, forms & validation, toasts & dialogs, a11y helpers.
- ✅ `@qavo/auth-login` and `@qavo/auth-registration` plugins.
- ✅ `@qavo/testing`: harness, mocks, fixtures; example unit + E2E specs.
- ✅ Reference app demonstrating composition, theming, plugins, error handling, OpenAPI client.

---

## P0 — toward a credible `0.1.0`

- 🟡 **CI & publishing pipeline.** Tag-triggered build → test → lint → publish to npm under `@qavo`, SemVer, changelogs. *(Packaging ready; automation pending.)*
- 🟡 **OIDC completion.** Pluggable PKCE code-exchange client behind `QAVO_AUTH_STRATEGY`; callback route handling; silent renewal.
- ⬜ **Unit-test pass across all libraries.** Bring every package to a meaningful coverage baseline; wire `ng test` into CI.
- ⬜ **Token contract documentation generator.** Emit a reference table of every token (the FE counterpart to the backend `qavo.yml`).

## P1 — depth & breadth

- 🟡 **Material token bridge.** Map Qavo tokens onto Angular Material's M3 CSS variables so Material components theme automatically.
- ⬜ **Responsive data tables.** Column-collapse and card layouts for data-dense, back-office views.
- ⬜ **More UI primitives.** Select, checkbox/radio/toggle, tabs, menu, chips, badges, tooltips, progress, pagination — all token-driven and accessible.
- 🟡 **Remote log sink.** HTTP sink forwarding structured, trace-correlated logs to a backend collector.
- ⬜ **Client-side circuit breaker.** Mirror the backend Resilience4j breaker for fast-fail UX, surfaced as a metric/signal.

## P2 — new plugins

- ⬜ `@qavo/user-management` (profile, roles/permissions admin UI).
- ⬜ `@qavo/notifications` (in-app notification center).
- ⬜ `@qavo/file-storage` (upload/download with progress + a11y).
- ⬜ `@qavo/audit-console` (read view over backend auditing).

---

## Accessibility improvements

- ⬜ Automated a11y checks (axe) in CI against the reference app.
- ⬜ Full WCAG 2.1 AA audit of every component and documented conformance.
- ⬜ High-contrast theme variant and forced-colors (`forced-colors`) support.
- ⬜ Screen-reader test matrix (NVDA / VoiceOver) for the shell, dialogs and forms.

## Performance improvements

- ⬜ Bundle-budget tracking per library; measure tree-shaking effectiveness.
- ⬜ Lazy-load plugin components via `loadComponent` route definitions.
- ⬜ Deferrable views (`@defer`) for below-the-fold reference-app sections.
- ⬜ Zoneless change detection evaluation (the codebase is already signal-first).

## SSR roadmap

- ⬜ Provide an SSR build target for the reference app (`@angular/ssr`).
- ⬜ Audit platform services for SSR safety (the theming engine and token store already guard `window`/`localStorage`).
- ⬜ Document the SSR opt-in path; keep mobile-first behavior identical in both modes.

## Developer experience

- ⬜ A schematic / generator for scaffolding a new Qavo plugin.
- ⬜ A Storybook (or equivalent) gallery of UI primitives and themes.
- ⬜ ESLint config package (`@qavo/eslint-config`) encoding the platform's conventions and anti-patterns.
- ⬜ Published API reference (TypeDoc) per package.
- ⬜ A `create-qavo-app` starter.
