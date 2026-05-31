import { TestBed } from '@angular/core/testing';
import { PluginRegistry, provideQavoPlugin } from './plugin';

/**
 * The plugin registry is the platform's promise that adding or removing a
 * plugin is a one-line operation. The test asserts that promise: `provideX`
 * adds the descriptor, and removing it leaves nothing behind.
 */
describe('PluginRegistry', () => {
  it('lists plugins registered through provideQavoPlugin', () => {
    TestBed.configureTestingModule({
      providers: [
        provideQavoPlugin({ plugin: { id: 'auth-login', version: '0.1.0' } }),
        provideQavoPlugin({ plugin: { id: 'auth-registration', version: '0.1.0' } }),
      ],
    });
    const registry = TestBed.inject(PluginRegistry);
    expect(registry.list().map((p) => p.id)).toEqual(['auth-login', 'auth-registration']);
    expect(registry.has('auth-login')).toBe(true);
    expect(registry.get('auth-login')?.version).toBe('0.1.0');
  });

  it('reports no plugins when none are registered', () => {
    TestBed.configureTestingModule({ providers: [] });
    expect(TestBed.inject(PluginRegistry).list()).toEqual([]);
  });
});
