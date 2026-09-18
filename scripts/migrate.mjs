import "dotenv/config";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const migrationsDirectory = path.join(process.cwd(), "database", "migrations");
const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql")).sort();

try {
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  for (const file of files) {
    const exists = await pool.query("SELECT 1 FROM schema_migrations WHERE name = $1", [file]);
    if (exists.rowCount) continue;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(await readFile(path.join(migrationsDirectory, file), "utf8"));
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT DO NOTHING", [file]);
      await client.query("COMMIT");
      console.log(`Applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  console.log("Database is up to date.");
} finally {
  await pool.end();
}
