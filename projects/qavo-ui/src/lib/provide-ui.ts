import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NotificationService } from '@qavo/core';
import { ToastService } from './feedback/toast.service';

/**
 * Register the UI layer's platform integrations.
 *
 * Today this swaps the core's console notification default for the themed,
 * accessible toast implementation, so the global error handler and HTTP layer
 * produce real user notifications. UI components themselves are standalone and
 * imported directly where used.
 */
export function provideQavoUi(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: NotificationService, useClass: ToastService }]);
}
