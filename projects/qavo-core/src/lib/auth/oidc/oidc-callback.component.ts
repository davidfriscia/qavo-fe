import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Default OIDC callback handler.
 *
 * Mounted by {@link provideOidcCallbackRoute}, this component reads the
 * `code` / `state` query parameters, asks the {@link AuthService} (and
 * therefore the active OIDC strategy) to complete the redirect, then
 * navigates the user to the original `returnUrl` recorded before the
 * authorize redirect. Applications that need a custom-looking callback
 * page replace this component while keeping the underlying contract.
 */
@Component({
  selector: 'qavo-oidc-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="status" aria-live="polite" style="padding: 2rem; text-align: center;">
      @if (error()) {
        <p>{{ error() }}</p>
      } @else {
        <p>Completing sign-in…</p>
      }
    </div>
  `,
})
export class QavoOidcCallbackComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const idpError = params.get('error');
    if (idpError) {
      this.error.set(`Sign-in failed: ${params.get('error_description') ?? idpError}.`);
      return;
    }
    const code = params.get('code');
    const state = params.get('state');
    if (!code || !state) {
      this.error.set('Missing authorization code or state in the callback URL.');
      return;
    }
    if (this.auth.strategyId !== 'oidc') {
      this.error.set('OIDC strategy is not active in this application.');
      return;
    }
    this.auth.completeRedirect({ code, state }).subscribe({
      next: (returnUrl) => {
        void this.router.navigateByUrl(returnUrl ?? '/');
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Sign-in failed.';
        this.error.set(message);
      },
    });
  }
}
