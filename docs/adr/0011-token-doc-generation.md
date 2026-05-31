# ADR 0011 — Token-contract documentation generated from a typed catalog

**Status:** Accepted (2026-05, with `0.1.0`); refines ADR 0003.

## Context

ADR 0003 established CSS custom properties driven by a typed token contract as
the single source of truth for theming. That contract lives in TypeScript
(`ColorTokens`, `TypographyTokens`, etc.), which is excellent for compile-time
safety inside the workspace — but useless to integrators reading the
documentation, who need to know *which* CSS variables exist, what each one is
*for*, and what its **default** light/dark value is. The previous answer to
"what tokens are there?" was "read the TypeScript types", which is neither
honest documentation nor a stable public contract.

Constraints:

- The contract is the source of truth, not the docs. Any documentation must be
  **generated from** the contract, never maintained alongside it, or the two
  drift on the very first PR that adds a token.
- Renaming or removing a token must be a **compile error** somewhere, not a
  documentation-review miss.
- The output has to be plain Markdown so it renders on GitHub and lives in
  `docs/` next to the rest of the platform documentation.
- The generator must run on a developer laptop and in CI with no extra
  dependencies beyond what the workspace already has.

## Decision

Introduce a small, typed `TOKEN_CATALOG` in `@qavo/theming` colocated with the
token contract:

```ts
type Catalog<T> = { [K in keyof T]-?: TokenDoc };

interface TokenDoc {
  purpose: string;
  classification: 'semantic' | 'structural' | 'responsive';
  themeDependent: boolean;
}

export const TOKEN_CATALOG = {
  color: { ... } satisfies Catalog<ColorTokens>,
  typography: { ... } satisfies Catalog<TypographyTokens>,
  // ... etc, one entry per Tokens interface
};
```

The mapped type `Catalog<T>` makes the catalog **structurally identical** to
the token interfaces: adding a token to `ColorTokens` produces a TS error
inside the catalog until a `TokenDoc` is added; removing a token from the
contract leaves an orphan in the catalog that the type system flags. The
documentation cannot drift.

`scripts/generate-token-docs.mjs` reads the **built** theming bundle (the
FESM in `dist/qavo-theming`) rather than the source, which means it sees
exactly what consumers see. The script joins `TOKEN_CATALOG` entries with
`LIGHT_THEME.tokens`, `DARK_THEME.tokens` and `BREAKPOINT_TOKENS` to produce
Markdown tables grouped by category, with columns *CSS variable · Purpose ·
Light default · Dark default · Classification*. The output is committed to
`docs/token-reference.md` with a "do not edit by hand" header and a
regeneration timestamp.

The script begins with `await import('@angular/compiler')` before any Angular
code is imported. ng-packagr emits **partial-compiled** output that requires
the JIT linker when loaded directly in Node; without this preload the very
first decorator hits a runtime error inside `@angular/common`. This is a
documented Angular requirement, just an unusual one to encounter outside of
testing harnesses.

A new root npm script wires it together:

```json
"docs:tokens": "ng build qavo-theming && node scripts/generate-token-docs.mjs"
```

## Alternatives considered

- **JSON Schema or a YAML manifest of tokens.** Would work but introduces a
  *second* place to declare every token, exactly the drift problem we are
  trying to eliminate. The TS contract is already the source of truth.
- **TypeDoc.** Excellent for API reference but doesn't model the theming
  semantics we want (per-token purpose, light vs dark default, semantic vs
  structural classification). A future ADR may add TypeDoc for the overall
  package APIs in parallel.
- **Storybook / docgen.** Solves a broader problem (a component gallery) and
  is on the roadmap, but it would be overkill as the *only* surface for the
  token reference and it doesn't render in the GitHub repo browser, which is
  where a developer first lands.
- **Read the source `.ts` directly with a TS parser.** Possible but slower
  and indirect; reading the built FESM means the generator validates that the
  theming library exports what it claims to export.

## Consequences

- `docs/token-reference.md` is now a real, accurate reference. Integrators
  can grep it, copy a CSS variable name, and use it.
- Adding a token requires three coordinated changes (the typed contract, the
  default theme values, the catalog entry) — and the type system enforces
  all three. Removing a token is just as enforced.
- The generator is one file (`scripts/generate-token-docs.mjs`) with no
  dependencies beyond the workspace's existing Angular install. CI can run
  it as a freshness check (out-of-date docs are a build failure) in a future
  iteration.
- The `@angular/compiler` preload requirement is documented in the script
  itself, so the next person running it in a new context will not have to
  rediscover it.
