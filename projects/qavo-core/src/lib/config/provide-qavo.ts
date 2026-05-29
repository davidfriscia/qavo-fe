import {
  EnvironmentProviders,
  ErrorHandler,
  Provider,
  makeEnvironmentProviders,
} from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { provideQavoTheming } from '@qavo/theming';
import { provideQavoAuth } from '../auth/provide-auth';
import { QAVO_ERROR_MAPPERS } from '../errors/error-mapping';
import { QavoErrorHandler } from '../errors/global-error-handler';
import { QAVO_FEATURE_FLAGS } from '../features/feature-flags';
import {
  ConsoleLogSink,
  LogSink,
  QAVO_LOGGING_CONFIG,
  QAVO_LOG_SINKS,
} from '../logging/logger';
import { ConsoleNotificationService, NotificationService } from '../notifications/notification';
import { QAVO_APP_TITLE, QavoTitleStrategy } from '../routing/title-strategy';
import { QAVO_API_BASE_URL } from './api-base-url';
import { QAVO_CONFIG, QavoConfig } from './qavo-config';
import { resolveEnvironment, QavoEnvironment } from './environment';

/**
 * The single platform bootstrap.
 *
 * One call wires every cross-cutting concern consistently across applications:
 * configuration, environment, theming, the authentication abstraction, the
 * global error handler, structured logging, the notification surface and
 * centralized page titles. Plugins are registered as siblings in the providers
 * array (e.g. `provideAuthLogin()`); the HTTP layer via `provideQavoHttp()`.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideQavo({ apiBaseUrl: '/api/v1', auth: { strategy: 'local' } }),
 *     provideQavoHttp(),
 *     provideAuthLogin(),
 *     provideRouter(appRoutes),
 *   ],
 * });
 */
export function provideQavo(config: QavoConfig): EnvironmentProviders {
  const environment: QavoEnvironment = resolveEnvironment(config.environment ?? 'production');
  const appName = config.appName ?? 'Qavo';

  const resolvedConfig = {
    ...config,
    appName,
    environment: environment.name,
  };

  const providers: (Provider | EnvironmentProviders)[] = [
    { provide: QAVO_CONFIG, useValue: resolvedConfig },
    { provide: QAVO_API_BASE_URL, useValue: config.apiBaseUrl },
    { provide: QAVO_APP_TITLE, useValue: appName },

    // Feature flags
    { provide: QAVO_FEATURE_FLAGS, useValue: config.features ?? {} },

    // Logging
    {
      provide: QAVO_LOGGING_CONFIG,
      useValue: {
        appName,
        minLevel: config.logging?.minLevel ?? (environment.production ? 'info' : 'debug'),
        remoteEndpoint: config.logging?.remoteEndpoint,
      },
    },
    { provide: QAVO_LOG_SINKS, useFactory: (): LogSink[] => [new ConsoleLogSink()] },

    // Centralized error handling
    { provide: ErrorHandler, useClass: QavoErrorHandler },
    { provide: QAVO_ERROR_MAPPERS, useValue: [] },

    // Notification surface — default sink; `@qavo/ui` overrides with a themed host.
    { provide: NotificationService, useClass: ConsoleNotificationService },

    // Centralized page titles
    { provide: TitleStrategy, useClass: QavoTitleStrategy },

    // Theming engine
    provideQavoTheming(config.theming ?? {}),

    // Authentication abstraction
    provideQavoAuth(config.auth),
  ];

  return makeEnvironmentProviders(providers);
}
