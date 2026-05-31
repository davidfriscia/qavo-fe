# ADR 0012 — Unit-test baseline: invariants over coverage percentage

**Status:** Accepted (2026-05, with `0.1.0`)

## Context

The `0.0.0` foundation shipped with `@qavo/testing` and example specs but no
real test pass across the seven `@qavo/*` libraries. For a platform whose
*contract* with applications is a set of injection tokens, interceptors and
pure helpers, "the tests pass" is the strongest credibility signal we can
give. Coverage percentage, however, is not — a 90 %-covered library can still
miss the one behavior that matters (a base-URL interceptor that quietly
double-prefixes absolute URLs, a PKCE verifier that breaks RFC 7636 encoding,
a theme service that fails to honor `prefers-color-scheme` after the user
explicitly chose a mode).

Constraints:

- Angular 21 ships `@angular/build:unit-test` (Vitest under the hood); we are
  not going to introduce Karma or Jest.
- Specs must run in CI on every push/PR and gate the release workflow.
- New maintainers (and an AI assistant) should be able to read a spec file
  and immediately understand which **invariant** of the platform it locks in,
  without having to chase test setup through several helpers.

## Decision

Adopt a baseline strategy of **one spec per invariant**, organized by what
the platform promises rather than by code shape:

- **Standards conformance.** PKCE verifier/challenge tested against RFC 7636
  vectors; Problem Details parsing tested against RFC 9457 example payloads.
  These specs fail the moment we drift from a published standard.
- **Interceptor contracts.** `base-url`, `auth-token`, `trace` each have a
  spec asserting only what the platform documents:
  - logical paths get the configured prefix, absolute and already-prefixed
    URLs pass through untouched;
  - the bearer header is attached when (and only when) the strategy reports
    a session;
  - a W3C `traceparent` is generated, propagated and visible to subsequent
    logging.
- **Extension points.** `PluginRegistry` registers and lists plugins;
  `QAVO_ERROR_MAPPERS` lets a consumer translate a domain error into a
  navigation. These are the seams integrators rely on.
- **State machines.** `FeatureFlags` honors config seeding and runtime
  override, `Logger` emits structured records with `appName` + `traceId`,
  `ThemeService` resolves `system` against `prefers-color-scheme` and pins
  to the user's explicit choice once made.
- **OIDC primitives.** Pure-function PKCE and the `SessionStorageOidcStateStore`
  TTL + one-shot semantics. The orchestrating strategy itself is exercised
  via the smaller pieces; a strategy-level spec is on the roadmap once we
  validate against a real IdP.
- **Forms.** Reusable validators and the server-error reconciliation that
  maps RFC 9457 field errors onto `AbstractControl.setErrors`.
- **Plugins.** Each plugin has at least one spec confirming it self-registers
  with the platform registry (login, registration).

Specs use vitest globals (`describe`/`it`/`expect`/`beforeEach`), Angular's
`TestBed.configureTestingModule`, `HttpTestingController` /
`provideHttpClientTesting`, and `firstValueFrom` for observable assertions.
No spec mocks more than it needs to.

The release workflow runs the full suite on the tagged commit; a failing spec
blocks publication.

## Alternatives considered

- **Coverage threshold (e.g. 80 %).** Easy to game, easy to ignore. Forces
  invariant-shaped questions to fit a percentage-shaped report. We may add
  coverage *reporting* later for visibility, but not coverage *gates*.
- **One large `e2e` against everything.** Useful, and Playwright smoke specs
  already cover the reference app, but slow and noisy as a per-PR signal.
  Unit specs catch contract regressions faster and with clearer blame.
- **Snapshot tests for component rendering.** Fragile against intentional
  token / style changes (which are the whole point of token-driven theming).
  We rely on a11y + behavior assertions instead.

## Consequences

- The baseline today is ~70 specs across all seven libraries plus the
  reference app, all passing in CI. Each spec is short, focused, and
  documents an invariant in its `describe` name.
- New behavior added to the platform should add or update an invariant spec;
  PR review explicitly looks for this.
- The contract is now executable: a refactor that silently changes the
  base-URL semantics, the trace header name, the PKCE encoding or the theme
  resolution rule turns red on the first CI run.
- The deliberate gap is end-to-end OIDC validation against a real IdP. This
  is on the P1 roadmap and will likely take the form of a Playwright test
  against Keycloak in a container.
