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
  generateBlogPost,
  getAuthorsAdmin,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  uploadAuthorPhoto,
  getKeywordIdeas,
  updateKeywordIdeaStatus,
  runKeywordIdeasNow,
  getOutreach,
  scanOutreachTargets,
  findOutreachEmail,
  draftOutreach,
  updateOutreach,
  sendOutreach,
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
  Sparkles,
  Users,
  Upload,
  Lightbulb,
  Link2,
  Mail,
  Search,
} from "lucide-react";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin-token") || "";
}

// Sources are edited as "Title | https://url" lines and stored as JSON.
function citationsToText(raw: unknown): string {
  if (!raw) return "";
  try {
    const arr = JSON.parse(String(raw));
    if (!Array.isArray(arr)) return "";
    return arr
      .filter((c) => c && c.url)
      .map((c) => `${c.title || c.url} | ${c.url}`)
      .join("\n");
  } catch {
    return "";
  }
}

function textToCitations(text: string): { title: string; url: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.lastIndexOf("|");
      if (idx === -1) return { title: line, url: line };
      const title = line.slice(0, idx).trim();
      const url = line.slice(idx + 1).trim();
      return { title: title || url, url };
    })
    .filter((c) => /^https?:\/\//i.test(c.url));
}

type BlogFormState = {
  originalSlug: string | null; // null = creating a new post
  subject: string; // research topic for AI generation (not stored)
  title: string;
  slug: string;
  description: string;
  category: string;
  // Author selection: "" = none, "rotate" = round-robin, or a numeric id string.
  authorChoice: string;
  readMinutes: string;
  datePublished: string;
  published: boolean;
  body: string;
  focusKeyword: string;
  keywords: string;
  // Sources as "Title | https://url" lines, one per line.
  sourcesText: string;
};

function emptyBlogForm(): BlogFormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    originalSlug: null,
    subject: "",
    title: "",
    slug: "",
    description: "",
    category: "",
    authorChoice: "",
    readMinutes: "",
    datePublished: today,
    published: true,
    body: "",
    focusKeyword: "",
    keywords: "",
    sourcesText: "",
  };
}

type AuthorFormState = {
  id: number | null; // null = creating
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
};

