import { ColorTokens, ElevationTokens } from '../tokens/token-contract';
import { QavoTheme } from './theme.model';
import {
  BASE_BORDER,
  BASE_MOTION,
  BASE_RADIUS,
  BASE_SPACING,
  BASE_TYPOGRAPHY,
  BASE_Z_INDEX,
} from './base-tokens';

const LIGHT_COLORS: ColorTokens = {
  background: '#f6f7f9',
  surface: '#ffffff',
  surfaceVariant: '#eef0f4',
  surfaceElevated: '#ffffff',
  overlay: 'rgba(15, 23, 42, 0.45)',

  onBackground: '#1a1d23',
  onSurface: '#1a1d23',
  onSurfaceVariant: '#475467',
  textPrimary: '#1a1d23',
  textSecondary: '#475467',
  textDisabled: '#98a2b3',
  link: '#1d4ed8',
  icon: '#475467',

  primary: '#2563eb',
  onPrimary: '#ffffff',
  primaryHover: '#1d4ed8',
  primaryActive: '#1e40af',
  secondary: '#0d9488',
  onSecondary: '#ffffff',
  tertiary: '#7c3aed',
  onTertiary: '#ffffff',

  error: '#dc2626',
  onError: '#ffffff',
  errorSurface: '#fef2f2',
  warning: '#d97706',
  onWarning: '#ffffff',
  warningSurface: '#fffbeb',
  success: '#16a34a',
  onSuccess: '#ffffff',
  successSurface: '#f0fdf4',
  info: '#0284c7',
  onInfo: '#ffffff',
  infoSurface: '#f0f9ff',

  border: '#e4e7ec',
  borderStrong: '#d0d5dd',
  divider: '#eceef2',
  focusRing: 'rgba(37, 99, 235, 0.45)',
  hoverOverlay: 'rgba(15, 23, 42, 0.04)',
  selected: 'rgba(37, 99, 235, 0.12)',
  disabled: 'rgba(15, 23, 42, 0.08)',
};

const LIGHT_ELEVATION: ElevationTokens = {
  elevation0: 'none',
  elevation1: '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)',
  elevation2: '0 2px 4px rgba(15, 23, 42, 0.06), 0 4px 8px rgba(15, 23, 42, 0.08)',
  elevation3: '0 6px 12px rgba(15, 23, 42, 0.08), 0 12px 24px rgba(15, 23, 42, 0.10)',
  elevation4: '0 12px 24px rgba(15, 23, 42, 0.12), 0 24px 48px rgba(15, 23, 42, 0.14)',
};

/** The built-in light theme. Contrast ratios target WCAG 2.1 AA. */
export const LIGHT_THEME: QavoTheme = {
  id: 'light',
  name: 'Light',
  colorScheme: 'light',
  tokens: {
    color: LIGHT_COLORS,
    elevation: LIGHT_ELEVATION,
    typography: BASE_TYPOGRAPHY,
    spacing: BASE_SPACING,
    radius: BASE_RADIUS,
    motion: BASE_MOTION,
    zIndex: BASE_Z_INDEX,
    border: BASE_BORDER,
  },
};
