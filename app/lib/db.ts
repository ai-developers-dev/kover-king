import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;
  console.log("[DB] initDb called, url:", process.env.TURSO_DATABASE_URL ? "turso" : "local");
  try {
    await db.execute(
      "CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, insurance_type TEXT NOT NULL, address TEXT, city TEXT, state TEXT DEFAULT 'IL', zip TEXT, details TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS meta_leads (id INTEGER PRIMARY KEY AUTOINCREMENT, leadgen_id TEXT UNIQUE NOT NULL, page_id TEXT, form_id TEXT, ad_id TEXT, full_name TEXT, email TEXT, phone TEXT, raw_payload TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS lead_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    initialized = true;
    console.log("[DB] initDb complete");
  } catch (err) {
    console.error("[DB] initDb error:", err);
    throw err;
  }
}
