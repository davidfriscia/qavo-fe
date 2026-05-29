# ADR 0008 — Standalone, token-driven, accessible component design

**Status:** Accepted

## Context

`@qavo/ui` should behave like a coherent design system: visually consistent,
responsive, accessible, with clean APIs and no business coupling (architecture
§5.7, §5.8; brief's design-system principles).

## Decision

All Qavo UI primitives follow one design philosophy:

- **Standalone components**, `ChangeDetectionStrategy.OnPush`, and **signal inputs**
  (`input()`, with `booleanAttribute`/`numberAttribute` transforms for ergonomic
  attribute binding).
- **Token-driven styling only.** Component styles reference `var(--qavo-*)`; no
  literal colors, spacing, radii, shadows or breakpoints. This is what makes every
  component theme-correct and consistent automatically.
- **Accessibility by construction.** Prefer native semantics (the button targets
  native `<button>`/`<a>`); wire ARIA and `aria-invalid`; trap focus in dialogs
  (CDK); provide a skip link in the shell; honor `prefers-reduced-motion`; keep
  touch targets adequate.
- **Clean, minimal public APIs** and **no business coupling** — primitives know
  nothing of any domain. Behavior-only needs reuse the **CDK** rather than
  reinventing it.
- **Composition over configuration sprawl.** Layout is composed from a few
  primitives (`container`/`stack`/`grid`/`shell`) instead of one mega-layout
  component with dozens of flags.

## Consequences

- Components look unified across applications and themes with zero extra styling.
- Predictable, typed APIs; OnPush + signals keep them efficient.
- The component set is intentionally small at `0.0.0` and grows over time following
  these same rules (roadmap, P1).
