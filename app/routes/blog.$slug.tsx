import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Phone } from "lucide-react";
import { jsonLd, articleSchema, breadcrumbSchema, canonical } from "~/lib/seo";
import { parseBody, formatPostDate, type BlogBlock } from "~/content/blog";
import { getPublishedPost } from "~/lib/actions";

type LoadedPost = {
  slug: string;
  title: string;
  description: string;
  category: string | null;
  author: string | null;
  authorPhotoUrl: string | null;
  readMinutes: number | null;
  datePublished: string;
  blocks: BlogBlock[];
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: LoadedPost }> => {
    const row = (await getPublishedPost({
      data: { slug: params.slug },
    })) as Record<string, unknown> | null;
    if (!row) throw notFound();
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
        blocks: parseBody(String(row.body ?? "")),
      },
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article Not Found | Kover King" }] };
    }
    return {
      meta: [
        { title: `${post.title} | Kover King` },
        { name: "description", content: post.description },
        { property: "og:title", content: `${post.title} | Kover King` },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: canonical(`/blog/${post.slug}`) },
      ],
    };
  },
  component: BlogPostPage,
});

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="font-heading text-2xl font-bold text-text-primary mt-10 mb-3">
        {block.text}
      </h2>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="my-4 space-y-2 list-disc pl-6 text-text-secondary leading-relaxed">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <p className="my-4 text-text-secondary leading-relaxed text-lg">
      {block.text}
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
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All articles
            </Link>
            {post.category && (
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}
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
              {post.author && (
                <span className="flex items-center gap-2">
                  {post.authorPhotoUrl && (
                    <img
                      src={post.authorPhotoUrl}
                      alt={post.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  By {post.author}
                </span>
              )}
            </div>
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
