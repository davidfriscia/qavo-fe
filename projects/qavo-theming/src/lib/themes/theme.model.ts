import { DesignTokens, DesignTokenOverrides } from '../tokens/token-contract';

/**
 * A complete, registrable theme.
 *
 * Themes are additive: built-in light and dark ship with the platform, and
 * applications register their own. Switching the active theme is always a
 * runtime operation (swapping CSS variables), never a rebuild.
 */
export interface QavoTheme {
  /** Stable identifier, e.g. `light`, `dark`, `acme-brand`. Used in URLs/storage. */
  readonly id: string;
  /** Human-readable label for theme pickers. */
  readonly name: string;
  /** Drives the native `color-scheme` property and OS-preference matching. */
  readonly colorScheme: 'light' | 'dark';
  /** The resolved, complete token set. */
  readonly tokens: DesignTokens;
}

/**
 * Derive a new theme from an existing one by overriding a subset of its tokens
 * — the common branding case (e.g. swap only the brand colors).
 */
export function extendTheme(
  base: QavoTheme,
  id: string,
  name: string,
  overrides: DesignTokenOverrides,
  colorScheme: 'light' | 'dark' = base.colorScheme,
): QavoTheme {
  const tokens = {} as DesignTokens;
  for (const key of Object.keys(base.tokens) as (keyof DesignTokens)[]) {
    tokens[key] = {
      ...(base.tokens[key] as object),
      ...((overrides[key] as object) ?? {}),
    } as never;
  }
  return { id, name, colorScheme, tokens };
}
