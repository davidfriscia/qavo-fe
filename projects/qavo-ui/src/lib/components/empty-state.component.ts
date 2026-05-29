import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Unified surface for empty, error and "no results" states.
 *
 * Centralizing this guarantees that "nothing here yet" and "something went
 * wrong" look and read consistently across every application and plugin. The
 * `tone` selects the appropriate semantic status color.
 */
@Component({
  selector: 'qavo-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="qavo-empty" [attr.data-tone]="tone()">
      <h3 class="qavo-empty__title">{{ title() }}</h3>
      @if (description()) {
        <p class="qavo-empty__description">{{ description() }}</p>
      }
      <div class="qavo-empty__actions">
        <ng-content />
      </div>
    </div>
  `,
  host: { role: 'note' },
  styles: [
    `
      .qavo-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--qavo-spacing-space3);
        padding: var(--qavo-spacing-space10) var(--qavo-spacing-space4);
        color: var(--qavo-color-text-secondary);
      }
      .qavo-empty__title {
        margin: 0;
        font-size: var(--qavo-typography-font-size-lg);
        font-weight: var(--qavo-typography-font-weight-semibold);
        color: var(--qavo-color-text-primary);
      }
      .qavo-empty[data-tone='error'] .qavo-empty__title { color: var(--qavo-color-error); }
      .qavo-empty__description { margin: 0; max-width: 40ch; }
      .qavo-empty__actions { margin-top: var(--qavo-spacing-space2); }
      .qavo-empty__actions:empty { display: none; }
    `,
  ],
})
export class QavoEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly tone = input<'neutral' | 'error'>('neutral');
}
