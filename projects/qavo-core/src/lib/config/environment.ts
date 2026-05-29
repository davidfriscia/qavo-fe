/** Runtime environment classification. Drives environment-aware behavior across the platform. */
export type QavoEnvironmentName = 'development' | 'test' | 'production';

/**
 * The resolved environment descriptor.
 *
 * Applications pass `environment` into {@link QavoConfig}; the platform exposes
 * this typed view so cross-cutting code (logging verbosity, error detail, dev
 * warnings) can adapt without each feature re-deriving it.
 */
export interface QavoEnvironment {
  readonly name: QavoEnvironmentName;
  readonly production: boolean;
  readonly development: boolean;
  readonly test: boolean;
}

export function resolveEnvironment(name: QavoEnvironmentName = 'production'): QavoEnvironment {
  return {
    name,
    production: name === 'production',
    development: name === 'development',
    test: name === 'test',
  };
}
