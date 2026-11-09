const { createRemoteJWKSet, jwtVerify } = require("jose");

let remoteJwks;

function getOidcConfig(env = process.env) {
  const issuer = env.OIDC_ISSUER;
  const audience = env.OIDC_AUDIENCE;
  if (!issuer || !audience) {
    throw new Error("OIDC_ISSUER and OIDC_AUDIENCE must be configured");
  }
  const jwksUrl = env.OIDC_JWKS_URI || new URL(".well-known/jwks.json", issuer.endsWith("/") ? issuer : issuer + "/").toString();
  return { issuer, audience, jwksUrl };
}

async function verifyAccessToken(token, env = process.env) {
  const config = getOidcConfig(env);
  if (!remoteJwks || remoteJwks._ecareJwksUrl !== config.jwksUrl) {
    remoteJwks = createRemoteJWKSet(new URL(config.jwksUrl));
    Object.defineProperty(remoteJwks, "_ecareJwksUrl", { value: config.jwksUrl });
  }
  const { payload, protectedHeader } = await jwtVerify(token, remoteJwks, {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["RS256", "ES256"],
    clockTolerance: 5
  });
  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Token subject is missing");
  }
  if (protectedHeader.typ && protectedHeader.typ.toLowerCase() !== "jwt") {
    throw new Error("Unexpected token type");
  }
  return { issuer: config.issuer, subject: payload.sub, claims: payload };
}

function bearerToken(header) {
  if (typeof header !== "string") return null;
  const match = /^Bearer\s+([^\s]+)$/i.exec(header);
  return match ? match[1] : null;
}

module.exports = { getOidcConfig, verifyAccessToken, bearerToken };
