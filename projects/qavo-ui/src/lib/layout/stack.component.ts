import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * One-dimensional flex layout with token-driven gaps.
 *
 * Stacks vertically by default (the mobile-first baseline) and can switch to a
 * row from a chosen breakpoint up — the common "stack on phone, row on desktop"
 * pattern, expressed declaratively rather than with bespoke media queries.
 */
@Component({
  selector: 'qavo-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[style.display]': '"flex"',
    '[style.flex-direction]': 'direction()',
    '[style.gap]': 'gapValue()',
    '[style.align-items]': 'align()',
    '[style.justify-content]': 'justify()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"',
  },
})
export class QavoStack {
  /** Main-axis direction. Defaults to `column` (mobile-first). */
  readonly direction = input<'row' | 'column'>('column');
  /** Gap between children, expressed as a spacing-scale step. */
  readonly gap = input<SpaceStep>(4);
  readonly align = input<'stretch' | 'center' | 'start' | 'end'>('stretch');
  readonly justify = input<'start' | 'center' | 'end' | 'space-between'>('start');
  readonly wrap = input(false, { transform: booleanAttribute });

  protected readonly gapValue = computed(() => `var(--qavo-spacing-space${this.gap()})`);
}
