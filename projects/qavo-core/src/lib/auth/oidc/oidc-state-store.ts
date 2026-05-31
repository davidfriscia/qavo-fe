import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * The transient state Qavo persists across an OIDC authorize redirect.
 *
 * Two reasons this is a dedicated abstraction:
 *  1. it is the security-critical bit (without `code_verifier` + `state`,
 *     PKCE cannot be validated), so it deserves an explicit contract; and
 *  2. application hosts that run inside iframes, SSR contexts, or custom
 *     embedders may need to replace it with a non-DOM-based store.
 */
export interface OidcAuthorizationRequest {
  /** The opaque random `state` echoed back by the IdP. */
  state: string;
  /** The PKCE `code_verifier` paired with the `code_challenge` we sent. */
  codeVerifier: string;
  /** Optional `nonce` claim for ID-Token replay protection. */
  nonce?: string;
  /** Where to send the user after a successful callback. */
  returnUrl?: string;
  /** Epoch millis the request was created at, used to expire stale entries. */
  createdAt: number;
}

/**
 * Pluggable store for the {@link OidcAuthorizationRequest}.
 *
 * The default implementation uses `sessionStorage` — cleared on tab close,
 * not synced across origins — which is the lowest-risk default for a public
 * client. Applications that need a different lifetime override the token.
 */
export abstract class OidcStateStore {
  abstract save(request: OidcAuthorizationRequest): void;
  abstract consume(state: string): OidcAuthorizationRequest | null;
  abstract clear(): void;
}

const STORAGE_KEY_PREFIX = 'qavo.oidc.request.';
/** Authorization requests are useless after the IdP's reasonable response window. */
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * Default `sessionStorage`-backed implementation.
 *
 * Keyed by `state` so multiple in-flight requests (e.g. due to a stale tab)
 * do not stomp on each other. Stale entries are evicted on read so the store
 * cannot grow unbounded.
 */
@Injectable()
export class SessionStorageOidcStateStore extends OidcStateStore {
  private readonly storage = inject(DOCUMENT).defaultView?.sessionStorage;

  save(request: OidcAuthorizationRequest): void {
    try {
      this.storage?.setItem(STORAGE_KEY_PREFIX + request.state, JSON.stringify(request));
    } catch {
      // Best-effort: a failed write means the callback will be rejected,
      // which is the correct behavior (no PKCE proof, no exchange).
    }
  }

  consume(state: string): OidcAuthorizationRequest | null {
    if (!this.storage) {
      return null;
    }
    const key = STORAGE_KEY_PREFIX + state;
    const raw = this.storage.getItem(key);
    this.storage.removeItem(key);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as OidcAuthorizationRequest;
      if (Date.now() - parsed.createdAt > STATE_MAX_AGE_MS) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): void {
    if (!this.storage) {
      return;
    }
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keys.push(key);
      }
    }
    for (const key of keys) {
      this.storage.removeItem(key);
    }
  }
}
