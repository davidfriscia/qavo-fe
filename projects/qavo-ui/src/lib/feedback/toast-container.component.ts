import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Notification } from '@qavo/core';

interface ActiveToast extends Notification {
  id: number;
}

/**
 * Host that renders stacked, dismissible toasts. Attached once to a CDK overlay
 * by {@link ToastService}; applications never place it manually. Each toast is a
 * polite live region so screen readers announce it without stealing focus.
 */
@Component({
  selector: 'qavo-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (toast of toasts(); track toast.id) {
      <div class="qavo-toast" [attr.data-severity]="toast.severity" role="status" aria-live="polite">
        <div class="qavo-toast__body">
          <strong class="qavo-toast__title">{{ toast.title }}</strong>
          @if (toast.detail) {
            <p class="qavo-toast__detail">{{ toast.detail }}</p>
          }
          @if (toast.traceId) {
            <p class="qavo-toast__trace">Ref: {{ toast.traceId }}</p>
          }
        </div>
        @if (toast.action) {
          <button type="button" class="qavo-toast__action" (click)="runAction(toast)">
            {{ toast.action.label }}
          </button>
        }
        <button
          type="button"
          class="qavo-toast__close"
          aria-label="Dismiss notification"
          (click)="dismiss(toast.id)"
        >
          ×
        </button>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: var(--qavo-spacing-space4);
        inset-inline-end: var(--qavo-spacing-space4);
        z-index: var(--qavo-z-index-z-toast);
        display: flex;
        flex-direction: column;
        gap: var(--qavo-spacing-space2);
        max-width: min(28rem, calc(100vw - 2rem));
      }
      .qavo-toast {
        display: flex;
        align-items: flex-start;
        gap: var(--qavo-spacing-space3);
        padding: var(--qavo-spacing-space3) var(--qavo-spacing-space4);
        background: var(--qavo-color-surface-elevated);
        color: var(--qavo-color-on-surface);
        border: var(--qavo-border-border-width-thin) solid var(--qavo-color-border);
        border-inline-start: 4px solid var(--qavo-color-info);
        border-radius: var(--qavo-radius-radius-md);
        box-shadow: var(--qavo-elevation-elevation3);
        animation: qavo-toast-in var(--qavo-motion-duration-normal) var(--qavo-motion-easing-decelerate);
      }
      .qavo-toast[data-severity='success'] { border-inline-start-color: var(--qavo-color-success); }
      .qavo-toast[data-severity='warning'] { border-inline-start-color: var(--qavo-color-warning); }
      .qavo-toast[data-severity='error'] { border-inline-start-color: var(--qavo-color-error); }
      .qavo-toast__body { flex: 1; min-width: 0; }
      .qavo-toast__title { display: block; font-weight: var(--qavo-typography-font-weight-semibold); }
      .qavo-toast__detail { margin: var(--qavo-spacing-space1) 0 0; font-size: var(--qavo-typography-font-size-sm); }
      .qavo-toast__trace {
        margin: var(--qavo-spacing-space1) 0 0;
        font-family: var(--qavo-typography-font-family-mono);
        font-size: var(--qavo-typography-font-size-xs);
        color: var(--qavo-color-text-secondary);
      }
      .qavo-toast__action,
      .qavo-toast__close {
        background: none;
        border: none;
        color: var(--qavo-color-primary);
        cursor: pointer;
        font: inherit;
        padding: var(--qavo-spacing-space1);
      }
      .qavo-toast__close { color: var(--qavo-color-text-secondary); font-size: 1.25rem; line-height: 1; }
      .qavo-toast__close:focus-visible,
      .qavo-toast__action:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--qavo-border-focus-ring-width) var(--qavo-color-focus-ring);
        border-radius: var(--qavo-radius-radius-sm);
      }
      @keyframes qavo-toast-in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .qavo-toast { animation: none; }
      }
    `,
  ],
})
export class QavoToastContainer {
  private nextId = 0;
  readonly toasts = signal<ActiveToast[]>([]);

  add(notification: Notification): void {
    const toast: ActiveToast = { ...notification, id: this.nextId++ };
    this.toasts.update((list) => [...list, toast]);
    const duration = notification.durationMs ?? 0;
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  runAction(toast: ActiveToast): void {
    toast.action?.handler();
    this.dismiss(toast.id);
  }
}
