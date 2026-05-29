# ADR 0003 — Token-based theming on CSS custom properties

**Status:** Accepted

## Context

Theming is a first-class, centralized concern (architecture §5.7). A single engine
must govern the entire visual surface, switch at runtime (light ⇄ dark ⇄ custom)
with no rebuild, be brandable per application, and protect custom themes from
silent breakage.

## Decision

Model the design system as a **typed token contract** (`@qavo/theming`) whose values
are applied at runtime as **CSS custom properties** on the document root.

- The token contract (`DesignTokens`) covers color, typography, spacing, radius,
  elevation, motion, z-index and border; breakpoints are exposed separately as
  theme-invariant tokens.
- `ThemeService` (signals) owns the theme registry and the active theme, writes
  tokens to `:root` via `applyTokensToElement`, tracks `prefers-color-scheme` in
  `system` mode, and persists the user's choice.
- Components and applications consume `var(--qavo-…)`; they never hold literal
  values. The same tokens theme Angular Material.
- The token contract is **versioned as public API**: adding a token is MINOR;
  renaming/removing is MAJOR with a migration note.

## Alternatives considered

- **SCSS-compiled themes.** Switching themes would mean shipping/loading multiple
  stylesheets and cannot change at runtime without swapping sheets; harder to
  override per app. CSS variables make switching instantaneous.
- **CSS-in-JS.** Foreign to Angular's styling model and adds runtime cost.

## Consequences

- Instant, rebuild-free theme switching and trivial per-app branding via token
  overrides (`extendTheme`).
- Token application is JS-driven, so a token bridge is still needed to drive
  third-party (Material) component variables fully (roadmap).
- The naming convention (`--qavo-{category}-{token}`) is itself a contract.
