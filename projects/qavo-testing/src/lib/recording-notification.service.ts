import { Injectable } from '@angular/core';
import { Notification, NotificationService } from '@qavo/core';

/**
 * A {@link NotificationService} that records notifications instead of rendering
 * them, so tests can assert what the platform tried to tell the user (e.g. that
 * an error toast was raised) without a DOM.
 */
@Injectable()
export class RecordingNotificationService extends NotificationService {
  readonly notifications: Notification[] = [];

  override notify(notification: Notification): void {
    this.notifications.push(notification);
  }

  /** The most recent notification, or `undefined`. */
  get last(): Notification | undefined {
    return this.notifications.at(-1);
  }

  clear(): void {
    this.notifications.length = 0;
  }
}
