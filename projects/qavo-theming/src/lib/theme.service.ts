import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { applyTokensToElement } from './tokens/css-variables';
import { QavoTheme } from './themes/theme.model';
import { LIGHT_THEME } from './themes/light-theme';
import { DARK_THEME } from './themes/dark-theme';
import {
  QAVO_THEMING_CONFIG,
  ThemePreference,
} from './theming-config';

/**
 * Central theming engine.
 *
 * Owns the registry of available themes and the single active theme, exposed as
 * signals. Applying a theme writes its tokens as CSS custom properties on the
 * document root, so switching is instantaneous and never requires a rebuild.
 * When the preference is `system`, the service tracks the OS `prefers-color-scheme`
 * until the user makes an explicit choice.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(QAVO_THEMING_CONFIG);

  private readonly registry = new Map<string, QavoTheme>();
  private readonly preferenceSignal = signal<ThemePreference>(this.config.defaultTheme);
  private readonly activeThemeSignal = signal<QavoTheme>(LIGHT_THEME);

  /** The currently applied theme. */
  readonly activeTheme = this.activeThemeSignal.asReadonly();
  /** The raw preference (`system` or a theme id). */
  readonly preference = this.preferenceSignal.asReadonly();
  /** Convenience flag for `prefers-dark`. */
  readonly isDark = computed(() => this.activeThemeSignal().colorScheme === 'dark');
  /** Whether the host application permits user-driven switching. */
  readonly canSwitch = this.config.allowUserSwitch;

  private mediaQuery?: MediaQueryList;

  constructor() {
    this.registerTheme(LIGHT_THEME);
    this.registerTheme(DARK_THEME);
    for (const theme of this.config.customThemes) {
      this.registerTheme(theme);
    }
    this.initialize();
  }

  /** All registered themes, in registration order. */
  themes(): QavoTheme[] {
    return [...this.registry.values()];
  }

  /** Register (or replace) a theme. Registration is additive and idempotent. */
  registerTheme(theme: QavoTheme): void {
    this.registry.set(theme.id, theme);
  }

  /**
   * Set the active theme by id, or `system` to follow the OS preference.
   * No-ops when the host disabled switching, except for the very first
   * initialization performed internally.
   */
  setTheme(preference: ThemePreference, persist = true): void {
    this.preferenceSignal.set(preference);
    this.resolveAndApply();
    if (persist && this.config.persistence === 'local') {
      this.writeStoredPreference(preference);
    }
  }

  /** Toggle between light and dark, pinning the choice (leaves `system` mode). */
  toggleDarkMode(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private initialize(): void {
    const stored = this.readStoredPreference();
    if (stored) {
      this.preferenceSignal.set(stored);
    }
    if (typeof this.document.defaultView?.matchMedia === 'function') {
      this.mediaQuery = this.document.defaultView.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', () => {
        if (this.preferenceSignal() === 'system') {
          this.resolveAndApply();
        }
      });
    }
    this.resolveAndApply();
  }

  private resolveAndApply(): void {
    const theme = this.resolveTheme(this.preferenceSignal());
    this.activeThemeSignal.set(theme);
    const root = this.document.documentElement;
    applyTokensToElement(root, theme.tokens, theme.id, theme.colorScheme);
  }

  private resolveTheme(preference: ThemePreference): QavoTheme {
    if (preference === 'system') {
      const prefersDark = this.mediaQuery?.matches ?? false;
      return prefersDark ? DARK_THEME : LIGHT_THEME;
    }
    return this.registry.get(preference) ?? LIGHT_THEME;
  }

  private readStoredPreference(): ThemePreference | null {
    if (this.config.persistence !== 'local') {
      return null;
    }
    try {
      return this.document.defaultView?.localStorage.getItem(this.config.storageKey) ?? null;
    } catch {
      // Storage can throw in private-browsing / sandboxed contexts; fail soft.
      return null;
    }
  }

  private writeStoredPreference(preference: ThemePreference): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.config.storageKey, preference);
    } catch {
      // Persistence is best-effort.
    }
  }
}
