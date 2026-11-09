const http = require("node:http");
const { listSyntheticPatients } = require("./patients/patients");

const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === "production";

function send(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer"
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/health/live") {
    return send(res, 200, { status: "ok", service: "ecare-api" });
  }
  if (req.method === "GET" && url.pathname === "/health/ready") {
    return send(res, 200, { status: "degraded", checks: { database: "not-configured", identity: "not-configured" } });
  }
  // This route is intentionally synthetic-only and is disabled in production.
  if (req.method === "GET" && url.pathname === "/api/demo/patients") {
    if (production) return send(res, 404, { error: "not_found" });
    return send(res, 200, { data: listSyntheticPatients(), synthetic: true });
  }
  return send(res, 404, { error: "not_found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`E-Care Connect API listening on 127.0.0.1:${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
