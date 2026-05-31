import { generateCodeVerifier, computeCodeChallenge, base64UrlEncode, generateRandomToken } from './pkce';

/**
 * The platform's PKCE helpers are the only piece of OIDC cryptography Qavo
 * actually owns, so they get the most direct coverage: RFC bounds, the
 * documented S256 test vector, and the no-padding base64url contract.
 */
describe('PKCE helpers', () => {
  it('generates verifiers within the RFC 7636 length bounds', () => {
    const verifier = generateCodeVerifier();
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
    expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });

  it('rejects out-of-range verifier lengths', () => {
    expect(() => generateCodeVerifier(42)).toThrow(RangeError);
    expect(() => generateCodeVerifier(129)).toThrow(RangeError);
  });

  it('produces distinct verifiers and tokens on each call', () => {
    expect(generateCodeVerifier()).not.toBe(generateCodeVerifier());
    expect(generateRandomToken()).not.toBe(generateRandomToken());
  });

  it('matches the RFC 7636 Appendix B S256 test vector', async () => {
    // Verifier from RFC 7636 §4.1 example, hashed to the documented challenge.
    const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
    const challenge = await computeCodeChallenge(verifier);
    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  });

  it('base64url encodes without padding and using URL-safe alphabet', () => {
    const encoded = base64UrlEncode(new Uint8Array([0xff, 0xee, 0xdd, 0xcc]));
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
  });
});
