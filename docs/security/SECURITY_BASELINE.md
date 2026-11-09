# Security baseline

**Status: initial controls implemented; production approval is not established.**

- Synthetic data only until legal, privacy, security and institutional approval.
- Never commit secrets, private keys, production environment files, patient data or database dumps.
- API access tokens are verified against configured OIDC issuer/JWKS and audience; browser-supplied identity and role claims are not trusted.
- Application users and organization-scoped roles are resolved from PostgreSQL. Access is deny-by-default when the identity is not provisioned or the organization membership is absent.
- Database migrations are explicit and serialized with a PostgreSQL advisory lock.
- Audit schema is append-only at the application trigger layer; production still requires a restricted database role and immutable external storage.
- Encrypt network traffic; configure database TLS, backup encryption and key management before production.
- Apply rate limits, input validation, secure headers, dependency scanning, SAST, container scanning and penetration testing.
- Define retention, deletion, incident response, backup restoration and disaster recovery.
- Review Rwanda Law No. 058/2021 and applicable DPO guidance with qualified local counsel and the accountable data controller.
- Production deployment is prohibited until security and privacy gates are evidenced and signed off.
