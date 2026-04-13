import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getQuotes,
  getContacts,
  deleteQuote,
  deleteContact,
} from "~/lib/actions";
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
} from "lucide-react";

export const Route = createFileRoute("/admin_/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Kover King Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

type Tab = "quotes" | "contacts";

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
    try {
      const [q, c] = await Promise.all([
        getQuotes({ data: {} }),
        getContacts({ data: {} }),
      ]);
      setQuotes(q as any[]);
      setContacts(c as any[]);
    } catch {
      // If fetch fails, might need re-auth
    }
    setLoading(false);
  };

  const handleDeleteQuote = async (id: number) => {
    await deleteQuote({ data: { id } });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDeleteContact = async (id: number) => {
    await deleteContact({ data: { id } });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin-token");
    }
    navigate({ to: "/admin" });
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
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
                    <button
                      onClick={() => toggleExpand(id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
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
                            onClick={() => handleDeleteQuote(Number(q.id))}
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
                    <button
                      onClick={() => toggleExpand(id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
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
                            onClick={() => handleDeleteContact(Number(c.id))}
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
