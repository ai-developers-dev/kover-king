import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getQuotes,
  getContacts,
  deleteQuote,
  deleteContact,
  logoutAdmin,
  getBlogPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "~/lib/actions";
import { slugify } from "~/content/blog";
import {
  FileText,
  MessageSquare,
  Loader2,
  Trash2,
  LogOut,
  RefreshCw,
  Car,
  Home,
  Briefcase,
  HeartPulse,
  Shield,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Plus,
  Pencil,
  Save,
  X,
} from "lucide-react";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin-token") || "";
}

type BlogFormState = {
  originalSlug: string | null; // null = creating a new post
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  readMinutes: string;
  datePublished: string;
  published: boolean;
  body: string;
};

function emptyBlogForm(): BlogFormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    originalSlug: null,
    title: "",
    slug: "",
    description: "",
    category: "",
    author: "Kover King Insurance",
    readMinutes: "",
    datePublished: today,
    published: true,
    body: "",
  };
}

export const Route = createFileRoute("/admin_/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Kover King Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

type Tab = "quotes" | "contacts" | "blog";

const insuranceIcon: Record<string, typeof Car> = {
  Auto: Car,
  Home: Home,
  Business: Briefcase,
  Life: HeartPulse,
};

function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("quotes");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotes, setQuotes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  const [blogForm, setBlogForm] = useState<BlogFormState | null>(null);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogError, setBlogError] = useState("");
  // Whether the slug has been hand-edited (so we stop auto-deriving it).
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin-token");
      if (!token) {
        navigate({ to: "/admin" });
        return;
      }
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const token = getToken();
    try {
      const [q, c, p] = await Promise.all([
        getQuotes({ data: { token } }),
        getContacts({ data: { token } }),
        getBlogPostsAdmin({ data: { token } }),
      ]);
      setQuotes(q as any[]);
      setContacts(c as any[]);
      setPosts(p as any[]);
    } catch {
      // A failure here usually means the session expired — send back to login.
      sessionStorage.removeItem("admin-token");
      navigate({ to: "/admin" });
    }
    setLoading(false);
  };

  const handleDeleteQuote = async (id: number, name?: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Delete the quote request${name ? ` from ${name}` : ""}? This cannot be undone.`
      )
    ) {
      return;
    }
    await deleteQuote({ data: { token: getToken(), id } });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDeleteContact = async (id: number, name?: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Delete the message${name ? ` from ${name}` : ""}? This cannot be undone.`
      )
    ) {
      return;
    }
    await deleteContact({ data: { token: getToken(), id } });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin({ data: { token: getToken() } });
    } catch {
      // Ignore — we clear locally regardless.
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin-token");
    }
    navigate({ to: "/admin" });
  };

  // ── Blog editor handlers ──
  const startNewPost = () => {
    setBlogError("");
    setSlugTouched(false);
    setBlogForm(emptyBlogForm());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEditPost = (p: any) => {
    setBlogError("");
    setSlugTouched(true);
    setBlogForm({
      originalSlug: String(p.slug),
      title: String(p.title),
      slug: String(p.slug),
      description: String(p.description),
      category: p.category ? String(p.category) : "",
      author: p.author ? String(p.author) : "",
      readMinutes: p.read_minutes == null ? "" : String(p.read_minutes),
      datePublished: String(p.date_published),
      published: Number(p.published) === 1,
      body: String(p.body ?? ""),
    });
  };

  const cancelBlogForm = () => {
    setBlogForm(null);
    setBlogError("");
  };

  const updateForm = (patch: Partial<BlogFormState>) =>
    setBlogForm((f) => (f ? { ...f, ...patch } : f));

  const handleSaveBlog = async () => {
    if (!blogForm) return;
    setBlogError("");
    if (!blogForm.title.trim() || !blogForm.description.trim() || !blogForm.body.trim()) {
      setBlogError("Title, description, and body are required.");
      return;
    }
    const slug = (blogForm.slug || slugify(blogForm.title)).trim();
    if (!slug) {
      setBlogError("Please provide a URL (slug) for the post.");
      return;
    }
    setBlogSaving(true);
    const payload = {
      token: getToken(),
      slug,
      title: blogForm.title.trim(),
      description: blogForm.description.trim(),
      category: blogForm.category.trim() || undefined,
      author: blogForm.author.trim() || undefined,
      readMinutes: blogForm.readMinutes ? Number(blogForm.readMinutes) : undefined,
      body: blogForm.body,
      published: blogForm.published,
      datePublished: blogForm.datePublished,
    };
    try {
      const result = blogForm.originalSlug
        ? await updateBlogPost({ data: { ...payload, originalSlug: blogForm.originalSlug } })
        : await createBlogPost({ data: payload });
      if (!result.success) {
        setBlogError(result.error || "Could not save the post.");
        setBlogSaving(false);
        return;
      }
      setBlogForm(null);
      await loadData();
    } catch {
      setBlogError("Could not save the post. Your session may have expired.");
    }
    setBlogSaving(false);
  };

  const handleDeletePost = async (slug: string) => {
    await deleteBlogPost({ data: { token: getToken(), slug } });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr: unknown) => {
    if (!dateStr || typeof dateStr !== "string") return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-text-primary">
                KoverKing Admin
              </h1>
              <p className="text-xs text-text-muted">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-500 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-text-muted mb-1">Total Quotes</p>
            <p className="text-2xl font-heading font-bold text-text-primary">
              {quotes.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-text-muted mb-1">Total Contacts</p>
            <p className="text-2xl font-heading font-bold text-text-primary">
              {contacts.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-text-muted mb-1">Most Requested</p>
            <p className="text-2xl font-heading font-bold text-text-primary">
              {quotes.length > 0
                ? Object.entries(
                    quotes.reduce(
                      (acc, q) => {
                        const t = String(q.insurance_type || "Other");
                        acc[t] = (acc[t] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>
                    )
                  ).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "—"
                : "—"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-text-muted mb-1">Latest Quote</p>
            <p className="text-sm font-medium text-text-primary">
              {quotes.length > 0
                ? formatDate(quotes[0]?.created_at)
                : "No quotes yet"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("quotes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "quotes"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setTab("contacts")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "contacts"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setTab("blog")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "blog"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog ({posts.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : tab === "blog" ? (
          <BlogPanel
            posts={posts}
            form={blogForm}
            saving={blogSaving}
            error={blogError}
            slugTouched={slugTouched}
            setSlugTouched={setSlugTouched}
            onNew={startNewPost}
            onEdit={startEditPost}
            onDelete={handleDeletePost}
            onCancel={cancelBlogForm}
            onSave={handleSaveBlog}
            updateForm={updateForm}
            formatDate={formatDate}
          />
        ) : tab === "quotes" ? (
          <div className="space-y-3">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted">No quote requests yet.</p>
              </div>
            ) : (
              quotes.map((q) => {
                const id = `quote-${q.id}`;
                const isExpanded = expandedId === id;
                const Icon =
                  insuranceIcon[String(q.insurance_type)] || FileText;
                return (
                  <div
                    key={String(q.id)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="w-full flex items-center gap-4 px-5 py-4">
                      <button
                        onClick={() => toggleExpand(id)}
                        className="flex items-center gap-4 flex-1 min-w-0 text-left"
                      >
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary text-sm">
                            {String(q.first_name)} {String(q.last_name)}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {String(q.insurance_type)} Insurance &middot;{" "}
                            {String(q.email)}
                          </p>
                        </div>
                        <span className="text-xs text-text-muted whitespace-nowrap hidden sm:block">
                          {formatDate(q.created_at)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteQuote(
                            Number(q.id),
                            `${String(q.first_name)} ${String(q.last_name)}`.trim()
                          )
                        }
                        aria-label="Delete quote"
                        title="Delete quote"
                        className="shrink-0 flex items-center justify-center w-9 h-9 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-sm">
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Email
                            </p>
                            <p className="text-text-primary font-medium">
                              {String(q.email)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Phone
                            </p>
                            <p className="text-text-primary font-medium">
                              {String(q.phone || "—")}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Type
                            </p>
                            <p className="text-text-primary font-medium">
                              {String(q.insurance_type)}
                            </p>
                          </div>
                          {q.address && (
                            <div>
                              <p className="text-text-muted text-xs mb-0.5">
                                Address
                              </p>
                              <p className="text-text-primary font-medium">
                                {String(q.address)}
                              </p>
                            </div>
                          )}
                          {(q.city || q.state || q.zip) && (
                            <div>
                              <p className="text-text-muted text-xs mb-0.5">
                                City / State / ZIP
                              </p>
                              <p className="text-text-primary font-medium">
                                {[q.city, q.state, q.zip]
                                  .filter(Boolean)
                                  .map(String)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Submitted
                            </p>
                            <p className="text-text-primary font-medium">
                              {formatDate(q.created_at)}
                            </p>
                          </div>
                        </div>

                        {q.details && (
                          <div className="mt-4">
                            <p className="text-text-muted text-xs mb-1">
                              Details
                            </p>
                            <p className="text-text-primary text-sm bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
                              {String(q.details)}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() =>
                              handleDeleteQuote(
                                Number(q.id),
                                `${String(q.first_name)} ${String(q.last_name)}`.trim()
                              )
                            }
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-text-muted">No contact messages yet.</p>
              </div>
            ) : (
              contacts.map((c) => {
                const id = `contact-${c.id}`;
                const isExpanded = expandedId === id;
                return (
                  <div
                    key={String(c.id)}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="w-full flex items-center gap-4 px-5 py-4">
                      <button
                        onClick={() => toggleExpand(id)}
                        className="flex items-center gap-4 flex-1 min-w-0 text-left"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary text-sm">
                            {String(c.name)}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {String(c.email)}
                          </p>
                        </div>
                        <span className="text-xs text-text-muted whitespace-nowrap hidden sm:block">
                          {formatDate(c.created_at)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteContact(Number(c.id), String(c.name))
                        }
                        aria-label="Delete message"
                        title="Delete message"
                        className="shrink-0 flex items-center justify-center w-9 h-9 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-sm">
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Email
                            </p>
                            <p className="text-text-primary font-medium">
                              {String(c.email)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Phone
                            </p>
                            <p className="text-text-primary font-medium">
                              {String(c.phone || "—")}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted text-xs mb-0.5">
                              Submitted
                            </p>
                            <p className="text-text-primary font-medium">
                              {formatDate(c.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-text-muted text-xs mb-1">
                            Message
                          </p>
                          <p className="text-text-primary text-sm bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
                            {String(c.message)}
                          </p>
                        </div>

                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() =>
                              handleDeleteContact(Number(c.id), String(c.name))
                            }
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Blog management panel ───────────────────────────────────────────────────

function BlogPanel({
  posts,
  form,
  saving,
  error,
  slugTouched,
  setSlugTouched,
  onNew,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  updateForm,
  formatDate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  form: BlogFormState | null;
  saving: boolean;
  error: string;
  slugTouched: boolean;
  setSlugTouched: (b: boolean) => void;
  onNew: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (p: any) => void;
  onDelete: (slug: string) => void;
  onCancel: () => void;
  onSave: () => void;
  updateForm: (patch: Partial<BlogFormState>) => void;
  formatDate: (d: unknown) => string;
}) {
  const fieldClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

  if (form) {
    const finalSlug = (form.slug || "").trim();
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-text-primary">
            {form.originalSlug ? "Edit Post" : "New Post"}
          </h2>
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-5">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                updateForm(
                  slugTouched
                    ? { title }
                    : { title, slug: slugify(title) }
                );
              }}
              placeholder="How to Choose the Right Home Insurance"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              URL (slug) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateForm({ slug: slugify(e.target.value) });
              }}
              placeholder="how-to-choose-home-insurance"
              className={fieldClass}
            />
            <p className="text-xs text-text-muted mt-1">
              Page address: koverking.com/blog/{finalSlug || "your-slug"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Short description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={2}
              placeholder="One or two sentences shown on the blog list and under the title."
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateForm({ category: e.target.value })}
                placeholder="Auto Insurance"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Read time (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={form.readMinutes}
                onChange={(e) => updateForm({ readMinutes: e.target.value })}
                placeholder="4"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Publish date
              </label>
              <input
                type="date"
                value={form.datePublished}
                onChange={(e) => updateForm({ datePublished: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Author
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => updateForm({ author: e.target.value })}
              placeholder="Kover King Insurance"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.body}
              onChange={(e) => updateForm({ body: e.target.value })}
              rows={16}
              placeholder={
                "Write your article here.\n\nLeave a blank line between paragraphs.\n\n## Type two hashes for a section heading\n\n- Start a line with a dash for a bullet\n- Like this"
              }
              className={`${fieldClass} resize-y font-mono leading-relaxed`}
            />
            <div className="text-xs text-text-muted mt-2 bg-surface rounded-lg p-3 leading-relaxed">
              <strong className="text-text-secondary">Formatting:</strong> Blank
              line = new paragraph &nbsp;·&nbsp; <code>## </code> at the start of
              a line = section heading &nbsp;·&nbsp; <code>- </code> at the start
              of a line = bullet point.
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateForm({ published: e.target.checked })}
              className="w-4 h-4 accent-primary-500"
            />
            <span className="text-sm text-text-primary">
              Published{" "}
              <span className="text-text-muted">
                (uncheck to save as a hidden draft)
              </span>
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {form.originalSlug ? "Save Changes" : "Publish Post"}
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-text-muted">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-text-muted">
            No blog posts yet. Click “New Post” to write your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={String(p.slug)}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">
                  {String(p.title)}
                  {Number(p.published) !== 1 && (
                    <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-muted truncate">
                  /blog/{String(p.slug)} · {formatDate(p.date_published)}
                </p>
              </div>
              {Number(p.published) === 1 && (
                <a
                  href={`/blog/${String(p.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary-500 hover:underline hidden sm:block"
                >
                  View
                </a>
              )}
              <button
                onClick={() => onEdit(p)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(String(p.slug))}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
