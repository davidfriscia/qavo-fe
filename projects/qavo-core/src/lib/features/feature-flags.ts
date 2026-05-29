import { InjectionToken, Injectable, Signal, computed, inject, signal } from '@angular/core';

/** Initial flag map, conventionally namespaced (e.g. `billing.invoices`). */
export type FeatureFlagMap = Record<string, boolean>;

export const QAVO_FEATURE_FLAGS = new InjectionToken<FeatureFlagMap>('QAVO_FEATURE_FLAGS');

/**
 * Lightweight feature-flag service mirroring the backend convention.
 *
 * Flags are seeded from configuration (typically environment-specific) and can
 * be toggled at runtime. It is intentionally minimal — not a replacement for a
 * full feature-management platform — covering environment-aware rollout, the
 * common case.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly flags = signal<FeatureFlagMap>(inject(QAVO_FEATURE_FLAGS, { optional: true }) ?? {});

  /** Imperative check. */
  isEnabled(flag: string): boolean {
    return this.flags()[flag] === true;
  }

  /** Reactive check, suitable for templates and computed state. */
  flag(name: string): Signal<boolean> {
    return computed(() => this.flags()[name] === true);
  }

  /** Override a flag at runtime (e.g. from a remote source or admin toggle). */
  set(flag: string, enabled: boolean): void {
    this.flags.update((current) => ({ ...current, [flag]: enabled }));
  }

  snapshot(): FeatureFlagMap {
    return { ...this.flags() };
  }
}
