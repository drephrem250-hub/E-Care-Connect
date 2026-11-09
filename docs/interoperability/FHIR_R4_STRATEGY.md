# FHIR R4 strategy

FHIR R4 (4.0.1) is the initial target for interoperability engineering, pending confirmation with pilot institutions and relevant national stakeholders.

Candidate resources for the first exchange slice:
- Patient
- Organization
- Practitioner and PractitionerRole
- ServiceRequest
- ServiceRequest-based referral workflow, with Task where agreed
- DiagnosticReport
- Observation
- Specimen
- Provenance
- AuditEvent

Do not invent a Rwanda national profile. Before production integration, agree canonical identifiers, terminology bindings, profile packages, authentication, transport, acknowledgements, error semantics, and versioning with each partner. Validate resources against the agreed Implementation Guide and test with synthetic fixtures.
