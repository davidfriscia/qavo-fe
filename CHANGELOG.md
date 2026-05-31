# Changelog

All notable changes to Qavo Frontend are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added
- **CI & publishing pipeline.** GitHub Actions workflows for pull-request /
  main validation (build → unit tests → Playwright smoke) and tag-triggered
  releases that publish every `@qavo/*` package to npm with provenance and
  source CHANGELOG entries into GitHub Release notes.
- **OIDC abstraction completion.** Pluggable PKCE code-exchange client,
  session-scoped state store for the `state`/`code_verifier`/`returnUrl`
  triad, callback route registration (`provideOidcCallbackRoute`), optional
  scheduled silent renewal via the standard refresh-token grant, and a
  default token client built on Angular's `HttpClient`. The platform remains
  provider-agnostic; nothing in `@qavo/core` couples to a specific vendor.
- **Token contract documentation generator.** A Node script
  (`npm run docs:tokens`) emits `docs/token-reference.md` from a typed
  token-catalog module in `@qavo/theming`, classifying every token by
  category, purpose and SemVer impact.
- **Meaningful unit-test pass across every library.** New behavior-focused
  specs for the core bootstrap, error normalization, plugin registry,
  feature flags, trace helpers, structured logger, HTTP interceptors,
  theming engine, validators, server-error reconciliation, breakpoint
  service, the OIDC PKCE helpers, and the testing harness itself.
- **ADRs.** Records 0009–0012 capture the release-automation, OIDC
  completion, token-doc generation and test-baseline decisions.

### Changed
- All `@qavo/*` packages bumped to `0.1.0`. Peer dependencies on sibling
  `@qavo/*` packages now request `^0.1.0`.
- README, capabilities matrix and roadmap reflect the new honest maturity
  of CI/publishing, OIDC, testing and token documentation.

### Security
- PKCE `code_verifier`, `state` and `nonce` values are persisted in
  `sessionStorage` (cleared on tab close) by default, not `localStorage`.
- Refresh tokens, when present, are subject to the same in-memory-by-default
  policy as the access token; opt-in persistence is documented.

## [0.0.0] - Foundation

Initial platform foundation: Angular 21 monorepo, the seven `@qavo/*`
libraries, `provideQavo` bootstrap, token-based theming engine, HTTP
interceptor stack, responsive UI primitives, two auth plugins, testing
utilities and the reference application. See `docs/capabilities-matrix.md`
for the per-feature inventory.
