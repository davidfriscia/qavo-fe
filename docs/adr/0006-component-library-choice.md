# ADR 0006 — Angular Material (+ CDK) as the optional component library

**Status:** Accepted

## Context

The architecture allows **Angular Material or PrimeNG** as the consistent,
accessible component library, themed through Qavo tokens (§2.2, §5.7). One must be
chosen and justified. Qavo also builds its own primitives (`@qavo/ui`) for the
patterns it wants to own (layout, shell, form-field, feedback).

## Decision

Choose **Angular Material**, and depend directly on the **Angular CDK** for
behavior-only building blocks (a11y, layout/`BreakpointObserver`, overlay, dialog,
portal).

Rationale:

- **Official Angular-team ownership** — release cadence and long-term support track
  Angular itself, aligning with the maintainability principle.
- **CDK alignment.** Qavo already relies on the CDK for the breakpoint service,
  overlay-based toasts, focus-trapped dialogs and portals. Material is built on the
  same CDK, so there is no second behavioral foundation to reconcile.
- **Token-friendly theming.** Material's M3 theming is CSS-variable based, which
  maps cleanly onto Qavo's token engine (ADR 0003), so Material components can be
  driven by the same `--qavo-*` tokens (bridge on the roadmap).

## Alternatives considered

- **PrimeNG.** Larger out-of-the-box component set, but a third-party release
  cadence and a different theming model that would sit beside (not on) the CDK Qavo
  already uses.

## Consequences

- `@angular/material` and `@angular/cdk` are peer dependencies; applications opt in
  to Material components, while Qavo's own primitives cover the owned patterns.
- A Material↔token bridge is needed to fully theme Material via Qavo tokens
  (roadmap, P1).
- Where Qavo provides a primitive (button, card, form-field, dialog, shell),
  applications should prefer it for visual and behavioral consistency.
