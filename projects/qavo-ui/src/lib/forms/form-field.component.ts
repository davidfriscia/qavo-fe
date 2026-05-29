import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  QAVO_VALIDATION_MESSAGES,
  ValidationMessageResolver,
  defaultValidationMessage,
  firstMessage,
} from './validation-messages';

let nextId = 0;

/**
 * Standardized form-field wrapper: label, projected control, hint, and a single
 * resolved error message shown once the control is touched and invalid.
 *
 * Pair with the `qavoInput` directive on the projected control. Error text is
 * resolved through the {@link QAVO_VALIDATION_MESSAGES} token, so wording and
 * localization are centralized and consistent across the platform — including
 * server-side errors reconciled via `applyServerErrors`.
 *
 * Uses unencapsulated styles so the shared input styling applies to the
 * projected native control.
 */
@Component({
  selector: 'qavo-form-field',
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="qavo-field__label" [attr.for]="fieldId">
      {{ label() }}
      @if (required()) {
        <span class="qavo-field__required" aria-hidden="true">*</span>
      }
    </label>
    <ng-content />
    @if (hint() && !showError) {
      <p class="qavo-field__hint">{{ hint() }}</p>
    }
    @if (showError) {
      <p class="qavo-field__error" role="alert">{{ errorMessage }}</p>
    }
  `,
  styles: [
    `
      qavo-form-field {
        display: block;
        margin-bottom: var(--qavo-spacing-space4);
      }
      .qavo-field__label {
        display: block;
        margin-bottom: var(--qavo-spacing-space1);
        font-size: var(--qavo-typography-font-size-sm);
        font-weight: var(--qavo-typography-font-weight-medium);
        color: var(--qavo-color-text-primary);
      }
      .qavo-field__required { color: var(--qavo-color-error); margin-inline-start: 2px; }
      .qavo-field__hint {
        margin: var(--qavo-spacing-space1) 0 0;
        font-size: var(--qavo-typography-font-size-xs);
        color: var(--qavo-color-text-secondary);
      }
      .qavo-field__error {
        margin: var(--qavo-spacing-space1) 0 0;
        font-size: var(--qavo-typography-font-size-xs);
        color: var(--qavo-color-error);
      }
      .qavo-input {
        display: block;
        width: 100%;
        min-height: 2.75rem;
        padding: var(--qavo-spacing-space2) var(--qavo-spacing-space3);
        font: inherit;
        color: var(--qavo-color-text-primary);
        background: var(--qavo-color-surface);
        border: var(--qavo-border-border-width-thin) solid var(--qavo-color-border-strong);
        border-radius: var(--qavo-radius-radius-md);
        transition: border-color var(--qavo-motion-duration-fast) var(--qavo-motion-easing-standard),
          box-shadow var(--qavo-motion-duration-fast) var(--qavo-motion-easing-standard);
      }
      .qavo-input:focus-visible {
        outline: none;
        border-color: var(--qavo-color-primary);
        box-shadow: 0 0 0 var(--qavo-border-focus-ring-width) var(--qavo-color-focus-ring);
      }
      .qavo-input[aria-invalid='true'] {
        border-color: var(--qavo-color-error);
      }
      .qavo-input:disabled {
        background: var(--qavo-color-disabled);
        cursor: not-allowed;
      }
      @media (prefers-reduced-motion: reduce) {
        .qavo-input { transition: none; }
      }
    `,
  ],
})
export class QavoFormField {
  private readonly resolver: ValidationMessageResolver =
    inject(QAVO_VALIDATION_MESSAGES, { optional: true }) ?? defaultValidationMessage;

  readonly label = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  readonly hint = input<string>('');
  readonly required = input<boolean>(false);
  /** Optional explicit id to wire `for`/`id`; otherwise an auto id is generated. */
  readonly inputId = input<string>('');

  private readonly autoId = `qavo-field-${nextId++}`;
  get fieldId(): string {
    return this.inputId() || this.autoId;
  }

  get showError(): boolean {
    const control = this.control();
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  get errorMessage(): string | null {
    const control = this.control();
    return control ? firstMessage(control.errors, this.resolver) : null;
  }
}
