const test = require("node:test");
const assert = require("node:assert/strict");
const { bearerToken, getOidcConfig } = require("../src/auth/oidc");
const { requireOrganizationMembership } = require("../src/auth/authorization");

test("bearer token parser accepts only a single bearer credential", () => {
  assert.equal(bearerToken("Bearer abc.def.ghi"), "abc.def.ghi");
  assert.equal(bearerToken("Basic abc"), null);
  assert.equal(bearerToken("Bearer token extra"), null);
  assert.equal(bearerToken(undefined), null);
});

test("OIDC configuration requires issuer and audience", () => {
  assert.throws(() => getOidcConfig({}), /must be configured/);
  assert.deepEqual(getOidcConfig({ OIDC_ISSUER: "https://identity.example/", OIDC_AUDIENCE: "ecare-api" }), {
    issuer: "https://identity.example/",
    audience: "ecare-api",
    jwksUrl: "https://identity.example/.well-known/jwks.json"
  });
});

test("organization access is denied without an active matching membership", () => {
  let status;
  let body;
  const req = { headers: { "x-organization-id": "org-b" }, auth: { memberships: [{ organizationId: "org-a", role: "clinician" }] } };
  const res = { status(code) { status = code; return this; }, json(value) { body = value; } };
  requireOrganizationMembership()(req, res, () => assert.fail("must not authorize"));
  assert.equal(status, 403);
  assert.equal(body.error, "organization_access_denied");
});
