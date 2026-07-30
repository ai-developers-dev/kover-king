# Fix AI blog featured-image quality → illinois-mortgage

You are working in the **illinois-mortgage** repo (`~/Desktop/illinois-mortgage`), a
licensed Illinois mortgage broker site (TanStack Start + **Convex**). The AI-generated
blog **featured images** look bad. The sibling insurance site (kover-king) had the exact
same problem and fixed it — apply the same fix here, **in this repo's Convex code**
(`convex/blogImage.ts`), not by copying kover-king's TypeScript.

## What was actually wrong (diagnosis from kover-king)
The images were ugly for THREE reasons — none of them the model itself:
1. **Garbled text in the image.** The scene-picker kept choosing "person reviewing
   insurance/mortgage **documents** at a desk / on a **laptop**," so the image model
   rendered fake, misspelled words on the paper/screen — the #1 thing that makes AI
   images look amateur.
2. **Heavy orange/amber color cast.** The style prompt asked for "warm amber light to
   complement the brand," which drenched every photo in an unnatural sepia/golden wash.
3. **Repetitive composition** — almost always "people around a table."

Plus two operational gotchas that masquerade as "it's broken":
4. **OpenAI billing hard limit.** When the account hits its spend cap, image calls return
   HTTP **400 `billing_hard_limit_reached`** (or 429). It's an account billing issue, NOT
   a code bug — raise the limit in OpenAI → Settings → Billing → Limits.
5. **Browser cache + stale data.** New images live behind the same-ish URL; a hard refresh
   is needed, and existing posts keep their OLD image until regenerated.

## The fix (apply in `convex/blogImage.ts`)

### A. You are already on the best model — just raise quality
Confirm the image call uses **`gpt-image-1`** (the top OpenAI image model; there is nothing
higher) at `size: '1536x1024'`. Change `quality` from `'medium'` → **`'high'`** (and
`output_compression` ~85). If there's a **dall-e-3 fallback**, bump its `quality` from
`'standard'` → **`'hd'`**. Keep the fallback — gpt-image-1 needs org verification and can
400 on some accounts.

### B. Rewrite the SCENE prompt (the gpt-4o-mini step that picks the scene)
Make it:
- **Prefer real-life, mostly OUTDOOR lifestyle moments** relevant to a mortgage/home
  audience (a family at the front door of a new home, kids playing in a yard, a couple
  carrying boxes up a driveway, keys handed over on a porch, a tree-lined Midwestern
  street, a "for sale → sold" feeling WITHOUT any actual sign text).
- **Explicitly AVOID** people staring at laptops, holding paperwork, or reviewing
  documents at a table — state that the model renders such text as gibberish.
- **Hard constraint:** absolutely NO text, words, letters, numbers, paper, documents,
  screens, logos, watermarks, or signage anywhere in the image.
- **Vary the composition** every time; never default to "people around a table."

### C. Rewrite the STYLE prompt (the wrapper sent to the image model)
- Demand **bright, clean, natural daylight with neutral white balance and true-to-life,
  balanced color.** Explicitly say **NOT orange-tinted, NOT a heavy warm/amber or
  golden-hour/sepia wash** (this is what fixed the cast).
- "crisp and realistic, like a real DSLR photo," natural soft depth of field.
- Re-state the no-text/paper/screens/signage constraint.
- The brand should come from the SITE UI around the image, **not** from tinting the photo.

### D. Regenerate existing posts
Existing posts keep their old (bad) images until regenerated. After deploying the prompt
fix: run the bulk/"regenerate" path. Note the kover-king bulk job only targeted posts with
NO image — to refresh posts that ALREADY have an image, either (a) temporarily null the
image field first, or (b) add a "force regenerate" path / per-post Regenerate button. Do a
hard browser refresh afterward (image URLs cache).

## Reference (kover-king's fixed version — read for wording, re-implement in Convex)
- `~/Desktop/Websites/kover-king/app/lib/blog-image.ts` — the corrected `SCENE_SYSTEM`
  prompt, `stylePrompt()` wrapper, and the `gpt-image-1` (quality:'high') + `dall-e-3`
  (quality:'hd') calls. Copy the PROMPT WORDING; adapt insurance→mortgage themes and wire
  it into this repo's Convex action.

## Verify
1. Build green.
2. With OpenAI billing limit raised: regenerate one post → fetch the image and eyeball it:
   **no orange cast, no garbled text, outdoor/varied scene, sharp.**
3. Confirm it's `gpt-image-1` (1536×1024) succeeding (not silently falling back to
   dall-e-3 — log which model produced it).
4. Hard-refresh the blog to bust the image cache.

## Honesty notes
- "Highest model" = `gpt-image-1`; the only quality lever is the `quality` param (now
  `high`). `high` costs ~2–3× more per image than `medium` — relevant for billing.
- A 400/429 from image generation is almost always the OpenAI **billing cap**, not the
  code. Check billing before debugging code.
- Re-theme all scene examples for a **mortgage** audience (home-buying / move-in / keys /
  neighborhoods), not insurance.
