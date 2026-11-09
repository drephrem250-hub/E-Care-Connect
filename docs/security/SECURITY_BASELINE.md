# Security baseline

**Current status: requirements only; controls are not yet implemented.**

- Synthetic data only until legal, privacy, security and institutional approval.
- Never commit secrets, private keys, production environment files, patient data or database dumps.
- Require OIDC authentication, MFA for privileged roles, short-lived tokens and server-side authorization before clinical access.
- Enforce tenant/facility boundaries and deny by default.
- Encrypt network traffic; define database, backup and key-management encryption before production.
- Record access decisions and clinical-data events in protected, tamper-evident audit storage.
- Apply rate limits, input validation, secure headers, dependency scanning, SAST, container scanning and penetration testing.
- Define retention, deletion, incident response, backup restoration and disaster recovery.
- Review Rwanda Law No. 058/2021 and applicable DPO guidance with qualified local counsel and the accountable data controller.
- Production deployment is prohibited until security and privacy gates are evidenced and signed off.
