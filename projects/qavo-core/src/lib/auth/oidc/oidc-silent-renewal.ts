import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, Subscription, catchError, tap, throwError } from 'rxjs';
import { OidcConfig } from '../auth-config';
import { OidcTokenClient, OidcTokenResponse } from './oidc-token-client';

const DEFAULT_LEEWAY_SECONDS = 60;
/** Absolute minimum delay between renewal attempts (prevents tight loops on bad clocks). */
const MIN_DELAY_MS = 1_000;

/**
 * Schedules a silent refresh-token grant a short window before the current
 * access token expires.
 *
 * The renewer is intentionally minimal: one timer, cancellable, no global
 * state. It is started by the OIDC strategy once a session with a refresh
 * token is established and stopped on logout. Network failures abort the
 * schedule and surface through {@link errors}; the strategy then forces a
 * re-authentication by clearing the session.
 */
@Injectable()
export class OidcSilentRenewal implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly tokenClient = inject(OidcTokenClient);

  private timerId?: ReturnType<typeof setTimeout>;
  private subscription?: Subscription;
  private currentRefreshToken: string | null = null;

  private readonly renewedSubject = new Subject<OidcTokenResponse>();
  private readonly errorSubject = new Subject<unknown>();

  /** Emits each successful refresh response, so the strategy can update its session. */
  readonly renewed: Observable<OidcTokenResponse> = this.renewedSubject.asObservable();
  /** Emits when a scheduled renewal fails. The strategy decides how to react. */
  readonly errors: Observable<unknown> = this.errorSubject.asObservable();

  /** Begin (or replace) the schedule for a session expiring at `expiresAtMs`. */
  schedule(refreshToken: string, expiresAtMs: number, config: OidcConfig): void {
    this.cancel();
    if (!config.silentRenewal && config.silentRenewal !== undefined) {
      // Explicitly disabled.
      return;
    }
    if (typeof this.document.defaultView?.setTimeout !== 'function') {
      // Non-browser environment (SSR/tests without DOM): renewal is a no-op.
      return;
    }
    this.currentRefreshToken = refreshToken;
    const leewayMs = (config.renewalLeewaySeconds ?? DEFAULT_LEEWAY_SECONDS) * 1000;
    const delay = Math.max(MIN_DELAY_MS, expiresAtMs - Date.now() - leewayMs);
    this.timerId = this.document.defaultView.setTimeout(() => this.renew(), delay);
  }

  /** Cancel any pending renewal (called on logout / session loss). */
  cancel(): void {
    if (this.timerId !== undefined) {
      this.document.defaultView?.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.currentRefreshToken = null;
  }

  ngOnDestroy(): void {
    this.cancel();
  }

  private renew(): void {
    const token = this.currentRefreshToken;
    if (!token) {
      return;
    }
    this.subscription = this.tokenClient
      .refresh({ refreshToken: token })
      .pipe(
        tap((response) => this.renewedSubject.next(response)),
        catchError((error) => {
          this.errorSubject.next(error);
          return throwError(() => error);
        }),
      )
      .subscribe({ error: () => this.cancel() });
  }
}
