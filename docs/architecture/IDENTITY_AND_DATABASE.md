# Identity and database foundation

## Authentication model
The API accepts OAuth 2.0/OIDC access tokens from a configured trusted issuer. Tokens are verified against the issuer's JWKS with issuer, audience, expiry and allowed-signature-algorithm checks. The API does not accept identity or role claims supplied by the browser as authority.

An authenticated OIDC identity is mapped by the immutable pair (issuer, subject) to an application user. Organization membership and roles are read from PostgreSQL, not trusted from user-editable client data or arbitrary JWT role claims. Accounts must be provisioned by an authorized administrative workflow before access is granted.

## Authorization model
Requests that require organization context supply `X-Organization-Id`; the API verifies that the authenticated user has an active membership and, where configured, an allowed role. This is an initial boundary, not a complete ABAC policy engine. Clinical resource-level authorization, purpose-of-use, consent/legal-basis checks and break-glass controls remain mandatory future gates.

## Data model
- organizations: facility and partner organization registry.
- app_users: OIDC issuer/subject mapping and account lifecycle.
- organization_memberships: organization-scoped roles and membership lifecycle.
- audit_events: append-only event records with actor, organization, outcome and request metadata.
- schema_migrations: applied migration ledger.

## Operational notes
Run migrations explicitly with `npm --workspace apps/api run migrate`. Never auto-run schema migrations during API startup. Use a least-privileged database role in deployed environments; the development Compose credentials are local-only. Production must use TLS, managed secrets, backups, tested restore procedures and a security-reviewed immutable audit export.
