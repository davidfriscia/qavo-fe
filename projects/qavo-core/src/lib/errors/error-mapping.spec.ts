import { HttpErrorResponse } from '@angular/common/http';
import { mapToQavoError } from './error-mapping';
import { QavoError } from './qavo-error';
import { ProblemDetails } from './problem-details';

/**
 * Verifies the single normalization step every consumer relies on. The mapper
 * is the seam between raw transport failures and the platform's `QavoError`
 * vocabulary; getting `kind` wrong would mis-route notifications, redirects
 * and retry decisions.
 */
describe('mapToQavoError', () => {
  it('passes a QavoError through unchanged', () => {
    const original = new QavoError({ kind: 'validation', message: 'bad' });
    expect(mapToQavoError(original)).toBe(original);
  });

  it('maps an HTTP 401 to the `unauthorized` kind', () => {
    const result = mapToQavoError(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
    expect(result.kind).toBe('unauthorized');
    expect(result.status).toBe(401);
    expect(result.userFacing).toBe(true);
  });

  it('maps status 0 to the `network` kind with a user-readable message', () => {
    const result = mapToQavoError(new HttpErrorResponse({ status: 0 }));
    expect(result.kind).toBe('network');
    expect(result.message).toMatch(/server could not be reached/i);
  });

  it('extracts RFC 9457 problem details, field errors and traceId', () => {
    const problem: ProblemDetails = {
      title: 'Validation failed',
      detail: 'Email is required.',
      status: 422,
      traceId: 'abc123',
      errors: [{ field: 'email', message: 'Email is required.' }],
    };
    const result = mapToQavoError(new HttpErrorResponse({ status: 422, error: problem }));
    expect(result.kind).toBe('validation');
    expect(result.traceId).toBe('abc123');
    expect(result.fieldErrors).toHaveLength(1);
    expect(result.fieldErrors[0]).toMatchObject({ field: 'email' });
    expect(result.message).toBe('Email is required.');
    expect(result.problem).toBe(problem);
  });

  it('classifies any 5xx as `server`', () => {
    expect(mapToQavoError(new HttpErrorResponse({ status: 503 })).kind).toBe('server');
  });

  it('treats a thrown Error as a non-user-facing client failure', () => {
    const result = mapToQavoError(new Error('boom'));
    expect(result.kind).toBe('client');
    expect(result.userFacing).toBe(false);
    expect(result.message).toBe('boom');
  });

  it('falls back to `unknown` for arbitrary values', () => {
    const result = mapToQavoError('something odd');
    expect(result.kind).toBe('unknown');
    expect(result.cause).toBe('something odd');
  });
});
