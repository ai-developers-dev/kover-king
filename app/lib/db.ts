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
    initialized = true;
    console.log("[DB] initDb complete");
  } catch (err) {
    console.error("[DB] initDb error:", err);
    throw err;
  }
}
