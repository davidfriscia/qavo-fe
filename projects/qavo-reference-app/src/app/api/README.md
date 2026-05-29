# Generated API client

This folder demonstrates how a Qavo application integrates a **typed API client
generated from the backend's OpenAPI document** — the single source of truth for
the backend/frontend contract (architecture §2.3, §7.3).

In a real project the contents of `generated/` are produced by CI and are **not
hand-edited**. The files here are illustrative stand-ins with the same shape
`openapi-generator` emits for the `typescript-angular` generator.

## Generation command

```bash
# openapitools.json at the repo root pins the generator version.
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:8080/v3/api-docs \
  -g typescript-angular \
  -o projects/qavo-reference-app/src/app/api/generated \
  --additional-properties=ngVersion=21.0.0,providedInRoot=true,withInterceptorAuth=false
```

## Why the generated client stays thin

Base URL, authentication token injection, trace correlation, error mapping and
resilience are all centralized in `@qavo/http`'s interceptor stack. The generated
services therefore issue requests against logical paths (`/users`) and remain
free of cross-cutting concerns — a fix to any of those propagates via a platform
version bump, not a regeneration.
