import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "~/lib/db";
import { SITE_PAGES, BLOG_CATEGORIES, SITE_URL } from "~/lib/seo";

type Citation = { title: string; url: string };

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
    try {
      const { sendLeadNotification } = await import("./outreach-agent");
      await sendLeadNotification({
        kind: "Contact message",
        replyTo: data.email,
        fields: [
          { label: "Name", value: data.name },
          { label: "Email", value: data.email },
          { label: "Phone", value: data.phone || "" },
          { label: "Message", value: data.message },
        ],
      });
    } catch {
      /* notification is best-effort */
    }
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
    try {
      const { sendLeadNotification } = await import("./outreach-agent");
      await sendLeadNotification({
        kind: "Quote request",
        replyTo: data.email,
        fields: [
          { label: "Name", value: `${data.first_name} ${data.last_name}`.trim() },
          { label: "Email", value: data.email },
          { label: "Phone", value: data.phone },
          { label: "Insurance", value: data.insurance_type },
          { label: "Address", value: data.address || "" },
          {
            label: "City/State/ZIP",
            value: [data.city, data.state, data.zip].filter(Boolean).join(", "),
          },
          { label: "Details", value: data.details || "" },
        ],
      });
    } catch {
      /* notification is best-effort */
    }
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
      "SELECT slug, title, description, category, author, author_photo_url, read_minutes, body, date_published, published, featured_image_url, featured_image_alt, featured_image_width, featured_image_height FROM blog_posts WHERE published = 1 ORDER BY date_published DESC, id DESC"
    );
    return result.rows;
  });

