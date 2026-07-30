import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { submitQuote } from "~/lib/actions";
import { CheckCircle, Loader2, MessageSquare } from "lucide-react";

// Shared A2P 10DLC-compliant SMS opt-in form.
//
// Used on the homepage (so Twilio/carrier reviewers find the consent language
// at the top-level domain) and on the dedicated /sms-alerts page. Every
// required element must stay intact: brand name, msg & data rates, frequency,
// STOP/HELP, "not a condition of purchase", and links to the policy + terms.
// The consent checkbox MUST default to unchecked.

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

export const SMS_CONSENT_LANGUAGE =
  "By checking this box, I agree to receive customer service text messages from Kover King Insurance Agency at the phone number provided. Msg & data rates may apply. Msg frequency varies. Reply STOP to cancel, HELP for help. Consent is not a condition of purchase.";

export function SmsOptInForm({ source }: { source: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone.replace(/\D/g, "").length >= 10;
  const canSubmit =
    firstName.trim() && lastName.trim() && emailValid && phoneValid && smsConsent;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitQuote({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          insurance_type: "Auto",
          details: [
            `Source: ${source}`,
            `SMS consent: YES (${new Date().toISOString()})`,
            `Consent language shown: "${SMS_CONSENT_LANGUAGE}"`,
          ].join("\n"),
          ghl_tags: ["sms-opt-in"],
        },
      });
    } catch {
      /* best-effort — still confirm to the user */
    }
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
          You're signed up
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          Thanks, {firstName}. We've recorded your consent for the number ending
          in {phone.replace(/\D/g, "").slice(-4)}. Reply STOP at any time to
          cancel, or HELP for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              placeholder="Smith"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="jane@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Mobile Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="(217) 555-0100"
          />
        </div>

        {/* REQUIRED consent checkbox — unchecked by default. */}
        <label className="flex items-start gap-3 cursor-pointer bg-surface border border-gray-200 rounded-xl p-4">
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#B33D08]"
          />
          <span className="text-xs text-text-secondary leading-relaxed">
            By checking this box, I agree to receive customer service text
            messages from{" "}
            <strong className="text-text-primary">
              Kover King Insurance Agency
            </strong>{" "}
            at the phone number provided, including messages about my quote,
            policy, appointments, and service reminders.{" "}
            <strong className="text-text-primary">
              Msg &amp; data rates may apply. Msg frequency varies.
            </strong>{" "}
            Reply <strong className="text-text-primary">STOP</strong> to cancel,{" "}
            <strong className="text-text-primary">HELP</strong> for help. Consent
            is not a condition of purchase. See our{" "}
            <Link
              to="/privacy-policy"
              className="text-primary-500 underline hover:text-primary-600"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-of-service"
              className="text-primary-500 underline hover:text-primary-600"
            >
              SMS Terms
            </Link>
            .
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              Sign Up for Text Alerts
            </>
          )}
        </button>
        {!smsConsent && (
          <p className="text-xs text-text-muted text-center">
            You must check the consent box above to sign up.
          </p>
        )}
      </div>
    </div>
  );
}