function emptyAuthorForm(): AuthorFormState {
  return { id: null, name: "", title: "", bio: "", photoUrl: "" };
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

type Tab = "quotes" | "contacts" | "blog" | "authors" | "ideas" | "outreach";

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
  const [blogGenerating, setBlogGenerating] = useState(false);
  const [blogError, setBlogError] = useState("");
  // Whether the slug has been hand-edited (so we stop auto-deriving it).
  const [slugTouched, setSlugTouched] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authors, setAuthors] = useState<any[]>([]);
  const [authorForm, setAuthorForm] = useState<AuthorFormState | null>(null);
  const [authorSaving, setAuthorSaving] = useState(false);
  const [authorUploading, setAuthorUploading] = useState(false);
  const [authorError, setAuthorError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ideas, setIdeas] = useState<any[]>([]);
  const [ideasGenerating, setIdeasGenerating] = useState(false);
  const [ideasMsg, setIdeasMsg] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outreach, setOutreach] = useState<any[]>([]);
  const [outreachBusy, setOutreachBusy] = useState(false);
  const [outreachMsg, setOutreachMsg] = useState("");

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
      const [q, c, p, a, ki, o] = await Promise.all([
        getQuotes({ data: { token } }),
        getContacts({ data: { token } }),
        getBlogPostsAdmin({ data: { token } }),
        getAuthorsAdmin({ data: { token } }),
        getKeywordIdeas({ data: { token } }),
        getOutreach({ data: { token } }),
      ]);
      setQuotes(q as any[]);
      setContacts(c as any[]);
      setPosts(p as any[]);
      setAuthors(a as any[]);
      setIdeas(ki as any[]);
      setOutreach(o as any[]);
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

  // ── Keyword Ideas handlers ──
  const handleGenerateIdeas = async () => {
    setIdeasMsg("");
    setIdeasGenerating(true);
    try {
      const res = await runKeywordIdeasNow({ data: { token: getToken() } });
      if (res.success) {
        setIdeasMsg(
          `Generated ${res.count} ideas.` +
            (res.emailed ? " Emailed to you." : ` (Email not sent: ${res.note || "not configured"})`)
        );
        await loadData();
      } else {
        setIdeasMsg(res.error || "Could not generate ideas.");
      }
    } catch {
      setIdeasMsg("Could not generate ideas. Your session may have expired.");
    }
    setIdeasGenerating(false);
  };

  // Start a new blog post pre-seeded with an idea's keyword/title as the subject.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usePostIdea = (idea: any) => {
    setBlogError("");
    setSlugTouched(false);
    setBlogForm({ ...emptyBlogForm(), subject: String(idea.title || idea.keyword) });
    setTab("blog");
    if (idea.id) {
      updateKeywordIdeaStatus({ data: { token: getToken(), id: Number(idea.id), status: "used" } }).catch(() => {});
      setIdeas((prev) => prev.map((x) => (x.id === idea.id ? { ...x, status: "used" } : x)));
    }
  };

  const dismissIdea = async (id: number) => {
    setIdeas((prev) => prev.map((x) => (x.id === id ? { ...x, status: "dismissed" } : x)));
    await updateKeywordIdeaStatus({ data: { token: getToken(), id, status: "dismissed" } }).catch(() => {});
  };

  // ── Outreach handlers ──
  const handleScanOutreach = async () => {
    setOutreachMsg("");
    setOutreachBusy(true);
    try {
      const res = await scanOutreachTargets({ data: { token: getToken() } });
      setOutreachMsg(res.success ? `Added ${res.added} new target(s).` : "Scan failed.");
      await loadData();
    } catch {
      setOutreachMsg("Scan failed. Your session may have expired.");
    }
    setOutreachBusy(false);
  };

  // Find emails for every target that doesn't have one yet (sequential to
  // respect per-request limits).
  const handleFindEmails = async () => {
    setOutreachMsg("");
    setOutreachBusy(true);
    const targets = outreach.filter((o) => !o.email && o.status !== "no_email");
    let found = 0;
    for (const t of targets) {
      try {
        const res = await findOutreachEmail({ data: { token: getToken(), id: Number(t.id) } });
        if (res.success && res.email) found++;
      } catch {
        /* keep going */
      }
    }
    setOutreachMsg(`Searched ${targets.length} site(s); found ${found} email(s).`);
    await loadData();
    setOutreachBusy(false);
  };

  const handleFindOneEmail = async (id: number) => {
    try {
      await findOutreachEmail({ data: { token: getToken(), id } });
      await loadData();
    } catch {
      /* ignore */
    }
  };

  const handleDraftOutreach = async (id: number) => {
    try {
      await draftOutreach({ data: { token: getToken(), id } });
      await loadData();
    } catch {
      /* ignore */
    }
  };

  const handleSaveOutreach = async (
    id: number,
    patch: { email?: string; draftSubject?: string; draftBody?: string; status?: string }
  ) => {
    await updateOutreach({ data: { token: getToken(), id, ...patch } }).catch(() => {});
    await loadData();
  };

  const handleSendOutreach = async (id: number, email: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Send this outreach email to ${email}? This sends a real email.`)
    ) {
      return;
    }
    setOutreachMsg("");
    try {
      const res = await sendOutreach({ data: { token: getToken(), id } });
      setOutreachMsg(res.success ? `Sent to ${email}.` : res.error || "Send failed.");
    } catch {
      setOutreachMsg("Send failed. Your session may have expired.");
    }
    await loadData();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEditPost = (p: any) => {
    setBlogError("");
    setSlugTouched(true);
    setBlogForm({
      originalSlug: String(p.slug),
      subject: "",
      title: String(p.title),
      slug: String(p.slug),
      description: String(p.description),
      category: p.category ? String(p.category) : "",
      authorChoice: p.author_id != null ? String(p.author_id) : "",
      readMinutes: p.read_minutes == null ? "" : String(p.read_minutes),
      datePublished: String(p.date_published),
      published: Number(p.published) === 1,
      body: String(p.body ?? ""),
      focusKeyword: p.focus_keyword ? String(p.focus_keyword) : "",
      keywords: p.keywords ? String(p.keywords) : "",
      sourcesText: citationsToText(p.citations),
    });
  };

  const cancelBlogForm = () => {
    setBlogForm(null);
    setBlogError("");
  };

  const updateForm = (patch: Partial<BlogFormState>) =>
    setBlogForm((f) => (f ? { ...f, ...patch } : f));

  const handleGenerate = async () => {
    if (!blogForm) return;
    setBlogError("");
    const subject = blogForm.subject.trim();
    if (!subject) {
      setBlogError("Enter a subject for the AI to research and write about.");
      return;
    }
    setBlogGenerating(true);
    try {
      const result = await generateBlogPost({
        data: { token: getToken(), subject },
      });
      if (!result.success) {
        setBlogError(result.error || "Could not generate the post.");
        setBlogGenerating(false);
        return;
      }
      // Fill the draft; auto-derive the slug from the new title unless the
      // admin has already hand-edited it.
      updateForm({
        title: result.title,
        description: result.description,
        body: result.body,
        focusKeyword: result.focusKeyword || "",
        keywords: result.keywords || "",
        category: result.category || blogForm.category,
        sourcesText: (result.citations || [])
          .map((c) => `${c.title} | ${c.url}`)
          .join("\n"),
        ...(slugTouched ? {} : { slug: slugify(result.title) }),
      });
    } catch {
      setBlogError(
        "Could not generate the post. Your session may have expired, or it timed out."
      );
    }
    setBlogGenerating(false);
  };

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
    const authorId: number | "rotate" | null =
      blogForm.authorChoice === "rotate"
        ? "rotate"
        : blogForm.authorChoice
          ? Number(blogForm.authorChoice)
          : null;
    const payload = {
      token: getToken(),
      slug,
      title: blogForm.title.trim(),
      description: blogForm.description.trim(),
      category: blogForm.category.trim() || undefined,
      authorId,
      readMinutes: blogForm.readMinutes ? Number(blogForm.readMinutes) : undefined,
      body: blogForm.body,
      published: blogForm.published,
      datePublished: blogForm.datePublished,
      focusKeyword: blogForm.focusKeyword.trim() || undefined,
      keywords: blogForm.keywords.trim() || undefined,
      citations: textToCitations(blogForm.sourcesText),
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

  // ── Author handlers ──
  const startNewAuthor = () => {
    setAuthorError("");
    setAuthorForm(emptyAuthorForm());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEditAuthor = (a: any) => {
    setAuthorError("");
    setAuthorForm({
      id: Number(a.id),
      name: String(a.name),
      title: a.title ? String(a.title) : "",
      bio: a.bio ? String(a.bio) : "",
      photoUrl: a.photo_url ? String(a.photo_url) : "",
    });
  };

  const cancelAuthorForm = () => {
    setAuthorForm(null);
    setAuthorError("");
  };

  const updateAuthorForm = (patch: Partial<AuthorFormState>) =>
    setAuthorForm((f) => (f ? { ...f, ...patch } : f));

  const handleAuthorPhotoFile = async (file: File) => {
    setAuthorError("");
    setAuthorUploading(true);
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || "");
          // strip the "data:...;base64," prefix
          resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      const result = await uploadAuthorPhoto({
        data: {
          token: getToken(),
          filename: file.name,
          contentType: file.type,
          dataBase64,
        },
      });
      if (!result.success) {
        setAuthorError(result.error || "Upload failed.");
      } else {
        updateAuthorForm({ photoUrl: result.url });
      }
    } catch {
      setAuthorError("Could not upload the image. Please try again.");
    }
    setAuthorUploading(false);
  };

  const handleSaveAuthor = async () => {
    if (!authorForm) return;
    setAuthorError("");
    if (!authorForm.name.trim()) {
      setAuthorError("Author name is required.");
      return;
    }
    setAuthorSaving(true);
    const payload = {
      token: getToken(),
      name: authorForm.name.trim(),
      title: authorForm.title.trim() || undefined,
      bio: authorForm.bio.trim() || undefined,
      photoUrl: authorForm.photoUrl.trim() || undefined,
    };
    try {
      const result = authorForm.id
        ? await updateAuthor({ data: { ...payload, id: authorForm.id } })
        : await createAuthor({ data: payload });
      if (!result.success) {
        setAuthorError(result.error || "Could not save the author.");
        setAuthorSaving(false);
        return;
      }
      setAuthorForm(null);
      await loadData();
    } catch {
      setAuthorError("Could not save the author. Your session may have expired.");
    }
    setAuthorSaving(false);
  };

  const handleDeleteAuthor = async (id: number, name: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Delete author "${name}"? Existing posts keep their byline; this only removes them from the roster.`
      )
    ) {
      return;
    }
    await deleteAuthor({ data: { token: getToken(), id } });
    setAuthors((prev) => prev.filter((a) => Number(a.id) !== id));
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
          <button
            onClick={() => setTab("authors")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "authors"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Authors ({authors.length})
          </button>
          <button
            onClick={() => setTab("ideas")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "ideas"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Keyword Ideas
          </button>
          <button
            onClick={() => setTab("outreach")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "outreach"
                ? "bg-primary-500 text-white shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
                : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Link2 className="w-4 h-4" />
            Outreach ({outreach.length})
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
            authors={authors}
            form={blogForm}
            saving={blogSaving}
            generating={blogGenerating}
            error={blogError}
            slugTouched={slugTouched}
            setSlugTouched={setSlugTouched}
            onNew={startNewPost}
            onEdit={startEditPost}
            onDelete={handleDeletePost}
            onCancel={cancelBlogForm}
            onSave={handleSaveBlog}
            onGenerate={handleGenerate}
            updateForm={updateForm}
            formatDate={formatDate}
          />
        ) : tab === "authors" ? (
          <AuthorsPanel
            authors={authors}
            form={authorForm}
            saving={authorSaving}
            uploading={authorUploading}
            error={authorError}
            onNew={startNewAuthor}
            onEdit={startEditAuthor}
            onDelete={handleDeleteAuthor}
            onCancel={cancelAuthorForm}
            onSave={handleSaveAuthor}
            onPhotoFile={handleAuthorPhotoFile}
            updateForm={updateAuthorForm}
          />
        ) : tab === "ideas" ? (
          <IdeasPanel
            ideas={ideas}
            generating={ideasGenerating}
            message={ideasMsg}
            onGenerate={handleGenerateIdeas}
            onUse={usePostIdea}
            onDismiss={dismissIdea}
            formatDate={formatDate}
          />
        ) : tab === "outreach" ? (
          <OutreachPanel
            outreach={outreach}
            busy={outreachBusy}
            message={outreachMsg}
            onScan={handleScanOutreach}
            onFindAll={handleFindEmails}
            onFindOne={handleFindOneEmail}
            onDraft={handleDraftOutreach}
            onSave={handleSaveOutreach}
            onSend={handleSendOutreach}
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
  authors,
  form,
  saving,
  generating,
  error,
  slugTouched,
  setSlugTouched,
  onNew,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  onGenerate,
  updateForm,
  formatDate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authors: any[];
  form: BlogFormState | null;
  saving: boolean;
  generating: boolean;
  error: string;
  slugTouched: boolean;
  setSlugTouched: (b: boolean) => void;
  onNew: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (p: any) => void;
  onDelete: (slug: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onGenerate: () => void;
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

        {/* AI draft generator */}
        <div className="mb-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <h3 className="font-semibold text-text-primary text-sm">
              Write with AI
            </h3>
          </div>
          <p className="text-xs text-text-muted mb-3 leading-relaxed">
            Enter a subject and click Generate. The AI researches it on the web
            and drafts the title, summary, and body below for you to review and
            edit before publishing.
          </p>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Subject
          </label>
          <textarea
            value={form.subject}
            onChange={(e) => updateForm({ subject: e.target.value })}
            rows={2}
            placeholder="e.g. Why renters in Springfield, IL should consider renters insurance"
            className={`${fieldClass} resize-none`}
          />
          <button
            onClick={onGenerate}
            disabled={generating || !form.subject.trim()}
            className="mt-3 flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Researching &amp; writing… (up to a minute)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </>
            )}
          </button>
        </div>

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
            <select
              value={form.authorChoice}
              onChange={(e) => updateForm({ authorChoice: e.target.value })}
              className={`${fieldClass} cursor-pointer`}
            >
              <option value="">No author</option>
              <option value="rotate">🔀 Rotate authors (round-robin)</option>
              {authors.map((a) => (
                <option key={String(a.id)} value={String(a.id)}>
                  {String(a.name)}
                </option>
              ))}
            </select>
            {form.authorChoice === "rotate" && (
              <p className="text-xs text-text-muted mt-1">
                Each new post is assigned the next author in your roster, in turn.
              </p>
            )}
            {authors.length === 0 && (
              <p className="text-xs text-text-muted mt-1">
                No authors yet — add some in the Authors tab to assign bylines.
              </p>
            )}
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
              of a line = bullet point &nbsp;·&nbsp; <code>[text](/home-insurance)</code>{" "}
              = link.
            </div>
          </div>

          {/* SEO fields (auto-filled by Generate, fully editable) */}
          <div className="rounded-xl border border-gray-100 bg-surface/60 p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              SEO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Focus keyword
                </label>
                <input
                  type="text"
                  value={form.focusKeyword}
                  onChange={(e) => updateForm({ focusKeyword: e.target.value })}
                  placeholder="home insurance Springfield IL"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Keywords{" "}
                  <span className="text-text-muted font-normal">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) => updateForm({ keywords: e.target.value })}
                  placeholder="home insurance, homeowners coverage, flood insurance"
                  className={fieldClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Sources{" "}
                <span className="text-text-muted font-normal">
                  (one per line: Title | https://url)
                </span>
              </label>
              <textarea
                value={form.sourcesText}
                onChange={(e) => updateForm({ sourcesText: e.target.value })}
                rows={3}
                placeholder="Illinois DOI | https://idoi.illinois.gov/"
                className={`${fieldClass} resize-y font-mono text-xs leading-relaxed`}
              />
              <p className="text-xs text-text-muted mt-1.5">
                Shown as a “Sources” list at the bottom of the post (external,
                nofollow links).
              </p>
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

// ─── Authors management panel ────────────────────────────────────────────────

function AuthorsPanel({
  authors,
  form,
  saving,
  uploading,
  error,
  onNew,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  onPhotoFile,
  updateForm,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authors: any[];
  form: AuthorFormState | null;
  saving: boolean;
  uploading: boolean;
  error: string;
  onNew: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (a: any) => void;
  onDelete: (id: number, name: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onPhotoFile: (file: File) => void;
  updateForm: (patch: Partial<AuthorFormState>) => void;
}) {
  const fieldClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

  if (form) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-text-primary">
            {form.id ? "Edit Author" : "New Author"}
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
          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Photo
            </label>
            <div className="flex items-center gap-4">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt="Author"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Users className="w-7 h-7" />
                </div>
              )}
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 bg-cream hover:bg-primary-50 px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {form.photoUrl ? "Replace photo" : "Upload photo"}
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPhotoFile(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-text-muted mt-2">
              JPG or PNG, up to 4MB. Stored securely via Vercel Blob.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Jane Smith"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Title / role
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder="Licensed Insurance Agent"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Short bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => updateForm({ bio: e.target.value })}
              rows={3}
              placeholder="A sentence or two about this author."
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSave}
              disabled={saving || uploading}
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
                  {form.id ? "Save Changes" : "Add Author"}
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
          {authors.length} {authors.length === 1 ? "author" : "authors"}
        </p>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)]"
        >
          <Plus className="w-4 h-4" />
          New Author
        </button>
      </div>

      {authors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-text-muted">
            No authors yet. Add authors here, then assign them (or rotate them)
            on each blog post.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {authors.map((a) => (
            <div
              key={String(a.id)}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4"
            >
              {a.photo_url ? (
                <img
                  src={String(a.photo_url)}
                  alt={String(a.name)}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">
                  {String(a.name)}
                </p>
                {a.title && (
                  <p className="text-xs text-text-muted truncate">
                    {String(a.title)}
                  </p>
                )}
              </div>
              <button
                onClick={() => onEdit(a)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(Number(a.id), String(a.name))}
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

// ─── Keyword Ideas panel ─────────────────────────────────────────────────────

function IdeasPanel({
  ideas,
  generating,
  message,
  onGenerate,
  onUse,
  onDismiss,
  formatDate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ideas: any[];
  generating: boolean;
  message: string;
  onGenerate: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUse: (idea: any) => void;
  onDismiss: (id: number) => void;
  formatDate: (d: unknown) => string;
}) {
  // Group ideas by batch_date (newest first; rows already sorted by the query).
  const batches: { date: string; items: any[] }[] = [];
  for (const idea of ideas) {
    const d = String(idea.batch_date);
    let b = batches.find((x) => x.date === d);
    if (!b) {
      b = { date: d, items: [] };
      batches.push(b);
    }
    b.items.push(idea);
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Weekly SEO Keyword Ideas
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Every Monday morning your AI agent researches the web and emails you
              the top 5 long-tail blog opportunities. Generate a fresh batch now,
              or turn any idea into a post in one click.
            </p>
            {message && (
              <p className="text-sm text-primary-600 mt-2 font-medium">{message}</p>
            )}
          </div>
          <button
            onClick={onGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-[0_4px_20px_-4px_rgba(233,86,12,0.4)] shrink-0"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Researching…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate ideas now
              </>
            )}
          </button>
        </div>
      </div>

      {batches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-text-muted">
            No ideas yet. Click “Generate ideas now” or wait for Monday’s batch.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {batches.map((batch) => (
            <div key={batch.date}>
              <h3 className="text-sm font-semibold text-text-muted mb-3">
                Week of {formatDate(batch.date)}
              </h3>
              <div className="space-y-3">
                {batch.items.map((idea) => {
                  const dismissed = String(idea.status) === "dismissed";
                  const used = String(idea.status) === "used";
                  return (
                    <div
                      key={String(idea.id)}
                      className={`bg-white rounded-2xl border border-gray-100 px-5 py-4 ${
                        dismissed ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-primary-600 bg-cream px-2 py-0.5 rounded-full">
                              {String(idea.keyword)}
                            </span>
                            {used && (
                              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                Used
                              </span>
                            )}
                            {dismissed && (
                              <span className="text-xs font-medium text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                                Dismissed
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-text-primary text-sm mt-1.5">
                            {String(idea.title)}
                          </p>
                          {idea.rationale && (
                            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                              {String(idea.rationale)}
                            </p>
                          )}
                          {idea.intent && (
                            <p className="text-xs text-text-muted mt-1">
                              Intent: {String(idea.intent)}
                            </p>
                          )}
                        </div>
                        {!dismissed && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => onUse(idea)}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              New post
                            </button>
                            <button
                              onClick={() => onDismiss(Number(idea.id))}
                              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Outreach panel ──────────────────────────────────────────────────────────

const OUTREACH_STATUS_LABEL: Record<string, string> = {
  found: "Needs email",
  email_found: "Email found",
  no_email: "No email",
  drafted: "Draft ready",
  sent: "Sent",
  skipped: "Skipped",
  unsubscribed: "Unsubscribed",
};

function OutreachPanel({
  outreach,
  busy,
  message,
  onScan,
  onFindAll,
  onFindOne,
  onDraft,
  onSave,
  onSend,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outreach: any[];
  busy: boolean;
  message: string;
  onScan: () => void;
  onFindAll: () => void;
  onFindOne: (id: number) => void;
  onDraft: (id: number) => void;
  onSave: (
    id: number,
    patch: { email?: string; draftSubject?: string; draftBody?: string; status?: string }
  ) => void;
  onSend: (id: number, email: string) => void;
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEdit = (o: any) => {
    setEditId(Number(o.id));
    setEditEmail(String(o.email || ""));
    setEditSubject(String(o.draft_subject || ""));
    setEditBody(String(o.draft_body || ""));
  };
  const saveEdit = () => {
    if (editId == null) return;
    onSave(editId, {
      email: editEmail,
      draftSubject: editSubject,
      draftBody: editBody,
    });
    setEditId(null);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Backlink Outreach
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Scan the sites you cite as Sources, find a contact email, then review
              and send a friendly link-request. Every email is sent only when you
              click Send — nothing goes out automatically.
            </p>
            {message && (
              <p className="text-sm text-primary-600 mt-2 font-medium">{message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onScan}
              disabled={busy}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />
              Scan cited sites
            </button>
            <button
              onClick={onFindAll}
              disabled={busy}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-text-primary font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Search className="w-4 h-4" />
              Find emails
            </button>
          </div>
        </div>
      </div>

      {outreach.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Link2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-text-muted">
            No targets yet. Click “Scan cited sites” to pull domains from your blog
            sources.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {outreach.map((o) => {
            const id = Number(o.id);
            const status = String(o.status);
            const isEditing = editId === id;
            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-gray-100 px-5 py-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text-primary text-sm">
                        {String(o.domain)}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          status === "sent"
                            ? "text-green-700 bg-green-50"
                            : status === "no_email"
                              ? "text-amber-700 bg-amber-50"
                              : "text-text-secondary bg-gray-100"
                        }`}
                      >
                        {OUTREACH_STATUS_LABEL[status] || status}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-1">
                      Cited in: {String(o.post_title || o.post_slug || "—")}
                    </p>
                    {o.email && (
                      <p className="text-sm text-text-primary mt-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary-500" />
                        {String(o.email)}
                      </p>
                    )}
                    {o.error && (
                      <p className="text-xs text-red-500 mt-1">Error: {String(o.error)}</p>
                    )}
                  </div>
                  {!isEditing && status !== "sent" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      {!o.email && (
                        <button
                          onClick={() => onFindOne(id)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-text-primary px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Search className="w-3.5 h-3.5" />
                          Find email
                        </button>
                      )}
                      {!o.draft_subject ? (
                        <button
                          onClick={() => onDraft(id)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-text-primary px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Draft
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(o)}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-text-primary px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                      {o.email && o.draft_subject && (
                        <button
                          onClick={() => onSend(id, String(o.email))}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Send
                        </button>
                      )}
                    </div>
                  )}
                  {status === "sent" && o.sent_at && (
                    <span className="text-xs text-text-muted shrink-0">
                      Sent {String(o.sent_at).slice(0, 10)}
                    </span>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="contact@example.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">
                        Body
                      </label>
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-xs font-semibold text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onSave(id, { status: "skipped" });
                          setEditId(null);
                        }}
                        className="ml-auto text-xs font-semibold text-text-muted hover:text-text-primary px-3 py-2 rounded-lg transition-colors"
                      >
                        Skip this site
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
