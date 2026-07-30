import { useEffect, useState } from "react";
import {
  getPaymentMethods,
  revealPaymentMethod,
  markPaymentProcessed,
  purgePaymentMethod,
} from "~/lib/vault-actions";
import {
  CreditCard,
  Landmark,
  Eye,
  EyeOff,
  Loader2,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

// Admin view of submitted payment details.
//
// Full numbers are NEVER included in the list payload — they're fetched only
// when an agent explicitly clicks Reveal, and every reveal is audit-logged.

export function AdminPayments({ token }: { token: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Record<number, Record<string, string>>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = async () => {
    try {
      const res = await getPaymentMethods({ data: { token } });
      setRows(res as any[]);
    } catch {
      setError("Could not load payment records.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const reveal = async (id: number) => {
    if (revealed[id]) {
      setRevealed((r) => {
        const next = { ...r };
        delete next[id];
        return next;
      });
      return;
    }
    setBusyId(id);
    setError("");
    const res = await revealPaymentMethod({ data: { token, id } }).catch(() => ({
      success: false as const,
      error: "Reveal failed.",
    }));
    if ((res as any).success) {
      setRevealed((r) => ({ ...r, [id]: (res as any).details }));
    } else {
      setError((res as any).error || "Reveal failed.");
    }
    setBusyId(null);
  };

  const process = async (id: number, purge: boolean) => {
    setBusyId(id);
    await markPaymentProcessed({ data: { token, id, purge } }).catch(() => {});
    setRevealed((r) => {
      const next = { ...r };
      delete next[id];
      return next;
    });
    await load();
    setBusyId(null);
  };

  const purge = async (id: number) => {
    if (!confirm("Permanently delete these payment details? This cannot be undone.")) return;
    setBusyId(id);
    await purgePaymentMethod({ data: { token, id } }).catch(() => {});
    setRevealed((r) => {
      const next = { ...r };
      delete next[id];
      return next;
    });
    await load();
    setBusyId(null);
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">Handle with care</p>
          <p className="text-amber-800">
            Every reveal is logged with your name and timestamp. Key the details
            into the carrier portal, then click <strong>Processed &amp; Purge</strong>{" "}
            to destroy them. Anything not purged is auto-deleted after 14 days.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary text-sm">
            No payment details submitted yet.
          </p>
        </div>
      ) : (
        rows.map((r) => {
          const id = Number(r.id);
          const det = revealed[id];
          const isCard = String(r.method) === "card";
          const purged = String(r.status) === "purged" || !r.last4;
          return (
            <div
              key={id}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    {isCard ? (
                      <CreditCard className="w-5 h-5 text-primary-500" />
                    ) : (
                      <Landmark className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-text-primary">
                        {String(r.first_name || "")} {String(r.last_name || "")}
                      </p>
                      <StatusPill status={String(r.status)} />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {String(r.brand || "")} •••• {String(r.last4 || "----")} ·{" "}
                      {isCard ? "Card" : "e-Check (ACH)"}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {String(r.customer_email || "")} · submitted{" "}
                      {new Date(String(r.created_at)).toLocaleString()}
                    </p>
                    {r.processed_by && (
                      <p className="text-xs text-text-muted">
                        Processed by {String(r.processed_by)}
                      </p>
                    )}
                  </div>
                </div>

                {!purged && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reveal(id)}
                      disabled={busyId === id}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {busyId === id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : det ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {det ? "Hide" : "Reveal"}
                    </button>
                    <button
                      onClick={() => purge(id)}
                      disabled={busyId === id}
                      title="Delete details"
                      className="flex items-center justify-center w-9 h-9 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {det && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.entries(det).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-2 bg-surface rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wide text-text-muted">
                            {k.replace(/_/g, " ")}
                          </p>
                          <p className="font-mono text-sm text-text-primary break-all">
                            {v}
                          </p>
                        </div>
                        <button
                          onClick={() => copy(k, v)}
                          className="shrink-0 text-text-muted hover:text-primary-500"
                          title="Copy"
                        >
                          {copied === k ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => process(id, true)}
                      disabled={busyId === id}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Processed &amp; Purge
                    </button>
                    <button
                      onClick={() => process(id, false)}
                      disabled={busyId === id}
                      className="bg-white border border-gray-200 hover:border-primary-500 text-text-secondary font-semibold text-sm py-2.5 px-5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Mark Processed (keep)
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    processed: "bg-green-50 text-green-700",
    purged: "bg-gray-100 text-gray-600",
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
