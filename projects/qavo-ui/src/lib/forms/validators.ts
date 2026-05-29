import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Reusable validators that mirror the backend's Bean Validation constraints, so
 * the client gives immediate feedback with the same rules — the "dual
 * validation" principle. The server remains the source of truth.
 */
export const QavoValidators = {
  /** Rejects values that are only whitespace. */
  notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value === 'string' && value.trim().length === 0 && value.length > 0) {
        return { notBlank: true };
      }
      return null;
    };
  },

  /** A reasonable password-strength policy; tune to match the backend policy. */
  strongPassword(minLength = 10): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value ?? '';
      if (!value) {
        return null;
      }
      const failures: string[] = [];
      if (value.length < minLength) failures.push('length');
      if (!/[a-z]/.test(value)) failures.push('lowercase');
      if (!/[A-Z]/.test(value)) failures.push('uppercase');
      if (!/[0-9]/.test(value)) failures.push('digit');
      return failures.length > 0 ? { strongPassword: { failures, minLength } } : null;
    };
  },

  /**
   * Cross-field validator placed on a `FormGroup` to require two controls to
   * match (e.g. password / confirm). Sets the error on the second control.
   */
  matchControls(sourceName: string, targetName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const source = group.get(sourceName);
      const target = group.get(targetName);
      if (!source || !target) {
        return null;
      }
      if (source.value !== target.value) {
        target.setErrors({ ...target.errors, mismatch: true });
        return { mismatch: true };
      }
      // Clear a previously-set mismatch without clobbering other errors.
      if (target.errors?.['mismatch']) {
        const { mismatch, ...rest } = target.errors;
        target.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    };
  },
};
