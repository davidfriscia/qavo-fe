import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OidcConfig } from '../auth-config';

/** The shape of a successful OAuth 2.0 token response (RFC 6749 §5.1). */
export interface OidcTokenResponse {
  /** OAuth 2.0 access token. */
  access_token: string;
  /** Token type; `Bearer` for OIDC code-flow. */
  token_type?: string;
  /** Lifetime in seconds of the access token. */
  expires_in?: number;
  /** Refresh token, when the IdP issued one. */
  refresh_token?: string;
  /** Signed ID Token JWT, when `openid` scope was requested. */
  id_token?: string;
  /** Granted scopes. */
  scope?: string;
}

/** Input to the authorization-code exchange. */
export interface OidcCodeExchangeInput {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/** Input to the refresh-token exchange. */
export interface OidcRefreshInput {
  refreshToken: string;
  /** Optional scope down-scoping. */
  scope?: string;
}

/**
 * Pluggable OIDC token-endpoint client.
 *
 * Kept behind a token so an application that already integrates an OIDC SDK
 * (e.g. `oidc-client-ts`) can adapt it to Qavo's uniform `AuthStrategy`
 * surface without rewriting the rest of the platform. The default
 * implementation below covers the standard OIDC contract.
 */
export abstract class OidcTokenClient {
  abstract exchangeCode(input: OidcCodeExchangeInput): Observable<OidcTokenResponse>;
  abstract refresh(input: OidcRefreshInput): Observable<OidcTokenResponse>;
}

/**
 * Internal token used by {@link HttpOidcTokenClient} to obtain the OIDC config
 * without forcing every client to inject the full auth config. Wired by
 * {@link provideQavoAuth} when the OIDC strategy is active.
 */
export const QAVO_OIDC_CONFIG = new InjectionToken<OidcConfig>('QAVO_OIDC_CONFIG');

/**
 * Default token client: POSTs the standard `application/x-www-form-urlencoded`
 * body to the IdP's token endpoint. The endpoint is resolved in order of
 * preference:
 *
 *   1. an explicit `tokenEndpoint` on {@link OidcConfig} (most deployments);
 *   2. `<issuerUri>/token`, matching the common discovery convention used by
 *      Keycloak, Entra ID and other compliant OIDC servers.
 *
 * Calls are issued with an absolute URL so Qavo's base-URL interceptor
 * naturally bypasses them; the IdP's token endpoint is not behind the API.
 */
@Injectable()
export class HttpOidcTokenClient extends OidcTokenClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(QAVO_OIDC_CONFIG);

  exchangeCode(input: OidcCodeExchangeInput): Observable<OidcTokenResponse> {
    return this.post({
      grant_type: 'authorization_code',
      code: input.code,
      code_verifier: input.codeVerifier,
      redirect_uri: input.redirectUri,
    });
  }

  refresh(input: OidcRefreshInput): Observable<OidcTokenResponse> {
    const body: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: input.refreshToken,
    };
    if (input.scope) {
      body['scope'] = input.scope;
    }
    return this.post(body);
  }

  private post(body: Record<string, string>): Observable<OidcTokenResponse> {
    body['client_id'] = this.config.clientId;
    return this.http.post<OidcTokenResponse>(this.tokenEndpoint(), encode(body), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    });
  }

  private tokenEndpoint(): string {
    return this.config.tokenEndpoint ?? `${trimTrailingSlash(this.config.issuerUri)}/token`;
  }
}

function encode(body: Record<string, string>): string {
  return Object.entries(body)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}
