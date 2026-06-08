# kover-king

Illinois auto/home/life/business **insurance** lead-gen site (koverking.com).

## ⭐ Pending work
**`PORT-FROM-MORTGAGE.md`** in this repo root contains a full, ready-to-run task:
port blog + SEO features (AI featured images, llms.txt, real OG image, GA4/GSC
wiring, brand-token extraction) from the sibling `~/Desktop/illinois-mortgage`
site into this stack. Read it before starting that work.

## Stack
- **Framework:** TanStack Start + Vite/Vinxi (SSR). Routes in `app/routes/`
  (file-based; `head: () => ({ meta, links })` for per-route SEO).
- **DB:** LibSQL/Turso, **raw SQL** via `@libsql/client`. Schema lives in
  `app/lib/db.ts` `initDb()` (CREATE TABLE IF NOT EXISTS + idempotent
  guarded `ALTER TABLE` in a try/catch loop).
- **Server logic:** `createServerFn` in `app/lib/actions.ts`. Protected
  functions call `assertSession(token)` first (admin session tokens in
  `admin_sessions`; client sends `getToken()` from sessionStorage).
- **Binary storage:** Vercel Blob (`BLOB_READ_WRITE_TOKEN`) — see
  `uploadAuthorPhoto()` for the upload pattern.
- **AI:** OpenAI SDK (`OPENAI_API_KEY`), `gpt-4o-mini`; Tavily for research.
- **Email:** Resend (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`,
  `LEAD_NOTIFY_TO`) — see `app/lib/outreach-agent.ts` / `app/lib/seo-agent.ts`.
- **Admin UI:** `app/routes/admin_.dashboard.tsx` (tabs: Quotes, Contacts,
  Blog, Authors, Keyword Ideas, Outreach).
- **SEO helpers:** `app/lib/seo.ts` (NAP, canonical, schema, SITE_PAGES map).
  Dynamic sitemap: `app/server/routes/sitemap.xml.ts`. IndexNow ping on publish.

## Deploy — IMPORTANT
- Hosted on **Vercel** (project `kover-king`, team `ai-developers-projects`).
- **Always deploy from source** (`npx vercel@latest deploy --prod`), never
  `--prebuilt` from this Mac — local builds ship macOS-native `@libsql`
  binaries that break on Vercel's Linux runtime (every DB route 500s).
- Playwright/Chromium **cannot** run on Vercel serverless (read-only FS,
  size, timeout). Use fetch + APIs instead.
- End commit messages with the Co-Authored-By line.

## Content discipline
Licensed insurance agency. No fabricated stats, prices, license numbers, or
guarantees. Inclusive, non-stereotypical imagery; alt text on every image.
