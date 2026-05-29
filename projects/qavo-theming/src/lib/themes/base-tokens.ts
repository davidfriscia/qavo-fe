import {
  BorderTokens,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
  TypographyTokens,
  ZIndexTokens,
} from '../tokens/token-contract';

/**
 * Structural tokens shared by every built-in theme.
 *
 * Typography, spacing, radii, motion and layering do not change between the
 * light and dark schemes — only colors and elevation do. Centralizing them here
 * keeps the built-in themes DRY and guarantees structural consistency across
 * the whole design system. Custom themes may still override any of these.
 */

export const BASE_TYPOGRAPHY: TypographyTokens = {
  fontFamilyBase:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontFamilyHeading:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontFamilyMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  // Fluid root size: scales between phone and desktop without per-screen overrides.
  fontSizeRoot: 'clamp(15px, 0.9rem + 0.2vw, 17px)',
  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.125rem',
  fontSizeXl: '1.375rem',
  fontSize2xl: '1.75rem',
  fontSize3xl: '2.25rem',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.7',
  letterSpacingTight: '-0.01em',
  letterSpacingNormal: '0',
  letterSpacingWide: '0.02em',
};

export const BASE_SPACING: SpacingTokens = {
  space0: '0',
  space1: '0.25rem',
  space2: '0.5rem',
  space3: '0.75rem',
  space4: '1rem',
  space5: '1.25rem',
  space6: '1.5rem',
  space8: '2rem',
  space10: '2.5rem',
  space12: '3rem',
  space16: '4rem',
  containerSm: '40rem',
  containerMd: '48rem',
  containerLg: '64rem',
  containerXl: '80rem',
};

export const BASE_RADIUS: RadiusTokens = {
  radiusNone: '0',
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusXl: '1rem',
  radiusFull: '9999px',
};

export const BASE_MOTION: MotionTokens = {
  durationInstant: '0ms',
  durationFast: '120ms',
  durationNormal: '220ms',
  durationSlow: '360ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  easingAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
};

export const BASE_Z_INDEX: ZIndexTokens = {
  zBase: '0',
  zSticky: '100',
  zDrawer: '200',
  zOverlay: '300',
  zModal: '400',
  zToast: '500',
  zTooltip: '600',
};

export const BASE_BORDER: BorderTokens = {
  borderWidthThin: '1px',
  borderWidthThick: '2px',
  focusRingWidth: '3px',
};
