# Port blog + SEO features from illinois-mortgage → kover-king

You are working in the **kover-king** repo (`~/Desktop/Websites/kover-king`), an Illinois auto/home/life/business **insurance** lead-gen site. A sibling **mortgage** site at `~/Desktop/illinois-mortgage` has blog + SEO features I want mirrored here so both sites have identical capabilities. Port these features **into kover-king, adapting them to kover-king's existing stack — do NOT copy Convex code.**

**Stack facts (important):**
- **kover-king:** TanStack Start + Vite/Vinxi, **LibSQL/Turso** raw SQL (`@libsql/client`; schema in `app/lib/db.ts` `initDb()`), server functions via **`createServerFn`** in `app/lib/actions.ts` (protected ones call `assertSession(token)`), binary storage via **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`; see `uploadAuthorPhoto()`), OpenAI via the **`openai` SDK** (`OPENAI_API_KEY`), admin UI at `app/routes/admin_.dashboard.tsx`.
- **illinois-mortgage (reference only):** TanStack Start + **Convex**. Read its files for the design, then re-implement equivalently in kover-king's stack.

**First, read the reference design docs:**
- `~/Desktop/illinois-mortgage/docs/superpowers/specs/2026-06-06-blog-featured-images-design.md`
- `~/Desktop/illinois-mortgage/docs/superpowers/plans/2026-06-06-blog-featured-images.md`

Then review both codebases and give me a short plan (files to touch per feature) before large changes. Implement in this order:

**1. AI-generated featured images for blog posts (primary).**
Reference: `~/Desktop/illinois-mortgage/convex/blogImage.ts` (two-step prompt + generation + dall-e-3 fallback + webp), `src/routes/admin.tsx` (`FeaturedImagePicker`), `src/routes/blog.$slug.tsx` + `src/routes/blog.index.tsx` (display), `src/lib/seo.ts` (image/imageAlt), `convex/posts.ts` (`setFeaturedImage`/`listMissingImage`/upsert fields).
Build for kover-king:
- **DB:** add to `blog_posts` (idempotent ALTER in `initDb()`): `featured_image_url TEXT`, `featured_image_alt TEXT`, `featured_image_width INTEGER`, `featured_image_height INTEGER`, `featured_image_credit TEXT`.
- **Generation** (`createServerFn`, session-protected, in `app/lib/actions.ts`): (a) `gpt-4o-mini` reads the post **title + description** → returns JSON `{scene, alt}`, one concrete, photographable **insurance** scene (a family by their car in an Illinois driveway, a homeowner on their porch, a small-business owner at their shop, a couple reviewing coverage at a kitchen table). VARY composition; never a generic car/house. No text/logos/signage in the image; people warm, diverse, non-stereotypical; never depict accidents, damage, cash, or "approved/guaranteed" stamps. (b) wrap `scene` in a fixed brand style template → call **`gpt-image-1`** (`size:'1536x1024'`, `quality:'medium'`, `output_format:'webp'`, `output_compression:80`); on any error fall back to **`dall-e-3`** (`size:'1792x1024'`, returns a URL to fetch). Upload bytes to **Vercel Blob** (reuse `uploadAuthorPhoto()`'s pattern, path `blog/{slug}-{ts}.webp`); store the Blob URL + alt + dims + credit `"AI-generated (OpenAI)"` on the post.
- **Admin** (`admin_.dashboard.tsx`): a "Featured image" block with **Generate with AI** (uses the editor's current title + description), **Regenerate**, **Upload your own** (Vercel Blob), and a **required alt-text** field (block publish if an image is set without alt). Plus a bulk **"Generate images for all posts missing one."**
- **Public:** render the image as the post **hero** on `blog.$slug.tsx` (eager, `fetchpriority="high"`, explicit width/height, 16:9 `object-cover`, alt), a **lazy card thumbnail** on the blog index, and as the **OG/Twitter image** + `BlogPosting` schema `image` (replace the current authorPhoto/favicon fallback). Small "AI-generated (OpenAI)" caption.

**2. `llms.txt`.** Reference `~/Desktop/illinois-mortgage/public/llms.txt`. Create `public/llms.txt` for kover-king: short markdown describing koverking.com (Illinois insurance agency), key pages (auto/home/life/business/landlord/duplex insurance, blog, contact), and a note that quotes are by request (no binding quotes online). Confirm it serves at `/llms.txt`.

**3. Real default OG image (fix the broken reference).** `app/routes/__root.tsx` points `og:image` at `https://koverking.com/og-image.png` but no such file exists. Reference `~/Desktop/illinois-mortgage/scripts/og-card.html` (a 1200×630 HTML card rendered to PNG via headless Chrome — render command is in the file's top comment). Create `scripts/og-card.html` themed to kover-king's brand, render it to `public/og-image.png` (1200×630) with headless Chrome, and keep the HTML in `scripts/` for re-rendering.

**4. GA4 + Search Console wiring (env-gated, off by default).** Reference `~/Desktop/illinois-mortgage/src/routes/__root.tsx` (GA4 via a `VITE_GA_ID` env + a Search Console verification meta, both no-ops when unset). Add the same to kover-king's `__root.tsx` so a GA4 Measurement ID + GSC token can be dropped in later with no code change. Add `geo` meta tags if missing.

**5. Make the visuals pixel-match kover-king's real brand — don't guess.** Before building the OG card (item 3), extract kover-king's actual design tokens from the repo so everything looks like one brand:
- **Fonts:** find the font families and any Google Fonts `@import` / `<link>` in the app CSS (e.g., `app/styles/app.css`) and/or the Tailwind theme, and use those **exact** families in `scripts/og-card.html` (load them via the same Google Fonts URL so the card renders with the real typeface, not a system fallback).
- **Colors:** pull the real brand values from the CSS variables / Tailwind theme — the orange `primary-*` scale, plus text/background/surface tokens — instead of hardcoding a guessed hex. (The header uses `~#E9560C`; confirm the actual token.)
- **Logo:** if `public/logos/` has a usable mark, place it on the card.
- **Reference:** `~/Desktop/illinois-mortgage/scripts/og-card.html` does exactly this — it loads the mortgage site's real **Fraunces + Manrope** fonts and uses its actual navy/green CSS tokens. Mirror that approach with kover-king's tokens.
- Apply the same "use the real tokens" discipline to the AI-image **style template's** brand cues and the blog **hero** styling, so the generated images, the OG card, and the site all read as one cohesive brand.

**Quality & process:** match kover-king's existing conventions (raw SQL, `createServerFn`, `assertSession`, Vercel Blob, the dashboard's styling). Alt text required on every image; inclusive, non-stereotypical imagery; no fabricated stats or guarantees (licensed insurance agency — keep its existing content discipline). Verify with the project's build (`vite build` / `pnpm build`) after each feature and fix type errors. Commit each feature separately with clear messages. The `OPENAI_API_KEY` is already set (no new key); `gpt-image-1` may require OpenAI org verification, which is why the `dall-e-3` fallback exists.
