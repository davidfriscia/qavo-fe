import { InjectionToken } from '@angular/core';
import { QavoTheme } from './themes/theme.model';

/** `system` follows the OS `prefers-color-scheme`; otherwise a registered theme id. */
export type ThemePreference = 'system' | (string & {});

/** Configuration accepted by {@link provideQavoTheming}. */
export interface QavoThemingConfig {
  /**
   * The default theme on first load. `system` honors the OS preference and keeps
   * tracking it until the user makes an explicit choice. Defaults to `system`.
   */
  defaultTheme?: ThemePreference;
  /** Whether end users may switch themes at runtime. Defaults to `true`. */
  allowUserSwitch?: boolean;
  /** Additional themes to register (token overrides or brand-new themes). */
  customThemes?: QavoTheme[];
  /**
   * Persist the user's choice so it follows them across sessions. `local`
   * uses `localStorage`; `none` disables persistence. Defaults to `local`.
   */
  persistence?: 'local' | 'none';
  /** Storage key used when `persistence` is `local`. */
  storageKey?: string;
}

export const QAVO_THEMING_CONFIG = new InjectionToken<Required<QavoThemingConfig>>(
  'QAVO_THEMING_CONFIG',
);

export const DEFAULT_THEMING_CONFIG: Required<QavoThemingConfig> = {
  defaultTheme: 'system',
  allowUserSwitch: true,
  customThemes: [],
  persistence: 'local',
  storageKey: 'qavo.theme',
};
