# Releasing Qavo Frontend

Qavo Frontend releases are **tag-triggered**, **SemVer-versioned**, and **fully
auditable** from the GitHub Actions run page. This document describes how a
maintainer cuts a release and what the platform automates.

## Versioning

Every `@qavo/*` package is versioned in lockstep at the platform level — the
public API surface is a single platform contract and pre-1.0 minor bumps may
touch any of the libraries. After `1.0.0` the same SemVer rules apply
per-library, but the lockstep convention will continue unless a future ADR
formally relaxes it.

| Change | Bump |
|---|---|
| Breaking change to any `@qavo/*` public API or token contract | MAJOR |
| Additive change (new public export, new token, new plugin) | MINOR |
| Bug fix, no public-API change | PATCH |

Pre-`1.0.0` minor releases may include breaking changes; this is explicit in
the [README maturity disclaimer](../README.md#maturity-disclaimer) and the
[capabilities matrix](capabilities-matrix.md).

## What the workflows do

### `ci.yml` (pull requests + main)

1. install dependencies reproducibly (`npm ci`),
2. build every library in dependency order (`npm run build:libs`),
3. build the reference application (`npm run build:app`),
4. run unit tests (`npm test -- --watch=false`),
5. run the Playwright smoke suite on the desktop project,
6. upload the Playwright report as an artifact on failure.

The CI workflow runs the same commands a maintainer runs locally; there are no
CI-only build flags. A green CI run is the precondition for cutting a tag.

### `release.yml` (tag push `vX.Y.Z` or `vX.Y.Z-*`)

1. derive the release version from the tag (`v0.1.0` → `0.1.0`) and pick the
   npm dist-tag (`latest` for stable, `next` for pre-releases),
2. **verify** every `projects/qavo-*/package.json` already declares that exact
   version — otherwise the workflow fails before publishing,
3. install, build the libraries, run the unit-test suite,
4. publish every `@qavo/*` package to npm with **npm provenance**
   (`npm publish --access public --provenance`),
5. extract the matching section from [`CHANGELOG.md`](../CHANGELOG.md) and
   open a GitHub Release with that content.

## How a maintainer cuts a release

1. Make sure `main` is green on CI.
2. Update every `projects/qavo-*/package.json` to the new version
   (`X.Y.Z`). Keep the inter-package `peerDependencies` ranges in sync (a
   minor or patch bump in one package should bump the matching `^X.Y.Z`
   ranges in every package that depends on it).
3. Add a `## [X.Y.Z] - YYYY-MM-DD` section to `CHANGELOG.md` describing
   what changed.
4. Commit, push, open a PR; once it merges, tag the merge commit:

   ```bash
   git tag -a vX.Y.Z -m "Release X.Y.Z"
   git push origin vX.Y.Z
   ```

5. Watch the **Release** workflow. On success, packages are live on npm and a
   GitHub Release page exists for the tag.

## Required repository secrets

| Secret | Purpose |
|---|---|
| `NPM_TOKEN` | An npm automation token for the `@qavo` scope with `publish` permission. Mandatory. |

`GITHUB_TOKEN` is provided by the runner and is sufficient for creating the
GitHub Release and for npm provenance (it consumes the runner's OIDC identity).

> **Never** put either secret in the repository; both are configured under
> *Settings → Secrets and variables → Actions*.

## Pre-`1.0.0` limitations

- **All packages release in lockstep.** Independent per-library versioning is
  designed for but not yet active.
- **Changelogs are hand-curated.** Conventional-commits-driven changelog
  generation is on the roadmap but not yet wired.
- **Playwright runs on the `desktop` project only in CI.** Mobile-viewport
  coverage runs locally via `npx playwright test` so it stays cheap on every
  PR. A scheduled cross-project run is on the roadmap.
- **`latest` is the default dist-tag.** To publish a pre-release, tag with a
  suffix (e.g. `v0.2.0-rc.1`); the workflow will choose `next` automatically.

## Rolling back a release

`@qavo/*` packages are independently consumable, so a faulty release is
mitigated by publishing a fixed PATCH. Avoid `npm unpublish` except for the
narrow 72-hour window allowed by npm policy; even then, prefer a deprecation
notice (`npm deprecate @qavo/<pkg>@X.Y.Z 'use X.Y.Z+1'`) so downstream
consumers learn about the issue when they install.
