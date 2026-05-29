/**
 * RFC 9457 "Problem Details for HTTP APIs".
 *
 * This mirrors the contract the Qavo backend emits, so the frontend can parse
 * every error response in one consistent shape. Field-level validation errors
 * are carried in the non-standard but platform-conventional `errors` array,
 * matching the backend's validation envelope.
 */
export interface ProblemDetails {
  /** A URI reference identifying the problem type. */
  type?: string;
  /** A short, human-readable summary of the problem type. */
  title?: string;
  /** The HTTP status code. */
  status?: number;
  /** A human-readable explanation specific to this occurrence. */
  detail?: string;
  /** A URI reference identifying the specific occurrence. */
  instance?: string;
  /** ISO-8601 timestamp the backend attached to the problem. */
  timestamp?: string;
  /** Correlation id linking this error to backend logs and traces. */
  traceId?: string;
  /** Field-level validation violations (Qavo convention). */
  errors?: ProblemFieldError[];
  /** Any additional, type-specific members. */
  [key: string]: unknown;
}

/** A single field-level validation violation. */
export interface ProblemFieldError {
  field: string;
  message: string;
  code?: string;
}

/** Narrow an unknown payload to a {@link ProblemDetails}. */
export function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  // A Problem Details body is identified structurally by its canonical members.
  return (
    'title' in candidate ||
    'detail' in candidate ||
    'type' in candidate ||
    'status' in candidate
  );
}

/** Extract field errors keyed by field name, for reconciliation with form controls. */
export function fieldErrorsByName(problem: ProblemDetails): Record<string, ProblemFieldError[]> {
  const map: Record<string, ProblemFieldError[]> = {};
  for (const error of problem.errors ?? []) {
    (map[error.field] ??= []).push(error);
  }
  return map;
}
