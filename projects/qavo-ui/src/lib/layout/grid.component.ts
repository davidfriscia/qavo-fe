import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * Responsive auto-fitting grid.
 *
 * Columns are sized with `auto-fit` + `minmax`, so the grid reflows naturally
 * from one column on a phone to many on a wide screen with no breakpoint
 * bookkeeping — a single rule covers every device.
 */
@Component({
  selector: 'qavo-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[style.display]': '"grid"',
    '[style.gap]': 'gapValue()',
    '[style.grid-template-columns]': 'columns()',
  },
})
export class QavoGrid {
  /** Minimum comfortable column width before the grid adds another column. */
  readonly minColumnWidth = input<string>('16rem');
  /** Gap between cells, as a spacing-scale step. */
  readonly gap = input<SpaceStep>(4);

  protected readonly gapValue = computed(() => `var(--qavo-spacing-space${this.gap()})`);
  protected readonly columns = computed(
    () => `repeat(auto-fit, minmax(min(${this.minColumnWidth()}, 100%), 1fr))`,
  );
}
