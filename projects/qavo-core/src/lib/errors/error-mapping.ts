import { HttpErrorResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { ProblemDetails, fieldErrorsByName, isProblemDetails } from './problem-details';
import { QavoError, QavoErrorKind } from './qavo-error';

/**
 * Extensible error mapper.
 *
 * Applications and plugins can register additional mappers via the
 * {@link QAVO_ERROR_MAPPERS} multi-token to translate domain-specific failures
 * into a {@link QavoError}. Returning `null` defers to the next mapper and,
 * ultimately, to the built-in mapping.
 */
export type QavoErrorMapper = (error: unknown) => QavoError | null;

export const QAVO_ERROR_MAPPERS = new InjectionToken<QavoErrorMapper[]>('QAVO_ERROR_MAPPERS');

function statusToKind(status: number): QavoErrorKind {
  if (status === 0) return 'network';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status === 408 || status === 504) return 'timeout';
  if (status === 422 || status === 400) return 'validation';
  if (status >= 500) return 'server';
  if (status >= 400) return 'client';
  return 'unknown';
}

/** Built-in normalization of any thrown value into a {@link QavoError}. */
export function mapToQavoError(error: unknown): QavoError {
  if (error instanceof QavoError) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    const kind = statusToKind(error.status);
    const problem: ProblemDetails | undefined = isProblemDetails(error.error)
      ? (error.error as ProblemDetails)
      : undefined;
    const fieldErrors = problem ? Object.values(fieldErrorsByName(problem)).flat() : [];
    const message =
      problem?.detail ??
      problem?.title ??
      (error.status === 0
        ? 'The server could not be reached.'
        : `Request failed with status ${error.status}.`);
    return new QavoError({
      kind,
      message,
      status: error.status,
      traceId: problem?.traceId,
      fieldErrors,
      problem,
      cause: error,
      userFacing: true,
    });
  }

  if (error instanceof Error) {
    return new QavoError({
      kind: 'client',
      message: error.message || 'An unexpected error occurred.',
      cause: error,
      // Raw client exceptions are usually not meaningful to end users.
      userFacing: false,
    });
  }

  return new QavoError({
    kind: 'unknown',
    message: 'An unexpected error occurred.',
    cause: error,
    userFacing: false,
  });
}
