import { ErrorHandler, Injectable, inject } from '@angular/core';
import { QavoLogger } from '../logging/logger';
import { NotificationService } from '../notifications/notification';
import { QAVO_ERROR_MAPPERS, mapToQavoError } from './error-mapping';
import { QavoError } from './qavo-error';

/**
 * Centralized Angular `ErrorHandler`.
 *
 * Every uncaught error funnels through here, is normalized into a
 * {@link QavoError} (consulting application/plugin-registered mappers first),
 * logged with its `traceId`, and — when user-facing — surfaced through the
 * notification service. HTTP-level concerns (401 redirect, 403 page, field
 * reconciliation) are handled earlier in the HTTP interceptor; this is the
 * final safety net for everything else.
 */
@Injectable()
export class QavoErrorHandler implements ErrorHandler {
  private readonly logger = inject(QavoLogger);
  private readonly notifications = inject(NotificationService);
  private readonly mappers = inject(QAVO_ERROR_MAPPERS, { optional: true }) ?? [];

  handleError(error: unknown): void {
    const qavoError = this.normalize(error);

    this.logger.error(
      qavoError.message,
      {
        kind: qavoError.kind,
        status: qavoError.status,
        fieldErrors: qavoError.fieldErrors,
      },
      qavoError.traceId,
    );

    if (qavoError.userFacing && this.shouldNotify(qavoError)) {
      this.notifications.error(
        this.titleFor(qavoError),
        qavoError.message,
        qavoError.traceId,
      );
    }

    // Preserve original console visibility for developers.
    if (qavoError.cause instanceof Error) {
      console.error(qavoError.cause);
    }
  }

  private normalize(error: unknown): QavoError {
    for (const mapper of this.mappers) {
      const mapped = mapper(error);
      if (mapped) {
        return mapped;
      }
    }
    return mapToQavoError(error);
  }

  /** 401/403 are handled by the HTTP layer (redirect / access-denied page). */
  private shouldNotify(error: QavoError): boolean {
    return error.kind !== 'unauthorized' && error.kind !== 'forbidden';
  }

  private titleFor(error: QavoError): string {
    switch (error.kind) {
      case 'network':
        return 'Connection problem';
      case 'timeout':
        return 'The request timed out';
      case 'validation':
        return 'Please review the highlighted fields';
      case 'not-found':
        return 'Not found';
      case 'conflict':
        return 'Conflict';
      case 'server':
        return 'Something went wrong on our side';
      default:
        return 'Unexpected error';
    }
  }
}
