# ADR 0001 — Angular as the frontend framework

**Status:** Accepted

## Context

Qavo's central requirement is *standardization and centralization imposed by the
framework*. The platform must configure cross-cutting concerns once and have every
application inherit them, rather than each application reassembling infrastructure
from competing libraries.

## Decision

Use **Angular** (current stable, v21) as the frontend framework, adopting
**standalone components** and **signals**, in SPA mode initially with SSR kept
available for later.

Angular natively provides — without third-party selection — routing with lazy
loading and guards, reactive forms with first-class validation, `HttpClient` with
an interceptor mechanism (the natural home for auth, error handling and tracing),
and a structured DI system conceptually aligned with the backend's Spring DI.

## Alternatives considered

- **React.** Maximum flexibility and ecosystem, but a *library*: it pushes the
  burden of choosing and standardizing routing, forms, data fetching and state onto
  the platform author. That is friction for an architecture whose explicit goal is
  to impose a standard.

## Consequences

- Most cross-cutting concerns are *configured once* in `@qavo/core`/`@qavo/http`
  rather than assembled per app.
- The Angular library model maps directly onto Qavo's plugin model (each capability
  is a publishable Angular library).
- Shared mental model with the Spring backend lowers the learning curve.
- We accept Angular's opinionated structure and semi-annual release cadence (with
  LTS), consistent with the long-term-maintainability principle.