// Posts whose category matches one shown on a given service/location page.
// Powers the "Related Articles" block. Public (GET), no auth.
export const getRelatedPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { category: string; limit?: number }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await initDb();
    if (!data.category) return [];
    const limit = data.limit && data.limit > 0 ? Math.min(data.limit, 6) : 3;
    const result = await db.execute({
      sql: "SELECT slug, title, description, category, author, author_photo_url, read_minutes, date_published FROM blog_posts WHERE published = 1 AND category = ? ORDER BY date_published DESC, id DESC LIMIT ?",
      args: [data.category, limit],
    });
    return result.rows;
  });

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await initDb();
    const result = await db.execute({
      sql: "SELECT slug, title, description, category, author, author_photo_url, read_minutes, body, date_published, published, keywords, focus_keyword, citations, featured_image_url, featured_image_alt, featured_image_width, featured_image_height, featured_image_credit FROM blog_posts WHERE slug = ? AND published = 1 LIMIT 1",
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
  // Author selection: a numeric author id, the string "rotate" for
  // round-robin assignment, or null/omitted to fall back to free text.
  authorId?: number | "rotate" | null;
  author?: string; // free-text fallback / legacy
  readMinutes?: number;
  body: string;
  published: boolean;
  datePublished: string;
  keywords?: string;
  focusKeyword?: string;
  citations?: Citation[];
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  featuredImageWidth?: number | null;
  featuredImageHeight?: number | null;
  featuredImageCredit?: string | null;
};

// Resolve the author selection into a { name, photoUrl, id } snapshot stored
// on the post. Round-robin advances a pointer in app_state so each new
// "rotate" post gets the next author in (sort_order, id) order.
async function resolveAuthor(
  authorId: number | "rotate" | null | undefined,
  fallbackName: string | undefined
): Promise<{ id: number | null; name: string | null; photoUrl: string | null }> {
  if (authorId === "rotate") {
    const all = await db.execute(
      "SELECT id, name, photo_url FROM authors ORDER BY sort_order IS NULL, sort_order, id"
    );
    if (all.rows.length === 0) {
      return { id: null, name: fallbackName || null, photoUrl: null };
    }
    const ptr = await db.execute({
      sql: "SELECT value FROM app_state WHERE key = 'last_author_id'",
      args: [],
    });
    const lastId = ptr.rows[0] ? Number(ptr.rows[0].value) : null;
    const idx =
      lastId == null
        ? 0
        : (all.rows.findIndex((r) => Number(r.id) === lastId) + 1) % all.rows.length;
    const chosen = all.rows[idx];
    await db.execute({
      sql: "INSERT INTO app_state (key, value) VALUES ('last_author_id', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [String(chosen.id)],
    });
    return {
      id: Number(chosen.id),
      name: String(chosen.name),
      photoUrl: chosen.photo_url ? String(chosen.photo_url) : null,
    };
  }
  if (typeof authorId === "number") {
    const row = await db.execute({
      sql: "SELECT id, name, photo_url FROM authors WHERE id = ? LIMIT 1",
      args: [authorId],
    });
    if (row.rows[0]) {
      return {
        id: Number(row.rows[0].id),
        name: String(row.rows[0].name),
        photoUrl: row.rows[0].photo_url ? String(row.rows[0].photo_url) : null,
      };
    }
  }
  return { id: null, name: fallbackName || null, photoUrl: null };
}

export const getBlogPostsAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, slug, title, description, category, author, author_id, author_photo_url, read_minutes, body, date_published, published, keywords, focus_keyword, citations, featured_image_url, featured_image_alt, featured_image_width, featured_image_height, featured_image_credit, facebook_post_id, facebook_posted_at FROM blog_posts ORDER BY date_published DESC, id DESC"
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
    const a = await resolveAuthor(data.authorId, data.author);
    await db.execute({
      sql: "INSERT INTO blog_posts (slug, title, description, category, author, author_id, author_photo_url, read_minutes, body, published, date_published, keywords, focus_keyword, citations, featured_image_url, featured_image_alt, featured_image_width, featured_image_height, featured_image_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.slug,
        data.title,
        data.description,
        data.category || null,
        a.name,
        a.id,
        a.photoUrl,
        data.readMinutes ?? null,
        data.body,
        data.published ? 1 : 0,
        data.datePublished,
        data.keywords?.trim() || null,
        data.focusKeyword?.trim() || null,
        data.citations && data.citations.length
          ? JSON.stringify(data.citations)
          : null,
        data.featuredImageUrl || null,
        data.featuredImageAlt || null,
        data.featuredImageWidth ?? null,
        data.featuredImageHeight ?? null,
        data.featuredImageCredit || null,
      ],
    });
    if (data.published) {
      try {
        const { pingIndexNow } = await import("./indexnow");
        await pingIndexNow([
          `https://koverking.com/blog/${data.slug}`,
          "https://koverking.com/blog",
        ]);
      } catch {
        /* best-effort */
      }
    }
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
    const a = await resolveAuthor(data.authorId, data.author);
    await db.execute({
      sql: "UPDATE blog_posts SET slug = ?, title = ?, description = ?, category = ?, author = ?, author_id = ?, author_photo_url = ?, read_minutes = ?, body = ?, published = ?, date_published = ?, keywords = ?, focus_keyword = ?, citations = ?, featured_image_url = ?, featured_image_alt = ?, featured_image_width = ?, featured_image_height = ?, featured_image_credit = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
      args: [
        data.slug,
        data.title,
        data.description,
        data.category || null,
        a.name,
        a.id,
        a.photoUrl,
        data.readMinutes ?? null,
        data.body,
        data.published ? 1 : 0,
        data.datePublished,
        data.keywords?.trim() || null,
        data.focusKeyword?.trim() || null,
        data.citations && data.citations.length
          ? JSON.stringify(data.citations)
          : null,
        data.featuredImageUrl || null,
        data.featuredImageAlt || null,
        data.featuredImageWidth ?? null,
        data.featuredImageHeight ?? null,
        data.featuredImageCredit || null,
        data.originalSlug,
      ],
    });
    if (data.published) {
      try {
        const { pingIndexNow } = await import("./indexnow");
        await pingIndexNow([
          `https://koverking.com/blog/${data.slug}`,
          "https://koverking.com/blog",
        ]);
      } catch {
        /* best-effort */
      }
    }
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

// Share a published post to the Facebook Page as a link card.
export const shareToFacebook = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; slug: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<{ success: true; postId: string } | { success: false; error: string }> => {
      await assertSession(data.token);
      const row = await db.execute({
        sql: "SELECT title, description, published FROM blog_posts WHERE slug = ? LIMIT 1",
        args: [data.slug],
      });
      const r = row.rows[0];
      if (!r) return { success: false, error: "Post not found." };
      if (Number(r.published) !== 1) {
        return { success: false, error: "Publish the post before sharing it." };
      }
      const title = String(r.title);
      const description = String(r.description || "");
      const link = `${SITE_URL}/blog/${data.slug}`;
      const message = description ? `${title}\n\n${description}` : title;

      const { postToFacebook } = await import("./facebook");
      const result = await postToFacebook({ message, link });
      if (!result.ok) return { success: false, error: result.error };

      await db.execute({
        sql: "UPDATE blog_posts SET facebook_post_id = ?, facebook_posted_at = CURRENT_TIMESTAMP WHERE slug = ?",
        args: [result.postId, data.slug],
      });
      return { success: true, postId: result.postId };
    }
  );

