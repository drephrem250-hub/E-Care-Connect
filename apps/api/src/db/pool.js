const { Pool } = require("pg");

let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be configured");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DB_POOL_MAX || 10),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      application_name: "ecare-connect-api",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined
    });
    pool.on("error", error => {
      // Do not log connection strings or query parameters.
      console.error("Unexpected idle PostgreSQL client error", { message: error.message });
    });
  }
  return pool;
}

async function closePool() {
  if (pool) {
    const current = pool;
    pool = undefined;
    await current.end();
  }
}

module.exports = { getPool, closePool };
