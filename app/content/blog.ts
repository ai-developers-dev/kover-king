// Blog content helpers.
//
// Posts are now stored in the database (table `blog_posts`) and managed from
// the admin dashboard — see app/lib/actions.ts for the create/read/update/delete
// server functions. This file only holds the shared types and the helpers that
// turn the admin's plain-text body into rendered blocks.

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

// Shape returned to the UI. `body` is the raw text the admin typed; call
// parseBody(body) to get renderable blocks.
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category?: string | null;
  author?: string | null;
  authorPhotoUrl?: string | null;
  readMinutes?: number | null;
  datePublished: string;
  published: boolean;
  body: string;
};

/**
 * Turn the admin's plain-text body into renderable blocks.
 *
 * Formatting rules (kept deliberately simple):
 *   - A line starting with "## " becomes a heading.
 *   - One or more consecutive lines starting with "- " become a bullet list.
 *   - Any other run of non-blank lines becomes a paragraph.
 *   - Blank lines separate blocks.
 */
export function parseBody(raw: string): BlogBlock[] {
  const lines = (raw ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: BlogBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      flushParagraph();
      flushList();
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: trimmed.slice(3).trim() });
    } else if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2).trim());
    } else {
      flushList();
      paragraph.push(trimmed);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

/** Turn a title into a URL-safe slug, e.g. "My Post!" -> "my-post". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Format an ISO date as e.g. "May 29, 2026" for display. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = (iso ?? "").split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  if (!y || !m || !d) return iso;
  return `${months[m - 1]} ${d}, ${y}`;
}
