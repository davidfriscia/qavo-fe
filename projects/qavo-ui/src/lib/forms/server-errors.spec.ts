import { FormBuilder, FormGroup } from '@angular/forms';
import { ProblemDetails } from '@qavo/core';
import { applyServerErrors } from './server-errors';

describe('applyServerErrors', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormBuilder().group({ email: [''], password: [''] });
  });

  it('attaches a `server` error carrying the backend message to matching controls', () => {
    const problem: ProblemDetails = {
      errors: [{ field: 'email', message: 'Email is required.' }],
    };
    const unmatched = applyServerErrors(form, problem);
    expect(form.get('email')!.errors).toEqual({ server: 'Email is required.' });
    expect(form.get('email')!.touched).toBe(true);
    expect(unmatched).toEqual([]);
  });

  it('returns field names that do not correspond to any control', () => {
    const problem: ProblemDetails = {
      errors: [{ field: 'nonexistent', message: 'oops' }],
    };
    const unmatched = applyServerErrors(form, problem);
    expect(unmatched).toEqual(['nonexistent']);
  });

  it('joins multiple errors on the same field into a single message', () => {
    const problem: ProblemDetails = {
      errors: [
        { field: 'password', message: 'Too short.' },
        { field: 'password', message: 'Missing uppercase.' },
      ],
    };
    applyServerErrors(form, problem);
    expect(form.get('password')!.errors?.['server']).toBe('Too short. Missing uppercase.');
  });
});
