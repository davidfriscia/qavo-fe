# ADR 0004 — Mobile-first, single-codebase responsive strategy

**Status:** Accepted

## Context

The platform must render correctly and ergonomically on phones, tablets and
desktops from one codebase, with no separate mobile build (architecture §5.8). The
responsive behavior should be centralized so applications inherit it.

## Decision

Adopt a **mobile-first** method and centralize responsive logic in `@qavo/theming`
(breakpoint tokens) and `@qavo/ui` (primitives + `BreakpointService`).

- A **shared breakpoint scale** (`handset/tablet/desktop/wide`) is exposed as tokens
  and emitted as CSS variables, so the whole ecosystem uses one set of thresholds.
- Styling starts from the mobile baseline and enhances upward with `min-width`
  queries.
- **Responsive primitives** — `qavo-container`, `qavo-grid`, `qavo-stack`, and the
  adaptive `qavo-shell` (side nav on desktop, off-canvas drawer on handsets) — let
  applications compose responsive layouts without bespoke media queries.
- `BreakpointService` (CDK `BreakpointObserver` + signals) provides reactive state
  for the rare cases that must branch in TypeScript.
- Typography and spacing are fluid via tokens (e.g. `clamp()` root size).

## Alternatives considered

- **Desktop-first with overrides.** Tends to cram desktop layouts onto phones and
  bloats the base experience.
- **Per-component ad-hoc media queries.** Fragments the breakpoint vocabulary
  across the codebase.

## Consequences

- Applications get responsive, touch-friendly behavior "for free" by composing
  primitives and using breakpoint tokens.
- One codebase serves all devices; E2E runs on desktop + mobile viewports.
- Responsive data-table patterns are not yet built (roadmap).
