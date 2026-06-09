# Port the "Link Opportunities" feature → illinois-mortgage

You are working in the **illinois-mortgage** repo (`~/Desktop/illinois-mortgage`), a
licensed Illinois mortgage broker site (TanStack Start + **Convex**). A sibling
**insurance** site, kover-king (`~/Desktop/Websites/kover-king`, TanStack Start +
**LibSQL/Turso raw SQL**), built a **"Link Opportunities"** admin feature for local-SEO
link building. Port it here, **adapting it to this repo's Convex stack — do NOT copy the
raw-SQL code.**

> This supersedes the earlier "Directories" port. The feature was broadened: directories
> are only ~1 of 7 local link-building channels, so it now covers them all.

## What the feature does (product spec)
A **"Link Opportunities" tab** in the admin that finds and tracks **every kind of local
backlink/citation opportunity**, grouped by category, so the business can earn links that
boost local SEO. It **finds + tracks only** — it does NOT auto-submit (each opportunity
needs manual signup / outreach / verification, which can't be automated and would break
sites' terms). It removes the "what's out there, and did I do it?" overhead.

### Categories (this is the core idea — not just directories)
- **Directory** — general business directories (Google Business Profile, Bing Places,
  Apple Business Connect, Yelp, BBB, Facebook, YellowPages, Manta, Foursquare).
- **Mortgage** — industry/niche directories (NMLS Consumer Access, Zillow lender
  directory, loan-officer / mortgage-broker directories). *(kover-king uses "Insurance" +
  TrustedChoice here — swap for mortgage equivalents.)*
- **Local IL** — Illinois/Springfield(or this site's actual market) chambers of commerce,
  civic orgs, city/county business directories.
- **Sponsorship** — local teams / events / charities that list & link their sponsors.
- **Partnership** — complementary local businesses to swap referrals/links with (real
  estate agents, **insurance agencies incl. the sister kover-king site**, title
  companies, home inspectors, builders).
- **News/PR** — local news/media outlets that cover community business stories.
- **Resource** — local blogs, "community resources" pages, guest-post targets.

Research insight to bake in: **sponsorships, partnerships, and chamber/local-org links
typically carry more ranking weight than plain directories** (they signal genuine
community involvement), so make sure the AI returns a MIX across categories, not all
directories.

## Reference implementation (kover-king — read for design, re-implement in Convex)
- `~/Desktop/Websites/kover-king/app/lib/directory-agent.ts` — `LINK_CATEGORIES`,
  `SEED_DIRECTORIES` (multi-category seed), and `researchDirectories()` (7 per-type
  Tavily searches + GPT categorization). **Stack-agnostic — port almost verbatim**
  (plain `fetch` + the `openai` SDK; just retheme insurance→mortgage).
- `~/Desktop/Websites/kover-king/app/lib/actions.ts` — `getDirectories` /
  `scanDirectories` / `updateDirectory` / `deleteDirectory` (server-fn + auth + DB).
- `~/Desktop/Websites/kover-king/app/lib/db.ts` — the `directories` table DDL.
- `~/Desktop/Websites/kover-king/app/routes/admin_.dashboard.tsx` — search
  `DirectoriesPanel` (NAP copy card, "Find opportunities" button, **rows grouped by
  category with counts**, status dropdown, live-listing-URL field).

## Build for illinois-mortgage (Convex)

### 1. Data model (`convex/schema.ts`)
Add a table (name it `linkOpportunities` if "directories"/"citations" feels too narrow;
otherwise `directories` is fine):
- `name: v.string()`
- `url: v.string()` (dedupe on insert by normalized URL/domain; add an index on `url`)
- `category: v.optional(v.string())`  // one of the 7 categories above
- `notes: v.optional(v.string())`
- `status: v.string()`  // "not_started" | "submitted" | "live" | "skipped" (default "not_started")
- `listingUrl: v.optional(v.string())`  // the live backlink once earned

### 2. Research agent (`convex/linkOpportunities.ts` — actions, auth-gated)
Port `directory-agent.ts`:
- **`LINK_CATEGORIES`** = Directory, Mortgage, Local IL, Sponsorship, Partnership, News/PR, Resource.
- **`SEED_OPPORTUNITIES`** — the always-relevant ones across categories, **re-themed for a
  mortgage broker** (Google/Bing/Apple/Yelp/BBB/Facebook/YellowPages/Manta/Foursquare for
  Directory; NMLS Consumer Access + Zillow + mortgage-broker directories for Mortgage;
  this site's local chamber for Local IL; a sponsorship prompt; a Partnership row pointing
  at the sister kover-king insurance site; the local newspaper for News/PR).
- **`research()`** action — ~7 per-category Tavily searches (business directories,
  mortgage/loan-officer directories, local chamber, charity/event sponsorships, local
  news/press, complementary-business partnerships, community resource pages) → feed
  snippets to `gpt-4o-mini` (`response_format: json_object`) → return
  `{ items: [{name, url, category, notes}] }`, up to ~18, **a mix across categories**.
  Constrain to real link opportunities; EXCLUDE competitor brokers, generic listicles,
  non-submittable articles. Validate `category` against `LINK_CATEGORIES` (default
  "Directory"). Guard bad JSON.
- Uses existing `OPENAI_API_KEY` + `TAVILY_API_KEY` Convex env vars (no new keys).

### 3. Convex functions
- `list` (query) — all rows, ordered live → submitted → category → name.
- `scan` (action) — seed `SEED_OPPORTUNITIES` + run `research()`; insert new (dedupe by
  normalized URL). Return `{ added }`.
- `update` (mutation) — patch `status` / `listingUrl` / `notes`.
- `remove` (mutation) — delete by id.
All gated by this repo's admin auth (Clerk identity check).

### 4. Admin UI (`src/routes/admin.tsx`)
- New **"Link Opportunities"** tab (match this repo's tab pattern).
- **NAP card** (Copy button) from this site's real NAP — "Use these EXACT details on every
  listing; consistent NAP is the #1 local-SEO factor."
- **"Find opportunities"** button → `scan` (spinner, shows count added).
- **Rows grouped by category** (heading + count per group). Each row: name (links out,
  new tab), category chip, notes, status dropdown (Not started / Submitted / Live /
  Skipped), and — when Live — a field to paste the live listing/backlink URL. Plus delete.

## Quality & process
- Match this repo's conventions (Convex queries/mutations/actions, its auth gate, admin
  styling). No raw SQL / TanStack server-fn code copied.
- Real, verified mortgage NAP (NMLS / address / phone); Equal Housing Opportunity
  discipline; no fabricated facts.
- Build green; fix type errors. No new API keys.

## Honesty notes to carry over
- Finds + tracks only; **no auto-submission** (manual per opportunity).
- AI results occasionally include a weak URL — the seed list guarantees the high-value
  ones; the user can delete junk rows.
- Sponsorships / partnerships / chamber links > plain directories for ranking weight.
- NAP consistency across everything is the whole point — the Copy-NAP card enforces it.
