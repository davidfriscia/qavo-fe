import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  Provider,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { MemoryTokenStore, TokenStore } from './auth-models';
import {
  DEFAULT_AUTH_CONFIG,
  QAVO_AUTH_CONFIG,
  QAVO_AUTH_STRATEGY,
  QavoAuthConfig,
} from './auth-config';
import { LocalAuthStrategy } from './local-auth.strategy';
import { OidcAuthStrategy } from './oidc-auth.strategy';

/** `localStorage`-backed token store, used only when `persistToken` is enabled. */
class LocalStorageTokenStore extends TokenStore {
  private readonly key = 'qavo.access-token';
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;
  get(): string | null {
    try {
      return this.storage?.getItem(this.key) ?? null;
    } catch {
      return null;
    }
  }
  set(token: string | null): void {
    try {
      if (token) {
        this.storage?.setItem(this.key, token);
      } else {
        this.storage?.removeItem(this.key);
      }
    } catch {
      /* best-effort */
    }
  }
  clear(): void {
    this.set(null);
  }
}

/**
 * Register the authentication abstraction with the chosen strategy.
 *
 * The strategy is the only thing that changes between `local` and `oidc`; the
 * uniform `AuthService`, guards and permission directive are always available.
 * Invoked indirectly by `provideQavo({ auth })`, or directly when composing.
 */
export function provideQavoAuth(config: QavoAuthConfig = DEFAULT_AUTH_CONFIG): EnvironmentProviders {
  const merged: QavoAuthConfig = { ...DEFAULT_AUTH_CONFIG, ...config };

  const strategyProvider: Provider =
    merged.strategy === 'oidc'
      ? { provide: QAVO_AUTH_STRATEGY, useClass: OidcAuthStrategy }
      : { provide: QAVO_AUTH_STRATEGY, useClass: LocalAuthStrategy };

  const tokenStoreProvider: Provider = merged.persistToken
    ? { provide: TokenStore, useClass: LocalStorageTokenStore }
    : { provide: TokenStore, useClass: MemoryTokenStore };

  return makeEnvironmentProviders([
    { provide: QAVO_AUTH_CONFIG, useValue: merged },
    tokenStoreProvider,
    LocalAuthStrategy,
    OidcAuthStrategy,
    strategyProvider,
  ]);
}
