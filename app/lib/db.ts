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
    // Blog posts authored from the admin dashboard.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, category TEXT, author TEXT, read_minutes INTEGER, body TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 1, date_published TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Server-side admin sessions (token validated on every protected call).
    await db.execute(
      "CREATE TABLE IF NOT EXISTS admin_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Reusable author roster for blog bylines.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, title TEXT, bio TEXT, photo_url TEXT, sort_order INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Small key/value store (used for the round-robin author rotation pointer).
    await db.execute(
      "CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT)"
    );
    // Weekly AI-generated SEO blog/keyword ideas (one batch = 5 rows).
    await db.execute(
      "CREATE TABLE IF NOT EXISTS keyword_ideas (id INTEGER PRIMARY KEY AUTOINCREMENT, batch_date TEXT NOT NULL, rank INTEGER, keyword TEXT NOT NULL, title TEXT, rationale TEXT, intent TEXT, status TEXT NOT NULL DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Backlink outreach targets (the sites we cite as Sources). One row per
    // domain (UNIQUE) so we never email the same site twice.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS outreach (id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT UNIQUE NOT NULL, source_url TEXT, source_title TEXT, post_slug TEXT, post_title TEXT, email TEXT, status TEXT NOT NULL DEFAULT 'found', draft_subject TEXT, draft_body TEXT, sent_at DATETIME, error TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Local-SEO directory listings (business citations). One row per directory
    // URL (UNIQUE). status: not_started -> submitted -> live (or skipped).
    await db.execute(
      "CREATE TABLE IF NOT EXISTS directories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, url TEXT UNIQUE NOT NULL, category TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'not_started', listing_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );

    // ─── Customer portal / unified auth ──────────────────────────────────
    // One users table for every human who can log in. `role` decides where
    // /login sends them: 'admin' -> dashboard, 'customer' -> portal.
    // Passwords are scrypt hashes (see app/lib/auth.ts) — never plaintext.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', first_name TEXT, last_name TEXT, phone TEXT, email_verified_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_login_at DATETIME)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS email_verification_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS password_reset_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"
    );

    // ─── Policies, documents, billing ────────────────────────────────────
    // Money is stored as INTEGER CENTS everywhere. Never floats — rounding
    // errors on premium are not acceptable.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS policies (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL, carrier TEXT NOT NULL, insurance_type TEXT NOT NULL, policy_number TEXT, term TEXT NOT NULL DEFAULT '12_month', premium_cents INTEGER NOT NULL DEFAULT 0, effective_date TEXT, expiration_date TEXT, status TEXT NOT NULL DEFAULT 'active', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS policy_documents (id INTEGER PRIMARY KEY AUTOINCREMENT, policy_id INTEGER NOT NULL, kind TEXT NOT NULL DEFAULT 'other', blob_url TEXT NOT NULL, filename TEXT NOT NULL, size_bytes INTEGER, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL, policy_id INTEGER, invoice_number TEXT UNIQUE NOT NULL, amount_cents INTEGER NOT NULL, due_date TEXT, term TEXT, status TEXT NOT NULL DEFAULT 'draft', stripe_payment_intent_id TEXT, paid_at DATETIME, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id INTEGER NOT NULL, amount_cents INTEGER NOT NULL, method TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', stripe_payment_intent_id TEXT, last4 TEXT, recorded_by TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_policies_customer ON policies(customer_id)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_docs_policy ON policy_documents(policy_id)"
    );

    // ─── Payment vault ───────────────────────────────────────────────────
    // Card / bank details submitted by customers, held encrypted (AES-256-GCM,
    // see app/lib/crypto-vault.ts) until an authorized agent keys them into the
    // carrier's portal, then purged. `enc_payload` is the ONLY place sensitive
    // digits live; everything else is display-safe metadata.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS payment_methods (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL, invoice_id INTEGER, method TEXT NOT NULL, enc_payload TEXT, brand TEXT, last4 TEXT, name_on_account TEXT, status TEXT NOT NULL DEFAULT 'pending', purge_after DATETIME, processed_at DATETIME, processed_by TEXT, purged_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    // Who revealed which record, and when. Required for any audit.
    await db.execute(
      "CREATE TABLE IF NOT EXISTS payment_access_log (id INTEGER PRIMARY KEY AUTOINCREMENT, payment_method_id INTEGER NOT NULL, actor TEXT, action TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_pm_customer ON payment_methods(customer_id)"
    );
    await db.execute(
      "CREATE INDEX IF NOT EXISTS idx_pm_status ON payment_methods(status)"
    );
    // blog_posts predates author records — add the new columns if missing.
    // ALTER ... ADD COLUMN throws "duplicate column" if already present, so
    // each is wrapped to stay idempotent across restarts/deploys.
    for (const col of [
      "ALTER TABLE blog_posts ADD COLUMN author_id INTEGER",
      "ALTER TABLE blog_posts ADD COLUMN author_photo_url TEXT",
      // SEO fields: focus + long-tail keywords, research citations (JSON
      // array of {title,url}), and an optional manual related page.
      "ALTER TABLE blog_posts ADD COLUMN keywords TEXT",
      "ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT",
      "ALTER TABLE blog_posts ADD COLUMN citations TEXT",
      "ALTER TABLE blog_posts ADD COLUMN related_page TEXT",
      // Featured image (AI-generated or uploaded): public Blob URL, required
      // alt text, dimensions for CLS-free <img>, and a credit line.
      "ALTER TABLE blog_posts ADD COLUMN featured_image_url TEXT",
      "ALTER TABLE blog_posts ADD COLUMN featured_image_alt TEXT",
      "ALTER TABLE blog_posts ADD COLUMN featured_image_width INTEGER",
      "ALTER TABLE blog_posts ADD COLUMN featured_image_height INTEGER",
      "ALTER TABLE blog_posts ADD COLUMN featured_image_credit TEXT",
      // "Send to Facebook" tracking: the Graph post id + when it was shared.
      "ALTER TABLE blog_posts ADD COLUMN facebook_post_id TEXT",
      "ALTER TABLE blog_posts ADD COLUMN facebook_posted_at DATETIME",
    ]) {
      try {
        await db.execute(col);
      } catch {
        // Column already exists — ignore.
      }
    }
    // Seed the original sample post once so existing /blog links keep working.
    await db.execute({
      sql: "INSERT OR IGNORE INTO blog_posts (slug, title, description, category, author, read_minutes, body, published, date_published) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)",
      args: [
        "how-to-lower-your-car-insurance-premium",
        "How to Lower Your Car Insurance Premium",
        "Practical, no-nonsense ways to reduce your auto insurance costs without sacrificing the coverage you actually need.",
        "Auto Insurance",
        "Kover King Insurance",
        4,
        [
          "Car insurance is one of those bills most people set and forget. But premiums change every year, and a little attention at renewal time can put real money back in your pocket. Here are the levers that actually move your rate.",
          "## Raise your deductible",
          "Your deductible is what you pay out of pocket before coverage kicks in. Moving from a $250 to a $500 or $1,000 deductible can noticeably lower your premium — just make sure you keep enough in savings to cover the higher amount if you need to file a claim.",
          "## Bundle your policies",
          "Insuring your home (or renters) and auto with the same carrier often unlocks a multi-policy discount. As an independent agency, we can compare bundle pricing across carriers to find where the combined savings are largest.",
          "## Ask about every discount you qualify for",
          "- Safe-driver and accident-free discounts",
          "- Good-student discounts for drivers under 25",
          "- Low-mileage or usage-based (telematics) programs",
          "- Paid-in-full and paperless billing discounts",
          "## Shop your rate, don't just renew",
          "The single biggest mistake drivers make is auto-renewing without comparison. Rates for the same driver can vary by hundreds of dollars between carriers. If you'd like a no-obligation comparison, give us a call — we'll do the shopping for you.",
        ].join("\n"),
        "2026-05-29",
      ],
    });
    // Seed the admin user from ADMIN_EMAIL/ADMIN_PASSWORD if it doesn't exist.
    // Dynamic import avoids a circular dependency (seed-admin imports `db`).
    try {
      const { ensureSeedAdmin } = await import("./seed-admin");
      await ensureSeedAdmin();
    } catch (err) {
      console.error("[DB] seed admin failed:", err);
    }
    initialized = true;
    console.log("[DB] initDb complete");
  } catch (err) {
    console.error("[DB] initDb error:", err);
    throw err;
  }
}
