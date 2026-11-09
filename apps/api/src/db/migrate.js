const fs = require("node:fs");
const path = require("node:path");
const { getPool, closePool } = require("./pool");

async function migrate() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [721904202]);
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const directory = path.join(__dirname, "migrations");
    const files = fs.readdirSync(directory).filter(name => name.endsWith(".sql")).sort();
    for (const file of files) {
      const exists = await client.query("SELECT 1 FROM schema_migrations WHERE version = $1", [file]);
      if (exists.rowCount) continue;
      const sql = fs.readFileSync(path.join(directory, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations(version) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`Applied migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    try { await client.query("SELECT pg_advisory_unlock($1)", [721904202]); } catch {}
    client.release();
    await closePool();
  }
}

migrate().catch(error => {
  console.error("Database migration failed", { message: error.message });
  process.exitCode = 1;
});
