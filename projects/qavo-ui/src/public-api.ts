/*
 * Public API Surface of @qavo/ui
 *
 * Accessible, responsive, token-driven Angular primitives: layout system,
 * components, form/validation infrastructure, feedback (toasts/dialogs) and the
 * responsive breakpoint service.
 */

// Responsive
export * from './lib/responsive/breakpoint.service';

// Layout
export * from './lib/layout/container.component';
export * from './lib/layout/stack.component';
export * from './lib/layout/grid.component';
export * from './lib/layout/shell.component';

// Components
export * from './lib/components/button.component';
export * from './lib/components/card.component';
export * from './lib/components/spinner.component';
export * from './lib/components/empty-state.component';
export * from './lib/components/theme-toggle.component';

// Forms & validation
export * from './lib/forms/validators';
export * from './lib/forms/validation-messages';
export * from './lib/forms/server-errors';
export * from './lib/forms/input.directive';
export * from './lib/forms/form-field.component';

// Feedback
export * from './lib/feedback/toast-container.component';
export * from './lib/feedback/toast.service';
export * from './lib/feedback/confirm-dialog.component';
export * from './lib/feedback/dialog.service';

// Accessibility
export * from './lib/a11y/autofocus.directive';

// Platform integration
export * from './lib/provide-ui';
