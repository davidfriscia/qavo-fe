/**
 * The Qavo design-token contract.
 *
 * This is the single, versioned source of truth for every visual primitive the
 * platform exposes. Tokens are consumed three ways:
 *
 *  1. at runtime, serialized into CSS custom properties on the document root
 *     (see {@link applyTokensToElement}), enabling instant theme switching;
 *  2. by `@qavo/ui` components, which reference the CSS variables, never raw
 *     values;
 *  3. by applications, which may override any subset to brand their experience.
 *
 * Token-contract stability is part of the platform's public API: adding a token
 * is a MINOR change; renaming or removing one is a MAJOR change accompanied by a
 * migration note. This protects custom application themes from silent breakage.
 */

/** Semantic color tokens. Every color an application renders resolves to one of these. */
export interface ColorTokens {
  // --- Surfaces and backgrounds ---
  /** The base page background. */
  background: string;
  /** Default panel / card surface. */
  surface: string;
  /** A subtly differentiated surface (e.g. table header, inset panel). */
  surfaceVariant: string;
  /** An elevated surface (menus, raised cards). */
  surfaceElevated: string;
  /** Scrim/overlay behind modals and drawers. */
  overlay: string;

  // --- Content colors ---
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  link: string;
  icon: string;

  // --- Brand and accent ---
  primary: string;
  onPrimary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  onSecondary: string;
  tertiary: string;
  onTertiary: string;

  // --- Status and feedback (tie into validation, alerts, toasts) ---
  error: string;
  onError: string;
  errorSurface: string;
  warning: string;
  onWarning: string;
  warningSurface: string;
  success: string;
  onSuccess: string;
  successSurface: string;
  info: string;
  onInfo: string;
  infoSurface: string;

  // --- Borders, dividers, focus, states ---
  border: string;
  borderStrong: string;
  divider: string;
  focusRing: string;
  /** Translucent overlay applied on hover over interactive elements. */
  hoverOverlay: string;
  /** Background applied to a selected interactive element. */
  selected: string;
  /** Foreground/area color for disabled interactive elements. */
  disabled: string;
}

/** Typography tokens: families, the type scale, weights, line-heights and tracking. */
export interface TypographyTokens {
  fontFamilyBase: string;
  fontFamilyHeading: string;
  fontFamilyMono: string;
  /** Fluid base size used as the root for the rem scale. */
  fontSizeRoot: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontWeightRegular: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;
  fontWeightBold: string;
  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

/** Spacing scale and layout container widths. */
export interface SpacingTokens {
  space0: string;
  space1: string;
  space2: string;
  space3: string;
  space4: string;
  space5: string;
  space6: string;
  space8: string;
  space10: string;
  space12: string;
  space16: string;
  containerSm: string;
  containerMd: string;
  containerLg: string;
  containerXl: string;
}

/** Corner-radius scale. */
export interface RadiusTokens {
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
}

/** Elevation / shadow scale. Theme-dependent (shadows differ between light and dark). */
export interface ElevationTokens {
  elevation0: string;
  elevation1: string;
  elevation2: string;
  elevation3: string;
  elevation4: string;
}

/** Motion tokens: durations and easing curves, with a reduced-motion contract. */
export interface MotionTokens {
  durationInstant: string;
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingStandard: string;
  easingDecelerate: string;
  easingAccelerate: string;
}

/** Z-index layering scale for stacked surfaces. */
export interface ZIndexTokens {
  zBase: string;
  zSticky: string;
  zDrawer: string;
  zOverlay: string;
  zModal: string;
  zToast: string;
  zTooltip: string;
}

/** Border-width scale. */
export interface BorderTokens {
  borderWidthThin: string;
  borderWidthThick: string;
  focusRingWidth: string;
}

/**
 * The complete set of design tokens that compose a theme.
 *
 * Breakpoints are intentionally NOT part of a theme: they are responsive
 * thresholds shared by every theme and exposed separately as
 * {@link BREAKPOINT_TOKENS}.
 */
export interface DesignTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  elevation: ElevationTokens;
  motion: MotionTokens;
  zIndex: ZIndexTokens;
  border: BorderTokens;
}

/** A deeply-partial token override, used when an application brands an existing theme. */
export type DesignTokenOverrides = {
  [K in keyof DesignTokens]?: Partial<DesignTokens[K]>;
};
