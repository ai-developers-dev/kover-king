// AI featured-image generation for blog posts.
//
// Two steps so images are both RELEVANT and CONSISTENT:
//   1. gpt-4o-mini turns the post (title + description) into ONE concrete,
//      photographable INSURANCE scene + clean alt text.
//   2. that scene drops into a fixed brand STYLE template and is sent to an
//      OpenAI image model (gpt-image-1, falling back to dall-e-3).
// The resulting bytes are re-hosted on Vercel Blob (same as author photos).
// Reuses the existing OPENAI_API_KEY + BLOB_READ_WRITE_TOKEN (no new keys).

export type GeneratedImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
};

export const AI_IMAGE_CREDIT = "AI-generated (OpenAI)";

const SCENE_SYSTEM =
  "You are an art director choosing the featured image for a blog article from an independent Illinois insurance agency (Kover King, Springfield IL — auto, home, life, business, landlord, duplex). " +
  "Read BOTH the title AND the description carefully, then capture the article's SPECIFIC subject and angle — not a generic car or house. " +
  'Respond with strict JSON {"scene": string, "alt": string}. ' +
  '"scene" is ONE vivid, concrete, photographable sentence depicting a real moment that represents THIS article\'s topic. ' +
  "Pick a composition that fits the topic and VARY it across articles — e.g. a family loading their car in an Illinois driveway, a homeowner relaxing on a front porch, " +
  "a small-business owner opening up their shop, a couple reviewing coverage at a kitchen table, a young driver with their first car, a landlord outside a duplex, " +
  "a parent buckling a child into a car seat, a quiet tree-lined Springfield street. Do NOT default to a generic car or a generic house exterior. " +
  "Hard constraints: no text, words, numbers, charts, logos, watermarks, or signage anywhere in the image; if people appear they are warm, diverse, and non-stereotypical; " +
  'never depict accidents, vehicle/property damage, cash, or "approved"/"guaranteed" stamps. ' +
  '"alt" is concise (<=120 chars) descriptive alt text, warm and realistic, set in Illinois/the Midwest.';

/** Fixed brand style wrapper — the prompt actually sent to the image model. */
function stylePrompt(scene: string): string {
  return (
    `Photorealistic, editorial-quality landscape (16:9) featured image for an insurance article. ` +
    `Scene: ${scene} ` +
    `Style: warm natural daylight, clean modern Midwestern Illinois homes, driveways, and Main-Street neighborhoods, ` +
    `professional, reassuring, and trustworthy, lifestyle-documentary feel, soft depth of field, true-to-life color, ` +
    `with subtle warm amber/orange light that complements a warm brand palette. ` +
    `Absolutely no text, letters, numbers, logos, watermarks, or signage. No charts or dollar figures, no "approved" stamps. ` +
    `Never show accidents or damage. Any people are warm and natural in the scene, diverse, and non-stereotypical.`
  );
}

/** Step 1: title + description -> { scene, alt }. Falls back to the title. */
async function deriveScene(
  title: string,
  description?: string
): Promise<{ scene: string; alt: string }> {
  const key = process.env.OPENAI_API_KEY;
  const fallback = { scene: title, alt: title };
  if (!key) return fallback;
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        { role: "system", content: SCENE_SYSTEM },
        { role: "user", content: `Title: ${title}\nDescription: ${description ?? ""}` },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    const scene =
      typeof parsed.scene === "string" && parsed.scene.trim()
        ? parsed.scene.trim()
        : title;
    const alt =
      typeof parsed.alt === "string" && parsed.alt.trim() ? parsed.alt.trim() : title;
    return { scene, alt };
  } catch {
    return fallback;
  }
}

// Upload raw image bytes to Vercel Blob under blog/, return the public URL.
async function uploadToBlob(
  bytes: Uint8Array,
  slug: string,
  contentType: string,
  ext: string
): Promise<string> {
  const { put } = await import("@vercel/blob");
  const safeSlug = (slug || "post").replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`blog/${safeSlug}-${Date.now()}.${ext}`, Buffer.from(bytes), {
    access: "public",
    contentType,
  });
  return blob.url;
}

/** Step 2: render the styled prompt via OpenAI, re-host on Blob. */
async function renderImage(
  prompt: string,
  slug: string
): Promise<{ url: string; width: number; height: number }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured.");
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: key });

  // Primary: gpt-image-1 (returns base64 webp). Some orgs must be verified;
  // any failure falls through to dall-e-3.
  try {
    const g = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024",
      quality: "medium",
      output_format: "webp",
      output_compression: 80,
      n: 1,
    } as Record<string, unknown>);
    const b64 = g.data?.[0]?.b64_json;
    if (b64) {
      const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
      const url = await uploadToBlob(bytes, slug, "image/webp", "webp");
      return { url, width: 1536, height: 1024 };
    }
  } catch {
    /* fall through to dall-e-3 */
  }

  // Fallback: dall-e-3 (returns a temporary URL we fetch + store).
  const d = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1792x1024",
    quality: "standard",
    style: "natural",
    n: 1,
  });
  const imgUrl = d.data?.[0]?.url;
  if (!imgUrl) throw new Error("Image generation returned no image.");
  const resp = await fetch(imgUrl);
  if (!resp.ok) throw new Error(`Could not fetch generated image (${resp.status}).`);
  const bytes = new Uint8Array(await resp.arrayBuffer());
  const url = await uploadToBlob(bytes, slug, "image/png", "png");
  return { url, width: 1792, height: 1024 };
}

/**
 * Generate a featured image for a post from its title + description.
 * Returns the Blob URL, alt text, dimensions, and credit.
 */
export async function generateFeaturedImage(opts: {
  title: string;
  description?: string;
  slug: string;
}): Promise<GeneratedImage> {
  if (!opts.title.trim()) {
    throw new Error("Add a title first so the image can match the post.");
  }
  const { scene, alt } = await deriveScene(opts.title, opts.description);
  const img = await renderImage(stylePrompt(scene), opts.slug);
  return {
    url: img.url,
    alt,
    width: img.width,
    height: img.height,
    credit: AI_IMAGE_CREDIT,
  };
}
