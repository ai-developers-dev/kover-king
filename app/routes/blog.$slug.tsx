import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Phone, ExternalLink } from "lucide-react";
import {
  jsonLd,
  articleSchema,
  breadcrumbSchema,
  canonical,
  SITE_URL,
} from "~/lib/seo";
import {
  parseBody,
  parseInline,
  formatPostDate,
  type BlogBlock,
} from "~/content/blog";
import { getPublishedPost } from "~/lib/actions";

type Citation = { title: string; url: string };

type LoadedPost = {
  slug: string;
  title: string;
  description: string;
  category: string | null;
  author: string | null;
  authorPhotoUrl: string | null;
  readMinutes: number | null;
  datePublished: string;
  keywords: string | null;
  citations: Citation[];
  blocks: BlogBlock[];
};

const FALLBACK_OG_IMAGE = `${SITE_URL}/favicon.svg`;

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: LoadedPost }> => {
    const row = (await getPublishedPost({
      data: { slug: params.slug },
    })) as Record<string, unknown> | null;
    if (!row) throw notFound();
    let citations: Citation[] = [];
    if (row.citations) {
      try {
        const parsed = JSON.parse(String(row.citations));
        if (Array.isArray(parsed)) {
          citations = parsed.filter(
            (c) => c && typeof c.url === "string" && typeof c.title === "string"
          );
        }
      } catch {
        citations = [];
      }
    }
    return {
      post: {
        slug: String(row.slug),
        title: String(row.title),
        description: String(row.description),
        category: row.category ? String(row.category) : null,
        author: row.author ? String(row.author) : null,
        authorPhotoUrl: row.author_photo_url ? String(row.author_photo_url) : null,
        readMinutes: row.read_minutes == null ? null : Number(row.read_minutes),
        datePublished: String(row.date_published),
        keywords: row.keywords ? String(row.keywords) : null,
        citations,
        blocks: parseBody(String(row.body ?? "")),
      },
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article Not Found | Kover King" }] };
    }
    const fullTitle = `${post.title} | Kover King`;
    const url = canonical(`/blog/${post.slug}`);
    const image = post.authorPhotoUrl || FALLBACK_OG_IMAGE;
    return {
      meta: [
        { title: fullTitle },
        { name: "description", content: post.description },
        ...(post.keywords ? [{ name: "keywords", content: post.keywords }] : []),
        // Open Graph (article)
        { property: "og:title", content: fullTitle },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "article:published_time", content: post.datePublished },
        ...(post.author
          ? [{ property: "article:author", content: post.author }]
          : []),
        ...(post.category
          ? [{ property: "article:section", content: post.category }]
          : []),
        // Twitter card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: fullTitle },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPostPage,
});

// Render a line of body text with inline [label](href) links. Internal links
// (/path) use the SPA router; external links open in a new tab and are
// nofollow so we don't pass ranking signal to third parties.
function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((tok, i) => {
        if (tok.type === "text") return <span key={i}>{tok.value}</span>;
        if (tok.type === "bold")
          return (
            <strong key={i} className="font-semibold text-text-primary">
              {tok.value}
            </strong>
          );
        if (tok.href.startsWith("/")) {
          return (
            <Link
              key={i}
              to={tok.href as "/"}
              className="text-primary-500 font-medium underline underline-offset-2 hover:text-primary-600"
            >
              {tok.label}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={tok.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-primary-500 font-medium underline underline-offset-2 hover:text-primary-600"
          >
            {tok.label}
          </a>
        );
      })}
    </>
  );
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="font-heading text-2xl font-bold text-text-primary mt-10 mb-3">
        <Inline text={block.text} />
      </h2>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="my-4 space-y-2 list-disc pl-6 text-text-secondary leading-relaxed">
        {block.items.map((item) => (
          <li key={item}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="my-4 text-text-secondary leading-relaxed text-lg">
      <Inline text={block.text} />
    </p>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <article className="bg-white">
        {/* Header */}
        <header className="bg-surface border-b border-gray-100 py-14 lg:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 mb-6">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All articles
              </Link>
              {post.category && (
                <span className="inline-flex items-center rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-primary-600 ring-1 ring-primary-100">
                  {post.category}
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatPostDate(post.datePublished)}
              </span>
              {post.readMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readMinutes} min read
                </span>
              )}
            </div>
            {post.author && (
              <div className="mt-6 flex items-center gap-4">
                {post.authorPhotoUrl && (
                  <img
                    src={post.authorPhotoUrl}
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100 shadow-sm"
                  />
                )}
                <div className="leading-tight">
                  <div className="text-xs uppercase tracking-wide text-text-muted">
                    Written by
                  </div>
                  <div className="text-base font-semibold text-text-primary">
                    {post.author}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xl text-text-secondary leading-relaxed font-medium border-l-4 border-primary-500 pl-5 mb-8">
              {post.description}
            </p>
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            {/* Sources / citations from the research behind this article. */}
            {post.citations.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="font-heading text-lg font-bold text-text-primary mb-4">
                  Sources
                </h2>
                <ol className="space-y-2 list-decimal pl-6 text-sm text-text-secondary">
                  {post.citations.map((c) => (
                    <li key={c.url}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 underline underline-offset-2 break-words"
                      >
                        {c.title}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-primary-500 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Have a coverage question?
          </h2>
          <p className="text-white/80 text-lg mb-7">
            Our local agents are happy to talk it through — no pressure, no
            obligation.
          </p>
          <a
            href="tel:+12179608997"
            className="inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            Call (217) 960-8997
          </a>
        </div>
      </section>

      {/* Article + Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            articleSchema({
              headline: post.title,
              description: post.description,
              path: `/blog/${post.slug}`,
              datePublished: post.datePublished,
              author: post.author,
              authorPhotoUrl: post.authorPhotoUrl,
              keywords: post.keywords,
              image: post.authorPhotoUrl || FALLBACK_OG_IMAGE,
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ])
          ),
        }}
      />
    </div>
  );
}
