/*
 * Public API Surface of @qavo/theming
 *
 * The token-based theming engine: a versioned token contract, two built-in
 * accessible themes, runtime switching, and per-application extension.
 */

// Token contract
export * from './lib/tokens/token-contract';
export * from './lib/tokens/token-catalog';
export * from './lib/tokens/breakpoints';
export {
  QAVO_TOKEN_PREFIX,
  QAVO_THEME_ATTRIBUTE,
  tokensToCssVariables,
  applyTokensToElement,
} from './lib/tokens/css-variables';

// Themes
export * from './lib/themes/theme.model';
export { LIGHT_THEME } from './lib/themes/light-theme';
export { DARK_THEME } from './lib/themes/dark-theme';
export {
  BASE_TYPOGRAPHY,
  BASE_SPACING,
  BASE_RADIUS,
  BASE_MOTION,
  BASE_Z_INDEX,
  BASE_BORDER,
} from './lib/themes/base-tokens';

// Engine
export * from './lib/theme.service';
export * from './lib/theming-config';
export * from './lib/provide-theming';
