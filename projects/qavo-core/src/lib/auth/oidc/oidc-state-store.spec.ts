import { TestBed } from '@angular/core/testing';
import {
  OidcAuthorizationRequest,
  SessionStorageOidcStateStore,
} from './oidc-state-store';

/**
 * The state store is security-critical: a missing or stale entry must result
 * in `consume()` returning `null` so the strategy refuses the callback.
 */
describe('SessionStorageOidcStateStore', () => {
  let store: SessionStorageOidcStateStore;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [SessionStorageOidcStateStore] });
    store = TestBed.inject(SessionStorageOidcStateStore);
  });

  function makeRequest(overrides: Partial<OidcAuthorizationRequest> = {}): OidcAuthorizationRequest {
    return {
      state: 'state-1',
      codeVerifier: 'verifier-1',
      createdAt: Date.now(),
      ...overrides,
    };
  }

  it('round-trips a saved request by state', () => {
    const request = makeRequest();
    store.save(request);
    expect(store.consume('state-1')).toEqual(request);
  });

  it('removes the entry on consume so it cannot be replayed', () => {
    store.save(makeRequest());
    store.consume('state-1');
    expect(store.consume('state-1')).toBeNull();
  });

  it('rejects entries older than the 10-minute window', () => {
    store.save(makeRequest({ createdAt: Date.now() - 11 * 60 * 1000 }));
    expect(store.consume('state-1')).toBeNull();
  });

  it('returns null for an unknown state', () => {
    expect(store.consume('does-not-exist')).toBeNull();
  });

  it('keeps multiple in-flight requests separate', () => {
    store.save(makeRequest({ state: 'a' }));
    store.save(makeRequest({ state: 'b', codeVerifier: 'v-b' }));
    expect(store.consume('a')?.codeVerifier).toBe('verifier-1');
    expect(store.consume('b')?.codeVerifier).toBe('v-b');
  });
});
