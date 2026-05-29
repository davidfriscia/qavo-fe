import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FeatureFlagService, NotificationService, PluginRegistry } from '@qavo/core';
import {
  BreakpointService,
  DialogService,
  QavoButton,
  QavoCard,
  QavoContainer,
  QavoGrid,
  QavoStack,
} from '@qavo/ui';
import { UsersApi } from '../api/generated/users.api';

/**
 * Landing page that exercises the platform: responsive layout primitives, themed
 * components, the notification + dialog services, the plugin registry, feature
 * flags, and the generated API client (whose failure demonstrates centralized
 * error handling end to end).
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoContainer, QavoStack, QavoGrid, QavoCard, QavoButton],
  template: `
    <qavo-container size="lg">
      <qavo-stack [gap]="6">
        <header>
          <h1>Qavo reference application</h1>
          <p>
            A live demonstration of the platform foundation. Active breakpoint:
            <strong>{{ breakpoints.active() }}</strong>.
          </p>
        </header>

        <qavo-grid minColumnWidth="18rem" [gap]="4">
          <qavo-card heading="Theming">
            <p>Switch light/dark from the header. Tokens drive every surface.</p>
          </qavo-card>

          <qavo-card heading="Notifications">
            <qavo-stack direction="row" [gap]="2" wrap>
              <button qavoButton size="sm" (click)="notify('success')">Success</button>
              <button qavoButton size="sm" variant="secondary" (click)="notify('info')">Info</button>
              <button qavoButton size="sm" variant="danger" (click)="notify('error')">Error</button>
            </qavo-stack>
          </qavo-card>

          <qavo-card heading="Dialog">
            <button qavoButton variant="secondary" (click)="confirmDelete()">Delete something…</button>
            @if (confirmResult() !== null) {
              <p>You chose: <strong>{{ confirmResult() ? 'confirm' : 'cancel' }}</strong></p>
            }
          </qavo-card>

          <qavo-card heading="Centralized error handling">
            <p>Calls the generated client; with no backend it fails and the platform shows a toast.</p>
            <button qavoButton variant="secondary" [loading]="loading()" (click)="loadUsers()">
              Load users
            </button>
          </qavo-card>

          <qavo-card heading="Active plugins">
            <ul>
              @for (plugin of plugins.list(); track plugin.id) {
                <li>{{ plugin.id }} <small>v{{ plugin.version }}</small></li>
              } @empty {
                <li>No plugins registered.</li>
              }
            </ul>
          </qavo-card>

          <qavo-card heading="Feature flags">
            <p>
              <code>demo.beta</code> is
              <strong>{{ features.isEnabled('demo.beta') ? 'on' : 'off' }}</strong>.
            </p>
          </qavo-card>
        </qavo-grid>
      </qavo-stack>
    </qavo-container>
  `,
})
export class HomeComponent {
  protected readonly breakpoints = inject(BreakpointService);
  protected readonly plugins = inject(PluginRegistry);
  protected readonly features = inject(FeatureFlagService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(DialogService);
  private readonly usersApi = inject(UsersApi);

  protected readonly confirmResult = signal<boolean | null>(null);
  protected readonly loading = signal(false);

  notify(severity: 'success' | 'info' | 'error'): void {
    const title = `${severity[0].toUpperCase()}${severity.slice(1)} notification`;
    const detail = 'Raised through the centralized notification service.';
    if (severity === 'success') {
      this.notifications.success(title, detail);
    } else if (severity === 'info') {
      this.notifications.info(title, detail);
    } else {
      this.notifications.error(title, detail);
    }
  }

  confirmDelete(): void {
    this.dialog
      .confirm({
        title: 'Delete item?',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        tone: 'danger',
      })
      .subscribe((result) => this.confirmResult.set(result ?? false));
  }

  loadUsers(): void {
    this.loading.set(true);
    // No error callback on purpose: the error propagates to the global
    // ErrorHandler, which raises the centralized toast.
    this.usersApi
      .listUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }
}
