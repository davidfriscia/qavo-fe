import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QavoButton, QavoContainer, QavoEmptyState } from '@qavo/ui';

/** Fallback page registered via the platform's `provideNotFoundRoute`. */
@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoContainer, QavoEmptyState, QavoButton, RouterLink],
  template: `
    <qavo-container size="md">
      <qavo-empty-state title="Page not found" description="The page you requested does not exist.">
        <a qavoButton routerLink="/">Back to home</a>
      </qavo-empty-state>
    </qavo-container>
  `,
})
export class NotFoundComponent {}
