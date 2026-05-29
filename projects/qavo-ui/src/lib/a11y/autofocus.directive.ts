import { AfterViewInit, Directive, ElementRef, booleanAttribute, inject, input } from '@angular/core';

/**
 * Moves focus to the host element once it is rendered — used to direct keyboard
 * and screen-reader users to the primary control of a view or dialog. Disable
 * per-instance by binding `[qavoAutofocus]="false"`.
 */
@Directive({ selector: '[qavoAutofocus]' })
export class QavoAutofocus implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly enabled = input(true, { alias: 'qavoAutofocus', transform: booleanAttribute });

  ngAfterViewInit(): void {
    if (this.enabled()) {
      // Defer to the next frame so layout/animation has settled.
      queueMicrotask(() => this.host.nativeElement.focus());
    }
  }
}
