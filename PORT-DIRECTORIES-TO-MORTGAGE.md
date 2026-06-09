# Port the "Directories" (local-SEO citations) feature → illinois-mortgage

You are working in the **illinois-mortgage** repo (`~/Desktop/illinois-mortgage`), a
licensed Illinois mortgage broker site (TanStack Start + **Convex**). A sibling
**insurance** site, kover-king (`~/Desktop/Websites/kover-king`, TanStack Start +
**LibSQL/Turso raw SQL**), just built a **"Directories"** admin feature for local-SEO
citations. Port the same feature here, **adapting it to this repo's Convex stack — do
NOT copy the raw-SQL code.**

## What the feature does (product spec)
A **"Directories" tab** in the admin that helps the business earn local-SEO **citations**
— listings of its NAP (Name / Address / Phone) on directory sites (Google Business
Profile, Yelp, BBB, Bing Places, Apple Business Connect, YellowPages, chambers of
commerce, and **industry-specific** directories). Each listing is a backlink + a
local-ranking signal.

It **finds and tracks** directories; it does **not** auto-submit (every directory
requires manual account creation + verification — phone/postcard/email — which can't be
automated and would break their terms). The tab removes the "which directories, and did
I do them?" overhead; the user still clicks submit on each site.

### Naming note
In kover-king the word "citations" was already taken (blog research sources), so the
feature was named **"Directories."** Check this repo: if "citations" is free, you may use
"Local Citations"; otherwise use "Directories." Don't collide with existing names.

## Reference implementation (kover-king — read these for the design, then re-implement in Convex)
- `~/Desktop/Websites/kover-king/app/lib/directory-agent.ts` — the seed list + AI research
  (Tavily search + OpenAI structuring). **This file is stack-agnostic; port it almost
  verbatim** (it's plain `fetch` + the `openai` SDK, no DB).
- `~/Desktop/Websites/kover-king/app/lib/actions.ts` — search for
  `getDirectories` / `scanDirectories` / `updateDirectory` / `deleteDirectory`
  (the server-fn + auth + DB pattern to mirror).
- `~/Desktop/Websites/kover-king/app/lib/db.ts` — the `directories` table DDL.
- `~/Desktop/Websites/kover-king/app/routes/admin_.dashboard.tsx` — search for
  `DirectoriesPanel` and the `tab === "directories"` wiring (the admin tab + NAP card +
  status-dropdown rows). Also `OutreachPanel` is the closest sibling pattern.

## Build for illinois-mortgage (Convex)

### 1. Data model (`convex/schema.ts`)
Add a `directories` table:
- `name: v.string()`
- `url: v.string()` (treat as unique — dedupe on insert by normalized URL/domain)
- `category: v.optional(v.string())`  // "Core" | "General" | "Local IL" | "Mortgage"
- `notes: v.optional(v.string())`
- `status: v.string()`  // "not_started" | "submitted" | "live" | "skipped" (default "not_started")
- `listingUrl: v.optional(v.string())`  // the live backlink once listed
- Add an index on `url` for dedupe lookups.

### 2. Research agent (`convex/directories.ts` — actions, Clerk/auth-gated)
Port `directory-agent.ts`:
- **`SEED_DIRECTORIES`** constant — the always-relevant ones, **re-themed for a MORTGAGE
  broker**: Google Business Profile, Bing Places, Apple Business Connect, Yelp, BBB,
  Facebook, YellowPages, Manta, Foursquare, **Zillow / Lender directories / NMLS Consumer
  Access**, **mortgage-broker directories**, **Illinois + local chamber of commerce**.
  (kover-king's list uses TrustedChoice + insurance directories — swap those for
  mortgage equivalents.)
- **`researchDirectories()`** action:
  - A few Tavily searches (reuse this repo's existing Tavily/OpenAI env + patterns):
    "best business directories for local SEO citations", "Illinois business directory
    submit listing", "mortgage broker / loan officer directories submit listing",
    "Springfield/Chicago IL chamber of commerce business listing" (use this site's
    actual service area).
  - Feed snippets to `gpt-4o-mini` (`response_format: json_object`) → return
    `{ directories: [{name, url, category, notes}] }`, max ~12. Constrain: real
    submittable directory/listing sites only — **exclude blog posts, articles,
    listicles, competitors**. Dedupe by domain. Guard bad JSON.
  - `OPENAI_API_KEY` + `TAVILY_API_KEY` already exist in this repo's Convex env.

### 3. Convex functions (`convex/directories.ts`)
- `list` (query) — return all directories, ordered live → submitted → category → name.
- `scan` (action) — seed `SEED_DIRECTORIES` + run `researchDirectories()`; insert any
  new ones not already present (dedupe by normalized URL). Return `{ added }`.
- `update` (mutation) — patch `status` / `listingUrl` / `notes` by id.
- `remove` (mutation) — delete by id.
All auth-gated the way this repo gates admin mutations (Clerk identity check).

### 4. Admin UI (`src/routes/admin.tsx`)
- New **"Directories"** tab (match this repo's existing tab pattern).
- **NAP card** at the top — pull this site's real NAP (name, address, city/state/zip,
  phone, email, site URL — find the equivalent of kover-king's `app/lib/seo.ts` `NAP`)
  with a **Copy** button. Lead copy: "Use these EXACT details on every directory —
  consistent NAP is the #1 local-SEO factor."
- **"Find directories"** button → calls `scan` (spinner; shows count added).
- Each row: directory name (links out, new tab), category chip, notes, a **status
  dropdown** (Not started / Submitted / Live / Skipped), and — when Live — a field to
  paste the **live listing URL** (the backlink). Plus a delete button.

## Quality & process
- Match this repo's conventions (Convex queries/mutations/actions, its auth gate, its
  admin styling/components) — don't paste TanStack/SQL code.
- No fabricated business facts; NAP must be the real, verified mortgage-broker details
  (NMLS / address / phone). Equal Housing Opportunity discipline applies.
- `pnpm build` (or this repo's build) green after the change; fix type errors.
- No new API keys — reuses the existing OpenAI + Tavily Convex env vars.

## Honesty notes to carry over
- Finds + tracks only; **no auto-submission** (manual signup/verify per directory).
- AI-discovered URLs are occasionally weak (an article vs. a real listing page) — the
  seed list guarantees the high-value ones; the user can delete junk rows.
- Consistency of NAP across all directories is the whole point — the Copy-NAP card
  enforces it.
