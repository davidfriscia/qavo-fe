import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  ConsoleLogSink,
  NotificationService,
  QAVO_API_BASE_URL,
  QAVO_AUTH_CONFIG,
  QAVO_AUTH_STRATEGY,
  QAVO_FEATURE_FLAGS,
  QAVO_LOGGING_CONFIG,
  QAVO_LOG_SINKS,
  QavoSession,
} from '@qavo/core';
import { MockAuthStrategy } from './mock-auth.strategy';
import { RecordingNotificationService } from './recording-notification.service';

export interface QavoTestingOptions {
  /** Seed an authenticated session, or leave `null`/omitted for anonymous. */
  session?: QavoSession | null;
  /** API base URL used by HTTP-touching code under test. */
  apiBaseUrl?: string;
  /** Initial feature flags. */
  features?: Record<string, boolean>;
}

/**
 * One-call test environment for platform-aware components and services.
 *
 * Wires the mock auth strategy, a recording notification service, and the
 * tokens the platform expects — so a `TestBed` can exercise guards, the
 * permission directive, error handling and forms without standing up the full
 * `provideQavo` graph. Combine with `provideHttpClientTesting()` when the unit
 * under test makes HTTP calls.
 *
 * @example
 * TestBed.configureTestingModule({
 *   providers: [provideQavoTesting({ session: createTestSession({ permissions: ['orders:write'] }) })],
 * });
 */
export function provideQavoTesting(options: QavoTestingOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: QAVO_API_BASE_URL, useValue: options.apiBaseUrl ?? '/api/v1' },
    { provide: QAVO_AUTH_CONFIG, useValue: { strategy: 'local' } },
    { provide: QAVO_AUTH_STRATEGY, useFactory: () => new MockAuthStrategy(options.session ?? null) },
    { provide: QAVO_FEATURE_FLAGS, useValue: options.features ?? {} },
    {
      provide: QAVO_LOGGING_CONFIG,
      useValue: { appName: 'test', minLevel: 'error' },
    },
    { provide: QAVO_LOG_SINKS, useFactory: () => [new ConsoleLogSink()] },
    RecordingNotificationService,
    { provide: NotificationService, useExisting: RecordingNotificationService },
  ]);
}
