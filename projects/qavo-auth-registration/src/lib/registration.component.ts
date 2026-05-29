import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService, QavoError } from '@qavo/core';
import {
  QavoAutofocus,
  QavoButton,
  QavoCard,
  QavoEmptyState,
  QavoFormField,
  QavoInput,
  QavoValidators,
  applyServerErrors,
} from '@qavo/ui';
import {
  AUTH_REGISTRATION_CONFIG,
  AuthRegistrationConfig,
  DEFAULT_AUTH_REGISTRATION_CONFIG,
} from './registration-config';
import { RegistrationService } from './registration.service';

/**
 * Themed self-service sign-up screen.
 *
 * Showcases cross-field validation (password confirmation), the shared
 * strong-password validator mirroring the backend policy, and server-error
 * reconciliation. When self-service is disabled via configuration, it renders an
 * informative empty state instead of the form — behavior tuned by config, the
 * plugin still imported.
 */
@Component({
  selector: 'qavo-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    QavoCard,
    QavoButton,
    QavoFormField,
    QavoInput,
    QavoAutofocus,
    QavoEmptyState,
  ],
  template: `
    <div class="qavo-register">
      <qavo-card heading="Create your account" elevation="2">
        @if (!config.selfService) {
          <qavo-empty-state
            title="Registration is closed"
            description="Self-service sign-up is currently disabled. Please contact an administrator."
          />
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            @if (formError()) {
              <p class="qavo-register__error" role="alert">{{ formError() }}</p>
            }

            <qavo-form-field label="Username" [control]="form.controls.username" [required]="true">
              <input qavoInput qavoAutofocus type="text" autocomplete="username" formControlName="username" />
            </qavo-form-field>

            <qavo-form-field label="Email" [control]="form.controls.email" [required]="true">
              <input qavoInput type="email" autocomplete="email" formControlName="email" />
            </qavo-form-field>

            <qavo-form-field
              label="Password"
              [control]="form.controls.password"
              [required]="true"
              hint="At least {{ config.passwordMinLength }} characters, mixed case and a digit."
            >
              <input qavoInput type="password" autocomplete="new-password" formControlName="password" />
            </qavo-form-field>

            <qavo-form-field label="Confirm password" [control]="form.controls.confirmPassword" [required]="true">
              <input qavoInput type="password" autocomplete="new-password" formControlName="confirmPassword" />
            </qavo-form-field>

            <button qavoButton type="submit" [block]="true" [loading]="submitting()">
              Create account
            </button>
          </form>
        }
      </qavo-card>
    </div>
  `,
  styles: [
    `
      .qavo-register {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-block: var(--qavo-spacing-space10);
      }
      qavo-card { width: min(28rem, 100%); }
      .qavo-register__error {
        margin: 0 0 var(--qavo-spacing-space4);
        padding: var(--qavo-spacing-space3);
        background: var(--qavo-color-error-surface);
        color: var(--qavo-color-error);
        border-radius: var(--qavo-radius-radius-md);
        font-size: var(--qavo-typography-font-size-sm);
      }
    `,
  ],
})
export class QavoRegistrationComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly registration = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  protected readonly config: AuthRegistrationConfig =
    inject(AUTH_REGISTRATION_CONFIG, { optional: true }) ?? DEFAULT_AUTH_REGISTRATION_CONFIG;

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.group(
    {
      username: ['', [Validators.required, QavoValidators.notBlank()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, QavoValidators.strongPassword(this.config.passwordMinLength)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [QavoValidators.matchControls('password', 'confirmPassword')] },
  );

  submit(): void {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const { username, email, password } = this.form.getRawValue();
    this.registration.register({ username, email, password }).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.notifications.success(
          'Account created',
          result.pendingVerification
            ? 'Check your inbox to verify your email.'
            : 'You can now sign in.',
        );
        void this.router.navigateByUrl(this.config.successRoute);
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        if (error instanceof QavoError && error.isValidation && error.problem) {
          applyServerErrors(this.form, error.problem);
        } else {
          this.formError.set(
            error instanceof QavoError ? error.message : 'Registration failed. Please try again.',
          );
        }
      },
    });
  }
}
