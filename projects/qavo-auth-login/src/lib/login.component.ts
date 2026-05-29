import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, QavoError } from '@qavo/core';
import {
  QavoAutofocus,
  QavoButton,
  QavoCard,
  QavoFormField,
  QavoInput,
  QavoValidators,
  applyServerErrors,
} from '@qavo/ui';
import { AUTH_LOGIN_CONFIG, DEFAULT_AUTH_LOGIN_CONFIG } from './login-config';

/**
 * Themed, accessible local-login screen.
 *
 * Demonstrates the platform's form story end to end: reactive forms with shared
 * validators, the standardized field UI, server-side validation reconciliation
 * (`applyServerErrors`), and the strategy-agnostic {@link AuthService}. It looks
 * native to any host because it consumes the same theme tokens.
 */
@Component({
  selector: 'qavo-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    QavoCard,
    QavoButton,
    QavoFormField,
    QavoInput,
    QavoAutofocus,
  ],
  template: `
    <div class="qavo-login">
      <qavo-card heading="Sign in" elevation="2">
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          @if (formError()) {
            <p class="qavo-login__error" role="alert">{{ formError() }}</p>
          }

          <qavo-form-field label="Username" [control]="form.controls.username" [required]="true">
            <input
              qavoInput
              qavoAutofocus
              type="text"
              autocomplete="username"
              formControlName="username"
            />
          </qavo-form-field>

          <qavo-form-field label="Password" [control]="form.controls.password" [required]="true">
            <input qavoInput type="password" autocomplete="current-password" formControlName="password" />
          </qavo-form-field>

          <button qavoButton type="submit" [block]="true" [loading]="submitting()">Sign in</button>
        </form>

        <div card-footer class="qavo-login__footer">
          @if (config.registrationRoute) {
            <a [routerLink]="config.registrationRoute">Create an account</a>
          }
        </div>
      </qavo-card>
    </div>
  `,
  styles: [
    `
      .qavo-login {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-block: var(--qavo-spacing-space10);
      }
      qavo-card { width: min(26rem, 100%); }
      .qavo-login__error {
        margin: 0 0 var(--qavo-spacing-space4);
        padding: var(--qavo-spacing-space3);
        background: var(--qavo-color-error-surface);
        color: var(--qavo-color-error);
        border-radius: var(--qavo-radius-radius-md);
        font-size: var(--qavo-typography-font-size-sm);
      }
      .qavo-login__footer { margin-top: var(--qavo-spacing-space4); text-align: center; }
      .qavo-login__footer a { color: var(--qavo-color-link); }
    `,
  ],
})
export class QavoLoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly config = inject(AUTH_LOGIN_CONFIG, { optional: true }) ?? DEFAULT_AUTH_LOGIN_CONFIG;

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    username: ['', [Validators.required, QavoValidators.notBlank()]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl ?? this.config.defaultRedirect);
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        this.handleError(error);
      },
    });
  }

  private handleError(error: unknown): void {
    if (error instanceof QavoError) {
      if (error.isValidation && error.problem) {
        applyServerErrors(this.form, error.problem);
        return;
      }
      this.formError.set(
        error.kind === 'unauthorized' ? 'Invalid username or password.' : error.message,
      );
      return;
    }
    this.formError.set('Sign in failed. Please try again.');
  }
}
