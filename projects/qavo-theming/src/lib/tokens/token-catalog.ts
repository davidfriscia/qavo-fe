import {
  BorderTokens,
  ColorTokens,
  ElevationTokens,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
  TypographyTokens,
  ZIndexTokens,
} from './token-contract';

/**
 * Per-token documentation metadata.
 *
 * The token TypeScript contract gives us names and shapes; the catalog adds
 * the human-facing intent — what the token is *for* — and a small set of
 * structured attributes the docs generator turns into a reference table.
 *
 * Keeping the catalog colocated with the contract guarantees the two stay in
 * lock-step: the `tokenName` field is typed against the contract interface,
 * so renaming a token without updating the catalog is a build error.
 */
export interface TokenDoc {
  /** One-sentence purpose statement aimed at application authors and designers. */
  purpose: string;
  /**
   * Categorization for the docs table:
   *  - `semantic`  — meaning-bearing tokens that change with the theme (e.g. `color.primary`);
   *  - `structural` — values rarely overridden per theme (e.g. spacing scale, radii);
   *  - `responsive` — breakpoints and other layout-tier values.
   */
  classification: 'semantic' | 'structural' | 'responsive';
  /** Whether built-in themes are expected to redefine this token. */
  themeDependent: boolean;
}

type Catalog<T> = { [K in keyof T]-?: TokenDoc };

const color: Catalog<ColorTokens> = {
  background: { purpose: 'Base page background.', classification: 'semantic', themeDependent: true },
  surface: { purpose: 'Default panel or card surface.', classification: 'semantic', themeDependent: true },
  surfaceVariant: { purpose: 'Subtly differentiated surface (table header, inset panel).', classification: 'semantic', themeDependent: true },
  surfaceElevated: { purpose: 'Elevated surface for menus and raised cards.', classification: 'semantic', themeDependent: true },
  overlay: { purpose: 'Scrim shown behind modals and drawers.', classification: 'semantic', themeDependent: true },
  onBackground: { purpose: 'Default content color rendered on `background`.', classification: 'semantic', themeDependent: true },
  onSurface: { purpose: 'Default content color rendered on `surface`.', classification: 'semantic', themeDependent: true },
  onSurfaceVariant: { purpose: 'Default content color rendered on `surfaceVariant`.', classification: 'semantic', themeDependent: true },
  textPrimary: { purpose: 'Primary body text color.', classification: 'semantic', themeDependent: true },
  textSecondary: { purpose: 'Secondary / muted body text.', classification: 'semantic', themeDependent: true },
  textDisabled: { purpose: 'Text color for disabled controls and content.', classification: 'semantic', themeDependent: true },
  link: { purpose: 'Hyperlink color.', classification: 'semantic', themeDependent: true },
  icon: { purpose: 'Default icon color.', classification: 'semantic', themeDependent: true },
  primary: { purpose: 'Primary brand / call-to-action color.', classification: 'semantic', themeDependent: true },
  onPrimary: { purpose: 'Content color rendered on `primary`.', classification: 'semantic', themeDependent: true },
  primaryHover: { purpose: 'Primary color under pointer hover.', classification: 'semantic', themeDependent: true },
  primaryActive: { purpose: 'Primary color in the pressed/active state.', classification: 'semantic', themeDependent: true },
  secondary: { purpose: 'Secondary brand color used for accents.', classification: 'semantic', themeDependent: true },
  onSecondary: { purpose: 'Content color rendered on `secondary`.', classification: 'semantic', themeDependent: true },
  tertiary: { purpose: 'Tertiary accent color.', classification: 'semantic', themeDependent: true },
  onTertiary: { purpose: 'Content color rendered on `tertiary`.', classification: 'semantic', themeDependent: true },
  error: { purpose: 'Error / destructive intent color.', classification: 'semantic', themeDependent: true },
  onError: { purpose: 'Content color rendered on `error`.', classification: 'semantic', themeDependent: true },
  errorSurface: { purpose: 'Soft surface used for inline error banners.', classification: 'semantic', themeDependent: true },
  warning: { purpose: 'Warning intent color.', classification: 'semantic', themeDependent: true },
  onWarning: { purpose: 'Content color rendered on `warning`.', classification: 'semantic', themeDependent: true },
  warningSurface: { purpose: 'Soft surface used for inline warning banners.', classification: 'semantic', themeDependent: true },
  success: { purpose: 'Success / positive intent color.', classification: 'semantic', themeDependent: true },
  onSuccess: { purpose: 'Content color rendered on `success`.', classification: 'semantic', themeDependent: true },
  successSurface: { purpose: 'Soft surface used for inline success banners.', classification: 'semantic', themeDependent: true },
  info: { purpose: 'Informational intent color.', classification: 'semantic', themeDependent: true },
  onInfo: { purpose: 'Content color rendered on `info`.', classification: 'semantic', themeDependent: true },
  infoSurface: { purpose: 'Soft surface used for inline info banners.', classification: 'semantic', themeDependent: true },
  border: { purpose: 'Default border color.', classification: 'semantic', themeDependent: true },
  borderStrong: { purpose: 'Higher-contrast border color.', classification: 'semantic', themeDependent: true },
  divider: { purpose: 'Section / list divider color.', classification: 'semantic', themeDependent: true },
  focusRing: { purpose: 'Color of the accessible focus indicator.', classification: 'semantic', themeDependent: true },
  hoverOverlay: { purpose: 'Translucent overlay used on hover over interactive elements.', classification: 'semantic', themeDependent: true },
  selected: { purpose: 'Background applied to a selected interactive element.', classification: 'semantic', themeDependent: true },
  disabled: { purpose: 'Foreground / area color for disabled interactive elements.', classification: 'semantic', themeDependent: true },
};

