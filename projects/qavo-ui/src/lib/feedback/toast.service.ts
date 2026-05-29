import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, inject } from '@angular/core';
import { Notification, NotificationService } from '@qavo/core';
import { QavoToastContainer } from './toast-container.component';

/**
 * The themed implementation of the platform {@link NotificationService}.
 *
 * Registered by `provideQavoUi()`, it replaces the core's console default so the
 * global error handler and HTTP layer surface real, accessible toasts. The host
 * is attached to a CDK overlay on first use, so applications need no markup.
 */
@Injectable()
export class ToastService extends NotificationService {
  private readonly overlay = inject(Overlay);
  private containerRef?: ComponentRef<QavoToastContainer>;

  override notify(notification: Notification): void {
    this.ensureContainer().instance.add(notification);
  }

  private ensureContainer(): ComponentRef<QavoToastContainer> {
    if (!this.containerRef) {
      const overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
      this.containerRef = overlayRef.attach(new ComponentPortal(QavoToastContainer));
    }
    return this.containerRef;
  }
}
