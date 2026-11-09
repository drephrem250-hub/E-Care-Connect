# Architecture overview

## Initial deployment shape
A modular monolith is the default. Domain modules share a deployment unit initially, while enforcing internal boundaries and contracts. Extract a service only for a demonstrated scaling, security-isolation, regulatory, or independent-release need.

## Logical modules
- Identity and access: OIDC integration, organization membership, roles and policy enforcement.
- Patient identity: identifiers, demographics, duplicate detection, candidate matching and human reconciliation.
- Interoperability: FHIR R4 adapters, profiles, terminology, partner endpoints and message validation.
- Clinical exchange: referrals, service requests, laboratory orders and diagnostic reports.
- Governance: consent directives, legal-basis records, purpose of use, retention and data-subject requests.
- Audit: actor, organization, purpose, resource, action, decision, timestamp and correlation ID.
- Platform: configuration, observability, backup, recovery and integration operations.

## Hybrid readiness
Keep deployment configuration externalized. Support a cloud control plane and institution-hosted integration gateway where partner requirements demand it. Do not assume network connectivity, data residency, or institutional interfaces before discovery.

## Trust boundaries
Treat each facility, user session, integration partner, mobile device and external identity provider as a separate trust boundary. Enforce authorization at the API, not only in the UI.
