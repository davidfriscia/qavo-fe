import { Injectable } from '@angular/core';

/** Severity maps directly onto the status color tokens in `@qavo/theming`. */
export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error';

export interface NotificationAction {
  label: string;
  handler: () => void;
}

export interface Notification {
  severity: NotificationSeverity;
  /** Short, user-facing title. */
  title: string;
  /** Optional supporting detail. */
  detail?: string;
  /** Auto-dismiss delay in ms; `0`/omitted means it stays until dismissed. */
  durationMs?: number;
  /** Correlation id shown to users for support, linking to backend traces. */
  traceId?: string;
  /** Optional single action (e.g. "Retry"). */
  action?: NotificationAction;
}

/**
 * Platform notification surface.
 *
 * `@qavo/core` defines the abstraction (and a no-op default) so that
 * cross-cutting code — the global error handler, the HTTP error interceptor —
 * can notify the user without depending on the concrete UI. `@qavo/ui` provides
 * the themed toast/dialog implementation by overriding this token.
 */
export abstract class NotificationService {
  abstract notify(notification: Notification): void;

  success(title: string, detail?: string): void {
    this.notify({ severity: 'success', title, detail, durationMs: 4000 });
  }
  info(title: string, detail?: string): void {
    this.notify({ severity: 'info', title, detail, durationMs: 4000 });
  }
  warning(title: string, detail?: string): void {
    this.notify({ severity: 'warning', title, detail, durationMs: 6000 });
  }
  error(title: string, detail?: string, traceId?: string): void {
    this.notify({ severity: 'error', title, detail, traceId });
  }
}

/**
 * Default sink used until `@qavo/ui` (or an application) provides a real one.
 * It keeps the platform functional headless and during tests.
 */
@Injectable()
export class ConsoleNotificationService extends NotificationService {
  notify(notification: Notification): void {
    const line = `[qavo:${notification.severity}] ${notification.title}` +
      (notification.detail ? ` — ${notification.detail}` : '');
    if (notification.severity === 'error') {
      console.error(line, notification.traceId ?? '');
    } else if (notification.severity === 'warning') {
      console.warn(line);
    } else {
      console.info(line);
    }
  }
}
