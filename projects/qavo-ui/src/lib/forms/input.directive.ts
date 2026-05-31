import { Directive, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { QavoFormField } from './form-field.component';

/**
 * Applies consistent, token-driven styling and accessibility wiring to native
 * form controls. Sets `aria-invalid` automatically from the bound control's
 * validity once it has been touched, so error state is conveyed to assistive
 * technology without per-field boilerplate.
 *
 * When placed inside a {@link QavoFormField}, automatically picks up the
 * field's generated id so the `<label for="...">` association is valid, which
 * makes `getByLabel` queries work correctly in tests and assistive technology.
 */
@Directive({
  selector: 'input[qavoInput], textarea[qavoInput], select[qavoInput]',
  host: {
    class: 'qavo-input',
    '[attr.aria-invalid]': 'invalid',
    '[attr.id]': 'fieldId',
  },
})
export class QavoInput {
  constructor(
    @Optional() @Self() private readonly ngControl?: NgControl,
    @Optional() private readonly formField?: QavoFormField,
  ) {}

  get invalid(): boolean | null {
    if (!this.ngControl) {
      return null;
    }
    return this.ngControl.invalid && this.ngControl.touched ? true : null;
  }

  get fieldId(): string | null {
    return this.formField?.fieldId ?? null;
  }
}
