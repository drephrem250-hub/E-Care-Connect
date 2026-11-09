const { bearerToken, verifyAccessToken } = require("./oidc");
const { getPool } = require("../db/pool");

function createAuthenticationMiddleware(options = {}) {
  const verify = options.verifyAccessToken || verifyAccessToken;
  const poolFactory = options.getPool || getPool;
  return async function authenticate(req, res, next) {
    const token = bearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ error: "unauthorized" });
    try {
      const identity = await verify(token);
      const result = await poolFactory().query(
        `SELECT u.id, u.email, u.display_name, u.status,
                m.organization_id, o.code AS organization_code, o.name AS organization_name, m.role
           FROM app_users u
           LEFT JOIN organization_memberships m ON m.user_id = u.id AND m.status = 'active'
           LEFT JOIN organizations o ON o.id = m.organization_id AND o.status = 'active'
          WHERE u.oidc_issuer = $1 AND u.oidc_subject = $2 AND u.status = 'active'
          ORDER BY o.name`,
        [identity.issuer, identity.subject]
      );
      if (result.rowCount === 0) {
        return res.status(403).json({ error: "account_not_provisioned" });
      }
      req.auth = {
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          displayName: result.rows[0].display_name
        },
        memberships: result.rows.filter(row => row.organization_id).map(row => ({
          organizationId: row.organization_id,
          organizationCode: row.organization_code,
          organizationName: row.organization_name,
          role: row.role
        }))
      };
      await poolFactory().query(
        "UPDATE app_users SET last_authenticated_at = now() WHERE id = $1",
        [req.auth.user.id]
      );
      return next();
    } catch (error) {
      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        return res.status(503).json({ error: "identity_store_unavailable" });
      }
      return res.status(401).json({ error: "invalid_access_token" });
    }
  };
}

module.exports = { createAuthenticationMiddleware };
