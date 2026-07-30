import { useState } from "react";
import { submitPaymentMethod } from "~/lib/vault-actions";
import { CreditCard, Landmark, Lock, Loader2, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

// Customer payment-details form. Submits card or e-check (ACH) details, which
// are encrypted at rest and keyed into the carrier's portal by a licensed
// agent. Deliberately does NOT charge the card here.

// Shown wherever a customer submits or views payment. We collect details and
// a licensed agent keys them into the carrier's portal — submitting is NOT the
// same as paying, and coverage is not bound until the carrier applies it.
export const PENDING_PAYMENT_WARNING =
  "Submitting your payment details does not complete your payment. Your payment is not valid or applied until a licensed Kover King agent processes it with your insurance carrier. Coverage is not bound, renewed, or reinstated by this submission.";

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";
const labelClass = "block text-sm font-semibold text-text-primary mb-1.5";

const YEARS = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

export function PaymentForm({
  token,
  invoiceId,
  onDone,
}: {
  token: string;
  invoiceId?: number;
  onDone?: () => void;
}) {
  const [method, setMethod] = useState<"card" | "ach">("ach");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  // card
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  // ach
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [bankName, setBankName] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await submitPaymentMethod({
        data: {
          token,
          invoice_id: invoiceId,
          method,
          name_on_account: name,
          ...(method === "card"
            ? {
                card_number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvv,
                billing_zip: zip,
              }
            : {
                routing_number: routing,
                account_number: account,
                account_type: accountType,
                bank_name: bankName,
              }),
        },
      });
      if (res.success) {
        setDone(true);
        onDone?.();
      } else {
        setError(res.error || "Could not submit your payment details.");
      }
    } catch {
      setError("Something went wrong. Please try again or call (217) 960-8997.");
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
          Payment details received
        </h3>
        <p className="text-text-secondary text-sm max-w-sm mx-auto mb-4">
          A licensed Kover King agent will process your payment with the carrier
          and confirm once it's applied. You'll get a receipt by email.
        </p>
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-left max-w-md mx-auto">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Your payment is not complete yet.</strong> It is not valid or
            applied until an agent processes it with your carrier. Coverage is not
            bound, renewed, or reinstated by this submission. Call (217) 960-8997
            with any questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-primary-500" />
        <h3 className="font-heading text-lg font-bold text-text-primary">
          Make a Payment
        </h3>
      </div>
      <p className="text-text-secondary text-sm mb-5">
        Your details are encrypted and handled only by a licensed agent to
        process payment with your carrier.
      </p>

      {/* Method toggle — ACH first; it's cheaper and preferred. */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMethod("ach")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-colors ${
            method === "ach"
              ? "border-primary-500 bg-primary-50 text-primary-500"
              : "border-gray-200 text-text-secondary hover:border-gray-300"
          }`}
        >
          <Landmark className="w-4 h-4" />
          Bank / e-Check
        </button>
        <button
          onClick={() => setMethod("card")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-colors ${
            method === "card"
              ? "border-primary-500 bg-primary-50 text-primary-500"
              : "border-gray-200 text-text-secondary hover:border-gray-300"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Debit / Credit Card
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            Name on {method === "card" ? "Card" : "Account"}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Jane Smith"
            autoComplete="cc-name"
          />
        </div>

        {method === "card" ? (
          <>
            <div>
              <label className={labelClass}>Card Number</label>
              <input
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 19)
                      .replace(/(.{4})/g, "$1 ")
                      .trim()
                  )
                }
                className={inputClass}
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Month</label>
                <select
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">MM</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">YYYY</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Security Code</label>
                <input
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={inputClass}
                  placeholder="123"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Billing ZIP</label>
              <input
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className={inputClass}
                placeholder="62701"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={labelClass}>Bank Name</label>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className={inputClass}
                placeholder="Illinois National Bank"
              />
            </div>
            <div>
              <label className={labelClass}>Routing Number</label>
              <input
                inputMode="numeric"
                value={routing}
                onChange={(e) => setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))}
                className={inputClass}
                placeholder="9 digits"
              />
            </div>
            <div>
              <label className={labelClass}>Account Number</label>
              <input
                inputMode="numeric"
                value={account}
                onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 17))}
                className={inputClass}
                placeholder="Account number"
              />
            </div>
            <div>
              <label className={labelClass}>Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </>
        )}

        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-300 p-3.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Important:</strong> {PENDING_PAYMENT_WARNING}
          </p>
        </div>

        <button
          onClick={submit}
          disabled={busy || !name}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting securely...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Submit Payment Details
            </>
          )}
        </button>
        <p className="text-xs text-text-muted text-center">
          Encrypted in transit and at rest. Processed by a licensed, bonded
          Illinois agent. Questions? Call (217) 960-8997.
        </p>
      </div>
    </div>
  );
}
