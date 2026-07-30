import { Link } from "@tanstack/react-router";

// Optional SMS consent checkbox for forms whose PRIMARY purpose isn't SMS
// signup (quote requests, contact forms). Must stay OPTIONAL — making it
// required would make consent a condition of service, which is prohibited.
//
// Must always render unchecked by default (A2P error 30925) and carry the full
// disclosure set: brand, rates, frequency, STOP/HELP, not-a-condition, links.

export const SMS_CONSENT_TEXT =
  "By checking this box, I agree to receive customer service text messages from Kover King Insurance Agency at the phone number provided. Msg & data rates may apply. Msg frequency varies. Reply STOP to cancel, HELP for help. Consent is not a condition of purchase.";

export function SmsConsentCheckbox({
  checked,
  onChange,
  compact = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-2.5 cursor-pointer rounded-xl border border-gray-200 bg-surface ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#B33D08]"
      />
      <span className="text-[11px] leading-relaxed text-text-secondary">
        <strong className="text-text-primary">Optional:</strong> I agree to
        receive customer service text messages from{" "}
        <strong className="text-text-primary">Kover King Insurance Agency</strong>{" "}
        at the number provided about my quote, policy, and appointments.{" "}
        <strong className="text-text-primary">
          Msg &amp; data rates may apply. Msg frequency varies.
        </strong>{" "}
        Reply <strong className="text-text-primary">STOP</strong> to cancel,{" "}
        <strong className="text-text-primary">HELP</strong> for help. Consent is
        not a condition of purchase. See our{" "}
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
  );
}

/** Consistent audit-trail lines appended to a lead's `details` field. */
export function smsConsentDetailLines(consented: boolean): string[] {
  return consented
    ? [
        `SMS consent: YES (${new Date().toISOString()})`,
        `Consent language shown: "${SMS_CONSENT_TEXT}"`,
      ]
    : ["SMS consent: NO"];
}
