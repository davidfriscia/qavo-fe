import { Injectable, InjectionToken, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

/** The application's base title, appended to every page title. */
export const QAVO_APP_TITLE = new InjectionToken<string>('QAVO_APP_TITLE');

/**
 * Centralized page-title management.
 *
 * Routes declare their own `title`; this strategy composes it with the
 * application name into a consistent `"<page> · <app>"` document title, so every
 * Qavo application titles its tabs the same way without per-route boilerplate.
 */
@Injectable()
export class QavoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly appTitle = inject(QAVO_APP_TITLE, { optional: true }) ?? 'Qavo';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} · ${this.appTitle}` : this.appTitle);
  }
}
