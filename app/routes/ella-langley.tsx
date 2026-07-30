import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitQuote } from "~/lib/actions";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/ella-langley")({
  head: () => ({
    meta: [
      { title: "Win 2 Tickets to Ella Langley | Kover King Giveaway" },
      {
        name: "description",
        content:
          "Enter the drawing for 2 tickets to Ella Langley at the Illinois State Fair. All we ask is the chance to send you a free, no-obligation auto insurance quote.",
      },
      // Facebook ad traffic page — keep it out of the organic index.
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Win 2 Tickets to Ella Langley 🎟️" },
      {
        property: "og:description",
        content:
          "Illinois State Fair · August 15, 2026. Enter the drawing — plus a free auto insurance quote from Kover King.",
      },
      { property: "og:type", content: "website" },
      // Override the root's homepage og:url so FB scrapes THIS page.
      { property: "og:url", content: "https://koverking.com/ella-langley" },
      { property: "og:image", content: "https://koverking.com/ella-og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://koverking.com/ella-og.jpg" },
    ],
  }),
  component: EllaGiveaway,
});

// US states — IL default, matching the reference.
const STATES = [
  "IL", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const TOTAL_STEPS = 4;

const fieldLabel = "block text-sm font-semibold text-white mb-1.5";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition";

function EllaGiveaway() {
  const [step, setStep] = useState(1);
  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Step 2
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("IL");
  const [zip, setZip] = useState("");
  // Step 3
  const [dob, setDob] = useState("");
  const [vehicle, setVehicle] = useState("");
  // Step 4
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone.replace(/\D/g, "").length >= 10;

  const step1Ok = firstName.trim() && lastName.trim();
  const step2Ok = address.trim() && city.trim() && state && zip.length === 5;
  const step3Ok = dob && vehicle.trim();
  const step4Ok = emailValid && phoneValid;

  const submitEntry = async () => {
    if (!step4Ok) return;
    setSubmitting(true);
    try {
      await submitQuote({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          insurance_type: "Auto",
          address,
          city,
          state,
          zip,
          details: [
            "Source: Ella Langley Giveaway (Facebook)",
            `Date of birth: ${dob}`,
            `Vehicle: ${vehicle}`,
            `SMS consent: ${smsConsent ? `YES (${new Date().toISOString()})` : "NO"}`,
          ].join("\n"),
          // Pushed to GoHighLevel with this tag (see app/lib/ghl.ts).
          ghl_tags: smsConsent
            ? ["Ella-Langley", "sms-opt-in"]
            : ["Ella-Langley"],
          date_of_birth: dob,
        },
      });
    } catch {
      // Confirm the entry even if the DB write hiccups.
    }
    setSubmitting(false);
    setStep(5);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Full-bleed background: hi-res concert photo (4284x5712 source,
          CC BY 4.0 — credit in footer) + warm dark overlay for readability.
          No blur — the image is sharp; position keeps her face in frame. */}
      <div className="fixed inset-0 -z-10 bg-[#1a0a05]">
        {/* Mobile/tablet: standard centered cover. */}
        <div
          className="absolute inset-0 bg-cover lg:hidden"
          style={{
            backgroundImage: "url(/ella-hero.webp)",
            backgroundPosition: "center 18%",
          }}
        />
        {/* Desktop: oversize the photo and anchor it right, which pans Ella
            into the open left half so the centered card doesn't cover her. */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: "url(/ella-hero.webp)",
            backgroundSize: "145% auto",
            backgroundPosition: "right 20%",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#3a1206]/55 to-black/85" />
      </div>

      {/* Top bar */}
      <header className="relative max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-heading font-bold uppercase tracking-[0.2em] text-sm text-white/90">
          Kover King Presents
        </span>
        <a
          href="https://koverking.com"
          className="text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors"
        >
          koverking.com
        </a>
      </header>

      {/* Hero + form — centered column, like the reference. */}
      <main className="relative max-w-2xl mx-auto px-5 sm:px-8 pt-6 pb-16 text-center">
        <h1 className="font-heading text-5xl sm:text-6xl font-extrabold leading-[1.02] drop-shadow-lg">
          Win 2 Tickets to
          <br />
          <span className="text-primary-400">Ella Langley</span>
        </h1>

        <div className="mt-5 inline-flex items-center rounded-full bg-white/10 border border-white/15 backdrop-blur px-5 py-2 text-sm font-bold">
          Illinois State Fair · August 15, 2026
        </div>

        <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
          Enter the drawing below. All we need in return is the chance to send you
          a free, no-obligation auto insurance quote — that's it.
        </p>

        {/* Entry card: centered, translucent so the photo reads through. */}
        <div className="mt-8 text-left rounded-2xl bg-black/25 backdrop-blur-[3px] border border-white/10 shadow-2xl p-6 sm:p-8">
          {step <= TOTAL_STEPS && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-8 rounded-full transition-colors ${
                        i < step ? "bg-primary-500" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/60">
                  Step {step} of {TOTAL_STEPS}
                </span>
              </div>
            </>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={fieldLabel}>First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={fieldLabel}>Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <NavRow
                onNext={() => step1Ok && setStep(2)}
                nextDisabled={!step1Ok}
              />
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={fieldLabel}>Street address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={fieldLabel}>State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`${inputClass} cursor-pointer [&>option]:text-black`}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={fieldLabel}>ZIP code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                />
              </div>
              <NavRow
                onBack={() => setStep(1)}
                onNext={() => step2Ok && setStep(3)}
                nextDisabled={!step2Ok}
              />
            </div>
          )}

          {/* Step 3: Driver + vehicle */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className={fieldLabel}>Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
              <div>
                <label className={fieldLabel}>Vehicle (year, make &amp; model)</label>
                <input
                  type="text"
                  placeholder="e.g. 2021 Ford F-150"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <NavRow
                onBack={() => setStep(2)}
                onNext={() => step3Ok && setStep(4)}
                nextDisabled={!step3Ok}
              />
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className={fieldLabel}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={fieldLabel}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              {/* A2P 10DLC-compliant consent. Unchecked by default; a
                  pre-checked box is an automatic campaign rejection. */}
              <label className="flex items-start gap-2.5 cursor-pointer rounded-xl bg-white/5 border border-white/15 p-3">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#B33D08]"
                />
                <span className="text-xs text-white/70 leading-relaxed">
                  By checking this box, I agree to receive customer service text
                  messages from Kover King Insurance Agency at the number
                  provided about my insurance quote. Msg &amp; data rates may
                  apply. Msg frequency varies. Reply STOP to cancel, HELP for
                  help. Consent is not a condition of purchase or entry. See
                  our{" "}
                  <a href="/privacy-policy" className="underline hover:text-white">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms-of-service" className="underline hover:text-white">
                    SMS Terms
                  </a>
                  .
                </span>
              </label>
              <p className="text-xs text-white/50 leading-relaxed">
                We'll email your no-obligation quote to the address above.
                No purchase necessary to enter the drawing.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={submitEntry}
                  disabled={!step4Ok || submitting}
                  className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(179,61,8,0.6)]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Entering...
                    </>
                  ) : (
                    <>
                      Enter Drawing &amp; Get My Quote
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-primary-400" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold mb-2">
                You're entered! 🎉
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Good luck, {firstName || "friend"}. We'll email your no-obligation
                quote to <span className="text-white">{email}</span> within 1
                business day. The winner is drawn at the close of the promotion
                and contacted directly.
              </p>
              <a
                href="tel:+12179608997"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                Prefer to talk now? Call us
              </a>
            </div>
          )}
        </div>

        {/* Below-card fine print */}
        <p className="mt-5 text-xs text-white/50 leading-relaxed max-w-lg mx-auto">
          No purchase necessary. We'll email your personalized quote within 1
          business day. Winner drawn at the close of the promotion. This promotion
          is not sponsored by or affiliated with Ella Langley or the Illinois
          State Fair.
        </p>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 text-center text-xs text-white/50">
          &copy; 2026 Kover King Insurance Agency · Springfield, IL
          <span className="block mt-1">
            Photo:{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:EllaLangleyInConcert2025.jpg"
              className="underline hover:text-white/80"
            >
              BrDen
            </a>
            , CC BY 4.0, via Wikimedia Commons
          </span>
        </div>
      </footer>
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-1">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(179,61,8,0.6)]"
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
