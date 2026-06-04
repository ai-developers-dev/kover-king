import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { getRelatedPosts } from "~/lib/actions";
import { formatPostDate } from "~/content/blog";

type RelatedPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
};

/**
 * "Related Articles" block for service/location pages. Loads published blog
 * posts whose category matches `category` and renders a small card row.
 * Renders nothing when there are no matching posts, so pages stay clean until
 * relevant content exists. This builds two-way internal links (page <-> blog),
 * which helps SEO.
 */
export function RelatedArticles({ category }: { category: string }) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    let active = true;
    getRelatedPosts({ data: { category, limit: 3 } })
      .then((rows) => {
        if (!active) return;
        const list = (rows as Record<string, unknown>[]).map((r) => ({
          slug: String(r.slug),
          title: String(r.title),
          description: String(r.description),
          datePublished: String(r.date_published),
        }));
        setPosts(list);
      })
      .catch(() => {
        /* leave empty on failure */
      });
    return () => {
      active = false;
    };
  }, [category]);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-5 h-5 text-primary-500" />
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
            Related Articles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {formatPostDate(post.datePublished)}
              </span>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="hover:text-primary-500 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
                {post.description}
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
              >
                Read more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
