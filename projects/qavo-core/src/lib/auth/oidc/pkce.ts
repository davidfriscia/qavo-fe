/**
 * PKCE (RFC 7636) helpers used by the OIDC strategy.
 *
 * The platform always uses the `S256` method: a random `code_verifier` is
 * persisted across the redirect, and its SHA-256 hash (base64url-encoded
 * without padding) is sent as the `code_challenge` on the authorize request.
 * This guarantees that even an attacker who intercepts the authorization
 * `code` cannot exchange it for tokens without the verifier.
 *
 * These helpers are framework-free and depend only on the Web Crypto API,
 * so they are equally usable inside a test, a worker, or a callback page.
 */

/** Minimum / maximum verifier length permitted by RFC 7636 §4.1. */
const VERIFIER_MIN_LENGTH = 43;
const VERIFIER_MAX_LENGTH = 128;

/** Allowed verifier alphabet per RFC 7636 §4.1 (unreserved URI characters). */
const UNRESERVED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

function requireCrypto(): Crypto {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error(
      'OIDC PKCE requires the Web Crypto API. ' +
        'This environment exposes neither crypto.subtle nor a polyfill.',
    );
  }
  return cryptoObj;
}

/** Base64url-encode a byte array without padding (RFC 7636 §A). */
export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate a random PKCE `code_verifier`.
 *
 * Uses the full unreserved-character set rather than only base64url so the
 * encoded length matches the byte length and respects the RFC bounds without
 * surprises.
 */
export function generateCodeVerifier(length = 64): string {
  if (length < VERIFIER_MIN_LENGTH || length > VERIFIER_MAX_LENGTH) {
    throw new RangeError(
      `code_verifier length must be between ${VERIFIER_MIN_LENGTH} and ${VERIFIER_MAX_LENGTH}.`,
    );
  }
  const buffer = new Uint8Array(length);
  requireCrypto().getRandomValues(buffer);
  let result = '';
  for (const byte of buffer) {
    result += UNRESERVED[byte % UNRESERVED.length];
  }
  return result;
}

/** Compute the S256 challenge for a given verifier. */
export async function computeCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await requireCrypto().subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

/** Generate an opaque random `state` (and re-usable nonce) value. */
export function generateRandomToken(byteLength = 32): string {
  const buffer = new Uint8Array(byteLength);
  requireCrypto().getRandomValues(buffer);
  return base64UrlEncode(buffer);
}
