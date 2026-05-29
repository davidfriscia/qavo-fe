import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmDialogData, QavoConfirmDialog } from './confirm-dialog.component';

/**
 * Thin, themed wrapper over the CDK `Dialog`. Centralizing dialog creation here
 * keeps overlay configuration (backdrop, focus, scroll) consistent and gives
 * applications a one-line `confirm()` for the most common case.
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(Dialog);

  /** Open an arbitrary component as a modal dialog. */
  open<R = unknown>(
    component: ComponentType<unknown>,
    config?: DialogConfig,
  ): Observable<R | undefined> {
    const merged = { hasBackdrop: true, ...config } as DialogConfig<unknown, DialogRef<R>>;
    return this.dialog.open<R>(component, merged).closed;
  }

  /** Open the standard confirmation dialog; resolves to the user's choice. */
  confirm(data: ConfirmDialogData): Observable<boolean | undefined> {
    return this.dialog.open<boolean, ConfirmDialogData, QavoConfirmDialog>(QavoConfirmDialog, {
      hasBackdrop: true,
      data,
    }).closed;
  }
}
