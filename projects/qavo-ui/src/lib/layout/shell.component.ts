import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointService } from '../responsive/breakpoint.service';

/** A primary navigation entry rendered by {@link QavoShell}. */
export interface ShellNavItem {
  label: string;
  /** Router link target. */
  route: string | unknown[];
  /** Optional permission gating visibility (checked by the host, see docs). */
  permission?: string;
}

/**
 * Adaptive application shell — the canonical responsive navigation pattern.
 *
 * One component, every device: a persistent side navigation on desktop collapses
 * into an off-canvas drawer with a hamburger toggle on handsets, driven by the
 * shared {@link BreakpointService}. There is no separate mobile layout. Brand and
 * header actions are projected; the routed content is the default slot and is
 * focusable as a skip target for keyboard users.
 */
@Component({
  selector: 'qavo-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a class="qavo-shell__skip" href="#qavo-main">Skip to content</a>
    <header class="qavo-shell__header">
      @if (!breakpoints.isDesktopUp()) {
        <button
          type="button"
          class="qavo-shell__toggle"
          [attr.aria-expanded]="drawerOpen()"
          aria-controls="qavo-nav"
          aria-label="Toggle navigation"
          (click)="toggleDrawer()"
        >
          ☰
        </button>
      }
      <div class="qavo-shell__brand"><ng-content select="[shell-brand]" /></div>
      <div class="qavo-shell__actions"><ng-content select="[shell-actions]" /></div>
    </header>

    <div class="qavo-shell__body">
      <nav
        id="qavo-nav"
        class="qavo-shell__nav"
        [class.qavo-shell__nav--open]="drawerOpen()"
        [attr.aria-hidden]="!breakpoints.isDesktopUp() && !drawerOpen() ? true : null"
        aria-label="Primary navigation"
      >
        @for (item of items(); track item.label) {
          <a
            class="qavo-shell__nav-link"
            [routerLink]="item.route"
            routerLinkActive="qavo-shell__nav-link--active"
            (click)="closeDrawer()"
          >
            {{ item.label }}
          </a>
        }
      </nav>

      @if (!breakpoints.isDesktopUp() && drawerOpen()) {
        <div class="qavo-shell__scrim" (click)="closeDrawer()"></div>
      }

      <main id="qavo-main" class="qavo-shell__content" tabindex="-1">
        <ng-content />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        background: var(--qavo-color-background);
        color: var(--qavo-color-on-background);
      }
      .qavo-shell__skip {
        position: absolute;
        left: -999px;
        top: var(--qavo-spacing-space2);
        background: var(--qavo-color-surface);
        color: var(--qavo-color-primary);
        padding: var(--qavo-spacing-space2) var(--qavo-spacing-space4);
        border-radius: var(--qavo-radius-radius-md);
        z-index: var(--qavo-z-index-z-tooltip);
      }
      .qavo-shell__skip:focus { left: var(--qavo-spacing-space2); }
      .qavo-shell__header {
        position: sticky;
        top: 0;
        z-index: var(--qavo-z-index-z-sticky);
        display: flex;
        align-items: center;
        gap: var(--qavo-spacing-space3);
        height: 3.5rem;
        padding-inline: var(--qavo-spacing-space4);
        background: var(--qavo-color-surface);
        border-bottom: var(--qavo-border-border-width-thin) solid var(--qavo-color-border);
      }
      .qavo-shell__brand { font-weight: var(--qavo-typography-font-weight-bold); }
      .qavo-shell__actions { margin-inline-start: auto; display: flex; align-items: center; gap: var(--qavo-spacing-space2); }
      .qavo-shell__toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--qavo-color-icon);
        padding: var(--qavo-spacing-space1);
      }
      .qavo-shell__toggle:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--qavo-border-focus-ring-width) var(--qavo-color-focus-ring);
        border-radius: var(--qavo-radius-radius-sm);
      }
      .qavo-shell__body { display: flex; flex: 1; min-height: 0; }
      .qavo-shell__nav {
        display: flex;
        flex-direction: column;
        gap: var(--qavo-spacing-space1);
        padding: var(--qavo-spacing-space4);
        background: var(--qavo-color-surface);
        border-inline-end: var(--qavo-border-border-width-thin) solid var(--qavo-color-border);
      }
      .qavo-shell__nav-link {
        padding: var(--qavo-spacing-space2) var(--qavo-spacing-space3);
        border-radius: var(--qavo-radius-radius-md);
        color: var(--qavo-color-text-secondary);
        text-decoration: none;
        font-weight: var(--qavo-typography-font-weight-medium);
      }
      .qavo-shell__nav-link:hover { background: var(--qavo-color-hover-overlay); color: var(--qavo-color-text-primary); }
      .qavo-shell__nav-link--active { background: var(--qavo-color-selected); color: var(--qavo-color-primary); }
      .qavo-shell__nav-link:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--qavo-border-focus-ring-width) var(--qavo-color-focus-ring);
      }
      .qavo-shell__content { flex: 1; min-width: 0; padding: var(--qavo-spacing-space6) var(--qavo-spacing-space4); }
      .qavo-shell__content:focus { outline: none; }

      /* Mobile-first baseline: nav is an off-canvas drawer. */
      .qavo-shell__nav {
        position: fixed;
        inset-block: 3.5rem 0;
        inset-inline-start: 0;
        width: min(80vw, 18rem);
        transform: translateX(-100%);
        transition: transform var(--qavo-motion-duration-normal) var(--qavo-motion-easing-standard);
        z-index: var(--qavo-z-index-z-drawer);
      }
      .qavo-shell__nav--open { transform: translateX(0); }
      .qavo-shell__scrim {
        position: fixed;
        inset: 3.5rem 0 0 0;
        background: var(--qavo-color-overlay);
        z-index: calc(var(--qavo-z-index-z-drawer) - 1);
      }

      /* Desktop and up: nav becomes a persistent sidebar. */
      @media (min-width: 1024px) {
        .qavo-shell__nav {
          position: static;
          inset: auto;
          width: 16rem;
          transform: none;
          transition: none;
        }
        .qavo-shell__toggle { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        .qavo-shell__nav { transition: none; }
      }
    `,
  ],
})
export class QavoShell {
  protected readonly breakpoints = inject(BreakpointService);
  readonly items = input<ShellNavItem[]>([]);

  protected readonly drawerOpen = signal(false);

  toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }
  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
