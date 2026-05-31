import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Observable, defer, map, of } from 'rxjs';
import { AuthStrategy, OidcCallbackResult, QavoSession, QavoUser, TokenStore } from './auth-models';
import { OidcConfig, QAVO_AUTH_CONFIG } from './auth-config';
import { computeCodeChallenge, generateCodeVerifier, generateRandomToken } from './oidc/pkce';
import {
  OidcAuthorizationRequest,
  OidcStateStore,
} from './oidc/oidc-state-store';
import { OidcSilentRenewal } from './oidc/oidc-silent-renewal';
import { OidcTokenClient, OidcTokenResponse } from './oidc/oidc-token-client';

const DEFAULT_SCOPES = ['openid', 'profile', 'email'];

/**
 * OIDC Authorization Code Flow with PKCE.
 *
 * The strategy is composed of small, replaceable parts so the platform stays
 * provider-agnostic and out of the cryptography business it does not need to
 * own:
 *
 *  - {@link OidcStateStore} persists `state` / `code_verifier` / `returnUrl`
 *    across the redirect (default: `sessionStorage`).
 *  - {@link OidcTokenClient} performs the actual token-endpoint POST
 *    (default: a thin `HttpClient` wrapper that respects the standard OIDC
 *    contract; any vendor SDK can replace it).
 *  - {@link OidcSilentRenewal} schedules refresh-token grants ahead of expiry.
 *
 * The strategy itself orchestrates these pieces, builds the authorization URL,
 * validates the callback, and maps the IdP's token response into the uniform
 * {@link QavoSession} shape Qavo consumers depend on.
 */
@Injectable()
export class OidcAuthStrategy implements AuthStrategy {
  readonly id = 'oidc';

  private readonly document = inject(DOCUMENT);
  private readonly tokenStore = inject(TokenStore);
  private readonly stateStore = inject(OidcStateStore);
  private readonly tokenClient = inject(OidcTokenClient);
  private readonly renewal = inject(OidcSilentRenewal, { optional: true });
  private readonly config = inject(QAVO_AUTH_CONFIG, { optional: true });

  /** Most recently produced session, kept for `restore()` after silent renewal. */
  private current: QavoSession | null = null;
  /** Most recently issued refresh token (kept off the {@link TokenStore} on purpose). */
  private refreshToken: string | null = null;

  constructor() {
    // Wire renewal output once. Errors clear the session, forcing a fresh
    // interactive sign-in on the next protected navigation.
    this.renewal?.renewed.subscribe((response) => this.applyTokenResponse(response));
    this.renewal?.errors.subscribe(() => this.clearSession());
  }

  restore(): Observable<QavoSession | null> {
    // OIDC clients re-establish sessions via silent renewal or a fresh
    // redirect; on cold boot there is nothing to restore from memory.
    return of(this.current);
  }

  loginRedirect(targetUrl?: string): void {
    const oidc = this.requireOidc();
    void this.buildAuthorizeUrl(oidc, targetUrl).then((url) =>
      this.document.location.assign(url),
    );
  }

  completeRedirect(callback: {
    code: string;
    state: string;
  }): Observable<OidcCallbackResult> {
    const oidc = this.requireOidc();
    const request = this.stateStore.consume(callback.state);
    if (!request) {
      // No matching request => possible CSRF, replay, or expired flow.
      // Refuse rather than continuing with an attacker-controlled state.
      return defer(() => {
        throw new Error('OIDC callback state did not match any pending authorization.');
      });
    }
    const redirectUri = this.resolveRedirectUri(oidc);
    return this.tokenClient
      .exchangeCode({
        code: callback.code,
        codeVerifier: request.codeVerifier,
        redirectUri,
      })
      .pipe(
        map((response) => this.applyTokenResponse(response)),
        map((session) => ({ session, returnUrl: request.returnUrl ?? null })),
      );
  }

