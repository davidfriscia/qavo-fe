# ADR 0009 — Release automation: tag-triggered npm publishing

**Status:** Accepted (2026-05, with `0.1.0`)

## Context

The `0.0.0` foundation built and packaged every `@qavo/*` library cleanly with
ng-packagr but had no automation: there was no continuous integration on pushes,
no canonical place that ran the tests, and no path from "I tagged a release" to
"the package is on npm". For a platform whose value proposition is *being a
platform* — consumed by applications via the registry — this gap directly
undermined credibility.

Constraints that shaped the decision:

- The monorepo ships **multiple** packages from a single workspace; their
  versions must move together until `1.0.0` to keep peer-dependency ranges
  coherent (see ADR 0002).
- The platform is open source under MIT and intended for installation by anyone
  with `npm install @qavo/core`, so publishing has to be authentic and
  reproducible, not "ran from a maintainer's laptop".
- We want **one** trigger for a release — pushing a `vX.Y.Z` git tag — not a
  manual ordered click-path that humans can get wrong.
- Pre-1.0 SemVer is in force, and `CHANGELOG.md` is the canonical history. The
  release notes shown on GitHub should match the changelog exactly.

## Decision

Adopt a **two-workflow** GitHub Actions setup:

1. **`.github/workflows/ci.yml`** runs on every push and pull request: install,
   build every library, run unit tests (`@angular/build:unit-test` → Vitest),
   build the reference app, run Playwright smoke specs. This is the gate that
   makes a tag *publishable*.

2. **`.github/workflows/release.yml`** runs on `push` of a tag matching `v*`:
   - `scripts/verify-package-versions.mjs` asserts that every `@qavo/*`
     `package.json` and the root `package.json` declare exactly the tag's
     version. The build aborts if any are out of sync. This enforces lockstep
     pre-1.0 releases without trusting humans to remember.
   - The full library build + unit tests run again on the tagged commit.
   - `scripts/publish-packages.mjs` runs `npm publish --provenance --access public`
     for each built package in `dist/` (skipping already-published versions so
     the workflow is idempotent on retry).
   - `scripts/extract-changelog.mjs` reads the matching `[X.Y.Z]` section out of
     `CHANGELOG.md` and feeds it into `actions/create-release` so the GitHub
     Release notes are exactly the changelog entry.

Each package is published to the public `@qavo` npm scope with **provenance**,
linking the artifact back to the exact workflow run, repo and commit. The
`NPM_TOKEN` is a maintainer-scoped automation token stored as a repository
secret; it is the only credential the workflow uses.

## Alternatives considered

- **Lerna / Nx Release / Changesets.** These solve the same problem more
  generally, but they pull a heavyweight orchestration layer into a workspace
  that already has ng-packagr building artifacts in the right place. The
  ~120-line custom script is easier to read, easier to debug, and has zero
  marginal dependencies. We can adopt one of these tools later if the
  package count grows beyond what a script comfortably handles.
- **Independently versioned packages from day one.** Worth doing eventually,
  but pre-1.0 it would force consumers to reason about a matrix of compatible
  versions instead of `^0.x.y`. Defer until `1.0.0`.
- **Publishing from a maintainer's laptop.** Faster to set up, impossible to
  audit, easy to get wrong, and contributes no supply-chain provenance. Out.

## Consequences

- A release is a one-line operation: `git tag v0.1.0 && git push --tags`. CI
  does the rest, including failing loudly if versions drift.
- Every published artifact has npm provenance, which surfaces in the npm UI and
  in any SBOM-aware tooling downstream.
- Maintainers must remember to update `CHANGELOG.md` *before* tagging — the
  changelog extraction is intentionally not lenient, because a release without
  notes is a release with nothing to say.
- The dual workflow keeps the "did it build green?" question separate from the
  "did it publish?" question, so a broken publish step doesn't poison the main
  branch status.
