import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Building2,
  HardHat,
  Truck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Store,
  Wrench,
  Stethoscope,
  UtensilsCrossed,
  Laptop,
  ChevronDown,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      {
        title:
          "Business Insurance Springfield IL | Commercial Insurance | Kover King",
      },
      {
        name: "description",
        content:
          "Commercial insurance for Springfield businesses. General liability, commercial property, workers' compensation, business auto.",
      },
      {
        property: "og:title",
        content:
          "Business Insurance Springfield IL | Commercial Insurance | Kover King",
      },
      {
        property: "og:description",
        content:
          "Commercial insurance for Springfield businesses. General liability, commercial property, workers' compensation, business auto.",
      },
    ],
  }),
  component: BusinessPage,
});

const coverageTypes = [
  {
    icon: ShieldCheck,
    title: "General Liability",
    description:
      "Protects your business from third-party claims of bodily injury, property damage, and advertising injury. Essential for every business, often required by contracts and leases.",
    highlight: "Foundation Coverage",
  },
  {
    icon: Building2,
    title: "Commercial Property",
    description:
      "Covers your building, equipment, inventory, and furnishings against fire, theft, vandalism, and other covered perils. Protects what your business owns.",
    highlight: "Physical Assets",
  },
  {
    icon: HardHat,
    title: "Workers' Compensation",
    description:
      "Required by Illinois law for most employers, this coverage pays medical expenses and lost wages for employees injured on the job, and protects your business from related lawsuits.",
    highlight: "Illinois Required",
  },
  {
    icon: Truck,
    title: "Business Auto",
    description:
      "Covers vehicles owned or used by your business for liability, collision, and comprehensive needs. Includes hired and non-owned auto coverage for employees using personal vehicles.",
    highlight: "Fleet & Vehicle",
  },
  {
    icon: FileText,
    title: "Professional Liability",
    description:
      "Also known as errors and omissions (E&O) insurance, this protects professionals against claims of negligence, mistakes, or failure to deliver services as promised.",
    highlight: "E&O / Malpractice",
  },
  {
    icon: Briefcase,
    title: "Business Owner's Policy",
    description:
      "A BOP bundles general liability and commercial property into a single, cost-effective policy. Ideal for small to mid-size businesses looking for streamlined, affordable protection.",
    highlight: "Bundled Value",
  },
];

const industries = [
  { icon: Store, name: "Retail & Shops" },
  { icon: Wrench, name: "Contractors" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: UtensilsCrossed, name: "Restaurants" },
  { icon: Laptop, name: "Tech & Consulting" },
  { icon: Building2, name: "Real Estate" },
];

const whyChoosePoints = [
  "Independent agency access to 30+ commercial carriers",
  "Customized coverage built around your specific industry and risk",
  "BOP, standalone, and industry-specific policy options",
  "Annual policy reviews to ensure your coverage keeps pace with your business",
  "Local agents in Springfield who understand Illinois business regulations",
  "Claims advocacy — we're on your side when you need to file",
];

