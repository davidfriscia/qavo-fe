# ADR 0002 — Monorepo with independently published `@qavo/*` packages

**Status:** Accepted

## Context

The platform must evolve independently of applications and let each capability be
versioned and released on its own cadence (architecture §1, §3.2). Applications
should import the core plus only the plugins they need.

## Decision

Develop the platform as a **single Angular CLI workspace** containing one library
project per package, each built with **ng-packagr** and published independently to
npm under the **`@qavo` scope**. Specifics:

- Inter-package dependencies are declared as **peer dependencies**, so an
  application controls a single copy of Angular and of each `@qavo` package.
- Each library exposes an explicit public API via `public-api.ts`; nothing else is
  importable.
- TypeScript path mappings (`@qavo/*` → `dist/*`) let the workspace consume built
  libraries; build order follows the dependency DAG
  (`theming → core → http → ui → testing → plugins`), encoded in `npm run build:libs`.
- Versioning follows **Semantic Versioning**; the current version is `0.0.0`.

## Alternatives considered

- **One package, many entry points.** Simpler tooling, but couples release cadence
  and bloats every consumer with unused code — contrary to independent evolution.
- **Separate repos per package.** Maximum isolation, but heavy coordination
  overhead for a platform of this size; a monorepo with independent publishing gets
  most of the isolation benefit with far less friction.

## Consequences

- Capabilities release independently; a plugin fix doesn't touch the core.
- Tree-shaking and clean public APIs are preserved.
- Build order must be respected (tooling encodes it).
- A CI publishing pipeline is still required to automate releases (see roadmap).
