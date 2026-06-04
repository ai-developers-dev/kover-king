import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { jsonLd, breadcrumbSchema } from "~/lib/seo";
import { formatPostDate } from "~/content/blog";
import { getPublishedPosts } from "~/lib/actions";

type PostCard = {
  slug: string;
  title: string;
  description: string;
  category: string | null;
  readMinutes: number | null;
  datePublished: string;
  author: string | null;
  authorPhotoUrl: string | null;
};

export const Route = createFileRoute("/blog/")({
  loader: async (): Promise<{ posts: PostCard[] }> => {
    const rows = (await getPublishedPosts()) as Record<string, unknown>[];
    return {
      posts: rows.map((r) => ({
        slug: String(r.slug),
        title: String(r.title),
        description: String(r.description),
        category: r.category ? String(r.category) : null,
        readMinutes: r.read_minutes == null ? null : Number(r.read_minutes),
        datePublished: String(r.date_published),
        author: r.author ? String(r.author) : null,
        authorPhotoUrl: r.author_photo_url ? String(r.author_photo_url) : null,
      })),
    };
  },
  head: () => ({
    meta: [
      { title: "Insurance Tips & Guides | Kover King Blog" },
      {
        name: "description",
        content:
          "Insurance tips, coverage guides, and money-saving advice from Kover King — your independent insurance agency in Springfield, IL.",
      },
      { property: "og:title", content: "Insurance Tips & Guides | Kover King Blog" },
      {
        property: "og:description",
        content:
          "Insurance tips, coverage guides, and money-saving advice from Kover King — your independent insurance agency in Springfield, IL.",
      },
    ],
    links: [{ rel: "canonical", href: "https://koverking.com/blog" }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-surface border-b border-gray-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <BookOpen className="w-4 h-4" />
              Insurance Tips & Guides
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
              The Kover King Blog
            </h1>
            <p className="text-text-secondary text-lg">
              Straightforward insurance advice from local agents — how coverage
              works, what it costs, and how to save without leaving yourself
              exposed.
            </p>
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-text-secondary text-center py-10">
              New articles are on the way — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {post.category && (
                    <span className="inline-block self-start text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-heading text-xl font-bold text-text-primary">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="hover:text-primary-500 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-text-secondary">
                    {post.description}
                  </p>
                  {post.author && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
                      {post.authorPhotoUrl && (
                        <img
                          src={post.authorPhotoUrl}
                          alt={post.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">{post.author}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatPostDate(post.datePublished)}
                    </span>
                    {post.readMinutes && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readMinutes} min read
                      </span>
                    )}
                  </div>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ])
          ),
        }}
      />
    </div>
  );
}
