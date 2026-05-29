import { DesignTokens } from './token-contract';
import { BREAKPOINT_TOKENS } from './breakpoints';

/** Prefix for every Qavo CSS custom property. */
export const QAVO_TOKEN_PREFIX = '--qavo';

/** Attribute set on the theme root element so styles can target the active theme. */
export const QAVO_THEME_ATTRIBUTE = 'data-qavo-theme';

function kebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Flatten a {@link DesignTokens} object into a map of CSS custom properties.
 *
 * Naming convention: `--qavo-{category}-{token}` in kebab-case, e.g.
 * `color.primaryHover` becomes `--qavo-color-primary-hover`.
 */
export function tokensToCssVariables(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [category, group] of Object.entries(tokens)) {
    for (const [name, value] of Object.entries(group as Record<string, string>)) {
      vars[`${QAVO_TOKEN_PREFIX}-${kebab(category)}-${kebab(name)}`] = value;
    }
  }
  for (const [name, value] of Object.entries(BREAKPOINT_TOKENS)) {
    vars[`${QAVO_TOKEN_PREFIX}-breakpoint-${kebab(name)}`] = `${value}px`;
  }
  return vars;
}

/**
 * Apply a token set to an element as inline CSS custom properties.
 *
 * Writing the variables to an element (typically `document.documentElement`)
 * rather than swapping a stylesheet is what makes theme switching instantaneous
 * and rebuild-free.
 */
export function applyTokensToElement(
  element: HTMLElement,
  tokens: DesignTokens,
  themeId: string,
  colorScheme: 'light' | 'dark',
): void {
  const vars = tokensToCssVariables(tokens);
  for (const [property, value] of Object.entries(vars)) {
    element.style.setProperty(property, value);
  }
  element.setAttribute(QAVO_THEME_ATTRIBUTE, themeId);
  // `color-scheme` lets the browser theme native controls and scrollbars.
  element.style.setProperty('color-scheme', colorScheme);
}
