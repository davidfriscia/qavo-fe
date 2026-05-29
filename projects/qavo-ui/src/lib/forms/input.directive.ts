import { Directive, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Applies consistent, token-driven styling and accessibility wiring to native
 * form controls. Sets `aria-invalid` automatically from the bound control's
 * validity once it has been touched, so error state is conveyed to assistive
 * technology without per-field boilerplate.
 */
@Directive({
  selector: 'input[qavoInput], textarea[qavoInput], select[qavoInput]',
  host: {
    class: 'qavo-input',
    '[attr.aria-invalid]': 'invalid',
  },
})
export class QavoInput {
  constructor(@Optional() @Self() private readonly ngControl?: NgControl) {}

  get invalid(): boolean | null {
    if (!this.ngControl) {
      return null;
    }
    return this.ngControl.invalid && this.ngControl.touched ? true : null;
  }
}
