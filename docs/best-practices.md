# Best Practices

Patterns for building well with Qavo Frontend — and the anti-patterns to avoid.
These extend the platform's guiding principles to day-to-day application and
plugin code.

---

## Plugin development

A plugin is an independently versioned npm package that self-registers. Follow
the shape of `@qavo/auth-login`:

1. **One `provideXxx()` entry point** that delegates to `provideQavoPlugin`,
   contributing the plugin descriptor, its providers, and its routes.
2. **Routes via the `ROUTES` multi-token** (handled by `provideQavoPlugin`), so the
   host's `provideRouter` mounts them automatically. Reserve a namespace
   (`auth/**`, `billing/**`) to avoid collisions.
3. **Modularity for distribution, configuration for behavior.** Whether the plugin
   exists is decided at build time (import it or don't). *How* it behaves is tuned
   at runtime via a config token (e.g. `selfService`, field set, password policy).
4. **Consume tokens, never hardcode.** A plugin styled with `var(--qavo-*)` looks
   native in any host and any theme with zero extra CSS.
5. **Depend on `@qavo/core` and `@qavo/ui` as peers**, never bundle them.

```typescript
export function provideBilling(config: Partial<BillingConfig> = {}): EnvironmentProviders {
  const merged = { ...DEFAULT_BILLING_CONFIG, ...config };
  return provideQavoPlugin({
    plugin: { id: 'billing', version: '0.1.0' },
    providers: [{ provide: BILLING_CONFIG, useValue: merged }],
    routes: [{ path: 'billing', loadComponent: () => import('./billing.page').then(m => m.BillingPage) }],
  });
}
```

> **Anti-pattern:** an "everything in core, toggled by flags" mega-module. It ages
> badly — every app carries code and attack surface it never uses, and every core
> release risks unrelated features. Ship capabilities as plugins (architecture §6.1).

---

## Theming best practices

- **Tokens are the only source of visual truth.** Components and app CSS reference
  `var(--qavo-…)`; they never contain literal colors, spacing or shadows.
- **Brand by overriding tokens**, not by restyling components. `extendTheme(LIGHT_THEME, …)`
  with just your brand colors is the common case.
- **Respect the token contract's stability.** Adding tokens is safe (MINOR);
  renaming/removing is breaking (MAJOR). Treat custom themes as consumers of a
  public API.
- **Let `system` lead.** Default to `defaultTheme: 'system'` so the app honors the
  user's OS preference until they choose explicitly.
- **Status colors are semantic.** Use `error`/`warning`/`success`/`info` tokens for
  validation, toasts and banners so meaning stays consistent.

> **Anti-pattern:** theme-specific component logic (`if (isDark) …` in TypeScript).
> If a value differs between themes, it belongs in a token, not in code.

---

## Responsive design patterns

- **Design mobile-first.** Start from the phone layout; enhance upward with
  `min-width` and the shared breakpoint tokens. The base experience stays lean.
- **Compose primitives.** `qavo-shell`, `qavo-container`, `qavo-grid`, `qavo-stack`
  cover most layouts without bespoke media queries.
- **One codebase, all devices.** Never fork a "mobile version"; let the same
  components adapt. The shell already collapses its nav to a drawer on handsets.
- **Read breakpoints reactively** with `BreakpointService` only for genuinely
  bespoke behavior — prefer CSS where possible.
- **Touch-first ergonomics.** Keep interactive targets ≥ ~44px (the platform
  buttons/inputs already do).

> **Anti-pattern:** scattering raw `@media (max-width: …)` with ad-hoc pixel values.
> Use the breakpoint tokens/primitives so the whole app shares one responsive scale.

---

## Accessibility guidelines

- **Use semantic elements.** The button component targets native `<button>`/`<a>`;
  do the same in app code.
- **Every input gets a label.** Wrap controls in `qavo-form-field`; errors are
  announced via `role="alert"` and `aria-invalid`.
- **Manage focus.** Use `qavoAutofocus` for the primary control of a view/dialog;
  dialogs trap focus (CDK). Keep a skip link (the shell provides one).
- **Honor user settings.** Components respect `prefers-reduced-motion`; typography
  is fluid and zoom-friendly. Don't disable these.
- **Don't rely on color alone.** Pair status color with text/icons.

> **Anti-pattern:** `<div (click)>` as a button. It loses keyboard operability,
> focus and roles.

---

## Testing strategies

- **Unit-test with the harness.** `provideQavoTesting({ session })` supplies the
  mock auth strategy, a recording notification service and the platform tokens —
  no backend needed. Add `provideHttpClientTesting()` when exercising HTTP code.
- **Assert behavior via signals.** Read `AuthService` / `FeatureFlagService` signals
  directly rather than poking internals.
- **Test plugins in isolation.** A plugin's component spec needs only the harness +
  `provideRouter([])` + theming (see `login.component.spec.ts`).
- **Theming is plain data.** Assert the token contract without a TestBed (see
  `css-variables.spec.ts`).
- **E2E across viewports.** The Playwright config runs desktop + mobile projects;
  use it to verify the adaptive shell on both.

---

## Performance considerations

- **`ChangeDetectionStrategy.OnPush` everywhere**, paired with signals — the whole
  platform follows this; app components should too.
- **Lazy-load routes** with `loadComponent`, especially plugin pages.
- **Peer-depend, don't bundle.** Keeps a single copy of Angular and each `@qavo`
  package, and preserves tree-shaking.
- **Prefer CSS over JS for layout/responsiveness.** Reserve `BreakpointService` for
  logic that truly must branch in TypeScript.
- **Subscribe deliberately.** Let unhandled HTTP errors reach the global handler
  (one toast) instead of swallowing them in every component.

---

## Extension mechanisms (the seams)

| Need | Seam |
|---|---|
| Add cross-cutting HTTP behavior | `provideQavoHttp({ extraInterceptors: […] })` |
| Map a domain error to UX | `QAVO_ERROR_MAPPERS` multi-token |
| Customize/localize validation messages | `QAVO_VALIDATION_MESSAGES` token |
| Replace the notification surface | provide `NotificationService` (as `@qavo/ui` does) |
| Add a log destination | `QAVO_LOG_SINKS` multi-token |
| Swap the auth mechanism | provide `QAVO_AUTH_STRATEGY` |
| Add a capability | ship a plugin via `provideQavoPlugin` |
| Brand the look | `extendTheme` + `customThemes` |

---

## Anti-patterns to avoid (summary)

- God services / a god core module.
- Hardcoded colors, spacing or breakpoints.
- Theme-conditional logic in TypeScript.
- Duplicated infrastructure (re-implementing error handling, HTTP setup, auth) per app.
- Bundling `@qavo/*` or Angular instead of peer-depending.
- Uncontrolled RxJS where a signal would do.
- `<div>`-as-control and unlabeled inputs.
- A global wildcard route registered before plugin/app routes.