// ─── Local-SEO directories (auth required) ───────────────────────────────────

export const getDirectories = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, name, url, category, notes, status, listing_url FROM directories ORDER BY (status='live'), (status='submitted'), category, name LIMIT 300"
    );
    return result.rows;
  });

// Seed the known directories + AI-research more; insert any new ones.
export const scanDirectories = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<{ success: true; added: number } | { success: false; error: string }> => {
      await assertSession(data.token);
      const { SEED_DIRECTORIES, researchDirectories } = await import("./directory-agent");
      const researched = await researchDirectories();
      const all = [...SEED_DIRECTORIES, ...researched];

      const existing = await db.execute("SELECT url FROM directories");
      const known = new Set(
        existing.rows.map((r) => String(r.url).replace(/\/+$/, "").toLowerCase())
      );
      let added = 0;
      for (const d of all) {
        const key = d.url.replace(/\/+$/, "").toLowerCase();
        if (known.has(key)) continue;
        known.add(key);
        try {
          await db.execute({
            sql: "INSERT OR IGNORE INTO directories (name, url, category, notes) VALUES (?, ?, ?, ?)",
            args: [d.name, d.url, d.category || null, d.notes || null],
          });
          added++;
        } catch {
          /* skip dupes/bad rows */
        }
      }
      return { success: true, added };
    }
  );

export const updateDirectory = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      id: number;
      status?: string;
      listingUrl?: string;
      notes?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({
      sql: "UPDATE directories SET status = COALESCE(?, status), listing_url = COALESCE(?, listing_url), notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [data.status ?? null, data.listingUrl ?? null, data.notes ?? null, data.id],
    });
    return { success: true as const };
  });

export const deleteDirectory = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({ sql: "DELETE FROM directories WHERE id = ?", args: [data.id] });
    return { success: true as const };
  });

// ─── Blog featured images (auth required) ────────────────────────────────────

// Generate an AI featured image from the editor's current title + description.
// Returns the image fields for the admin form to hold until save.
export const generateFeaturedImage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { token: string; title: string; description?: string; slug?: string }) => data
  )
  .handler(
    async ({
      data,
    }): Promise<
      | {
          success: true;
          url: string;
          alt: string;
          width: number;
          height: number;
          credit: string;
        }
      | { success: false; error: string }
    > => {
      await assertSession(data.token);
      if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "OPENAI_API_KEY is not configured." };
      }
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: "Image storage isn't configured. Enable Vercel Blob (BLOB_READ_WRITE_TOKEN).",
        };
      }
      try {
        const { generateFeaturedImage: gen } = await import("./blog-image");
        const img = await gen({
          title: data.title,
          description: data.description,
          slug: data.slug || "post",
        });
        return { success: true, ...img };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: `Image generation failed: ${msg}` };
      }
    }
  );

// Upload a user-provided featured image to Vercel Blob (path blog/...).
export const uploadFeaturedImage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      filename: string;
      contentType: string;
      dataBase64: string;
    }) => data
  )
  .handler(
    async ({
      data,
    }): Promise<{ success: true; url: string } | { success: false; error: string }> => {
      await assertSession(data.token);
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error: "Image storage isn't configured. Enable Vercel Blob (BLOB_READ_WRITE_TOKEN).",
        };
      }
      if (!data.dataBase64) return { success: false, error: "No image data received." };
      try {
        const buffer = Buffer.from(data.dataBase64, "base64");
        if (buffer.length > 8 * 1024 * 1024) {
          return { success: false, error: "Image is too large (max 8MB)." };
        }
        const { put } = await import("@vercel/blob");
        const safeName = (data.filename || "image").replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await put(`blog/${Date.now()}-${safeName}`, buffer, {
          access: "public",
          contentType: data.contentType || "image/jpeg",
        });
        return { success: true, url: blob.url };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: `Upload failed: ${msg}` };
      }
    }
  );

