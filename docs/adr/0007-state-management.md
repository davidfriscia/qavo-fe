# ADR 0007 — Signals-first state; NgRx only when justified

**Status:** Accepted

## Context

The architecture calls for native signals by default and NgRx only for genuinely
complex state, avoiding over-engineering (§2.2, state-management philosophy).

## Decision

Use **Angular signals** as the default state primitive across the platform, and
**local component state wherever possible**. Shared reactive state lives in
`providedIn: 'root'` services that expose **read-only signals** (`computed`,
`asReadonly`). Examples in this codebase:

- `AuthService` exposes the security context (`user`, `isAuthenticated`, `roles`,
  `permissions`) as signals.
- `ThemeService`, `FeatureFlagService`, `BreakpointService` are signal-based.
- `*qavoHasPermission` reacts to auth signals via an `effect`.

**RxJS is used only where it is the right tool** — asynchronous I/O boundaries
(HTTP, auth-strategy operations) — and is bridged to signals with `toSignal` where
a reactive value is needed in templates.

**NgRx is not adopted.** Should an application develop genuinely complex,
cross-cutting client state (elaborate undo/redo, large normalized caches, complex
inter-feature coordination), it may add NgRx locally and must document the
rationale; the platform does not impose it.

## Consequences

- Minimal boilerplate; fine-grained reactivity; `OnPush`-friendly throughout.
- No global store indirection for state that doesn't need it.
- A consistent pattern (read-only signals from root services) for the rare shared
  state the platform does hold.
