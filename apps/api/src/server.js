const http = require("node:http");
const { URL } = require("node:url");
const { getPool, closePool } = require("./db/pool");
const { createAuthenticationMiddleware } = require("./auth/middleware");
const { requireOrganizationMembership } = require("./auth/authorization");
const { listSyntheticPatients } = require("./patients/patients");

const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === "production";
const auth = createAuthenticationMiddleware();

function send(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'"
  });
  res.end(JSON.stringify(body));
}

function runMiddleware(middleware, req, res) {
  return new Promise(resolve => middleware(req, res, resolve));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/health/live") {
    return send(res, 200, { status: "ok", service: "ecare-api" });
  }
  if (req.method === "GET" && url.pathname === "/health/ready") {
    try {
      await getPool().query("SELECT 1");
      return send(res, 200, { status: "ready", checks: { database: "ok", identity: process.env.OIDC_ISSUER && process.env.OIDC_AUDIENCE ? "configured" : "not_configured" } });
    } catch {
      return send(res, 503, { status: "not_ready", checks: { database: "unavailable", identity: "not_checked" } });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/demo/patients") {
    if (production) return send(res, 404, { error: "not_found" });
    return send(res, 200, { data: listSyntheticPatients(), synthetic: true });
  }
  if (req.method === "GET" && url.pathname === "/api/v1/me") {
    const result = await runMiddleware(auth, req, res);
    if (result === undefined && res.writableEnded) return;
    return send(res, 200, { data: req.auth });
  }
  if (req.method === "GET" && url.pathname === "/api/v1/organization/context") {
    let completed = false;
    const finish = () => { completed = true; };
    await new Promise(resolve => auth(req, res, resolve).then(resolve).catch(resolve));
    if (res.writableEnded) return;
    const roleCheck = requireOrganizationMembership();
    await new Promise(resolve => roleCheck(req, res, resolve));
    if (res.writableEnded) return;
    return send(res, 200, { data: req.organization });
  }
  return send(res, 404, { error: "not_found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`E-Care Connect API listening on 127.0.0.1:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