// Bulk: generate an AI image for every published post missing one.
export const bulkGenerateMissingImages = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<
      | { success: true; generated: number; failed: number }
      | { success: false; error: string }
    > => {
      await assertSession(data.token);
      if (!process.env.OPENAI_API_KEY || !process.env.BLOB_READ_WRITE_TOKEN) {
        return { success: false, error: "OpenAI and Vercel Blob must both be configured." };
      }
      const rows = await db.execute(
        "SELECT slug, title, description FROM blog_posts WHERE featured_image_url IS NULL ORDER BY id DESC LIMIT 20"
      );
      const { generateFeaturedImage: gen } = await import("./blog-image");
      let generated = 0;
      let failed = 0;
      for (const r of rows.rows) {
        try {
          const img = await gen({
            title: String(r.title),
            description: String(r.description || ""),
            slug: String(r.slug),
          });
          await db.execute({
            sql: "UPDATE blog_posts SET featured_image_url = ?, featured_image_alt = ?, featured_image_width = ?, featured_image_height = ?, featured_image_credit = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
            args: [img.url, img.alt, img.width, img.height, img.credit, String(r.slug)],
          });
          generated++;
        } catch {
          failed++;
        }
      }
      return { success: true, generated, failed };
    }
  );

// ─── Weekly SEO keyword ideas (auth required) ────────────────────────────────

export const getKeywordIdeas = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, batch_date, rank, keyword, title, rationale, intent, status FROM keyword_ideas ORDER BY batch_date DESC, rank ASC, id ASC LIMIT 100"
    );
    return result.rows;
  });

export const updateKeywordIdeaStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number; status: string }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({
      sql: "UPDATE keyword_ideas SET status = ? WHERE id = ?",
      args: [data.status, data.id],
    });
    return { success: true as const };
  });

// Manual "Generate ideas now" — runs the same agent the Monday cron uses.
export const runKeywordIdeasNow = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<
      | { success: true; batchDate: string; count: number; emailed: boolean; note?: string }
      | { success: false; error: string }
    > => {
      await assertSession(data.token);
      const { runWeeklyKeywordIdeas } = await import("./seo-agent");
      const result = await runWeeklyKeywordIdeas();
      if (!result.success) {
        return { success: false, error: result.error || "Could not generate ideas." };
      }
      return {
        success: true,
        batchDate: result.batchDate,
        count: result.ideas.length,
        emailed: result.emailed,
        note: result.emailed ? undefined : result.error,
      };
    }
  );

// ─── Backlink outreach (auth required) ───────────────────────────────────────

export const getOutreach = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, domain, source_url, source_title, post_slug, post_title, email, status, draft_subject, draft_body, sent_at, error FROM outreach ORDER BY (status='sent'), updated_at DESC, id DESC LIMIT 200"
    );
    return result.rows;
  });

// Scan every published post's citations and add any new domains as targets.
export const scanOutreachTargets = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const posts = await db.execute(
      "SELECT slug, title, citations FROM blog_posts WHERE citations IS NOT NULL"
    );
    const existing = await db.execute("SELECT domain FROM outreach");
    const known = new Set(existing.rows.map((r) => String(r.domain)));
    let added = 0;
    for (const p of posts.rows) {
      let cites: { title?: string; url?: string }[] = [];
      try {
        cites = JSON.parse(String(p.citations));
      } catch {
        continue;
      }
      if (!Array.isArray(cites)) continue;
      for (const c of cites) {
        if (!c?.url) continue;
        let domain = "";
        try {
          domain = new URL(c.url).hostname.replace(/^www\./, "");
        } catch {
          continue;
        }
        if (!domain || known.has(domain)) continue;
        known.add(domain);
        await db.execute({
          sql: "INSERT OR IGNORE INTO outreach (domain, source_url, source_title, post_slug, post_title, status) VALUES (?, ?, ?, ?, ?, 'found')",
          args: [domain, c.url, c.title || domain, String(p.slug), String(p.title)],
        });
        added++;
      }
    }
    return { success: true as const, added };
  });

