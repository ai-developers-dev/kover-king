import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { submitQuoteFromLead } from "~/lib/actions";
import {
  Crown,
  Phone,
  ArrowRight,
  CheckCircle,
  Loader2,
  Shield,
  Star,
  AlertCircle,
  Home,
} from "lucide-react";

export const Route = createFileRoute("/quote-continue")({
  head: () => ({
    meta: [
      { title: "Complete Your Quote | Kover King Insurance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QuoteContinuePage,
});

const HOME_VALUES = [
  { label: "Under $150,000", value: "under-150k", monthly: 85 },
  { label: "$150,000 - $250,000", value: "150k-250k", monthly: 115 },
  { label: "$250,000 - $400,000", value: "250k-400k", monthly: 155 },
  { label: "$400,000 - $600,000", value: "400k-600k", monthly: 210 },
  { label: "$600,000+", value: "600k-plus", monthly: 285 },
];

const YEAR_BUILT = [
  "Before 1970",
  "1970 - 1990",
  "1990 - 2010",
  "2010 or newer",
];

const HOME_TYPES = [
  "Single Family",
  "Condo / Townhouse",
  "Mobile Home",
  "Multi-Family",
];

const CARRIERS = [
  "State Farm",
  "Allstate",
  "Progressive",
  "Farmers",
  "USAA",
  "Other",
  "None / Not Insured",
];

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

function QuoteContinuePage() {
  const [prefillStatus, setPrefillStatus] = useState<
    "loading" | "ready" | "invalid"
  >("loading");

  // Prefilled fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Additional fields
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [homeValue, setHomeValue] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [homeType, setHomeType] = useState("");
  const [currentCarrier, setCurrentCarrier] = useState("");

  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [submitting, setSubmitting] = useState(false);
  const [estimatedRate, setEstimatedRate] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");

    if (!token) {
      setPrefillStatus("invalid");
      return;
    }

    fetch(`/api/prefill?t=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        setFullName(data.full_name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
        setPrefillStatus("ready");
      })
      .catch(() => setPrefillStatus("invalid"));
  }, []);

  const handleSubmit = async () => {
    if (!homeValue || !yearBuilt || !homeType) return;
    setSubmitting(true);

    const selected = HOME_VALUES.find((v) => v.value === homeValue);
    const rate = selected?.monthly ?? 115;
    const yearFactor =
      yearBuilt === "Before 1970"
        ? 1.2
        : yearBuilt === "1970 - 1990"
          ? 1.1
          : yearBuilt === "2010 or newer"
            ? 0.9
            : 1.0;
    setEstimatedRate(Math.round(rate * yearFactor));

    const nameParts = fullName.trim().split(" ");
    const first_name = nameParts[0] || fullName;
    const last_name = nameParts.slice(1).join(" ") || "-";

    try {
      await submitQuoteFromLead({
        data: {
          first_name,
          last_name,
          email,
          phone,
          address: address || undefined,
          zip: zip || undefined,
          home_value: selected?.label,
          year_built: yearBuilt,
          home_type: homeType,
          current_carrier: currentCarrier || undefined,
        },
      });
    } catch {
      // Still show the rate
    }

    setSubmitting(false);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header */}
      <header className="bg-primary-500 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-white font-bold text-lg">
              Kover King
            </span>
          </div>
          <a
            href="tel:+12179608997"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            (217) 960-8997
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(233,86,12,0.3),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Complete Your{" "}
                <span className="text-primary-500">Home Insurance</span> Quote
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                We just need a few more details to show you your personalized
                rate from 30+ top carriers.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary-500" />
                  30+ Carriers Compared
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                  5-Star Rated
                </span>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto w-full">
              {/* Loading */}
              {prefillStatus === "loading" && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                  <p className="text-text-secondary text-sm">
                    Loading your information...
                  </p>
                </div>
              )}

              {/* Invalid / Expired Token */}
              {prefillStatus === "invalid" && (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
                    Link Expired or Invalid
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    This quote link has expired or has already been used. Start a
                    fresh quote instead.
                  </p>
                  <a
                    href="/home-ppc-form"
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Start New Quote
                  </a>
                </div>
              )}

              {/* Step 1: Form */}
              {prefillStatus === "ready" && step === 1 && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-1">
                    Your Details
                  </h2>
                  <p className="text-text-secondary text-sm mb-5">
                    We've prefilled your info. Just add a few property details.
                  </p>

                  <div className="space-y-4">
                    {/* Prefilled fields (read-only) */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Pre-filled from your request
                      </p>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          disabled
                          className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm text-text-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            disabled
                            className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm text-text-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional fields */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Property Address
                      </label>
                      <input
                        type="text"
                        placeholder="123 Main St, Springfield, IL"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        placeholder="62701"
                        maxLength={5}
                        value={zip}
                        onChange={(e) =>
                          setZip(e.target.value.replace(/\D/g, ""))
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Estimated Home Value{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={homeValue}
                        onChange={(e) => setHomeValue(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select home value...
                        </option>
                        {HOME_VALUES.map((v) => (
                          <option key={v.value} value={v.value}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          Year Built <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={yearBuilt}
                          onChange={(e) => setYearBuilt(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select...
                          </option>
                          {YEAR_BUILT.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          Home Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={homeType}
                          onChange={(e) => setHomeType(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select...
                          </option>
                          {HOME_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Current Insurance Carrier
                      </label>
                      <select
                        value={currentCarrier}
                        onChange={(e) => setCurrentCarrier(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select (optional)...</option>
                        {CARRIERS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={
                        !homeValue || !yearBuilt || !homeType || submitting
                      }
                      className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          GET MY ESTIMATE
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-text-muted text-center">
                      No spam. Your info is only used to provide your quote.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Estimated Rate */}
              {prefillStatus === "ready" && step === 2 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-1">
                    Your Estimated Home Insurance Rate
                  </h2>
                  <div className="my-6">
                    <div className="text-5xl font-heading font-extrabold text-primary-500">
                      ${estimatedRate}
                    </div>
                    <p className="text-text-secondary text-sm mt-1">
                      per month (estimated)
                    </p>
                  </div>
                  <p className="text-text-muted text-xs mb-6">
                    This is an estimate based on typical rates in your area.
                    Actual rates may vary.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-800">
                        A Kover King agent will contact you shortly with exact
                        quotes from 30+ carriers to find you the best rate.
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:+12179608997"
                    className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now for Instant Quote
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary-500" />
            <span className="font-heading font-bold text-white">
              Kover King Insurance
            </span>
          </div>
          <p>&copy; 2026 Kover King Insurance Agency. All rights reserved.</p>
          <a
            href="tel:+12179608997"
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            (217) 960-8997
          </a>
        </div>
      </footer>
    </div>
  );
}
