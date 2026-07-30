import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSessionUser, logoutUser } from "~/lib/auth-actions";
import { PaymentForm } from "~/components/payment-form";
import {
  getMyOverview,
  updateMyProfile,
  changeMyPassword,
} from "~/lib/portal-actions";
import {
  Crown,
  Loader2,
  LogOut,
  Shield,
  FileText,
  CreditCard,
  User,
  IdCard,
  Download,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Car,
  Home as HomeIcon,
  Briefcase,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "My Account | Kover King Insurance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PortalPage,
});

type Tab = "overview" | "policies" | "documents" | "billing" | "profile";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const TERM_LABEL: Record<string, string> = {
  monthly: "Monthly",
  "6_month": "6-Month",
  "12_month": "12-Month",
};

const TYPE_ICON: Record<string, typeof Car> = {
  Auto: Car,
  Home: HomeIcon,
  Business: Briefcase,
  Life: Heart,
};

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition";

function PortalPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
  } | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [payingInvoice, setPayingInvoice] = useState<number | null>(null);
  const [data, setData] = useState<{
    policies: any[];
    invoices: any[];
    documents: any[];
    outstanding_cents: number;
  }>({ policies: [], invoices: [], documents: [], outstanding_cents: 0 });

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("kk-token") : null;

  useEffect(() => {
    if (!token) {
      navigate({ to: "/login" as "/" });
      return;
    }
    getSessionUser({ data: { token } })
      .then(async (res) => {
        if (!res.user) {
          navigate({ to: "/login" as "/" });
          return;
        }
        // Staff belong in the admin dashboard, not the customer portal.
        if (res.user.role !== "customer") {
          navigate({ to: "/admin/dashboard" as "/" });
          return;
        }
        setUser(res.user);
        const overview = await getMyOverview({ data: { token } });
        setData(overview as typeof data);
        setLoading(false);
      })
      .catch(() => navigate({ to: "/login" as "/" }));
  }, [token]);

  const handleLogout = async () => {
    if (token) await logoutUser({ data: { token } }).catch(() => {});
    sessionStorage.removeItem("kk-token");
    sessionStorage.removeItem("admin-token");
    navigate({ to: "/login" as "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const activePolicies = data.policies.filter((p) => p.status === "active");
  const dueInvoices = data.invoices.filter(
    (i) => i.status === "sent" || i.status === "overdue"
  );

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "policies", label: "My Policies", icon: FileText },
    { id: "documents", label: "ID Cards & Docs", icon: IdCard },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Portal header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-cream" />
            </div>
            <span className="font-heading text-lg font-bold text-text-primary">
              Kover <span className="text-primary-500">King</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-text-secondary">
              {user?.first_name} {user?.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl font-extrabold text-text-primary mb-1">
          Welcome back, {user?.first_name}
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Manage your policies, view ID cards, and pay your bill.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-primary-500 text-white"
                    : "bg-white text-text-secondary border border-gray-100 hover:border-primary-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard
                label="Active Policies"
                value={String(activePolicies.length)}
              />
              <StatCard
                label="Amount Due"
                value={money(data.outstanding_cents)}
                highlight={data.outstanding_cents > 0}
              />
              <StatCard label="Documents" value={String(data.documents.length)} />
            </div>

            {dueInvoices.length > 0 && (
              <div className="bg-white rounded-2xl border border-primary-200 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h2 className="font-heading font-bold text-text-primary mb-1">
                      You have {dueInvoices.length} payment
                      {dueInvoices.length > 1 ? "s" : ""} due
                    </h2>
                    <p className="text-text-secondary text-sm mb-4">
                      Total outstanding: {money(data.outstanding_cents)}
                    </p>
                    <button
                      onClick={() => setTab("billing")}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors"
                    >
                      Go to Billing
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activePolicies.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No policies yet"
                text="Once we've set up your coverage, your policies will appear here. Questions? Call (217) 960-8997."
              />
            ) : (
              <div className="space-y-3">
                <h2 className="font-heading font-bold text-text-primary">
                  Your Policies
                </h2>
                {activePolicies.map((p) => (
                  <PolicyRow key={String(p.id)} policy={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Policies ── */}
        {tab === "policies" && (
          <div className="space-y-3">
            {data.policies.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No policies on file"
                text="Your policies will appear here once they're active."
              />
            ) : (
              data.policies.map((p) => <PolicyRow key={String(p.id)} policy={p} detailed />)
            )}
          </div>
        )}

        {/* ── Documents ── */}
        {tab === "documents" && (
          <div className="space-y-3">
            {data.documents.length === 0 ? (
              <EmptyState
                icon={IdCard}
                title="No documents yet"
                text="Your ID cards and policy documents will appear here once uploaded."
              />
            ) : (
              data.documents.map((d) => (
                <div
                  key={String(d.id)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    {d.kind === "id_card" ? (
                      <IdCard className="w-5 h-5 text-primary-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate">
                      {d.kind === "id_card"
                        ? "Insurance ID Card"
                        : String(d.filename)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {String(d.carrier)} · {String(d.insurance_type)}
                    </p>
                  </div>
                  <a
                    href={String(d.blob_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:underline shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Billing ── */}
        {tab === "billing" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-300 p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Payments are not instant.</strong> Submitting payment
                details does not complete your payment. It is not valid or
                applied until a licensed Kover King agent processes it with your
                insurance carrier. Coverage is not bound, renewed, or reinstated
                by submitting payment here.
              </p>
            </div>
            {data.invoices.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No bills yet"
                text="When we issue a bill it'll show up here, and you'll be able to pay by card or e-check."
              />
            ) : (
              data.invoices.map((inv) => {
                const paid = inv.status === "paid";
                return (
                  <div
                    key={String(inv.id)}
                    className="bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-text-primary">
                            Invoice {String(inv.invoice_number)}
                          </p>
                          <StatusBadge status={String(inv.status)} />
                        </div>
                        <p className="text-sm text-text-secondary">
                          {inv.term ? TERM_LABEL[String(inv.term)] : ""}
                          {inv.due_date ? ` · Due ${String(inv.due_date)}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-2xl font-extrabold text-text-primary">
                          {money(Number(inv.amount_cents))}
                        </p>
                        {!paid && (
                          <button
                            onClick={() =>
                              setPayingInvoice(
                                payingInvoice === Number(inv.id) ? null : Number(inv.id)
                              )
                            }
                            className="mt-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2 px-5 rounded-xl transition-colors"
                          >
                            {payingInvoice === Number(inv.id) ? "Cancel" : "Pay Now"}
                          </button>
                        )}
                      </div>
                    </div>
                    {payingInvoice === Number(inv.id) && (
                      <div className="mt-5">
                        <PaymentForm
                          token={token!}
                          invoiceId={Number(inv.id)}
                          onDone={() => setPayingInvoice(null)}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <p className="text-xs text-text-muted pt-2">
              Prefer to pay over the phone? Call{" "}
              <a href="tel:+12179608997" className="text-primary-500 font-semibold">
                (217) 960-8997
              </a>
              .
            </p>
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && user && (
          <ProfileTab token={token!} user={user} />
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`font-heading text-3xl font-extrabold ${
          highlight ? "text-primary-500" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PolicyRow({ policy, detailed }: { policy: any; detailed?: boolean }) {
  const Icon = TYPE_ICON[String(policy.insurance_type)] || Shield;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-text-primary">
              {String(policy.insurance_type)} Insurance
            </p>
            <StatusBadge status={String(policy.status)} />
          </div>
          <p className="text-sm text-text-secondary">
            {String(policy.carrier)}
            {policy.policy_number ? ` · #${String(policy.policy_number)}` : ""}
          </p>
          {detailed && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
              <Field label="Term" value={TERM_LABEL[String(policy.term)] || "—"} />
              <Field
                label="Premium"
                value={money(Number(policy.premium_cents))}
              />
              <Field
                label="Effective"
                value={policy.effective_date ? String(policy.effective_date) : "—"}
              />
              <Field
                label="Expires"
                value={
                  policy.expiration_date ? String(policy.expiration_date) : "—"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p className="text-text-primary font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    paid: "bg-green-50 text-green-700",
    sent: "bg-amber-50 text-amber-700",
    overdue: "bg-red-50 text-red-700",
    expired: "bg-gray-100 text-gray-600",
    cancelled: "bg-gray-100 text-gray-600",
    draft: "bg-gray-100 text-gray-600",
    void: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Shield;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="font-heading font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mx-auto">{text}</p>
    </div>
  );
}

function ProfileTab({
  token,
  user,
}: {
  token: string;
  user: { first_name: string | null; last_name: string | null; email: string };
}) {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await updateMyProfile({
      data: { token, first_name: firstName, last_name: lastName, phone },
    }).catch(() => ({ success: false as const, error: "Failed to save." }));
    setMsg(res.success ? "Profile saved." : (res as any).error || "Failed.");
    setSaving(false);
  };

  const changePw = async () => {
    setPwBusy(true);
    setPwErr("");
    setPwMsg("");
    const res = await changeMyPassword({
      data: { token, current_password: cur, new_password: next },
    }).catch(() => ({ success: false as const, error: "Failed." }));
    if (res.success) {
      setPwMsg("Password updated. Other devices have been signed out.");
      setCur("");
      setNext("");
    } else {
      setPwErr((res as any).error || "Failed.");
    }
    setPwBusy(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-heading font-bold text-text-primary mb-4">
          Your Information
        </h2>
        {msg && (
          <p className="mb-4 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            {msg}
          </p>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="(217) 555-0100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Email
            </label>
            <input
              value={user.email}
              disabled
              className={`${inputClass} bg-surface text-text-muted`}
            />
            <p className="mt-1.5 text-xs text-text-muted">
              To change your email, call (217) 960-8997.
            </p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-heading font-bold text-text-primary mb-4">
          Change Password
        </h2>
        {pwMsg && (
          <p className="mb-4 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            {pwMsg}
          </p>
        )}
        {pwErr && (
          <p className="mb-4 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            {pwErr}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={inputClass}
              autoComplete="new-password"
            />
            <p className="mt-1.5 text-xs text-text-muted">
              At least 10 characters, including a letter and a number.
            </p>
          </div>
          <button
            onClick={changePw}
            disabled={pwBusy || !cur || !next}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {pwBusy ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
