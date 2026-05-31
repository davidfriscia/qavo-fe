/*
 * Public API Surface of @qavo/core
 *
 * The platform foundation: bootstrap, configuration, plugin registry, feature
 * flags, centralized error handling, structured logging, trace correlation, the
 * authentication abstraction and routing conventions.
 */

// Bootstrap & configuration
export * from './lib/config/qavo-config';
export * from './lib/config/api-base-url';
export * from './lib/config/environment';
export * from './lib/config/provide-qavo';

// Plugin system
export * from './lib/plugins/plugin';

// Feature flags
export * from './lib/features/feature-flags';

// Errors
export * from './lib/errors/problem-details';
export * from './lib/errors/qavo-error';
export * from './lib/errors/error-mapping';
export * from './lib/errors/global-error-handler';

// Notifications
export * from './lib/notifications/notification';

// Logging & tracing
export * from './lib/logging/logger';
export * from './lib/logging/trace';

// Authentication & authorization
export * from './lib/auth/auth-models';
export * from './lib/auth/auth-config';
export * from './lib/auth/auth.service';
export * from './lib/auth/local-auth.strategy';
export * from './lib/auth/oidc-auth.strategy';
export * from './lib/auth/oidc/pkce';
export * from './lib/auth/oidc/oidc-state-store';
export * from './lib/auth/oidc/oidc-token-client';
export * from './lib/auth/oidc/oidc-silent-renewal';
export * from './lib/auth/oidc/oidc-callback.component';
export * from './lib/auth/oidc/oidc-routes';
export * from './lib/auth/guards';
export * from './lib/auth/has-permission.directive';
export * from './lib/auth/provide-auth';

// Routing
export * from './lib/routing/title-strategy';
export * from './lib/routing/routing';
