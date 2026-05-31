import { TestBed } from '@angular/core/testing';
import { FeatureFlagService, QAVO_FEATURE_FLAGS } from './feature-flags';

describe('FeatureFlagService', () => {
  function setup(initial: Record<string, boolean> = {}): FeatureFlagService {
    TestBed.configureTestingModule({
      providers: [{ provide: QAVO_FEATURE_FLAGS, useValue: initial }],
    });
    return TestBed.inject(FeatureFlagService);
  }

  it('reads seeded flags', () => {
    const flags = setup({ 'billing.invoices': true });
    expect(flags.isEnabled('billing.invoices')).toBe(true);
    expect(flags.isEnabled('billing.missing')).toBe(false);
  });

  it('reflects runtime toggles through the reactive signal', () => {
    const flags = setup({ 'demo.beta': false });
    const signal = flags.flag('demo.beta');
    expect(signal()).toBe(false);
    flags.set('demo.beta', true);
    expect(signal()).toBe(true);
    expect(flags.isEnabled('demo.beta')).toBe(true);
  });

  it('returns a snapshot disconnected from internal state', () => {
    const flags = setup({ a: true });
    const snap = flags.snapshot();
    snap['a'] = false;
    expect(flags.isEnabled('a')).toBe(true);
  });
});
