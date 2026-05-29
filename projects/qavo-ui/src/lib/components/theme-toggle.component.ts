import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@qavo/theming';
import { QavoButton } from './button.component';

/**
 * A ready-made light/dark switch wired to the {@link ThemeService}. Honors the
 * host's `allowUserSwitch` setting and announces its current state.
 */
@Component({
  selector: 'qavo-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoButton],
  template: `
    @if (theme.canSwitch) {
      <button
        qavoButton
        variant="ghost"
        size="sm"
        [attr.aria-pressed]="theme.isDark()"
        (click)="theme.toggleDarkMode()"
      >
        {{ theme.isDark() ? '☀︎ Light' : '☾ Dark' }}
      </button>
    }
  `,
})
export class QavoThemeToggle {
  protected readonly theme = inject(ThemeService);
}