const typography: Catalog<TypographyTokens> = {
  fontFamilyBase: { purpose: 'Default body font stack.', classification: 'structural', themeDependent: false },
  fontFamilyHeading: { purpose: 'Heading font stack.', classification: 'structural', themeDependent: false },
  fontFamilyMono: { purpose: 'Monospaced / code font stack.', classification: 'structural', themeDependent: false },
  fontSizeRoot: { purpose: 'Root font-size, basis of the rem scale.', classification: 'structural', themeDependent: false },
  fontSizeXs: { purpose: 'Extra-small text size.', classification: 'structural', themeDependent: false },
  fontSizeSm: { purpose: 'Small text size.', classification: 'structural', themeDependent: false },
  fontSizeMd: { purpose: 'Default body text size.', classification: 'structural', themeDependent: false },
  fontSizeLg: { purpose: 'Large body / minor heading size.', classification: 'structural', themeDependent: false },
  fontSizeXl: { purpose: 'Section heading size.', classification: 'structural', themeDependent: false },
  fontSize2xl: { purpose: 'Page heading size.', classification: 'structural', themeDependent: false },
  fontSize3xl: { purpose: 'Display heading size.', classification: 'structural', themeDependent: false },
  fontWeightRegular: { purpose: 'Regular weight.', classification: 'structural', themeDependent: false },
  fontWeightMedium: { purpose: 'Medium weight.', classification: 'structural', themeDependent: false },
  fontWeightSemibold: { purpose: 'Semibold weight.', classification: 'structural', themeDependent: false },
  fontWeightBold: { purpose: 'Bold weight.', classification: 'structural', themeDependent: false },
  lineHeightTight: { purpose: 'Tight line-height for headings.', classification: 'structural', themeDependent: false },
  lineHeightNormal: { purpose: 'Default body line-height.', classification: 'structural', themeDependent: false },
  lineHeightRelaxed: { purpose: 'Relaxed line-height for long-form text.', classification: 'structural', themeDependent: false },
  letterSpacingTight: { purpose: 'Slightly tighter tracking for headings.', classification: 'structural', themeDependent: false },
  letterSpacingNormal: { purpose: 'Default tracking.', classification: 'structural', themeDependent: false },
  letterSpacingWide: { purpose: 'Wide tracking for small caps / labels.', classification: 'structural', themeDependent: false },
};

const spacing: Catalog<SpacingTokens> = {
  space0: { purpose: 'Zero spacing.', classification: 'structural', themeDependent: false },
  space1: { purpose: 'Step 1 of the spacing scale.', classification: 'structural', themeDependent: false },
  space2: { purpose: 'Step 2 of the spacing scale.', classification: 'structural', themeDependent: false },
  space3: { purpose: 'Step 3 of the spacing scale.', classification: 'structural', themeDependent: false },
  space4: { purpose: 'Step 4 of the spacing scale.', classification: 'structural', themeDependent: false },
  space5: { purpose: 'Step 5 of the spacing scale.', classification: 'structural', themeDependent: false },
  space6: { purpose: 'Step 6 of the spacing scale.', classification: 'structural', themeDependent: false },
  space8: { purpose: 'Step 8 of the spacing scale.', classification: 'structural', themeDependent: false },
  space10: { purpose: 'Step 10 of the spacing scale.', classification: 'structural', themeDependent: false },
  space12: { purpose: 'Step 12 of the spacing scale.', classification: 'structural', themeDependent: false },
  space16: { purpose: 'Step 16 of the spacing scale.', classification: 'structural', themeDependent: false },
  containerSm: { purpose: 'Small layout container max-width.', classification: 'structural', themeDependent: false },
  containerMd: { purpose: 'Medium layout container max-width.', classification: 'structural', themeDependent: false },
  containerLg: { purpose: 'Large layout container max-width.', classification: 'structural', themeDependent: false },
  containerXl: { purpose: 'Extra-large layout container max-width.', classification: 'structural', themeDependent: false },
};

