import { useEffect, useState } from "react";
import {
  getCustomers,
  inviteCustomer,
  getPoliciesAdmin,
  savePolicy,
  deletePolicy,
  uploadPolicyDocument,
  getPolicyDocuments,
  deletePolicyDocument,
  getInvoicesAdmin,
  createInvoice,
  createFullBill,
  updateInvoiceStatus,
  recordOfflinePayment,
} from "~/lib/billing-actions";
import {
  Loader2,
  Plus,
  Users,
  FileText,
  Receipt,
  Upload,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  IdCard,
} from "lucide-react";

const CARRIERS = [
  "Progressive", "Travelers", "Safeco", "Auto-Owners", "National General",
  "Madison Mutual", "Bristol West", "Openly", "Hippo", "Branch",
  "Universal Property", "Other",
];
const TYPES = ["Auto", "Home", "Life", "Business", "Landlord", "Duplex"];
const TERMS = [
  { value: "monthly", label: "Monthly" },
  { value: "6_month", label: "6-Month" },
  { value: "12_month", label: "12-Month" },
];

const money = (c: number) =>
  (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
const input =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition";
const label = "block text-xs font-semibold text-text-primary mb-1";

type Sub = "customers" | "policies" | "invoices";

export function AdminBilling({ token }: { token: string }) {
  const [sub, setSub] = useState<Sub>("policies");
  const [customers, setCustomers] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [showPolicy, setShowPolicy] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [docPolicy, setDocPolicy] = useState<any | null>(null);

  const load = async () => {
    try {
      const [c, p, i] = await Promise.all([
        getCustomers({ data: { token } }),
        getPoliciesAdmin({ data: { token } }),
        getInvoicesAdmin({ data: { token } }),
      ]);
      setCustomers(c as any[]);
      setPolicies(p as any[]);
      setInvoices(i as any[]);
    } catch {
      setErr("Could not load billing data.");
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
      </div>
    );
  }

  const subs: { id: Sub; label: string; icon: typeof Users; count: number }[] = [
    { id: "policies", label: "Policies", icon: FileText, count: policies.length },
    { id: "invoices", label: "Invoices", icon: Receipt, count: invoices.length },
    { id: "customers", label: "Customers", icon: Users, count: customers.length },
  ];

  return (
    <div className="space-y-4">
      {msg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          <CheckCircle className="w-4 h-4" />{msg}
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          <AlertCircle className="w-4 h-4" />{err}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {subs.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSub(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  sub === s.id
                    ? "bg-primary-500 text-white"
                    : "bg-white text-text-secondary border border-gray-100 hover:border-primary-500"
                }`}
              >
                <Icon className="w-4 h-4" />{s.label} ({s.count})
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {sub === "policies" && (
            <ActionBtn onClick={() => setShowPolicy(true)} label="New Policy" />
          )}
          {sub === "invoices" && (
            <ActionBtn onClick={() => setShowInvoice(true)} label="New Bill" />
          )}
          {sub === "customers" && (
            <ActionBtn onClick={() => setShowInvite(true)} label="Invite Customer" />
          )}
        </div>
      </div>

      {/* ── Policies ── */}
      {sub === "policies" && (
        <div className="space-y-3">
          {policies.length === 0 ? (
            <Empty text="No policies yet. Create one to populate a customer's portal." />
          ) : (
            policies.map((p) => (
              <div key={String(p.id)} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-text-primary">
                      {String(p.insurance_type)} · {String(p.carrier)}
                      {p.policy_number ? ` · #${String(p.policy_number)}` : ""}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {String(p.first_name || "")} {String(p.last_name || "")} ·{" "}
                      {String(p.customer_email || "")}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {TERMS.find((t) => t.value === String(p.term))?.label} ·{" "}
                      {money(Number(p.premium_cents))} · {String(p.doc_count)} document(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDocPolicy(p)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:bg-primary-50 px-3 py-2 rounded-lg"
                    >
                      <IdCard className="w-4 h-4" />Documents
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this policy and its documents?")) return;
                        await deletePolicy({ data: { token, id: Number(p.id) } });
                        await load(); flash("Policy deleted.");
                      }}
                      className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Invoices ── */}
      {sub === "invoices" && (
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <Empty text="No bills yet. Create one and the customer can pay it in their portal." />
          ) : (
            invoices.map((i) => (
              <div key={String(i.id)} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-text-primary">
                        {String(i.invoice_number)}
                      </p>
                      <Pill status={String(i.status)} />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {String(i.first_name || "")} {String(i.last_name || "")} ·{" "}
                      {String(i.customer_email || "")}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {i.carrier ? `${String(i.carrier)} · ` : ""}
                      {i.due_date ? `Due ${String(i.due_date)}` : "No due date"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl font-extrabold text-text-primary">
                      {money(Number(i.amount_cents))}
                    </p>
                    {String(i.status) !== "paid" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={async () => {
                            await updateInvoiceStatus({
                              data: { token, id: Number(i.id), status: "sent" },
                            });
                            await load(); flash("Marked as sent.");
                          }}
                          className="text-xs font-semibold text-text-secondary border border-gray-200 hover:border-primary-500 px-3 py-1.5 rounded-lg"
                        >
                          Mark Sent
                        </button>
                        <button
                          onClick={async () => {
                            const m = prompt("Payment method (check, cash, phone)?", "check");
                            if (!m) return;
                            await recordOfflinePayment({
                              data: {
                                token,
                                invoice_id: Number(i.id),
                                amount_cents: Number(i.amount_cents),
                                method: m,
                              },
                            });
                            await load(); flash("Payment recorded.");
                          }}
                          className="text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          Record Payment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Customers ── */}
      {sub === "customers" && (
        <div className="space-y-3">
          {customers.length === 0 ? (
            <Empty text="No customer accounts yet. Invite one, or they can self-register at /login." />
          ) : (
            customers.map((c) => (
              <div key={String(c.id)} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-text-primary">
                    {String(c.first_name || "")} {String(c.last_name || "")}
                  </p>
                  <p className="text-sm text-text-secondary">{String(c.email)}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {String(c.policy_count)} policies
                    {Number(c.due_cents) > 0 && ` · ${money(Number(c.due_cents))} due`}
                    {!c.email_verified_at && " · email unconfirmed"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showPolicy && (
        <PolicyModal
          token={token}
          customers={customers}
          onClose={() => setShowPolicy(false)}
          onSaved={async () => { setShowPolicy(false); await load(); flash("Policy saved."); }}
        />
      )}
      {showInvoice && (
        <InvoiceModal
          token={token}
          customers={customers}
          onClose={() => setShowInvoice(false)}
          onSaved={async (num: string) => {
            setShowInvoice(false); await load();
            flash(`Bill ${num || ""} created.`);
          }}
        />
      )}
      {showInvite && (
        <InviteModal
          token={token}
          onClose={() => setShowInvite(false)}
          onSaved={async () => { setShowInvite(false); await load(); flash("Invite sent."); }}
        />
      )}
      {docPolicy && (
        <DocsModal
          token={token}
          policy={docPolicy}
          onClose={async () => { setDocPolicy(null); await load(); }}
        />
      )}
    </div>
  );
}

function ActionBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2 px-4 rounded-xl transition-colors"
    >
      <Plus className="w-4 h-4" />{label}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
      <p className="text-text-secondary text-sm">{text}</p>
    </div>
  );
}

function Pill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-green-50 text-green-700",
    sent: "bg-amber-50 text-amber-700",
    overdue: "bg-red-50 text-red-700",
    draft: "bg-gray-100 text-gray-600",
    void: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-heading font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function PolicyModal({ token, customers, onClose, onSaved }: any) {
  const [f, setF] = useState({
    customer_id: "", carrier: "Progressive", insurance_type: "Auto",
    policy_number: "", term: "12_month", premium: "",
    effective_date: "", expiration_date: "",
  });
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState("");
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value });

  return (
    <Modal title="New Policy" onClose={onClose}>
      {e && <p className="mb-3 text-sm text-red-700">{e}</p>}
      <div className="space-y-3">
        <div>
          <label className={label}>Customer</label>
          <select value={f.customer_id} onChange={set("customer_id")} className={input}>
            <option value="">Select a customer...</option>
            {customers.map((c: any) => (
              <option key={String(c.id)} value={String(c.id)}>
                {String(c.first_name)} {String(c.last_name)} — {String(c.email)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Carrier</label>
            <select value={f.carrier} onChange={set("carrier")} className={input}>
              {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Insurance Type</label>
            <select value={f.insurance_type} onChange={set("insurance_type")} className={input}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Policy Number</label>
            <input value={f.policy_number} onChange={set("policy_number")} className={input} />
          </div>
          <div>
            <label className={label}>Term</label>
            <select value={f.term} onChange={set("term")} className={input}>
              {TERMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={label}>Premium Amount (USD)</label>
          <input
            inputMode="decimal" value={f.premium} onChange={set("premium")}
            className={input} placeholder="1800.00"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Effective Date</label>
            <input type="date" value={f.effective_date} onChange={set("effective_date")} className={input} />
          </div>
          <div>
            <label className={label}>Expiration Date</label>
            <input type="date" value={f.expiration_date} onChange={set("expiration_date")} className={input} />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!f.customer_id) return setE("Select a customer.");
            const cents = Math.round(parseFloat(f.premium || "0") * 100);
            if (!cents) return setE("Enter a premium amount.");
            setBusy(true); setE("");
            const res = await savePolicy({
              data: {
                token, customer_id: Number(f.customer_id), carrier: f.carrier,
                insurance_type: f.insurance_type, policy_number: f.policy_number,
                term: f.term, premium_cents: cents,
                effective_date: f.effective_date, expiration_date: f.expiration_date,
              },
            }).catch(() => ({ success: false as const, error: "Failed." }));
            setBusy(false);
            if ((res as any).success) onSaved(); else setE((res as any).error);
          }}
          disabled={busy}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl"
        >
          {busy ? "Saving..." : "Create Policy"}
        </button>
      </div>
    </Modal>
  );
}

function InvoiceModal({ token, customers, onClose, onSaved }: any) {
  // One form that captures everything: who the customer is (existing or new,
  // with mailing address), what they're insured for, the premium mode, and
  // the amount due. Creates customer + policy + invoice in a single action.
  const [mode, setMode] = useState<"new" | "existing">(
    customers.length > 0 ? "existing" : "new"
  );
  const [f, setF] = useState({
    customer_id: "",
    first_name: "", last_name: "", email: "", phone: "",
    address: "", city: "", state: "IL", zip: "",
    carrier: "Progressive", insurance_type: "Auto", policy_number: "",
    term: "12_month", premium: "", effective_date: "",
    amount: "", due_date: "", notes: "",
  });
  const [send, setSend] = useState(true);
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState("");
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value });

  const submit = async () => {
    setE("");
    if (mode === "existing" && !f.customer_id) return setE("Select a customer.");
    if (mode === "new" && (!f.first_name || !f.last_name || !f.email))
      return setE("Enter the customer's name and email.");
    const premiumCents = Math.round(parseFloat(f.premium || "0") * 100);
    const amountCents = Math.round(parseFloat(f.amount || f.premium || "0") * 100);
    if (!premiumCents) return setE("Enter the premium amount.");
    if (!amountCents) return setE("Enter the amount due.");

    setBusy(true);
    const res = await createFullBill({
      data: {
        token,
        ...(mode === "existing"
          ? { customer_id: Number(f.customer_id) }
          : {
              first_name: f.first_name, last_name: f.last_name,
              email: f.email, phone: f.phone,
              address: f.address, city: f.city, state: f.state, zip: f.zip,
            }),
        carrier: f.carrier,
        insurance_type: f.insurance_type,
        policy_number: f.policy_number,
        term: f.term,
        premium_cents: premiumCents,
        effective_date: f.effective_date,
        amount_cents: amountCents,
        due_date: f.due_date,
        notes: f.notes,
        send,
      },
    }).catch(() => ({ success: false as const, error: "Failed to create the bill." }));
    setBusy(false);
    if ((res as any).success) onSaved((res as any).invoiceNumber);
    else setE((res as any).error);
  };

  return (
    <Modal title="Create a Bill" onClose={onClose}>
      {e && <p className="mb-3 text-sm text-red-700">{e}</p>}
      <div className="space-y-5">
        {/* ── Customer ── */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
            Customer
          </h4>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setMode("new")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-colors ${
                mode === "new"
                  ? "border-primary-500 bg-primary-50 text-primary-500"
                  : "border-gray-200 text-text-secondary"
              }`}
            >
              New Customer
            </button>
            <button
              onClick={() => setMode("existing")}
              disabled={customers.length === 0}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-colors disabled:opacity-40 ${
                mode === "existing"
                  ? "border-primary-500 bg-primary-50 text-primary-500"
                  : "border-gray-200 text-text-secondary"
              }`}
            >
              Existing ({customers.length})
            </button>
          </div>

          {mode === "existing" ? (
            <select value={f.customer_id} onChange={set("customer_id")} className={input}>
              <option value="">Select a customer...</option>
              {customers.map((c: any) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {String(c.first_name)} {String(c.last_name)} — {String(c.email)}
                </option>
              ))}
            </select>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={label}>First Name</label>
                  <input value={f.first_name} onChange={set("first_name")} className={input} /></div>
                <div><label className={label}>Last Name</label>
                  <input value={f.last_name} onChange={set("last_name")} className={input} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={label}>Email</label>
                  <input type="email" value={f.email} onChange={set("email")} className={input} /></div>
                <div><label className={label}>Phone</label>
                  <input type="tel" value={f.phone} onChange={set("phone")} className={input} /></div>
              </div>
              <div><label className={label}>Street Address</label>
                <input value={f.address} onChange={set("address")} className={input} placeholder="123 Main St" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className={label}>City</label>
                  <input value={f.city} onChange={set("city")} className={input} /></div>
                <div><label className={label}>State</label>
                  <input value={f.state} onChange={set("state")} className={input} maxLength={2} /></div>
                <div><label className={label}>ZIP</label>
                  <input value={f.zip} onChange={set("zip")} className={input} maxLength={5} /></div>
              </div>
            </div>
          )}
        </section>

        {/* ── Coverage ── */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
            Coverage
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Insurance Type</label>
                <select value={f.insurance_type} onChange={set("insurance_type")} className={input}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select></div>
              <div><label className={label}>Carrier</label>
                <select value={f.carrier} onChange={set("carrier")} className={input}>
                  {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Policy Number</label>
                <input value={f.policy_number} onChange={set("policy_number")} className={input} /></div>
              <div><label className={label}>Effective Date</label>
                <input type="date" value={f.effective_date} onChange={set("effective_date")} className={input} /></div>
            </div>
          </div>
        </section>

        {/* ── Premium & billing ── */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
            Premium &amp; Billing
          </h4>
          <div className="space-y-3">
            <div>
              <label className={label}>Premium Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {TERMS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setF({ ...f, term: t.value })}
                    className={`py-2.5 rounded-lg text-xs font-semibold border-2 transition-colors ${
                      f.term === t.value
                        ? "border-primary-500 bg-primary-50 text-primary-500"
                        : "border-gray-200 text-text-secondary hover:border-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Premium Amount (USD)</label>
                <input inputMode="decimal" value={f.premium} onChange={set("premium")}
                  className={input} placeholder="1800.00" />
              </div>
              <div>
                <label className={label}>Amount Due Now</label>
                <input inputMode="decimal" value={f.amount} onChange={set("amount")}
                  className={input} placeholder="same as premium" />
              </div>
            </div>
            <div>
              <label className={label}>Due Date</label>
              <input type="date" value={f.due_date} onChange={set("due_date")} className={input} />
            </div>
          </div>
        </section>

        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={send} onChange={(ev) => setSend(ev.target.checked)}
            className="h-4 w-4 accent-[#B33D08]" />
          Email this bill to the customer now
        </label>

        <button
          onClick={submit}
          disabled={busy}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl"
        >
          {busy ? "Creating..." : send ? "Create & Send Bill" : "Save as Draft"}
        </button>
      </div>
    </Modal>
  );
}

function InviteModal({ token, onClose, onSaved }: any) {
  const [f, setF] = useState({ email: "", first_name: "", last_name: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState("");
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value });
  return (
    <Modal title="Invite a Customer" onClose={onClose}>
      {e && <p className="mb-3 text-sm text-red-700">{e}</p>}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={label}>First Name</label><input value={f.first_name} onChange={set("first_name")} className={input} /></div>
          <div><label className={label}>Last Name</label><input value={f.last_name} onChange={set("last_name")} className={input} /></div>
        </div>
        <div><label className={label}>Email</label><input type="email" value={f.email} onChange={set("email")} className={input} /></div>
        <div><label className={label}>Phone</label><input type="tel" value={f.phone} onChange={set("phone")} className={input} /></div>
        <p className="text-xs text-text-muted">
          They'll get an email with a link to set their own password. You never choose it.
        </p>
        <button
          onClick={async () => {
            setBusy(true); setE("");
            const res = await inviteCustomer({ data: { token, ...f } })
              .catch(() => ({ success: false as const, error: "Failed." }));
            setBusy(false);
            if ((res as any).success) onSaved(); else setE((res as any).error);
          }}
          disabled={busy || !f.email || !f.first_name}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl"
        >
          {busy ? "Sending..." : "Send Invite"}
        </button>
      </div>
    </Modal>
  );
}

function DocsModal({ token, policy, onClose }: any) {
  const [docs, setDocs] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState("id_card");
  const [e, setE] = useState("");

  const load = async () => {
    const d = await getPolicyDocuments({ data: { token, policy_id: Number(policy.id) } })
      .catch(() => []);
    setDocs(d as any[]);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setBusy(true); setE("");
    const base64 = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(",")[1] || "");
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const res = await uploadPolicyDocument({
      data: {
        token, policy_id: Number(policy.id), kind,
        filename: file.name, contentType: file.type, base64,
      },
    }).catch(() => ({ success: false as const, error: "Upload failed." }));
    if (!(res as any).success) setE((res as any).error);
    await load();
    setBusy(false);
  };

  return (
    <Modal
      title={`Documents — ${String(policy.insurance_type)} · ${String(policy.carrier)}`}
      onClose={onClose}
    >
      {e && <p className="mb-3 text-sm text-red-700">{e}</p>}
      <div className="space-y-4">
        <div>
          <label className={label}>Document Type</label>
          <select value={kind} onChange={(ev) => setKind(ev.target.value)} className={input}>
            <option value="id_card">Insurance ID Card</option>
            <option value="policy">Policy Document</option>
            <option value="declaration">Declaration Page</option>
            <option value="other">Other</option>
          </select>
        </div>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary-500 transition-colors">
          {busy ? (
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm text-text-secondary">
            {busy ? "Uploading..." : "Click to upload a PDF or image"}
          </span>
          <input
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(ev) => ev.target.files?.[0] && upload(ev.target.files[0])}
          />
        </label>

        <div className="space-y-2">
          {docs.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-2">No documents yet.</p>
          ) : (
            docs.map((d) => (
              <div key={String(d.id)} className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2">
                <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{String(d.filename)}</p>
                  <p className="text-xs text-text-muted">{String(d.kind).replace("_", " ")}</p>
                </div>
                <a href={String(d.blob_url)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-500 hover:underline">View</a>
                <button
                  onClick={async () => {
                    await deletePolicyDocument({ data: { token, id: Number(d.id) } });
                    await load();
                  }}
                  className="text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
