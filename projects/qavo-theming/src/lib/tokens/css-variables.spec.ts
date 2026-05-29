import { LIGHT_THEME } from '../themes/light-theme';
import { tokensToCssVariables } from './css-variables';

/**
 * Theming testing example: the token contract is plain data, so it can be
 * asserted without a TestBed. This guards the CSS-variable naming convention
 * that the whole design system depends on.
 */
describe('tokensToCssVariables', () => {
  const vars = tokensToCssVariables(LIGHT_THEME.tokens);

  it('emits kebab-cased, prefixed custom properties', () => {
    expect(vars['--qavo-color-primary']).toBe(LIGHT_THEME.tokens.color.primary);
    expect(vars['--qavo-color-primary-hover']).toBe(LIGHT_THEME.tokens.color.primaryHover);
  });

  it('includes breakpoint tokens with px units', () => {
    expect(vars['--qavo-breakpoint-tablet']).toBe('600px');
  });

  it('covers every token category', () => {
    expect(Object.keys(vars).some((key) => key.startsWith('--qavo-typography-'))).toBe(true);
    expect(Object.keys(vars).some((key) => key.startsWith('--qavo-spacing-'))).toBe(true);
    expect(Object.keys(vars).some((key) => key.startsWith('--qavo-elevation-'))).toBe(true);
  });
});