const faqItems = [
  {
    question: "How much does business insurance cost in Illinois?",
    answer:
      "Business insurance costs vary widely based on your industry, revenue, number of employees, claims history, and coverage limits. A sole proprietor consultant might pay $400–$800/year for a basic BOP, while a contractor with employees could pay $5,000–$15,000+ annually. The best way to know your actual cost is to get quotes — we compare 30+ carriers to find you the most competitive rate.",
  },
  {
    question: "What is a Business Owner's Policy (BOP)?",
    answer:
      "A Business Owner's Policy bundles general liability insurance and commercial property insurance into a single, discounted policy. It's designed for small to mid-size businesses and is typically more affordable than purchasing the two coverages separately. Many BOPs also include business interruption coverage. Not all businesses qualify — high-risk industries or businesses with complex needs may require standalone policies.",
  },
  {
    question: "Do I need workers' comp if I'm a sole proprietor?",
    answer:
      "In Illinois, sole proprietors without employees are not required to carry workers' compensation insurance. However, if you hire even one employee — full-time, part-time, or seasonal — workers' comp becomes legally required. Some sole proprietors voluntarily purchase it to protect themselves from medical costs if they're injured on the job. Certain contracts may also require it even if you have no employees.",
  },
  {
    question: "What does general liability insurance cover?",
    answer:
      "General liability insurance covers third-party claims of bodily injury (e.g., a customer slips and falls at your location), property damage (e.g., your employee accidentally damages a client's property), and advertising injury (e.g., claims of libel, slander, or copyright infringement in your marketing). It does not cover your own employees' injuries (that's workers' comp), your own property, or professional errors (that's E&O).",
  },
  {
    question: "How much liability coverage does my business need?",
    answer:
      "Most small businesses start with a $1 million per occurrence / $2 million aggregate general liability policy, which satisfies most lease and contract requirements. Higher-risk industries like construction, manufacturing, or businesses with significant foot traffic often need $2M–$5M or more. If you need higher limits without a large premium increase, a commercial umbrella policy can provide additional coverage cost-effectively.",
  },
  {
    question:
      "What is the difference between occurrence and claims-made policies?",
    answer:
      "An occurrence policy covers claims for incidents that happened during the policy period, regardless of when the claim is filed — even years later. A claims-made policy only covers claims filed while the policy is active. Claims-made policies are common for professional liability (E&O) and are often less expensive, but require you to maintain continuous coverage or purchase 'tail coverage' when you cancel.",
  },
  {
    question: "Can I get same-day business insurance?",
    answer:
      "Yes, in many cases. For straightforward business types — retail, consulting, small contractors — we can often bind coverage the same day you apply. More complex businesses, higher-risk industries, or policies requiring underwriter review may take 1–3 business days. If you have a time-sensitive contract or lease requirement, let us know and we'll prioritize getting your certificate of insurance as quickly as possible.",
  },
  {
    question: "What is an additional insured endorsement?",
    answer:
      "An additional insured endorsement adds another party — typically a client, landlord, or general contractor — to your policy, giving them some protection under your coverage. This is commonly required in contracts and commercial leases. It does not give the additional insured full policy rights; it typically only extends coverage for claims arising from your work or operations. We can add additional insureds and issue certificates of insurance quickly.",
  },
];

function BusinessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Business Insurance FAQ
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Common questions from Illinois business owners about commercial
            insurance coverage, costs, and requirements.
          </p>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-text-primary leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-text-secondary leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-text-secondary text-sm mt-8">
          Have a question not listed here?{" "}
          <Link
            to="/contact"
            className="text-primary-500 hover:underline font-medium"
          >
            Contact our team
          </Link>{" "}
          — we're happy to help.
        </p>
      </div>
    </section>
  );
}

function BusinessPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4" />
              Business Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Business Insurance in{" "}
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Protecting Springfield businesses is what we do. From a solo
              contractor to a growing company with employees, we'll find
              commercial coverage that fits your operation and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Business">
                <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                  Get a Business Quote
                  <ArrowRight className="w-5 h-5" />
                </button>
              </QuoteDialog>
              <a
                href="tel:+12179608997"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-500 text-primary-500 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-cream"
              >
                <Phone className="w-5 h-5" />
                (217) 960-8997
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Commercial Coverage Options
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every business faces unique risks. We'll assess your operation and
              build a policy package that closes the gaps without paying for
              coverage you don't need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverageTypes.map((coverage) => {
              const Icon = coverage.icon;
              return (
                <div
                  key={coverage.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-2">
                        {coverage.highlight}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                        {coverage.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {coverage.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Industries We Insure
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We work with businesses across all sectors in the Springfield
              metro area. If you own a business, we can find the right coverage.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map(({ icon: Icon, name }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <span className="text-sm font-semibold text-text-primary text-center leading-tight">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-text-secondary text-sm mt-6">
            Don't see your industry? We cover virtually all business types.{" "}
            <Link to="/contact" className="text-primary-500 hover:underline font-medium">
              Contact us
            </Link>{" "}
            to learn more.
          </p>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="bg-primary-500 rounded-2xl p-8 text-white order-2 lg:order-1">
              <h3 className="font-heading text-2xl font-bold mb-6">
                Protecting Springfield Businesses Since 1995
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/15 rounded-xl p-4">
                  <div className="text-3xl font-extrabold text-white">30+</div>
                  <div className="text-sm text-white/90">
                    Commercial carriers available for comparison
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 rounded-xl p-4">
                  <div className="text-3xl font-extrabold text-white">100%</div>
                  <div className="text-sm text-white/90">
                    Independent — we work for your business, not the carrier
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 rounded-xl p-4">
                  <div className="text-3xl font-extrabold text-white">1-on-1</div>
                  <div className="text-sm text-white/90">
                    Dedicated agent for ongoing support and annual reviews
                  </div>
                </div>
              </div>
              <QuoteDialog defaultInsuranceType="Business">
                <button className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-primary-500 hover:bg-cream font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                  Get a Business Insurance Quote
                  <ArrowRight className="w-4 h-4" />
                </button>
              </QuoteDialog>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                Why Springfield Businesses Choose Kover King
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                Running a business is complicated enough. Let us handle the
                insurance side — we'll compare carriers, explain your options,
                and make sure your business is properly protected.
              </p>
              <ul className="space-y-4">
                {whyChoosePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Illinois Business Insurance Requirements */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Illinois Business Insurance Requirements
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Illinois law mandates certain coverages for businesses operating
              in the state. Here's what's required and what's strongly
              recommended to protect your operation.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Required */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  Legally Required
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Workers' Compensation",
                    detail:
                      "Required for all Illinois employers with one or more employees. Covers medical expenses and lost wages for on-the-job injuries.",
                  },
                  {
                    title: "Commercial Auto",
                    detail:
                      "Required if your business owns or operates vehicles. Minimum liability limits apply under Illinois law.",
                  },
                  {
                    title: "Professional Liability",
                    detail:
                      "Required for certain licensed professionals including attorneys, physicians, architects, and engineers practicing in Illinois.",
                  },
                  {
                    title: "Liquor Liability",
                    detail:
                      "Required under the Illinois Dram Shop Act if your business sells or serves alcohol. Covers third-party claims from alcohol-related incidents.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-5 border border-red-100 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5">
                        REQUIRED
                      </span>
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Strongly Recommended */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary-500" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  Strongly Recommended
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "General Liability",
                    detail:
                      "Not required by Illinois law, but required by nearly every commercial lease, client contract, and vendor agreement. No serious business should operate without it.",
                  },
                  {
                    title: "Cyber Liability",
                    detail:
                      "Not yet legally mandated, but increasingly essential. Data breaches and ransomware attacks cost small businesses an average of $200,000+ per incident.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-5 border border-primary-100 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-block bg-cream text-primary-600 text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5">
                        RECOMMENDED
                      </span>
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-primary-500 rounded-xl p-5 text-white">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">Not sure what applies to your business?</span>{" "}
                    Our agents will walk through your specific situation and make
                    sure you're compliant with Illinois requirements while
                    identifying gaps that could expose you to serious risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose the Right Coverage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              How to Choose the Right Business Coverage
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              The right coverage depends on your industry, size, and risk
              exposure. Here's a practical guide to making smart coverage
              decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: "01",
                title: "Assess Your Risks",
                body: "Start by asking: what could go wrong? Consider lawsuits from customers or vendors, property damage, employee injuries, data breaches, and professional errors. Your answers determine your coverage priorities.",
              },
              {
                step: "02",
                title: "Understand Industry Requirements",
                body: "A general contractor faces entirely different risks than a software consultant. Construction businesses need tools & equipment coverage and contractor's liability. Consultants prioritize E&O and cyber coverage.",
              },
              {
                step: "03",
                title: "Factor in Revenue & Headcount",
                body: "Larger revenue and more employees mean greater exposure. Your general liability limits, workers' comp premiums, and umbrella needs all scale with your business size.",
              },
              {
                step: "04",
                title: "BOP vs. Standalone Policies",
                body: "A Business Owner's Policy bundles general liability and commercial property at a discount — ideal for small businesses. Larger or higher-risk operations often need standalone policies with higher limits and added endorsements.",
              },
              {
                step: "05",
                title: "Review Coverage Annually",
                body: "Your business changes — so should your insurance. New equipment, additional employees, new locations, or new services can all create gaps in your existing policy if you don't review it each year.",
              },
              {
                step: "06",
                title: "Watch for Common Coverage Gaps",
                body: "Small businesses frequently underinsure flood and water damage, cyber risk, employment practices liability, and business interruption. These are often the claims that hit hardest and aren't covered by a basic BOP.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl font-extrabold text-primary-100 mb-3 font-heading">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-cream rounded-2xl p-8 text-center">
            <p className="text-text-primary font-semibold text-lg mb-2">
              Not sure where to start?
            </p>
            <p className="text-text-secondary mb-6">
              Our agents will guide you through every step — assessing your
              risks, comparing carriers, and building a policy package that
              makes sense for your business.
            </p>
            <QuoteDialog defaultInsuranceType="Business">
              <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                Get a Free Business Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </QuoteDialog>
          </div>
        </div>
      </section>

      {/* Business Insurance FAQ */}
      <BusinessFAQ />

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Protect Your Springfield Business Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            One conversation. 30+ carriers compared. Coverage built for your
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Business">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get a Free Business Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </QuoteDialog>
            <a
              href="tel:+12179608997"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/30"
            >
              <Phone className="w-5 h-5" />
              (217) 960-8997
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
