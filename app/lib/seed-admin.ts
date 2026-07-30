// Seeds the first admin user from environment variables.
//
// Replaces the old hardcoded `admin` / `KoverKing2026!` credentials that lived
// in source (and are therefore in git history — that password must be treated
// as compromised and never reused).
//
// Set in Vercel:
//   ADMIN_EMAIL    = doug@aideveloper.dev
//   ADMIN_PASSWORD = <a long, unique password>
//
// On first login the row is created; afterwards this is a no-op. Rotating the
// password later is done in the dashboard, not by changing the env var.

import { db } from "./db";
import { hashPassword, normalizeEmail } from "./auth";

let checked = false;

export async function ensureSeedAdmin(): Promise<void> {
  if (checked) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    checked = true;
    return;
  }

  const normalized = normalizeEmail(email);
  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
    args: [normalized],
  });
  if (existing.rows.length > 0) {
    checked = true;
    return;
  }

  const password_hash = await hashPassword(password);
  await db.execute({
    sql: "INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified_at) VALUES (?, ?, 'admin', 'Kover King', 'Admin', CURRENT_TIMESTAMP)",
    args: [normalized, password_hash],
  });
  console.log("[auth] seeded admin user:", normalized);
  checked = true;
}
