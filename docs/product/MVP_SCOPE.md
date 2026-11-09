# MVP scope

## Product objective
Enable authorized healthcare organizations in Rwanda to exchange selected patient information safely across facility boundaries, beginning with a narrow, validated referral and laboratory-result workflow.

## MVP capabilities
1. Workforce identity, organization/facility membership and least-privilege access.
2. Patient identity registration, identifier management, duplicate detection and human reconciliation.
3. FHIR R4 interoperability boundary with partner-agreed profiles and terminology.
4. Referral creation, routing, acknowledgement and status tracking.
5. Laboratory order/result exchange with provenance and status.
6. Consent and other applicable legal-basis governance, purpose limitation and retention.
7. Security audit, operational monitoring and integration error handling.
8. Web application; mobile client follows the same API and authorization model.

## Out of scope for initial MVP
- Autonomous diagnosis or treatment recommendations.
- Production ML decision support.
- VR/AR clinical or educational workflows.
- National-scale rollout before a limited institutional pilot is evaluated.

## Acceptance principle
Every clinical workflow must have authenticated actors, explicit organization context, server-side authorization, patient identity safeguards, provenance, audit events, failure handling and tested recovery.
