# Roadmap & TODO

Prioritized plan for evolving Qavo Frontend. The current `0.1.0` release closes
out the P0 “credible foundation” slice; this document tracks what comes next.
Status reflects the [capabilities matrix](capabilities-matrix.md).

**Legend:** ✅ implemented · 🟡 partial · ⬜ planned.

---

## Implemented (through `0.1.0`)

- ✅ Angular 21 monorepo with seven `@qavo/*` libraries + reference app.
- ✅ `@qavo/theming`: token contract, light/dark themes, runtime switching, custom themes, auto-generated [token reference](token-reference.md).
- ✅ `@qavo/core`: `provideQavo`, config, plugin registry, feature flags, RFC 9457 errors, global `ErrorHandler`, structured logging + trace, auth abstraction, guards, `*qavoHasPermission`, routing helpers.
- ✅ `@qavo/core` OIDC: PKCE Authorization Code flow end-to-end — pluggable token client, session-storage state store, callback component/route, silent renewal scheduler.
- ✅ `@qavo/http`: base-url / auth / trace / error / retry interceptors, tunable resilience.
- ✅ `@qavo/ui`: breakpoint service, layout primitives, adaptive shell, components, forms & validation, toasts & dialogs, a11y helpers.
- ✅ `@qavo/auth-login` and `@qavo/auth-registration` plugins.
- ✅ `@qavo/testing`: harness, mocks, fixtures; baseline unit-test suite across every library.
- ✅ CI on every push/PR (build, unit, smoke E2E) and tag-triggered npm publishing with provenance — see [release process](releasing.md).
- ✅ Reference app demonstrating composition, theming, plugins, error handling, OpenAPI client.

---

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
