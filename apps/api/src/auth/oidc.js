const { createRemoteJWKSet, jwtVerify } = require("jose");

let cachedJwks;
let cachedIssuer;
let discoveryPromise;

function getOidcConfig(env = process.env) {
  const issuer = env.OIDC_ISSUER;
  const audience = env.OIDC_AUDIENCE;
  if (!issuer || !audience) throw new Error("OIDC_ISSUER and OIDC_AUDIENCE must be configured");
  return { issuer: issuer.replace(/\/$/, ""), audience, jwksUrl: env.OIDC_JWKS_URI || null };
}

async function resolveJwks(config) {
  if (cachedJwks && cachedIssuer === config.issuer && (!config.jwksUrl || cachedJwks.url === config.jwksUrl)) {
    return cachedJwks.keys;
  }
  let jwksUrl = config.jwksUrl;
  if (!jwksUrl) {
    if (!discoveryPromise || cachedIssuer !== config.issuer) {
      discoveryPromise = fetch(`${config.issuer}/.well-known/openid-configuration`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(5000)
      }).then(async response => {
        if (!response.ok) throw new Error("OIDC discovery endpoint unavailable");
        const metadata = await response.json();
        if (metadata.issuer?.replace(/\/$/, "") !== config.issuer || typeof metadata.jwks_uri !== "string") {
          throw new Error("OIDC discovery metadata is invalid");
        }
        return metadata.jwks_uri;
      });
      cachedIssuer = config.issuer;
    }
    jwksUrl = await discoveryPromise;
  }
  cachedJwks = { url: jwksUrl, keys: createRemoteJWKSet(new URL(jwksUrl)) };
  cachedIssuer = config.issuer;
  return cachedJwks.keys;
}

async function verifyAccessToken(token, env = process.env) {
  const config = getOidcConfig(env);
  const jwks = await resolveJwks(config);
  const { payload, protectedHeader } = await jwtVerify(token, jwks, {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["RS256", "ES256"],
    clockTolerance: 5
  });
  if (!payload.sub || typeof payload.sub !== "string") throw new Error("Token subject is missing");
  if (protectedHeader.typ && protectedHeader.typ.toLowerCase() !== "jwt") throw new Error("Unexpected token type");
  return { issuer: config.issuer, subject: payload.sub, claims: payload };
}

function bearerToken(header) {
  if (typeof header !== "string") return null;
  const match = /^Bearer\s+([^\s]+)$/i.exec(header);
  return match ? match[1] : null;
}

module.exports = { getOidcConfig, verifyAccessToken, bearerToken };
