import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Kover King Insurance" },
      {
        name: "description",
        content:
          "Privacy Policy for Kover King Insurance — how we collect, use, and protect your personal information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

const EFFECTIVE_DATE = "January 1, 2026";

const sections = [
  {
    id: "information-collection",
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information You Provide Directly",
        text: "When you request an insurance quote, submit a contact form, or communicate with us by phone or email, we collect personal information you provide voluntarily. This may include your name, mailing address, email address, telephone number, date of birth, driver's license number, vehicle information, property details, and other information relevant to your insurance needs.",
      },
      {
        subtitle: "Information Collected Automatically",
        text: "When you visit our website, we may automatically collect certain technical information, including your IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits. This information is collected through standard web server logs and similar technologies.",
      },
      {
        subtitle: "Information from Third Parties",
        text: "In connection with providing insurance products and services, we may receive information about you from insurance carriers, consumer reporting agencies, public records, and other third-party sources as permitted by applicable law.",
      },
    ],
  },
  {
    id: "use-of-information",
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "Providing Insurance Services",
        text: "We use your personal information primarily to provide insurance agency services, including obtaining and comparing insurance quotes on your behalf, processing policy applications, servicing existing policies, and assisting with claims.",
      },
      {
        subtitle: "Communications",
        text: "We may use your contact information to respond to your inquiries, provide policy documents, send renewal reminders, and communicate important changes to your coverage. With your consent, we may also send you information about additional insurance products or services that may be of interest to you.",
      },
      {
        subtitle: "Legal and Regulatory Compliance",
        text: "We may use and disclose your information as required by applicable laws and regulations, including those governing insurance agencies licensed in the State of Illinois, and to comply with lawful requests from government authorities.",
      },
      {
        subtitle: "Business Operations",
        text: "We use information to operate, maintain, and improve our website and services; to detect and prevent fraud and security incidents; and to carry out other legitimate business purposes.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "3. How We Share Your Information",
    content: [
      {
        subtitle: "Insurance Carriers and Partners",
        text: "To obtain insurance quotes and process policy applications, we share your information with licensed insurance carriers and, where applicable, wholesale brokers or managing general agents. These parties are required to handle your information in accordance with applicable privacy laws and their own privacy policies.",
      },
      {
        subtitle: "Service Providers",
        text: "We may share your information with third-party service providers who assist us in operating our business, such as website hosting providers, data analytics firms, and communication services. These vendors are contractually obligated to use your information only for the purposes for which it was shared and to maintain appropriate security measures.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information when required by law, court order, or governmental authority, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.",
      },
      {
        subtitle: "No Sale of Personal Information",
        text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: [
      {
        subtitle: "Security Measures",
        text: "We implement reasonable administrative, technical, and physical safeguards designed to protect the personal information we collect against unauthorized access, disclosure, alteration, and destruction. Our website uses industry-standard encryption (TLS/SSL) to protect data transmitted between your browser and our servers.",
      },
      {
        subtitle: "Limitations",
        text: "No method of transmission over the Internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. In the event of a data breach that affects your rights and freedoms, we will notify you as required by applicable law.",
      },
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies and Tracking Technologies",
    content: [
      {
        subtitle: "What We Use",
        text: "Our website may use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. Cookies are small text files stored on your device by your browser.",
      },
      {
        subtitle: "Your Choices",
        text: "Most web browsers are set to accept cookies by default. You can choose to set your browser to refuse cookies or to alert you when cookies are being sent. Please note that some features of our website may not function properly if cookies are disabled.",
      },
      {
        subtitle: "Analytics",
        text: "We may use third-party analytics services (such as Google Analytics) to help us understand how visitors use our website. These services may use cookies and similar technologies to collect information about your use of our site and report website trends. You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on.",
      },
    ],
  },
  {
    id: "third-party-links",
    title: "6. Third-Party Links",
    content: [
      {
        subtitle: "External Websites",
        text: "Our website may contain links to third-party websites, including the websites of insurance carriers and other partners. These links are provided for your convenience and informational purposes only. We have no control over the content, privacy practices, or security of external sites. We encourage you to review the privacy policies of any third-party websites you visit.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    title: "7. Children's Privacy",
    content: [
      {
        subtitle: "Age Restriction",
        text: "Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have inadvertently collected information from a child under 18, please contact us immediately and we will take steps to delete that information.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "8. Your Rights and Choices",
    content: [
      {
        subtitle: "Access and Correction",
        text: "You may request access to the personal information we hold about you and ask us to correct inaccurate or incomplete information. To make such a request, please contact us using the information provided below.",
      },
      {
        subtitle: "Opt-Out of Marketing",
        text: "If you have previously consented to receive marketing communications from us, you may opt out at any time by contacting us directly or by following the unsubscribe instructions included in our emails.",
      },
      {
        subtitle: "Illinois Residents",
        text: "Illinois residents may have additional rights under applicable state law, including the Illinois Personal Information Protection Act (PIPA). Please contact us if you have questions about your rights as an Illinois resident.",
      },
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Privacy Policy",
    content: [
      {
        subtitle: "Updates",
        text: "We reserve the right to update this Privacy Policy at any time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the effective date at the top of this page. Your continued use of our website after any changes to this Policy constitutes your acceptance of the revised Policy. We encourage you to review this Policy periodically.",
      },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      {
        subtitle: "Questions or Concerns",
        text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:",
      },
    ],
    contactBlock: true,
  },
];

function PrivacyPolicyPage() {
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
            Privacy Policy
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
          <span className="text-text-primary font-medium">Privacy Policy</span>
        </nav>

        {/* White content card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          {/* Introduction */}
          <div className="bg-cream border border-primary-100 rounded-2xl p-6 mb-10">
            <p className="text-text-secondary leading-relaxed">
              Kover King Insurance ("we," "us," or "our") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your personal information
              when you visit our website at{" "}
              <span className="font-semibold text-primary-500">
                koverking.com
              </span>{" "}
              or interact with our insurance agency services. Please read this
              Policy carefully. By using our website or services, you agree to
              the practices described in this Policy.
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
                      <p className="text-text-secondary leading-relaxed">{block.text}</p>
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

          {/* Back to top */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-text-muted">
              Last updated: {EFFECTIVE_DATE}
            </p>
            <div className="flex gap-4 text-sm">
              <Link
                to="/terms-of-service"
                className="text-primary-500 hover:underline font-medium"
              >
                Terms of Service
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
