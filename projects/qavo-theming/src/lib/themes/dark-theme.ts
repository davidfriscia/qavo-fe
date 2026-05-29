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

const DARK_COLORS: ColorTokens = {
  background: '#0e1117',
  surface: '#161b22',
  surfaceVariant: '#1f2630',
  surfaceElevated: '#21262e',
  overlay: 'rgba(0, 0, 0, 0.6)',

  onBackground: '#e6edf3',
  onSurface: '#e6edf3',
  onSurfaceVariant: '#9da7b3',
  textPrimary: '#e6edf3',
  textSecondary: '#9da7b3',
  textDisabled: '#5b6675',
  link: '#6ea8fe',
  icon: '#9da7b3',

  primary: '#5b8def',
  onPrimary: '#0b1220',
  primaryHover: '#7aa2f5',
  primaryActive: '#9bbcf9',
  secondary: '#2dd4bf',
  onSecondary: '#04201c',
  tertiary: '#a78bfa',
  onTertiary: '#1a1033',

  error: '#f87171',
  onError: '#2a0a0a',
  errorSurface: '#2a1416',
  warning: '#fbbf24',
  onWarning: '#241a02',
  warningSurface: '#2a2110',
  success: '#4ade80',
  onSuccess: '#062712',
  successSurface: '#10261a',
  info: '#38bdf8',
  onInfo: '#04212e',
  infoSurface: '#0c2330',

  border: '#2a313c',
  borderStrong: '#3a424f',
  divider: '#222932',
  focusRing: 'rgba(91, 141, 239, 0.55)',
  hoverOverlay: 'rgba(255, 255, 255, 0.06)',
  selected: 'rgba(91, 141, 239, 0.20)',
  disabled: 'rgba(255, 255, 255, 0.10)',
};

const DARK_ELEVATION: ElevationTokens = {
  elevation0: 'none',
  elevation1: '0 1px 2px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.5)',
  elevation2: '0 2px 4px rgba(0, 0, 0, 0.45), 0 4px 8px rgba(0, 0, 0, 0.5)',
  elevation3: '0 6px 12px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.55)',
  elevation4: '0 12px 24px rgba(0, 0, 0, 0.55), 0 24px 48px rgba(0, 0, 0, 0.6)',
};

/** The built-in dark theme. Contrast ratios target WCAG 2.1 AA. */
export const DARK_THEME: QavoTheme = {
  id: 'dark',
  name: 'Dark',
  colorScheme: 'dark',
  tokens: {
    color: DARK_COLORS,
    elevation: DARK_ELEVATION,
    typography: BASE_TYPOGRAPHY,
    spacing: BASE_SPACING,
    radius: BASE_RADIUS,
    motion: BASE_MOTION,
    zIndex: BASE_Z_INDEX,
    border: BASE_BORDER,
  },
};
