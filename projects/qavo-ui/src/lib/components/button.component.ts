import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Themed, accessible button.
 *
 * Applied to a native `<button>` or `<a>` so semantics, keyboard behavior and
 * focus come for free. All colors, spacing, radii, motion and focus rings are
 * token-driven, and a `loading` state sets `aria-busy` and a spinner while
 * disabling interaction.
 */
@Component({
  selector: 'button[qavoButton], a[qavoButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="qavo-btn__spinner" aria-hidden="true"></span>
    }
    <span class="qavo-btn__label"><ng-content /></span>
  `,
  host: {
    class: 'qavo-btn',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-block]': 'block() || null',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.disabled]': 'isDisabledAttr()',
    '[class.qavo-btn--loading]': 'loading()',
  },
  styles: [
    `
      .qavo-btn {
        --_bg: var(--qavo-color-primary);
        --_fg: var(--qavo-color-on-primary);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--qavo-spacing-space2);
        border: var(--qavo-border-border-width-thin) solid transparent;
        border-radius: var(--qavo-radius-radius-md);
        font-family: var(--qavo-typography-font-family-base);
        font-weight: var(--qavo-typography-font-weight-semibold);
        line-height: 1;
        cursor: pointer;
        text-decoration: none;
        background: var(--_bg);
        color: var(--_fg);
        transition: background-color var(--qavo-motion-duration-fast) var(--qavo-motion-easing-standard),
          box-shadow var(--qavo-motion-duration-fast) var(--qavo-motion-easing-standard);
        /* Touch-friendly minimum target size. */
        min-height: 2.75rem;
        padding-inline: var(--qavo-spacing-space4);
      }
      .qavo-btn[data-size='sm'] { min-height: 2.25rem; padding-inline: var(--qavo-spacing-space3); font-size: var(--qavo-typography-font-size-sm); }
      .qavo-btn[data-size='lg'] { min-height: 3.25rem; padding-inline: var(--qavo-spacing-space6); font-size: var(--qavo-typography-font-size-lg); }
      .qavo-btn[data-block] { display: flex; width: 100%; }
      .qavo-btn:hover { background: var(--qavo-color-primary-hover); }
      .qavo-btn:active { background: var(--qavo-color-primary-active); }
      .qavo-btn:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--qavo-border-focus-ring-width) var(--qavo-color-focus-ring);
      }
      .qavo-btn[data-variant='secondary'] {
        --_bg: transparent;
        --_fg: var(--qavo-color-primary);
        border-color: var(--qavo-color-border-strong);
      }
      .qavo-btn[data-variant='secondary']:hover { background: var(--qavo-color-hover-overlay); }
      .qavo-btn[data-variant='ghost'] {
        --_bg: transparent;
        --_fg: var(--qavo-color-text-primary);
      }
      .qavo-btn[data-variant='ghost']:hover { background: var(--qavo-color-hover-overlay); }
      .qavo-btn[data-variant='danger'] {
        --_bg: var(--qavo-color-error);
        --_fg: var(--qavo-color-on-error);
      }
      .qavo-btn[disabled],
      .qavo-btn[aria-busy='true'] {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
      }
      .qavo-btn__spinner {
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: var(--qavo-radius-radius-full);
        animation: qavo-btn-spin var(--qavo-motion-duration-slow) linear infinite;
      }
      @keyframes qavo-btn-spin {
        to { transform: rotate(360deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .qavo-btn { transition: none; }
        .qavo-btn__spinner { animation-duration: 1.5s; }
      }
    `,
  ],
})
export class QavoButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isDisabledAttr = computed(() =>
    this.disabled() || this.loading() ? '' : null,
  );
}
