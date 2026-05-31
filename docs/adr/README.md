# Architecture Decision Records

Significant decisions for **Qavo Frontend**, each with its context, the decision,
and its consequences. ADRs are immutable once accepted; a later ADR supersedes an
earlier one rather than editing it.

| # | Decision | Status |
|---|---|---|
| [0001](0001-frontend-framework.md) | Angular as the frontend framework | Accepted |
| [0002](0002-monorepo-and-packaging.md) | Monorepo with independently published `@qavo/*` packages | Accepted |
| [0003](0003-token-based-theming.md) | Token-based theming on CSS custom properties | Accepted |
| [0004](0004-mobile-first-responsive.md) | Mobile-first, single-codebase responsive strategy | Accepted |
| [0005](0005-plugin-architecture.md) | Plugins for distribution, configuration for behavior | Accepted |
| [0006](0006-component-library-choice.md) | Angular Material (+ CDK) as the optional component library | Accepted |
| [0007](0007-state-management.md) | Signals-first state; NgRx only when justified | Accepted |
| [0008](0008-component-design-philosophy.md) | Standalone, token-driven, accessible component design | Accepted |
| [0009](0009-release-automation.md) | Tag-triggered npm publishing with provenance | Accepted |
| [0010](0010-oidc-abstraction-completion.md) | OIDC strategy completed via composed, replaceable seams | Accepted |
| [0011](0011-token-doc-generation.md) | Token reference generated from a typed catalog | Accepted |
| [0012](0012-test-baseline-strategy.md) | Unit-test baseline: invariants over coverage percentage | Accepted |

These records implement the frontend choices of the reference architecture
(<https://github.com/davidfriscia/qavo>, §2.2, §5, §6).
