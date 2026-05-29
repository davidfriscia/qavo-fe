import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Structural directive that renders its content only when the current user holds
 * the required permission(s). Reactive: it shows/hides automatically when the
 * security context changes (e.g. after login/logout), because it reads the
 * `AuthService` signals.
 *
 * @example
 * ```html
 * <button *qavoHasPermission="'orders:write'">New order</button>
 * <section *qavoHasPermission="['reports:read','reports:export']; match: 'any'">…</section>
 * ```
 */
@Directive({ selector: '[qavoHasPermission]' })
export class HasPermissionDirective {
  private readonly auth = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  /** A single permission or a list. */
  readonly permission = input.required<string | string[]>({ alias: 'qavoHasPermission' });
  /** Require `all` (default) or `any` of the listed permissions. */
  readonly match = input<'all' | 'any'>('all', { alias: 'qavoHasPermissionMatch' });

  private readonly allowed = computed(() => {
    const required = this.permission();
    const list = Array.isArray(required) ? required : [required];
    if (list.length === 0) {
      return true;
    }
    return this.match() === 'all'
      ? this.auth.hasAllPermissions(list)
      : this.auth.hasAnyPermission(list);
  });

  private rendered = false;

  constructor() {
    effect(() => {
      const allowed = this.allowed();
      if (allowed && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }
}
