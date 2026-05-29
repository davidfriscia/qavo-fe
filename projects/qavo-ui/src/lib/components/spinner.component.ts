import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Accessible loading indicator. Announces itself to assistive technology via
 * `role="status"` and respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'qavo-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="qavo-spinner__ring" [style.width.px]="diameter()" [style.height.px]="diameter()"></span>
    <span class="qavo-spinner__label">{{ label() }}</span>
  `,
  host: {
    role: 'status',
    'aria-live': 'polite',
    class: 'qavo-spinner',
  },
  styles: [
    `
      .qavo-spinner {
        display: inline-flex;
        align-items: center;
        gap: var(--qavo-spacing-space2);
        color: var(--qavo-color-text-secondary);
      }
      .qavo-spinner__ring {
        display: inline-block;
        border: 3px solid var(--qavo-color-border-strong);
        border-top-color: var(--qavo-color-primary);
        border-radius: var(--qavo-radius-radius-full);
        animation: qavo-spinner-spin var(--qavo-motion-duration-slow) linear infinite;
      }
      .qavo-spinner__label {
        font-size: var(--qavo-typography-font-size-sm);
      }
      .qavo-spinner__label:empty {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      }
      @keyframes qavo-spinner-spin {
        to { transform: rotate(360deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .qavo-spinner__ring { animation-duration: 1.5s; }
      }
    `,
  ],
})
export class QavoSpinner {
  readonly diameter = input<number>(24);
  /** Accessible label; rendered visually next to the ring when non-empty. */
  readonly label = input<string>('Loading…');
}
