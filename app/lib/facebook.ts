// Publish to a Facebook Page via the Graph API.
//
// Posts a LINK share to the Page feed — Facebook scrapes the URL's OG tags
// (title, description, og:image) into a rich link card. Requires a Page Access
// Token with pages_manage_posts (separate from the lead-ads META token) and the
// Page ID. Best-effort: returns a status object, never throws.

const GRAPH = "https://graph.facebook.com/v19.0";

export async function postToFacebook(opts: {
  message: string;
  link: string;
}): Promise<{ ok: true; postId: string } | { ok: false; error: string }> {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID;
  if (!token || !pageId) {
    return {
      ok: false,
      error:
        "Facebook posting isn't configured. Set FB_PAGE_ACCESS_TOKEN and FB_PAGE_ID.",
    };
  }
  try {
    const res = await fetch(`${GRAPH}/${pageId}/feed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: opts.message,
        link: opts.link,
        access_token: token,
      }),
    });
    const json = (await res.json()) as {
      id?: string;
      error?: { message?: string };
    };
    if (!res.ok || !json.id) {
      return {
        ok: false,
        error: json.error?.message || `Graph API error (${res.status})`,
      };
    }
    return { ok: true, postId: json.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `Facebook request failed: ${msg}` };
  }
}
