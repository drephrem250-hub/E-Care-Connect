const { getPool, closePool } = require("./pool");

async function seed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development seed is disabled in production");
  }
  const pool = getPool();
  await pool.query(
    `INSERT INTO organizations(code, name, organization_type)
     VALUES ('DEMO-FACILITY-01', 'Synthetic Demonstration Facility', 'facility')
     ON CONFLICT (code) DO NOTHING`
  );
  console.log("Development organization seed applied. No user accounts or real patient data were created.");
}

seed().catch(error => {
  console.error("Development seed failed", { message: error.message });
  process.exitCode = 1;
}).finally(closePool);