  logout(): Observable<void> {
    const oidc = this.config?.oidc;
    this.clearSession();
    if (oidc?.endSessionEndpoint) {
      const postLogoutRedirectUri =
        oidc.postLogoutRedirectUri ?? `${this.document.location.origin}/`;
      const url =
        oidc.endSessionEndpoint +
        `?client_id=${encodeURIComponent(oidc.clientId)}` +
        `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
      this.document.location.assign(url);
    }
    return of(void 0);
  }

  getAccessToken(): string | null {
    return this.tokenStore.get();
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private async buildAuthorizeUrl(oidc: OidcConfig, targetUrl?: string): Promise<string> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await computeCodeChallenge(codeVerifier);
    const state = generateRandomToken();
    const nonce = generateRandomToken();
    const request: OidcAuthorizationRequest = {
      state,
      codeVerifier,
      nonce,
      returnUrl: targetUrl ?? this.document.location.pathname,
      createdAt: Date.now(),
    };
    this.stateStore.save(request);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: oidc.clientId,
      redirect_uri: this.resolveRedirectUri(oidc),
      scope: (oidc.scopes ?? DEFAULT_SCOPES).join(' '),
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const endpoint =
      oidc.authorizationEndpoint ?? `${trim(oidc.issuerUri)}/authorize`;
    return `${endpoint}?${params.toString()}`;
  }

  private applyTokenResponse(response: OidcTokenResponse): QavoSession {
    const expiresAt =
      typeof response.expires_in === 'number'
        ? Date.now() + response.expires_in * 1000
        : undefined;
    const user = decodeIdTokenUser(response.id_token);
    const session: QavoSession = {
      user,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt,
    };
    this.current = session;
    this.tokenStore.set(response.access_token);
    if (response.refresh_token) {
      this.refreshToken = response.refresh_token;
    }
    const refresh = this.refreshToken;
    const oidc = this.config?.oidc;
    if (refresh && oidc && expiresAt !== undefined) {
      this.renewal?.schedule(refresh, expiresAt, oidc);
    }
    return session;
  }

  private clearSession(): void {
    this.current = null;
    this.refreshToken = null;
    this.tokenStore.clear();
    this.renewal?.cancel();
  }

  private resolveRedirectUri(oidc: OidcConfig): string {
    return oidc.redirectUri ?? `${this.document.location.origin}/auth/callback`;
  }

  private requireOidc(): OidcConfig {
    const oidc = this.config?.oidc;
    if (!oidc) {
      throw new Error('OIDC strategy selected but no `oidc` configuration was provided.');
    }
    return oidc;
  }
}

function trim(value: string): string {
  return value.replace(/\/$/, '');
}

/**
 * Decode the JWT body of an ID Token into a {@link QavoUser}.
 *
 * The platform does **not** verify the ID Token signature — that is the token
 * endpoint's responsibility (we obtained the token over TLS, directly from the
 * IdP). The decoded claims are used for display only; authorization is enforced
 * by the backend on the access token.
 */
function decodeIdTokenUser(idToken: string | undefined): QavoUser {
  if (!idToken) {
    return anonymousUser();
  }
  const payload = decodeJwtPayload(idToken);
  if (!payload) {
    return anonymousUser();
  }
  const roles = asStringArray(payload['roles']) ?? [];
  const scopeClaim = payload['scope'];
  const permissions =
    asStringArray(payload['permissions']) ??
    (typeof scopeClaim === 'string' ? scopeClaim.split(' ') : []);
  return {
    id: String(payload['sub'] ?? 'unknown'),
    username: String(payload['preferred_username'] ?? payload['email'] ?? payload['sub'] ?? 'unknown'),
    displayName: payload['name'] ? String(payload['name']) : undefined,
    email: payload['email'] ? String(payload['email']) : undefined,
    roles,
    permissions,
  };
}

function anonymousUser(): QavoUser {
  return {
    id: 'unknown',
    username: 'unknown',
    roles: [],
    permissions: [],
  };
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  try {
    const segment = parts[1];
    const padded = segment.padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=');
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }
  return null;
}
