import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "~/lib/db";

// ─── Admin session helpers ───────────────────────────────────────────────────
// Sessions are random tokens stored server-side in `admin_sessions`. Every
// protected server function calls assertSession(token) before doing any work,
// so the database can never be read or modified without a valid, unexpired
// token issued by loginAdmin.

const SESSION_DAYS = 7;

async function assertSession(token: unknown): Promise<void> {
  await initDb();
  if (!token || typeof token !== "string") {
    throw new Error("Unauthorized");
  }
  const result = await db.execute({
    sql: "SELECT id FROM admin_sessions WHERE token = ? AND expires_at > ?",
    args: [token, new Date().toISOString()],
  });
  if (result.rows.length === 0) {
    throw new Error("Unauthorized");
  }
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
      args: [data.name, data.email, data.phone || null, data.message],
    });
    return { success: true };
  });

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      insurance_type: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      details?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "INSERT INTO quotes (first_name, last_name, email, phone, insurance_type, address, city, state, zip, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.insurance_type,
        data.address || null,
        data.city || null,
        data.state || "IL",
        data.zip || null,
        data.details || null,
      ],
    });
    return { success: true };
  });

export const getQuotes = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    return result.rows;
  });

export const getContacts = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    return result.rows;
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({ sql: "DELETE FROM quotes WHERE id = ?", args: [data.id] });
    return { success: true };
  });

export const deleteContact = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [data.id] });
    return { success: true };
  });

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { username: string; password: string }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    // Hardcoded admin credentials — move to DB + bcrypt before production
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "KoverKing2026!";
    if (data.username === ADMIN_USER && data.password === ADMIN_PASS) {
      const token = globalThis.crypto.randomUUID();
      const expires = new Date(
        Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();
      await db.execute({
        sql: "INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)",
        args: [token, expires],
      });
      return { success: true as const, token };
    }
    return { success: false as const, error: "Invalid credentials" };
  });

export const logoutAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await initDb();
    await db.execute({
      sql: "DELETE FROM admin_sessions WHERE token = ?",
      args: [data.token],
    });
    return { success: true };
  });

// ─── Blog: public reads (no auth — only published posts) ─────────────────────

export const getPublishedPosts = createServerFn({ method: "GET" })
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async () => {
    await initDb();
    const result = await db.execute(
      "SELECT slug, title, description, category, author, read_minutes, body, date_published, published FROM blog_posts WHERE published = 1 ORDER BY date_published DESC, id DESC"
    );
    return result.rows;
  });

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await initDb();
    const result = await db.execute({
      sql: "SELECT slug, title, description, category, author, read_minutes, body, date_published, published FROM blog_posts WHERE slug = ? AND published = 1 LIMIT 1",
      args: [data.slug],
    });
    return result.rows[0] ?? null;
  });

// ─── Blog: admin CRUD (auth required) ────────────────────────────────────────

type BlogInput = {
  token: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  author?: string;
  readMinutes?: number;
  body: string;
  published: boolean;
  datePublished: string;
};

export const getBlogPostsAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, slug, title, description, category, author, read_minutes, body, date_published, published FROM blog_posts ORDER BY date_published DESC, id DESC"
    );
    return result.rows;
  });

export const createBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: BlogInput) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    if (!data.slug || !data.title || !data.description || !data.body) {
      return { success: false as const, error: "Missing required fields" };
    }
    const dupe = await db.execute({
      sql: "SELECT id FROM blog_posts WHERE slug = ?",
      args: [data.slug],
    });
    if (dupe.rows.length > 0) {
      return { success: false as const, error: "A post with that URL already exists" };
    }
    await db.execute({
      sql: "INSERT INTO blog_posts (slug, title, description, category, author, read_minutes, body, published, date_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.slug,
        data.title,
        data.description,
        data.category || null,
        data.author || null,
        data.readMinutes ?? null,
        data.body,
        data.published ? 1 : 0,
        data.datePublished,
      ],
    });
    return { success: true as const };
  });

export const updateBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: BlogInput & { originalSlug: string }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    if (!data.slug || !data.title || !data.description || !data.body) {
      return { success: false as const, error: "Missing required fields" };
    }
    if (data.slug !== data.originalSlug) {
      const dupe = await db.execute({
        sql: "SELECT id FROM blog_posts WHERE slug = ?",
        args: [data.slug],
      });
      if (dupe.rows.length > 0) {
        return { success: false as const, error: "A post with that URL already exists" };
      }
    }
    await db.execute({
      sql: "UPDATE blog_posts SET slug = ?, title = ?, description = ?, category = ?, author = ?, read_minutes = ?, body = ?, published = ?, date_published = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
      args: [
        data.slug,
        data.title,
        data.description,
        data.category || null,
        data.author || null,
        data.readMinutes ?? null,
        data.body,
        data.published ? 1 : 0,
        data.datePublished,
        data.originalSlug,
      ],
    });
    return { success: true as const };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; slug: string }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({
      sql: "DELETE FROM blog_posts WHERE slug = ?",
      args: [data.slug],
    });
    return { success: true as const };
  });

export const submitQuoteFromLead = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address?: string;
      zip?: string;
      home_value?: string;
      year_built?: string;
      home_type?: string;
      current_carrier?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await initDb();
    const details = [
      data.home_value && `Home Value: ${data.home_value}`,
      data.year_built && `Year Built: ${data.year_built}`,
      data.home_type && `Home Type: ${data.home_type}`,
      data.current_carrier && `Current Carrier: ${data.current_carrier}`,
      "Source: Meta Lead Ad",
    ]
      .filter(Boolean)
      .join("\n");

    await db.execute({
      sql: "INSERT INTO quotes (first_name, last_name, email, phone, insurance_type, address, state, zip, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        "Home",
        data.address || null,
        "IL",
        data.zip || null,
        details,
      ],
    });
    return { success: true };
  });