export const findOutreachEmail = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const row = await db.execute({
      sql: "SELECT domain FROM outreach WHERE id = ? LIMIT 1",
      args: [data.id],
    });
    if (!row.rows[0]) return { success: false as const, error: "Not found" };
    const { discoverEmail } = await import("./outreach-agent");
    const email = await discoverEmail(String(row.rows[0].domain));
    await db.execute({
      sql: "UPDATE outreach SET email = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [email, email ? "email_found" : "no_email", data.id],
    });
    return { success: true as const, email };
  });

export const draftOutreach = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const row = await db.execute({
      sql: "SELECT domain, source_url, source_title, post_slug, post_title FROM outreach WHERE id = ? LIMIT 1",
      args: [data.id],
    });
    const r = row.rows[0];
    if (!r) return { success: false as const, error: "Not found" };
    const { buildOutreachDraft } = await import("./outreach-agent");
    const draft = buildOutreachDraft({
      siteTitle: String(r.source_title || r.domain),
      sourceUrl: String(r.source_url || ""),
      postSlug: String(r.post_slug || ""),
      postTitle: String(r.post_title || ""),
    });
    await db.execute({
      sql: "UPDATE outreach SET draft_subject = ?, draft_body = ?, status = CASE WHEN status='sent' THEN status ELSE 'drafted' END, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [draft.subject, draft.body, data.id],
    });
    return { success: true as const, ...draft };
  });

export const updateOutreach = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      token: string;
      id: number;
      email?: string;
      draftSubject?: string;
      draftBody?: string;
      status?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({
      sql: "UPDATE outreach SET email = COALESCE(?, email), draft_subject = COALESCE(?, draft_subject), draft_body = COALESCE(?, draft_body), status = COALESCE(?, status), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [
        data.email ?? null,
        data.draftSubject ?? null,
        data.draftBody ?? null,
        data.status ?? null,
        data.id,
      ],
    });
    return { success: true as const };
  });

export const sendOutreach = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(
    async ({
      data,
    }): Promise<{ success: true } | { success: false; error: string }> => {
      await assertSession(data.token);
      const row = await db.execute({
        sql: "SELECT email, draft_subject, draft_body, status FROM outreach WHERE id = ? LIMIT 1",
        args: [data.id],
      });
      const r = row.rows[0];
      if (!r) return { success: false, error: "Not found" };
      if (r.status === "sent") return { success: false, error: "Already sent" };
      const email = String(r.email || "");
      const subject = String(r.draft_subject || "");
      const body = String(r.draft_body || "");
      if (!email) return { success: false, error: "No email address on this target." };
      if (!subject || !body) return { success: false, error: "Draft the email first." };
      const { sendOutreachEmail } = await import("./outreach-agent");
      const { sent, error } = await sendOutreachEmail({ to: email, subject, body });
      if (!sent) {
        await db.execute({
          sql: "UPDATE outreach SET error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          args: [error || "send failed", data.id],
        });
        return { success: false, error: error || "Send failed" };
      }
      await db.execute({
        sql: "UPDATE outreach SET status = 'sent', sent_at = CURRENT_TIMESTAMP, error = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [data.id],
      });
      return { success: true };
    }
  );

// ─── Authors: roster CRUD (auth required) ────────────────────────────────────

type AuthorInput = {
  token: string;
  name: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
};

export const getAuthorsAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  // @ts-ignore - TanStack Start SSR register type mismatch
  .handler(async ({ data }) => {
    await assertSession(data.token);
    const result = await db.execute(
      "SELECT id, name, title, bio, photo_url, sort_order FROM authors ORDER BY sort_order IS NULL, sort_order, id"
    );
    return result.rows;
  });

export const createAuthor = createServerFn({ method: "POST" })
  .inputValidator((data: AuthorInput) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    if (!data.name?.trim()) {
      return { success: false as const, error: "Author name is required." };
    }
    // Append to the end of the rotation order.
    const max = await db.execute(
      "SELECT COALESCE(MAX(sort_order), 0) AS m FROM authors"
    );
    const nextOrder = Number(max.rows[0]?.m ?? 0) + 1;
    await db.execute({
      sql: "INSERT INTO authors (name, title, bio, photo_url, sort_order) VALUES (?, ?, ?, ?, ?)",
      args: [
        data.name.trim(),
        data.title?.trim() || null,
        data.bio?.trim() || null,
        data.photoUrl?.trim() || null,
        nextOrder,
      ],
    });
    return { success: true as const };
  });

