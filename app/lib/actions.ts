import { createServerFn } from "@tanstack/react-start";
import { db, initDb } from "~/lib/db";
import { SITE_PAGES, BLOG_CATEGORIES } from "~/lib/seo";

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
      "SELECT slug, title, description, category, author, author_photo_url, read_minutes, body, date_published, published FROM blog_posts WHERE published = 1 ORDER BY date_published DESC, id DESC"
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
      sql: "SELECT slug, title, description, category, author, author_photo_url, read_minutes, body, date_published, published, keywords, focus_keyword, citations FROM blog_posts WHERE slug = ? AND published = 1 LIMIT 1",
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
      "SELECT id, slug, title, description, category, author, author_id, author_photo_url, read_minutes, body, date_published, published, keywords, focus_keyword, citations FROM blog_posts ORDER BY date_published DESC, id DESC"
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
      sql: "INSERT INTO blog_posts (slug, title, description, category, author, author_id, author_photo_url, read_minutes, body, published, date_published, keywords, focus_keyword, citations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
    const a = await resolveAuthor(data.authorId, data.author);
    await db.execute({
      sql: "UPDATE blog_posts SET slug = ?, title = ?, description = ?, category = ?, author = ?, author_id = ?, author_photo_url = ?, read_minutes = ?, body = ?, published = ?, date_published = ?, keywords = ?, focus_keyword = ?, citations = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
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
    return { success: true };
  });
