import {
  EnvironmentProviders,
  InjectionToken,
  Injectable,
  Provider,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { ROUTES, Routes } from '@angular/router';

/**
 * Descriptor a plugin registers about itself, for introspection and diagnostics.
 * The behavioral contribution (providers, routes) is supplied alongside it via
 * {@link provideQavoPlugin}.
 */
export interface QavoPlugin {
  readonly id: string;
  readonly version?: string;
  readonly description?: string;
}

/** Multi-token collecting every registered plugin descriptor. */
export const QAVO_PLUGINS = new InjectionToken<QavoPlugin[]>('QAVO_PLUGINS');

/** Everything a plugin contributes when it self-registers. */
export interface QavoPluginDefinition {
  /** Identity/version metadata. */
  plugin: QavoPlugin;
  /** Providers (services, config tokens, interceptors) the plugin adds. */
  providers?: (Provider | EnvironmentProviders)[];
  /**
   * Lazy-loadable routes the plugin exposes. Contributed via the Angular
   * `ROUTES` multi-token, so the application's `provideRouter(...)` picks them
   * up automatically — the plugin mounts itself without the host editing route
   * tables. (Keep a global wildcard fallback last; see `provideNotFoundRoute`.)
   */
  routes?: Routes;
}

/**
 * The single entry point a frontend plugin uses to self-register with the
 * platform. Each plugin's public `provideXxx()` delegates to this, which is what
 * makes plugins independently removable: drop the `provideXxx()` call and the
 * plugin's providers, routes and descriptor all leave with it.
 */
export function provideQavoPlugin(definition: QavoPluginDefinition): EnvironmentProviders {
  const providers: (Provider | EnvironmentProviders)[] = [
    { provide: QAVO_PLUGINS, useValue: definition.plugin, multi: true },
    ...(definition.providers ?? []),
  ];
  if (definition.routes && definition.routes.length > 0) {
    providers.push({ provide: ROUTES, useValue: definition.routes, multi: true });
  }
  return makeEnvironmentProviders(providers);
}

/** Read-only view of the plugins active in the running application. */
@Injectable({ providedIn: 'root' })
export class PluginRegistry {
  private readonly plugins = inject(QAVO_PLUGINS, { optional: true }) ?? [];

  list(): readonly QavoPlugin[] {
    return this.plugins;
  }

  has(pluginId: string): boolean {
    return this.plugins.some((plugin) => plugin.id === pluginId);
  }

  get(pluginId: string): QavoPlugin | undefined {
    return this.plugins.find((plugin) => plugin.id === pluginId);
  }
}
