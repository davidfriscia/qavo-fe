import { FormGroup } from '@angular/forms';
import { ProblemDetails, fieldErrorsByName } from '@qavo/core';

/**
 * Reconcile backend validation errors (RFC 9457 Problem Details `errors[]`) with
 * a reactive form, attaching a `server` error carrying the backend message to
 * each matching control. This closes the dual-validation loop: the server stays
 * authoritative, and its messages render through the same field UI as client
 * validation.
 *
 * @returns field names that had no matching control (surface these as a
 *          form-level error).
 */
export function applyServerErrors(form: FormGroup, problem: ProblemDetails): string[] {
  const byField = fieldErrorsByName(problem);
  const unmatched: string[] = [];

  for (const [field, errors] of Object.entries(byField)) {
    const control = form.get(field);
    const message = errors.map((e) => e.message).join(' ');
    if (control) {
      control.setErrors({ ...control.errors, server: message });
      control.markAsTouched();
    } else {
      unmatched.push(field);
    }
  }
  return unmatched;
}