const radius: Catalog<RadiusTokens> = {
  radiusNone: { purpose: 'Square corners.', classification: 'structural', themeDependent: false },
  radiusSm: { purpose: 'Small corner radius (chips, badges).', classification: 'structural', themeDependent: false },
  radiusMd: { purpose: 'Default corner radius (inputs, buttons).', classification: 'structural', themeDependent: false },
  radiusLg: { purpose: 'Large corner radius (cards, dialogs).', classification: 'structural', themeDependent: false },
  radiusXl: { purpose: 'Extra-large corner radius (panels).', classification: 'structural', themeDependent: false },
  radiusFull: { purpose: 'Fully rounded (pill shape).', classification: 'structural', themeDependent: false },
};

const elevation: Catalog<ElevationTokens> = {
  elevation0: { purpose: 'No elevation / flat surface.', classification: 'semantic', themeDependent: true },
  elevation1: { purpose: 'Subtle lift (cards at rest).', classification: 'semantic', themeDependent: true },
  elevation2: { purpose: 'Raised surfaces (menus, dropdowns).', classification: 'semantic', themeDependent: true },
  elevation3: { purpose: 'Floating surfaces (popovers, sticky bars).', classification: 'semantic', themeDependent: true },
  elevation4: { purpose: 'Modal-level elevation (dialogs).', classification: 'semantic', themeDependent: true },
};

const motion: Catalog<MotionTokens> = {
  durationInstant: { purpose: 'Imperceptible duration; used for instant state flips.', classification: 'structural', themeDependent: false },
  durationFast: { purpose: 'Fast transition (hover/focus state changes).', classification: 'structural', themeDependent: false },
  durationNormal: { purpose: 'Default transition duration.', classification: 'structural', themeDependent: false },
  durationSlow: { purpose: 'Slow transition (page-level transitions).', classification: 'structural', themeDependent: false },
  easingStandard: { purpose: 'Standard easing for most transitions.', classification: 'structural', themeDependent: false },
  easingDecelerate: { purpose: 'Decelerating easing for entrances.', classification: 'structural', themeDependent: false },
  easingAccelerate: { purpose: 'Accelerating easing for exits.', classification: 'structural', themeDependent: false },
};

const zIndex: Catalog<ZIndexTokens> = {
  zBase: { purpose: 'Default in-flow content layer.', classification: 'structural', themeDependent: false },
  zSticky: { purpose: 'Sticky headers and toolbars.', classification: 'structural', themeDependent: false },
  zDrawer: { purpose: 'Side drawers and slide-overs.', classification: 'structural', themeDependent: false },
  zOverlay: { purpose: 'Modal scrim layer.', classification: 'structural', themeDependent: false },
  zModal: { purpose: 'Modal dialog layer.', classification: 'structural', themeDependent: false },
  zToast: { purpose: 'Toast / snackbar layer.', classification: 'structural', themeDependent: false },
  zTooltip: { purpose: 'Tooltip layer (always on top).', classification: 'structural', themeDependent: false },
};

const border: Catalog<BorderTokens> = {
  borderWidthThin: { purpose: 'Default border width.', classification: 'structural', themeDependent: false },
  borderWidthThick: { purpose: 'Emphasized border width.', classification: 'structural', themeDependent: false },
  focusRingWidth: { purpose: 'Width of the accessible focus ring.', classification: 'structural', themeDependent: false },
};

/**
 * The full, typed token catalog. The generator at
 * `scripts/generate-token-docs.mjs` walks this object, looks up the matching
 * runtime values in {@link LIGHT_THEME}, {@link DARK_THEME} and
 * {@link BREAKPOINT_TOKENS}, and renders `docs/token-reference.md`.
 */
export const TOKEN_CATALOG = {
  color,
  typography,
  spacing,
  radius,
  elevation,
  motion,
  zIndex,
  border,
} as const;

/** Breakpoints documented separately because they live outside the per-theme contract. */
export const BREAKPOINT_DOCS: Record<string, TokenDoc> = {
  handset: { purpose: 'Phones — mobile-first baseline.', classification: 'responsive', themeDependent: false },
  tablet: { purpose: 'Large phones and small tablets.', classification: 'responsive', themeDependent: false },
  desktop: { purpose: 'Tablets and small laptops.', classification: 'responsive', themeDependent: false },
  wide: { purpose: 'Large desktops and wide displays.', classification: 'responsive', themeDependent: false },
};
