import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BREAKPOINT_TOKENS, BreakpointName, minWidthQuery } from '@qavo/theming';

/**
 * Centralized responsive state, derived from the shared breakpoint tokens.
 *
 * Mobile-first by construction: everything is expressed as "at least this tier".
 * Components read these signals instead of writing their own media queries, so
 * the whole platform shares one responsive vocabulary. Built on the CDK
 * `BreakpointObserver` so it is zone- and SSR-friendly.
 */
@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly observer = inject(BreakpointObserver);

  private readonly matches = toSignal(
    this.observer.observe([
      minWidthQuery('tablet'),
      minWidthQuery('desktop'),
      minWidthQuery('wide'),
    ]),
    { initialValue: { matches: false, breakpoints: {} as Record<string, boolean> } },
  );

  /** The active tier name. */
  readonly active: Signal<BreakpointName> = computed(() => {
    const bp: Record<string, boolean> = this.matches().breakpoints;
    if (bp[minWidthQuery('wide')]) return 'wide';
    if (bp[minWidthQuery('desktop')]) return 'desktop';
    if (bp[minWidthQuery('tablet')]) return 'tablet';
    return 'handset';
  });

  /** True on phones (below the tablet threshold). */
  readonly isHandset = computed(() => this.active() === 'handset');
  /** True from tablet width upward. */
  readonly isTabletUp = computed(() => BREAKPOINT_TOKENS[this.active()] >= BREAKPOINT_TOKENS.tablet);
  /** True from desktop width upward. */
  readonly isDesktopUp = computed(
    () => BREAKPOINT_TOKENS[this.active()] >= BREAKPOINT_TOKENS.desktop,
  );

  /** Reactive "is the viewport at least `tier` wide?" check. */
  isAtLeast(tier: BreakpointName): Signal<boolean> {
    return computed(() => BREAKPOINT_TOKENS[this.active()] >= BREAKPOINT_TOKENS[tier]);
  }
}
