import { ProblemDetails, ProblemFieldError } from './problem-details';

/** Stable, platform-level error categories used for routing notifications and UX. */
export type QavoErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'client'
  | 'unknown';

/**
 * The platform's normalized error abstraction.
 *
 * Every failure — an HTTP error, a thrown exception, a rejected promise — is
 * mapped into a `QavoError` so the rest of the application reasons about a
 * single, stable shape instead of `HttpErrorResponse` vs `Error` vs `unknown`.
 */
export class QavoError extends Error {
  readonly kind: QavoErrorKind;
  readonly status?: number;
  readonly traceId?: string;
  readonly fieldErrors: ProblemFieldError[];
  readonly problem?: ProblemDetails;
  override readonly cause?: unknown;
  /** Whether this error is safe and useful to surface to the end user. */
  readonly userFacing: boolean;

  constructor(init: {
    kind: QavoErrorKind;
    message: string;
    status?: number;
    traceId?: string;
    fieldErrors?: ProblemFieldError[];
    problem?: ProblemDetails;
    cause?: unknown;
    userFacing?: boolean;
  }) {
    super(init.message);
    this.name = 'QavoError';
    this.kind = init.kind;
    this.status = init.status;
    this.traceId = init.traceId;
    this.fieldErrors = init.fieldErrors ?? [];
    this.problem = init.problem;
    this.cause = init.cause;
    this.userFacing = init.userFacing ?? true;
  }

  get isValidation(): boolean {
    return this.kind === 'validation';
  }
}
