import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Kover King Insurance" },
      {
        name: "description",
        content:
          "Terms of Service for Kover King Insurance — terms governing the use of our website and insurance agency services.",
      },
    ],
  }),
  component: TermsOfServicePage,
});

const EFFECTIVE_DATE = "January 1, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement",
        text: "By accessing or using the Kover King Insurance website located at koverking.com (the \"Site\") or any services offered by Kover King Insurance (\"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, please do not use our Site or services.",
      },
      {
        subtitle: "Capacity",
        text: "By using our Site and services, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement. If you are using our Site on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.",
      },
      {
        subtitle: "Modifications",
        text: "We reserve the right to modify these Terms at any time. Material changes will be indicated by an updated effective date. Your continued use of the Site following the posting of revised Terms constitutes your acceptance of the changes. It is your responsibility to review these Terms periodically.",
      },
    ],
  },
  {
    id: "services",
    title: "2. Description of Services",
    content: [
      {
        subtitle: "Insurance Agency Services",
        text: "Kover King Insurance is a licensed independent insurance agency in the State of Illinois. We act as an intermediary between you and licensed insurance carriers. Our services include providing information about insurance products, obtaining quotes on your behalf, submitting policy applications, and assisting with policy servicing and claims.",
      },
      {
        subtitle: "No Guarantee of Coverage",
        text: "Submission of a quote request or contact form through our Site does not constitute a binding insurance policy or a guarantee of coverage. Insurance coverage is subject to the underwriting guidelines, approval, and terms and conditions of the applicable insurance carrier. A policy is in force only when issued by a carrier and all required premiums have been paid.",
      },
      {
        subtitle: "Information Only",
        text: "The information provided on this Site is for general informational purposes only and does not constitute professional insurance, legal, or financial advice. Insurance needs vary significantly based on individual circumstances. We encourage you to speak with one of our licensed agents to discuss your specific situation before making any insurance decisions.",
      },
      {
        subtitle: "Availability",
        text: "We reserve the right to modify, suspend, or discontinue any aspect of our Site or services at any time without prior notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of services.",
      },
    ],
  },
  {
    id: "user-responsibilities",
    title: "3. Your Responsibilities",
    content: [
      {
        subtitle: "Accurate Information",
        text: "You agree to provide accurate, current, and complete information when using our Site and services. Providing false, misleading, or incomplete information in connection with an insurance application or quote request may constitute insurance fraud under applicable law and can result in policy cancellation, denial of claims, or criminal prosecution.",
      },
      {
        subtitle: "Prohibited Conduct",
        text: "You agree not to: (a) use the Site for any unlawful purpose or in violation of these Terms; (b) attempt to gain unauthorized access to any portion of the Site or its related systems; (c) use any automated means to access, scrape, or monitor the Site without our express written consent; (d) transmit any viruses, malware, or other malicious code through the Site; (e) interfere with or disrupt the integrity or performance of the Site; or (f) impersonate any person or entity.",
      },
      {
        subtitle: "Account Security",
        text: "If you create an account or are provided credentials to access any portion of our Site, you are responsible for maintaining the confidentiality of your login information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    content: [
      {
        subtitle: "Our Content",
        text: "All content on this Site, including but not limited to text, graphics, logos, images, and software, is the property of Kover King Insurance or its content suppliers and is protected by United States copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content from this Site without our prior written consent.",
      },
      {
        subtitle: "Limited License",
        text: "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Site solely for your personal, non-commercial purposes in connection with obtaining insurance agency services. This license does not include the right to collect or use any product listings or descriptions, make any derivative use of the Site or its contents, or use any data mining or similar data gathering tools.",
      },
    ],
  },
  {
    id: "disclaimers",
    title: "5. Disclaimers",
    content: [
      {
        subtitle: "As-Is Basis",
        text: "THE SITE AND ITS CONTENT ARE PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KOVER KING INSURANCE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      },
      {
        subtitle: "No Warranty of Accuracy",
        text: "While we strive to provide accurate and up-to-date information, we make no representations or warranties regarding the accuracy, completeness, reliability, suitability, or availability of any information on the Site. Any reliance you place on such information is at your own risk. Insurance products, rates, and availability are subject to change without notice.",
      },
      {
        subtitle: "Third-Party Content",
        text: "Our Site may contain links to or information about third-party websites, products, or services. We do not endorse, control, or assume responsibility for any third-party content, websites, or services. Your interactions with third parties are solely between you and such parties.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "6. Limitation of Liability",
    content: [
      {
        subtitle: "Cap on Damages",
        text: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL KOVER KING INSURANCE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE OR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
      },
      {
        subtitle: "Total Liability",
        text: "In no event shall our total cumulative liability to you for all claims arising out of or relating to these Terms or your use of the Site or services exceed the greater of (a) the amount you paid to us in the twelve months preceding the claim, or (b) one hundred dollars ($100.00).",
      },
      {
        subtitle: "Essential Basis",
        text: "The limitations of liability set forth above are fundamental elements of the basis of the bargain between us. Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you in their entirety.",
      },
    ],
  },
  {
    id: "indemnification",
    title: "7. Indemnification",
    content: [
      {
        subtitle: "Your Indemnity",
        text: "You agree to indemnify, defend, and hold harmless Kover King Insurance and its officers, directors, employees, agents, and successors from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to: (a) your use of the Site or services; (b) your violation of these Terms; (c) your violation of any applicable law or regulation; or (d) any information you provide to us, including any inaccurate or misleading information provided in connection with an insurance application.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "8. Governing Law and Dispute Resolution",
    content: [
      {
        subtitle: "Governing Law",
        text: "These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law provisions. You consent to the exclusive jurisdiction of the state and federal courts located in Sangamon County, Illinois for the resolution of any disputes arising under these Terms.",
      },
      {
        subtitle: "Informal Resolution",
        text: "Before initiating any formal dispute resolution proceeding, you agree to first contact us to attempt to resolve the dispute informally. We will make good-faith efforts to resolve your concern. If the dispute is not resolved within 30 days, either party may pursue formal dispute resolution.",
      },
    ],
  },
  {
    id: "general",
    title: "9. General Provisions",
    content: [
      {
        subtitle: "Severability",
        text: "If any provision of these Terms is found to be invalid or unenforceable under applicable law, the remaining provisions will continue in full force and effect.",
      },
      {
        subtitle: "Entire Agreement",
        text: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Kover King Insurance regarding your use of the Site and services and supersede all prior and contemporaneous agreements, representations, and understandings.",
      },
      {
        subtitle: "Waiver",
        text: "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. Any waiver must be in writing and signed by an authorized representative of Kover King Insurance.",
      },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      {
        subtitle: "Questions About These Terms",
        text: "If you have any questions about these Terms of Service, please contact us:",
      },
    ],
    contactBlock: true,
  },
];

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-surface border-b border-gray-100 py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary">
            Effective Date:{" "}
            <strong className="text-text-primary">{EFFECTIVE_DATE}</strong>
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-text-muted mb-10">
          <Link to="/" className="hover:text-primary-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">Terms of Service</span>
        </nav>

        {/* White content card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          {/* Introduction */}
          <div className="bg-cream border border-primary-100 rounded-2xl p-6 mb-10">
            <p className="text-text-secondary leading-relaxed">
              Please read these Terms of Service carefully before using the Kover
              King Insurance website or services. These Terms govern your access
              to and use of our website and the insurance agency services we
              provide. By accessing or using our Site, you agree to be bound by
              these Terms and our{" "}
              <Link
                to="/privacy-policy"
                className="text-primary-500 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-surface rounded-2xl border border-gray-100 p-6 mb-12">
            <h2 className="font-heading font-bold text-text-primary mb-4 text-lg">
              Table of Contents
            </h2>
            <ol className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-primary-500 hover:text-primary-600 hover:underline text-sm font-medium transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary-500 mb-6 pb-3 border-b border-gray-100">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.content.map((block) => (
                    <div key={block.subtitle}>
                      <h3 className="font-semibold text-text-primary mb-2">
                        {block.subtitle}
                      </h3>
                      <p
                        className={`leading-relaxed ${
                          block.text === block.text.toUpperCase()
                            ? "text-text-muted text-sm"
                            : "text-text-secondary"
                        }`}
                      >
                        {block.text}
                      </p>
                    </div>
                  ))}

                  {section.contactBlock && (
                    <div className="bg-surface rounded-2xl border border-gray-100 p-6 mt-4 space-y-2 text-text-secondary">
                      <div>
                        <span className="font-semibold text-text-primary">Kover King Insurance</span>
                      </div>
                      <div>Springfield, IL 62701</div>
                      <div>
                        Phone:{" "}
                        <a
                          href="tel:+12179608997"
                          className="text-primary-500 hover:underline font-medium"
                        >
                          (217) 960-8997
                        </a>
                      </div>
                      <div>
                        Email:{" "}
                        <a
                          href="mailto:info@koverking.com"
                          className="text-primary-500 hover:underline font-medium"
                        >
                          info@koverking.com
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-text-muted">
              Last updated: {EFFECTIVE_DATE}
            </p>
            <div className="flex gap-4 text-sm">
              <Link
                to="/privacy-policy"
                className="text-primary-500 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/contact"
                className="text-primary-500 hover:underline font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
