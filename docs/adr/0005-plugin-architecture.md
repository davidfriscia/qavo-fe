# ADR 0005 — Plugins for distribution, configuration for behavior

**Status:** Accepted

## Context

Capabilities such as login and registration could be (a) selectable plugins an
application imports, or (b) all built into the core and toggled by flags. The
architecture evaluates this explicitly (§6.1) and chooses plugins.

## Decision

Deliver each optional capability as an **independently versioned npm package** that
**self-registers** through `provideQavoPlugin`. Granularity:

- **Modularity is the unit of distribution and existence** (build time): the
  application chooses which `provideXxx()` to call. What is not imported does not
  exist in the app — no dead code, no extra attack surface.
- **Configuration is the unit of activation and behavior** (runtime): once imported,
  a plugin is tuned via a config token (fields, policies, `selfService`, …).

Mechanically, a plugin contributes its descriptor (to the `QAVO_PLUGINS` multi-token,
for introspection via `PluginRegistry`), its providers, and its routes (via the
Angular `ROUTES` multi-token, so the host's `provideRouter` mounts them
automatically). Removing the `provideXxx()` call removes the capability entirely.

## Alternatives considered

- **Everything in core, toggled by flags.** Convenient but ages badly: every app
  carries unused code and attack surface, and every core release risks unrelated
  features — the "God module" anti-pattern.

## Consequences

- The core stays small and stable; plugins evolve and release independently.
- Clean, enforced API boundary between core and plugins.
- Applications compose exactly the platform they need.
- A global wildcard route must be registered *after* plugin routes
  (`provideNotFoundRoute` last) so it never shadows them.
