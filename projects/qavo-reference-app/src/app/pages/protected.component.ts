import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService, HasPermissionDirective } from '@qavo/core';
import { QavoButton, QavoCard, QavoContainer, QavoStack } from '@qavo/ui';

/**
 * A route protected by `authGuard`. Also demonstrates permission-aware rendering
 * with the `*qavoHasPermission` directive — the "Admin action" button only
 * appears for users holding `reports:manage`.
 */
@Component({
  selector: 'app-protected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoContainer, QavoStack, QavoCard, QavoButton, HasPermissionDirective],
  template: `
    <qavo-container size="md">
      <qavo-stack [gap]="5">
        <h1>Protected area</h1>
        <qavo-card heading="Security context">
          <p>Signed in as <strong>{{ auth.user()?.displayName }}</strong>.</p>
          <p>Roles: {{ auth.roles().join(', ') || '—' }}</p>
          <p>Permissions: {{ auth.permissions().join(', ') || '—' }}</p>

          <button qavoButton *qavoHasPermission="'reports:manage'">Admin action</button>
        </qavo-card>
      </qavo-stack>
    </qavo-container>
  `,
})
export class ProtectedComponent {
  protected readonly auth = inject(AuthService);
}
