import { InjectionToken } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/** Resolves a single validation error key + payload into a user-facing message. */
export type ValidationMessageResolver = (key: string, error: unknown) => string;

export const QAVO_VALIDATION_MESSAGES = new InjectionToken<ValidationMessageResolver>(
  'QAVO_VALIDATION_MESSAGES',
);

/**
 * Default, i18n-friendly mapping from Angular/Qavo validation keys to messages.
 * Applications override the {@link QAVO_VALIDATION_MESSAGES} token to localize or
 * customize wording without touching components.
 */
export const defaultValidationMessage: ValidationMessageResolver = (key, error) => {
  switch (key) {
    case 'required':
      return 'This field is required.';
    case 'email':
      return 'Enter a valid email address.';
    case 'notBlank':
      return 'This field cannot be blank.';
    case 'mismatch':
      return 'The values do not match.';
    case 'minlength': {
      const e = error as { requiredLength?: number };
      return `Must be at least ${e.requiredLength ?? ''} characters.`;
    }
    case 'maxlength': {
      const e = error as { requiredLength?: number };
      return `Must be at most ${e.requiredLength ?? ''} characters.`;
    }
    case 'strongPassword':
      return 'Use upper- and lower-case letters, a digit, and the minimum length.';
    case 'server':
      return typeof error === 'string' ? error : 'This value was rejected by the server.';
    default:
      return 'This value is invalid.';
  }
};

/** Turn a control's `ValidationErrors` into the first applicable message. */
export function firstMessage(
  errors: ValidationErrors | null,
  resolver: ValidationMessageResolver,
): string | null {
  if (!errors) {
    return null;
  }
  const [key, value] = Object.entries(errors)[0];
  return resolver(key, value);
}
