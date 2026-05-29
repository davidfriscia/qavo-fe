import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

/**
 * A themed surface for grouping content, with optional header and footer slots.
 * Elevation, radius, borders and surface color are all token-driven.
 */
@Component({
  selector: 'qavo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (heading()) {
      <header class="qavo-card__header">
        <h3 class="qavo-card__title">{{ heading() }}</h3>
        <ng-content select="[card-actions]" />
      </header>
    }
    <div class="qavo-card__body">
      <ng-content />
    </div>
    <ng-content select="[card-footer]" />
  `,
  host: {
    class: 'qavo-card',
    '[attr.data-elevation]': 'elevation()',
  },
  styles: [
    `
      .qavo-card {
        display: block;
        background: var(--qavo-color-surface);
        color: var(--qavo-color-on-surface);
        border: var(--qavo-border-border-width-thin) solid var(--qavo-color-border);
        border-radius: var(--qavo-radius-radius-lg);
        padding: var(--qavo-spacing-space6);
        box-shadow: var(--qavo-elevation-elevation1);
      }
      .qavo-card[data-elevation='0'] { box-shadow: var(--qavo-elevation-elevation0); }
      .qavo-card[data-elevation='2'] { box-shadow: var(--qavo-elevation-elevation2); }
      .qavo-card[data-elevation='3'] { box-shadow: var(--qavo-elevation-elevation3); }
      .qavo-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--qavo-spacing-space3);
        margin-bottom: var(--qavo-spacing-space4);
      }
      .qavo-card__title {
        margin: 0;
        font-size: var(--qavo-typography-font-size-lg);
        font-weight: var(--qavo-typography-font-weight-semibold);
      }
    `,
  ],
})
export class QavoCard {
  readonly heading = input<string>('');
  /** Shadow depth 0–3. Accepts a numeric attribute (`elevation="2"`). */
  readonly elevation = input(1, { transform: numberAttribute });
}
