# E-Care Connect

Rwanda-first health information exchange platform. This repository is the engineering source of truth for the web, mobile, interoperability, and platform services.

> **Development status:** foundation stage. Use synthetic data only. This software is not approved for clinical use and must not process real patient information until security, privacy, legal, and institutional reviews are complete.

## Initial engineering direction

- Modular monolith with explicit domain boundaries and independently deployable services only when justified.
- Web and mobile clients backed by authenticated APIs.
- HL7 FHIR R4 interoperability, subject to confirmation of partner and national implementation profiles.
- PostgreSQL persistence; hybrid-ready deployment design.
- Identity, least-privilege authorization, patient matching, referrals, laboratory exchange, consent/legal-basis governance, and tamper-evident auditability are core MVP capabilities.
- ML and VR/AR are future, separately governed workstreams and are not MVP dependencies.

## Repository status

This is the initial repository bootstrap. Build, test, security, and deployment claims will be added only after they are executed and evidenced.

## Safety

Never commit credentials, production configuration, real patient data, database dumps, or identifiable clinical examples. See `docs/security/SECURITY_BASELINE.md`.

## Planned structure

- `apps/api` — backend modular monolith
- `apps/web` — web application
- `apps/mobile` — mobile application (planned)
- `packages` — shared contracts and tooling
- `infra` — local and hybrid deployment assets
- `docs` — architecture, product, interoperability, governance, and operations

## Getting started

The runnable development workspace and pinned dependencies are the next bootstrap milestone. Until then, treat architecture and requirements documents as the authoritative planning baseline, not as evidence of implemented controls.