export const updateAuthor = createServerFn({ method: "POST" })
  .inputValidator((data: AuthorInput & { id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    if (!data.name?.trim()) {
      return { success: false as const, error: "Author name is required." };
    }
    await db.execute({
      sql: "UPDATE authors SET name = ?, title = ?, bio = ?, photo_url = ? WHERE id = ?",
      args: [
        data.name.trim(),
        data.title?.trim() || null,
        data.bio?.trim() || null,
        data.photoUrl?.trim() || null,
        data.id,
      ],
    });
    return { success: true as const };
  });

export const deleteAuthor = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await assertSession(data.token);
    await db.execute({ sql: "DELETE FROM authors WHERE id = ?", args: [data.id] });
    // Existing posts keep their snapshotted author name/photo, so deleting an
    // author does not blank out past bylines.
    return { success: true as const };
  });

// Upload an author photo to Vercel Blob. The client sends the file as a
// base64 data string; we decode and store it, returning the public URL.
export const uploadAuthorPhoto = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { token: string; filename: string; contentType: string; dataBase64: string }) =>
      data
  )
  .handler(
    async ({
      data,
    }): Promise<
      { success: true; url: string } | { success: false; error: string }
    > => {
      await assertSession(data.token);
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
          success: false,
          error:
            "Photo storage isn't configured yet. Enable Vercel Blob and set BLOB_READ_WRITE_TOKEN.",
        };
      }
      if (!data.dataBase64) {
        return { success: false, error: "No image data received." };
      }
      try {
        const buffer = Buffer.from(data.dataBase64, "base64");
        // ~4MB cap to keep uploads quick and within request limits.
        if (buffer.length > 4 * 1024 * 1024) {
          return { success: false, error: "Image is too large (max 4MB)." };
        }
        const { put } = await import("@vercel/blob");
        const safeName = (data.filename || "author").replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await put(`authors/${Date.now()}-${safeName}`, buffer, {
          access: "public",
          contentType: data.contentType || "image/jpeg",
        });
        return { success: true, url: blob.url };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: `Upload failed: ${msg}` };
      }
    }
  );

// ─── AI blog generation ──────────────────────────────────────────────────────
// Admin types a subject; we research it on the live web (Tavily) and draft a
// post with OpenAI. Returns title/description/body for the admin to review and
// edit before publishing — it never writes to the DB directly.

// Pull a compact "what the web says" context for the subject. Best-effort: if
// the key is missing or the call fails, return "" and let the model write from
// its own knowledge rather than hard-failing the whole request.
async function researchSubject(
  subject: string
): Promise<{ context: string; citations: Citation[] }> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return { context: "", citations: [] };
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: subject,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
      }),
    });
    if (!res.ok) return { context: "", citations: [] };
    const json = (await res.json()) as {
      answer?: string;
      results?: { title?: string; url?: string; content?: string }[];
    };
    const parts: string[] = [];
    if (json.answer) parts.push(`Summary: ${json.answer}`);
    const citations: Citation[] = [];
    const seenDomains = new Set<string>();
    for (const r of json.results ?? []) {
      if (r.content) {
        parts.push(`Source (${r.title ?? r.url ?? "web"}): ${r.content}`);
      }
      // Collect citations, one per domain, capped at 5.
      if (r.url && citations.length < 5) {
        let domain = r.url;
        try {
          domain = new URL(r.url).hostname.replace(/^www\./, "");
        } catch {
          /* keep raw url as the dedup key */
        }
        if (!seenDomains.has(domain)) {
          seenDomains.add(domain);
          citations.push({ title: r.title?.trim() || domain, url: r.url });
        }
      }
    }
    // Cap context length to keep token usage and latency down.
    return { context: parts.join("\n\n").slice(0, 6000), citations };
  } catch {
    return { context: "", citations: [] };
  }
}

