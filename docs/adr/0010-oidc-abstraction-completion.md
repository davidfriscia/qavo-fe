# ADR 0010 — Completing the OIDC strategy with composed, replaceable seams

**Status:** Accepted (2026-05, with `0.1.0`); refines ADR 0005 for the auth
strategy contract.

## Context

The `0.0.0` foundation shipped the **abstraction** for OIDC — an
`AuthStrategy` interface, an `OidcAuthStrategy` skeleton, and configuration
plumbing — but the code-exchange step was a `TODO`. That left an honest
disclaimer in the README ("PKCE exchange delegated to an OIDC client you
provide") but no working end-to-end flow you could demonstrate against a real
IdP. To call the platform credible at `0.1.0` we needed:

- A complete Authorization Code + PKCE flow: redirect → callback → token
  exchange → session establishment → silent renewal → logout.
- **Provider-agnostic** behavior. Qavo cannot endorse Auth0 vs Keycloak vs
  Azure AD; integrators must be able to keep the platform contract while
  swapping in vendor-specific quirks.
- **Browser-only** trust assumptions. Public-client PKCE flow only; no client
  secret; tokens stored in memory by default per ADR 0005's secure-by-default
  posture.
- Symmetry with the rest of the platform: each piece must be replaceable via
  an injection token, the same way `OidcStateStore`, `TokenStore` and others
  already are.

## Decision

Implement OIDC as a **composition of small, injectable seams** wired together
by `OidcAuthStrategy`, rather than bundling a third-party OIDC client SDK
inside the platform:

- `pkce.ts` — pure functions for verifier/challenge generation and base64url
  encoding, tested against RFC 7636 vectors.
- `OidcStateStore` (default: `SessionStorageOidcStateStore`) — persists the
  `state`/`nonce`/`code_verifier`/`returnUrl` tuple across the redirect, with
  a 10-minute TTL and one-shot consumption to defeat replay.
- `OidcTokenClient` (default: `HttpOidcTokenClient`) — the only piece that
  talks to the token endpoint. Form-encoded `application/x-www-form-urlencoded`
  with `client_id` in the body (no client secret). Replaceable via DI: an
  integrator who needs Auth0 management quirks, Cognito's non-standard refresh
  shape, or an off-the-shelf SDK simply provides their own implementation of
  the abstract class.
- `OidcSilentRenewal` — schedules a refresh-token grant ahead of access-token
  expiry (`expires_in - leeway`, default 60 s), emits the renewed response on
  a `Subject`. Cancels cleanly on logout and on errors. Skipped when
  `silentRenewal === false` or when there's no DOM (SSR/test without a
  `defaultView`).
- `OidcCallbackComponent` + `provideOidcCallbackRoute` — a standalone, OnPush
  component that reads `code`/`state`, calls `auth.completeRedirect(...)` and
  navigates to the saved `returnUrl`. The route is opt-in; integrators who
  prefer their own callback component pass it in.

`OidcAuthStrategy` orchestrates these: builds the authorize URL with PKCE
challenge + state + nonce, redirects via `document.location.assign(url)`,
consumes state on return (throwing on missing state — CSRF/replay protection),
exchanges the code, decodes the id_token *body* into a `QavoSession`, hands
the access token to `TokenStore`, schedules renewal, and on logout clears
state and optionally navigates to the IdP's end-session endpoint.

We deliberately **do not verify the id_token signature** in the browser. The
token endpoint was reached over TLS and validated the client; the id_token is
used only for user-identity hydration, not as a security boundary. The
backend is the trust boundary for access decisions and validates tokens it
receives. This is consistent with current OIDC public-client guidance.

## Alternatives considered

- **Bundle `oidc-client-ts` (or `angular-auth-oidc-client`).** Saves
  implementation effort, but couples Qavo to that library's release cadence,
  exports, and design choices, and ships ~tens of kB of code into every Qavo
  app even when the strategy is `local`. Worse, it would still need adapters
  to fit the `AuthStrategy` contract. Net cost > net benefit.
- **Verify id_token signatures in the client.** Adds JWKS fetching, key
  rotation handling, and a crypto dependency, in exchange for defending
  against a threat already covered by TLS to the token endpoint and by
  backend validation of bearer tokens. Not worth the surface area today; can
  be added by swapping `OidcTokenClient` if a deployment needs it.
- **`localStorage` for OIDC ephemeral state.** Persists across tabs the
  user did not initiate the login from. `sessionStorage` is the safer
  default for a one-shot, per-tab handshake.
- **`window.location.href = ...` instead of `document.location.assign(...)`**
  for the redirect. Functionally equivalent; using `document` keeps the
  service testable with a mocked `Document`.

## Consequences

- The Authorization Code + PKCE flow works end to end with no application
  code beyond `provideQavo({ auth: { strategy: 'oidc', oidc: {...} } })` and
  `provideOidcCallbackRoute()`.
- Integrators retain a single, documented seam (`OidcTokenClient`) to plug in
  a vendor SDK without forking the strategy. The platform contract — what
  `AuthService` looks like, what a `QavoSession` is, how `HttpClient`
  acquires tokens — stays stable.
- The strategy is testable: PKCE is pure, state store is interface-only,
  token client is abstract, renewal exposes observables. Specs cover RFC 7636
  vectors and the state-store TTL/one-shot semantics today.
- No client-side signature verification is an **intentional gap** documented
  here. A future ADR can revisit if a deployment surfaces a real need.
