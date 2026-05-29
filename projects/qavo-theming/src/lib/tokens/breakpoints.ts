/**
 * Responsive breakpoint tokens.
 *
 * These thresholds are theme-invariant and shared by every application and
 * plugin, so the whole ecosystem uses the same responsive vocabulary instead of
 * each component inventing its own. They follow a mobile-first model: each value
 * is the `min-width` at which the named tier begins.
 *
 * `@qavo/ui` derives its `BreakpointService` and adaptive layout primitives from
 * these values, and they are also emitted as CSS variables (`--qavo-breakpoint-*`)
 * for use in container queries and bespoke styles.
 */
export const BREAKPOINT_TOKENS = {
  /** Phones — the mobile-first baseline (no media query needed). */
  handset: 0,
  /** Large phones / small tablets. */
  tablet: 600,
  /** Tablets / small laptops. */
  desktop: 1024,
  /** Large desktops and wide displays. */
  wide: 1440,
} as const;

export type BreakpointName = keyof typeof BREAKPOINT_TOKENS;

/** Ordered tiers, smallest first — the canonical mobile-first ordering. */
export const BREAKPOINT_ORDER: readonly BreakpointName[] = [
  'handset',
  'tablet',
  'desktop',
  'wide',
];

/** Build a `min-width` media-query string for the given tier. */
export function minWidthQuery(name: BreakpointName): string {
  return `(min-width: ${BREAKPOINT_TOKENS[name]}px)`;
}
