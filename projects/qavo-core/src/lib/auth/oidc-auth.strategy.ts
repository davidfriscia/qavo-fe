import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AuthStrategy, QavoSession, TokenStore } from './auth-models';
import { OidcConfig, QAVO_AUTH_CONFIG } from './auth-config';

/**
 * OIDC-ready strategy (Authorization Code Flow + PKCE).
 *
 * This provides the platform-facing seam for external identity providers
 * (Entra ID, Keycloak, any compliant OIDC/OAuth2 server). It builds the
 * authorization request and surfaces the token uniformly; the cryptographic
 * code exchange is intentionally delegated to a dedicated OIDC client, which an
 * application wires in by subclassing or replacing {@link QAVO_AUTH_STRATEGY}.
 * Keeping that boundary explicit avoids shipping a half-built OIDC client and
 * keeps the platform provider-agnostic.
 */
@Injectable()
export class OidcAuthStrategy implements AuthStrategy {
  readonly id = 'oidc';

  private readonly document = inject(DOCUMENT);
  private readonly tokenStore = inject(TokenStore);
  private readonly config = inject(QAVO_AUTH_CONFIG, { optional: true });

  restore(): Observable<QavoSession | null> {
    // A real deployment performs silent token renewal here; absent a client we
    // report anonymous and let the guard trigger an interactive login.
    return of(null);
  }

  loginRedirect(targetUrl?: string): void {
    const oidc = this.requireOidc();
    const redirectUri =
      oidc.redirectUri ?? `${this.document.location.origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: oidc.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: (oidc.scopes ?? ['openid', 'profile', 'email']).join(' '),
      state: targetUrl ?? this.document.location.pathname,
    });
    // Discovery would resolve the authorization endpoint; we follow the common
    // convention relative to the issuer for the foundation.
    this.document.location.assign(
      `${oidc.issuerUri.replace(/\/$/, '')}/authorize?${params.toString()}`,
    );
  }

  completeRedirect(): Observable<QavoSession> {
    return throwError(
      () =>
        new Error(
          'OIDC code exchange requires an OIDC client integration. ' +
            'Provide a concrete QAVO_AUTH_STRATEGY that completes the PKCE flow.',
        ),
    );
  }

  logout(): Observable<void> {
    this.tokenStore.clear();
    return of(void 0);
  }

  getAccessToken(): string | null {
    return this.tokenStore.get();
  }

  private requireOidc(): OidcConfig {
    const oidc = this.config?.oidc;
    if (!oidc) {
      throw new Error('OIDC strategy selected but no `oidc` configuration was provided.');
    }
    return oidc;
  }
}
