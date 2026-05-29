import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@qavo/core';
import { QavoButton, QavoShell, QavoThemeToggle, ShellNavItem } from '@qavo/ui';

/**
 * Root component: composes the adaptive {@link QavoShell} with primary
 * navigation, a theme toggle, and an auth-aware action. Everything responsive,
 * themed and accessible comes from the platform — the application only declares
 * its navigation and content (the routed outlet).
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QavoShell, QavoThemeToggle, QavoButton, RouterLink, RouterOutlet],
  template: `
    <qavo-shell [items]="navItems">
      <span shell-brand>Qavo</span>
      <ng-container shell-actions>
        <qavo-theme-toggle />
        @if (auth.isAuthenticated()) {
          <button qavoButton variant="ghost" size="sm" (click)="signOut()">Sign out</button>
        } @else {
          <a qavoButton variant="ghost" size="sm" routerLink="/auth/login">Sign in</a>
        }
      </ng-container>

      <router-outlet />
    </qavo-shell>
  `,
})
export class App {
  protected readonly auth = inject(AuthService);

  protected readonly navItems: ShellNavItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Protected', route: '/protected' },
  ];

  signOut(): void {
    this.auth.logout().subscribe();
  }
}
