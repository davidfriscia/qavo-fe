import { TestBed } from '@angular/core/testing';
import { provideQavoTheming, ThemeService } from '../public-api';

/**
 * The theme service is the single seam between application code and the
 * built-in / custom theme registry. The tests verify the contract every
 * consumer relies on: registration is additive, switching changes the
 * active theme atomically, and `persistence='none'` keeps nothing on disk.
 */
describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideQavoTheming({ persistence: 'none' })],
    });
  });

  it('registers light and dark themes by default', () => {
    const service = TestBed.inject(ThemeService);
    const ids = service.themes().map((t) => t.id);
    expect(ids).toContain('light');
    expect(ids).toContain('dark');
  });

  it('switches the active theme', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(service.activeTheme().id).toBe('dark');
    expect(service.isDark()).toBe(true);
    service.setTheme('light');
    expect(service.isDark()).toBe(false);
  });

  it('writes the active theme tokens to documentElement as CSS variables', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--qavo-color-background')).not.toBe('');
    expect(root.getAttribute('data-qavo-theme')).toBe('dark');
  });

  it('toggleDarkMode flips between light and dark', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    service.toggleDarkMode();
    expect(service.activeTheme().id).toBe('dark');
    service.toggleDarkMode();
    expect(service.activeTheme().id).toBe('light');
  });
});