export const generateBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; subject: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<
      | {
          success: true;
          title: string;
          description: string;
          body: string;
          keywords: string;
          focusKeyword: string;
          category: string;
          citations: Citation[];
        }
      | { success: false; error: string }
    > => {
      await assertSession(data.token);

      const subject = (data.subject ?? "").trim();
      if (!subject) {
        return { success: false, error: "Please enter a subject first." };
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          error:
            "OpenAI API key is not configured on the server. Add OPENAI_API_KEY and redeploy.",
        };
      }

      const { context: research, citations } = await researchSubject(subject);

      // Allowed internal links — the model may ONLY link to these paths.
      const linkList = SITE_PAGES.map((p) => `- "${p.label}" -> ${p.path}`).join("\n");

      const systemPrompt = [
        "You are a content writer for Kover King Insurance, an independent insurance agency in Springfield, IL.",
        "Kover King compares quotes from 30+ carriers and has served Central Illinois for ~30 years. Phone: (217) 960-8997.",
        "Write a genuinely useful blog post for everyday readers — clear, warm, and practical, not salesy.",
        "LENGTH: The body must be a thorough, in-depth article of 700–900 words. Use 5–7 short sections (each with a ## heading) and include at least one bullet list where it fits naturally. Cover the topic comprehensively with genuinely useful detail — do not pad with fluff or repeat yourself.",
        "STRICT BODY FORMAT (the site renderer only understands this):",
        "- Separate paragraphs with a blank line.",
        '- A line starting with "## " is a section heading.',
        '- A line starting with "- " is a bullet point.',
        "- You MAY use **bold** for emphasis on key terms. Do NOT use italics, images, or code.",
        "INTERNAL LINKS (for SEO): Naturally weave in 2–4 internal links using the EXACT syntax [anchor text](/path). You may ONLY link to these pages — never invent other internal URLs, and do not link the same page more than once:",
        linkList,
        "REQUIRED: at least one internal link MUST point to the most relevant SERVICE page for this topic (e.g. a home-insurance article must include [home insurance](/home-insurance)). Do not rely only on /contact. Put links in body paragraphs, never in the title or headings. Do NOT add external links in the body — sources are handled separately.",
        "Do NOT invent statistics, dollar amounts, dates, or local facts unless they appear in the provided research. When unsure, keep claims general.",
        `Choose the single best category from this list: ${BLOG_CATEGORIES.join(", ")}.`,
        "Return ONLY a JSON object with exactly these keys:",
        "- title (string, <=60 chars, no brand suffix)",
        "- description (string, 1-2 sentence meta summary, <=160 chars)",
        "- body (string, the article using the format rules above, including the internal links)",
        "- focusKeyword (string, the single primary keyword phrase this post targets)",
        "- keywords (string, 5-8 comma-separated keywords including long-tail variations)",
        "- category (string, exactly one of the category list above)",
      ].join("\n");

      const userPrompt = research
        ? `Subject: ${subject}\n\nWeb research to ground the article (use only what's relevant, do not copy verbatim):\n${research}`
        : `Subject: ${subject}\n\n(No external research available — write from general, accurate knowledge and avoid specific unverifiable figures.)`;

      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          max_tokens: 2600,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });
        const raw = completion.choices[0]?.message?.content ?? "";
        let parsed: {
          title?: string;
          description?: string;
          body?: string;
          focusKeyword?: string;
          keywords?: string;
          category?: string;
        };
        try {
          parsed = JSON.parse(raw);
        } catch {
          return {
            success: false,
            error: "The AI returned an unexpected format. Please try again.",
          };
        }
        if (!parsed.title || !parsed.description || !parsed.body) {
          return {
            success: false,
            error: "The AI response was incomplete. Please try again.",
          };
        }
        // Constrain category to the known set; default to first if off-list.
        const category =
          parsed.category &&
          (BLOG_CATEGORIES as readonly string[]).includes(parsed.category.trim())
            ? parsed.category.trim()
            : "";
        return {
          success: true,
          title: parsed.title.trim(),
          description: parsed.description.trim(),
          body: parsed.body.trim(),
          keywords: (parsed.keywords ?? "").trim(),
          focusKeyword: (parsed.focusKeyword ?? "").trim(),
          category,
          citations,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return {
          success: false,
          error: `AI generation failed: ${msg}`,
        };
      }
    }
  );

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
    try {
      const { sendLeadNotification } = await import("./outreach-agent");
      await sendLeadNotification({
        kind: "Quote request (Meta Lead Ad)",
        replyTo: data.email,
        fields: [
          { label: "Name", value: `${data.first_name} ${data.last_name}`.trim() },
          { label: "Email", value: data.email },
          { label: "Phone", value: data.phone },
          { label: "Details", value: details },
        ],
      });
    } catch {
      /* notification is best-effort */
    }
    return { success: true };
  });
