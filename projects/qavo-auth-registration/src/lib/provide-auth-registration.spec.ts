import { TestBed } from '@angular/core/testing';
import { PluginRegistry, provideQavo } from '@qavo/core';
import { provideAuthRegistration } from './provide-auth-registration';
import { AUTH_REGISTRATION_CONFIG, DEFAULT_AUTH_REGISTRATION_CONFIG } from './registration-config';

describe('provideAuthRegistration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideQavo({ apiBaseUrl: '/api' }),
        provideAuthRegistration({ selfService: true }),
      ],
    });
  });

  it('registers the plugin with the platform registry', () => {
    const registry = TestBed.inject(PluginRegistry);
    const ids = registry.list().map((p) => p.id);
    expect(ids).toContain('auth-registration');
  });

  it('exposes a merged config under AUTH_REGISTRATION_CONFIG', () => {
    const cfg = TestBed.inject(AUTH_REGISTRATION_CONFIG);
    expect(cfg.selfService).toBe(true);
    expect(cfg.routePath).toBe(DEFAULT_AUTH_REGISTRATION_CONFIG.routePath);
  });
});
