import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A centered, width-constrained content container.
 *
 * Widths come from the spacing tokens (`container-*`) and horizontal padding
 * scales with the viewport, so page gutters are consistent everywhere and
 * comfortable from phone to wide desktop.
 */
@Component({
  selector: 'qavo-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.data-size]': 'size()',
  },
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        margin-inline: auto;
        padding-inline: var(--qavo-spacing-space4);
      }
      @media (min-width: 600px) {
        :host {
          padding-inline: var(--qavo-spacing-space6);
        }
      }
      :host([data-size='sm']) { max-width: var(--qavo-spacing-container-sm); }
      :host([data-size='md']) { max-width: var(--qavo-spacing-container-md); }
      :host([data-size='lg']) { max-width: var(--qavo-spacing-container-lg); }
      :host([data-size='xl']) { max-width: var(--qavo-spacing-container-xl); }
      :host([data-size='full']) { max-width: none; }
    `,
  ],
})
export class QavoContainer {
  /** Maximum content width. Defaults to `lg`. */
  readonly size = input<'sm' | 'md' | 'lg' | 'xl' | 'full'>('lg');
}
