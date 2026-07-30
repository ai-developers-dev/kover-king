import { createFileRoute, Link } from "@tanstack/react-router";
import { SmsOptInForm } from "~/components/sms-optin-form";
import {
  MessageSquare,
  ShieldCheck,
  Phone,
  Ban,
  HelpCircle,
} from "lucide-react";

// Dedicated SMS opt-in page. This is the URL to give Twilio as the
// "Call-to-Action / opt-in URL" during A2P 10DLC campaign registration —
// carriers screenshot this page to verify consent language.
export const Route = createFileRoute("/sms-alerts")({
  head: () => ({
    meta: [
      { title: "Text Message Alerts | Kover King Insurance" },
      {
        name: "description",
        content:
          "Opt in to receive text messages from Kover King Insurance about your quote, policy, and reminders. Msg & data rates may apply. Reply STOP to cancel.",
      },
    ],
    links: [{ rel: "canonical", href: "https://koverking.com/sms-alerts" }],
  }),
  component: SmsOptInPage,
});

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

function SmsOptInPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-surface border-b border-gray-100 py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-7 h-7 text-primary-500" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
            Get Text Updates from Kover King
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Sign up to receive text messages about your insurance quote, policy
            documents, renewal reminders, and appointment confirmations — sent by
            our licensed Springfield, IL agents. Customer service only; we
            don't send marketing texts through this program.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmsOptInForm source="SMS Opt-In Page" />

      {/* Full program disclosures — carriers look for these on the page. */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h2 className="font-heading text-lg font-bold text-text-primary mb-4">
              SMS Program Details
            </h2>
            <dl className="space-y-4 text-sm">
              {[
                {
                  icon: MessageSquare,
                  term: "What you'll receive",
                  desc: "Customer service messages only: quote follow-ups, policy documents, appointment confirmations, renewal and payment reminders, and replies to questions you send us. We do not send promotional or marketing texts through this program.",
                },
                {
                  icon: ShieldCheck,
                  term: "Message frequency",
                  desc: "Message frequency varies. You may receive up to approximately 10 messages per month depending on your interaction with us.",
                },
                {
                  icon: Phone,
                  term: "Message and data rates",
                  desc: "Message and data rates may apply. Charges come from your mobile carrier. Carriers are not liable for delayed or undelivered messages.",
                },
                {
                  icon: Ban,
                  term: "How to opt out",
                  desc: "Reply STOP to any message to cancel. You'll get one confirmation message and then no further texts.",
                },
                {
                  icon: HelpCircle,
                  term: "How to get help",
                  desc: "Reply HELP to any message, email info@koverking.com, or call (217) 960-8997.",
                },
                {
                  icon: ShieldCheck,
                  term: "Your privacy",
                  desc: "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Mobile opt-in data will never be shared or sold to third parties or lead generators.",
                },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.term} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-cream rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <dt className="font-semibold text-text-primary">
                        {row.term}
                      </dt>
                      <dd className="text-text-secondary leading-relaxed">
                        {row.desc}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            <p className="mt-6 text-xs text-text-muted">
              Full details are available in our{" "}
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
                Terms of Service (Section 8 — SMS Terms)
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
