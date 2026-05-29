import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  inject,
} from '@angular/core';
import { ThemeService } from './theme.service';
import {
  DEFAULT_THEMING_CONFIG,
  QAVO_THEMING_CONFIG,
  QavoThemingConfig,
} from './theming-config';

/**
 * Register the Qavo theming engine.
 *
 * Usually invoked indirectly via `provideQavo({ theming: ... })` in `@qavo/core`,
 * but can be used standalone in an application that wants theming without the
 * rest of the platform.
 *
 * @example
 * provideQavoTheming({ defaultTheme: 'system', allowUserSwitch: true });
 */
export function provideQavoTheming(config: QavoThemingConfig = {}): EnvironmentProviders {
  const merged = { ...DEFAULT_THEMING_CONFIG, ...config };
  return makeEnvironmentProviders([
    { provide: QAVO_THEMING_CONFIG, useValue: merged },
    // Eagerly instantiate so tokens are applied before the first paint.
    provideEnvironmentInitializer(() => {
      inject(ThemeService);
    }),
  ]);
}
