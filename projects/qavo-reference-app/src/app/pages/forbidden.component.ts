import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QavoButton, QavoContainer, QavoEmptyState } from '@qavo/ui';

/** Access-denied page registered via the platform's `provideForbiddenRoute`. */
@Component({
  selector: 'app-forbidden',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoContainer, QavoEmptyState, QavoButton, RouterLink],
  template: `
    <qavo-container size="md">
      <qavo-empty-state
        tone="error"
        title="Access denied"
        description="You do not have permission to view this page."
      >
        <a qavoButton routerLink="/">Back to home</a>
      </qavo-empty-state>
    </qavo-container>
  `,
})
export class ForbiddenComponent {}
