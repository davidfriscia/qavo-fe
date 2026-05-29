import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QavoButton } from '../components/button.component';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
}

/**
 * Accessible confirmation dialog: focus is trapped while open (CDK), it is
 * labelled for assistive technology, and it returns a boolean result. Styled
 * entirely from theme tokens.
 */
@Component({
  selector: 'qavo-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoButton, CdkTrapFocus],
  template: `
    <div
      class="qavo-dialog"
      role="alertdialog"
      aria-modal="true"
      [attr.aria-label]="data.title"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
    >
      <h2 class="qavo-dialog__title">{{ data.title }}</h2>
      <p class="qavo-dialog__message">{{ data.message }}</p>
      <div class="qavo-dialog__actions">
        <button qavoButton variant="ghost" (click)="close(false)">
          {{ data.cancelLabel ?? 'Cancel' }}
        </button>
        <button qavoButton [variant]="data.tone === 'danger' ? 'danger' : 'primary'" (click)="close(true)">
          {{ data.confirmLabel ?? 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .qavo-dialog {
        background: var(--qavo-color-surface-elevated);
        color: var(--qavo-color-on-surface);
        border-radius: var(--qavo-radius-radius-lg);
        box-shadow: var(--qavo-elevation-elevation4);
        padding: var(--qavo-spacing-space6);
        max-width: min(28rem, calc(100vw - 2rem));
      }
      .qavo-dialog__title { margin: 0 0 var(--qavo-spacing-space3); font-size: var(--qavo-typography-font-size-xl); }
      .qavo-dialog__message { margin: 0 0 var(--qavo-spacing-space6); color: var(--qavo-color-text-secondary); }
      .qavo-dialog__actions { display: flex; justify-content: flex-end; gap: var(--qavo-spacing-space3); }
    `,
  ],
})
export class QavoConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
