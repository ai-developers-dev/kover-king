import { defineEventHandler, setResponseHeader } from "nitro/h3";
import { db, initDb } from "../utils/db";

const SITE = "https://koverking.com";

// Fixed, always-present pages. Blog posts are appended dynamically below so
// every post published from the admin shows up here automatically.
const STATIC_URLS: { loc: string; changefreq: string; priority: string }[] = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/auto", changefreq: "monthly", priority: "0.9" },
  { loc: "/home-insurance", changefreq: "monthly", priority: "0.9" },
  { loc: "/business", changefreq: "monthly", priority: "0.9" },
  { loc: "/life", changefreq: "monthly", priority: "0.9" },
  { loc: "/landlord-insurance", changefreq: "monthly", priority: "0.8" },
  { loc: "/duplex-insurance", changefreq: "monthly", priority: "0.8" },
  { loc: "/auto-insurance-springfield-il", changefreq: "monthly", priority: "0.8" },
  { loc: "/home-insurance-springfield-il", changefreq: "monthly", priority: "0.8" },
  { loc: "/business-insurance-springfield-il", changefreq: "monthly", priority: "0.8" },
  { loc: "/life-insurance-springfield-il", changefreq: "monthly", priority: "0.8" },
  { loc: "/landlord-insurance-springfield", changefreq: "monthly", priority: "0.7" },
  { loc: "/duplex-insurance-springfield", changefreq: "monthly", priority: "0.7" },
  { loc: "/about", changefreq: "monthly", priority: "0.7" },
  { loc: "/blog", changefreq: "weekly", priority: "0.6" },
  { loc: "/contact", changefreq: "monthly", priority: "0.7" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
];

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default defineEventHandler(async (event) => {
  // Pull every published blog post so newly created posts are discoverable
  // by search engines without any manual sitemap edits.
  let posts: { slug: string; date_published: string }[] = [];
  try {
    await initDb();
    const result = await db.execute(
      "SELECT slug, date_published FROM blog_posts WHERE published = 1 ORDER BY date_published DESC, id DESC"
    );
    posts = result.rows.map((r) => ({
      slug: String(r.slug),
      date_published: String(r.date_published),
    }));
  } catch {
    // If the DB is unavailable, still return the static pages.
    posts = [];
  }

  const staticXml = STATIC_URLS.map(
    (u) =>
      `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join("\n");

  const postXml = posts
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE}/blog/${xmlEscape(p.slug)}</loc>\n    <lastmod>${xmlEscape(
          p.date_published
        )}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticXml}${
    postXml ? "\n" + postXml : ""
  }\n</urlset>\n`;

  setResponseHeader(event, "Content-Type", "application/xml");
  setResponseHeader(event, "Cache-Control", "public, max-age=3600");
  return body;
});
