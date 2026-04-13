import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Building2,
  HardHat,
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
  Landmark,
  Car,
  HeartHandshake,
  Shield,
  Wifi,
  FileText,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/business-insurance-springfield-il")({
  head: () => ({
    meta: [
      {
        title:
          "Business Insurance Springfield IL | Commercial Coverage | Kover King",
      },
      {
        name: "description",
        content:
          "Springfield IL business insurance from 30+ carriers. General liability, workers comp, commercial property & BOP policies. Free quotes — call (217) 960-8997.",
      },
      {
        property: "og:title",
        content:
          "Business Insurance Springfield IL | Commercial Coverage | Kover King",
      },
      {
        property: "og:description",
        content:
          "Springfield IL business insurance from 30+ carriers. General liability, workers comp, commercial property & BOP policies. Free quotes — call (217) 960-8997.",
      },
      {
        name: "keywords",
        content:
          "business insurance Springfield IL, commercial insurance Springfield Illinois, general liability Springfield IL, workers comp Springfield Illinois, BOP Springfield IL, small business insurance Springfield, commercial property insurance Springfield",
      },
    ],
  }),
  component: BusinessInsuranceSpringfieldPage,
});

const coverageTypes = [
  {
    icon: ShieldCheck,
    title: "General Liability",
    description:
      "Protects your business from third-party claims of bodily injury, property damage, and advertising injury. Required by most commercial leases in downtown Springfield and government contracts.",
    highlight: "Foundation Coverage",
  },
  {
    icon: Building2,
    title: "Commercial Property",
    description:
      "Covers your building, equipment, inventory, and furnishings against fire, theft, vandalism, and other perils. Essential for Springfield's downtown storefronts, office buildings, and facilities along the Wabash corridor.",
    highlight: "Physical Assets",
  },
  {
    icon: HardHat,
    title: "Workers' Compensation",
    description:
      "Required by Illinois law for any employer with one or more employees. Covers medical expenses and lost wages for on-the-job injuries — critical for Springfield's construction and healthcare sectors.",
    highlight: "Illinois Required",
  },
  {
    icon: Briefcase,
    title: "Business Owner's Policy",
    description:
      "A BOP bundles general liability and commercial property into one affordable policy — ideal for Springfield's small businesses, downtown shops, and professional offices looking for streamlined coverage.",
    highlight: "Bundled Value",
  },
  {
    icon: Wifi,
    title: "Cyber Liability",
    description:
      "Covers data breaches, ransomware attacks, and cyber extortion. Increasingly important for Springfield healthcare providers, government contractors, and any business handling sensitive client data.",
    highlight: "Data Protection",
  },
  {
    icon: FileText,
    title: "Professional Liability",
    description:
      "Also called errors & omissions (E&O), this protects consultants, attorneys, accountants, healthcare providers, and other professionals from claims of negligence or failure to deliver promised services.",
    highlight: "E&O / Malpractice",
  },
];

const industries = [
  {
    icon: Landmark,
    name: "Government Contractors",
    description:
      "State agencies and subcontractors working on Illinois government projects require specific liability limits and bonding. We understand Springfield's procurement requirements.",
  },
  {
    icon: Stethoscope,
    name: "Healthcare & Medical",
    description:
      "Medical offices, clinics, and allied health providers near HSHS St. John's and Memorial Health need malpractice, premises liability, and cyber coverage tailored to HIPAA requirements.",
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurants & Food Service",
    description:
      "From Springfield's iconic horseshoe sandwich spots to downtown gastropubs — we cover GL, liquor liability, equipment breakdown, and workers' comp for the hospitality industry.",
  },
  {
    icon: Wrench,
    name: "Construction & Trades",
    description:
      "General contractors, electricians, plumbers, and HVAC companies working the Springfield metro area need contractor's liability, tools & equipment, and surety bonds.",
  },
  {
    icon: Laptop,
    name: "Professional Services",
    description:
      "Law firms, accounting practices, consultants, and IT firms operating in and around the state capital need E&O, cyber liability, and business interruption coverage.",
  },
  {
    icon: Store,
    name: "Retail & Downtown Shops",
    description:
      "Springfield's downtown retail corridor and neighborhood shops need BOP coverage, product liability, and commercial property protection for their storefronts and inventory.",
  },
  {
    icon: Car,
    name: "Auto Dealers & Repair",
    description:
      "Dealerships and repair shops need garage liability, garagekeepers insurance, commercial auto, and workers' comp — policies that protect against the unique risks of automotive businesses.",
  },
  {
    icon: HeartHandshake,
    name: "Nonprofits",
    description:
      "Springfield's active nonprofit sector — from social service agencies to arts organizations — needs directors & officers (D&O) liability, volunteer coverage, and general liability.",
  },
];

const springfieldFacts = [
  {
    icon: Landmark,
    title: "State Capital — Government Contracting Hub",
    body: "As the Illinois state capital, Springfield is home to thousands of government contractors and subcontractors serving state agencies. Contract requirements often mandate specific GL limits, professional liability, and performance bonds. We know what Springfield's government procurement officers expect.",
  },
  {
    icon: Stethoscope,
    title: "Major Healthcare Sector",
    body: "HSHS St. John's Hospital and Memorial Health System anchor a large healthcare and medical services ecosystem in Springfield. Medical offices, clinics, home health agencies, and allied health providers need specialized coverage including malpractice, cyber liability for HIPAA compliance, and workers' comp.",
  },
  {
    icon: Store,
    title: "Downtown Small Business Community",
    body: "Springfield's downtown revitalization has brought a wave of independent restaurants, boutiques, and service businesses. Many commercial leases along the 5th Street corridor and Old Capitol Plaza require general liability insurance as a condition of occupancy.",
  },
  {
    icon: TrendingUp,
    title: "Construction Growth in the Region",
    body: "Springfield and surrounding Sangamon County continue to see commercial and residential construction activity. Contractors working on state infrastructure, commercial development, and housing projects face substantial liability and workers' comp exposure.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant & Hospitality Scene",
    body: "Springfield's food and hospitality scene — from landmark diners to new brewpubs — carries specific insurance needs: liquor liability under Illinois' Dram Shop Act, equipment breakdown, and food spoilage coverage.",
  },
];

const whyChoosePoints = [
  "Independent agency with access to 30+ commercial carriers",
  "Customized coverage built around your specific industry and risk profile",
  "Deep familiarity with Springfield's government contracting requirements",
  "BOP, standalone, and industry-specific policy options",
  "Annual policy reviews to keep pace with your growing business",
  "Local Springfield agents who understand Illinois business regulations",
  "Claims advocacy — we're on your side when you need to file",
];

const ilRequirements = [
  {
    title: "Workers' Compensation",
    detail:
      "Required for all Illinois employers with one or more employees, including part-time and seasonal workers. Failure to carry workers' comp can result in fines and personal liability for injury claims.",
    required: true,
  },
  {
    title: "Commercial Auto Liability",
    detail:
      "Required if your business owns or operates vehicles. Illinois minimum liability limits are $25,000/$50,000 bodily injury and $20,000 property damage — most commercial policies exceed these minimums.",
    required: true,
  },
  {
    title: "Professional Liability",
    detail:
      "Required for certain licensed professionals in Illinois including attorneys, physicians, architects, and engineers. State licensing boards or client contracts often mandate minimum coverage limits.",
    required: true,
  },
  {
    title: "Liquor Liability",
    detail:
      "Required under the Illinois Dram Shop Act for any business that sells, serves, or furnishes alcohol. Covers third-party claims arising from alcohol-related incidents — essential for Springfield's bars and restaurants.",
    required: true,
  },
  {
    title: "General Liability",
    detail:
      "Not required by Illinois law but required by nearly every commercial lease, government contract, and client vendor agreement in Springfield. No serious business should operate without it.",
    required: false,
  },
  {
    title: "Cyber Liability",
    detail:
      "Not yet mandated, but increasingly required by contracts and clients handling sensitive data. Data breaches average $200,000+ for small businesses — especially relevant for healthcare providers and government subcontractors.",
    required: false,
  },
];

const faqItems = [
  {
    question:
      "Do Springfield government contractors need special insurance coverage?",
    answer:
      "Yes. Illinois state agency contracts typically require vendors and subcontractors to carry minimum general liability limits of $1M per occurrence / $2M aggregate, commercial auto if vehicles are used, workers' compensation, and often professional liability. Some contracts also require performance and payment bonds. Our agents are familiar with Illinois procurement requirements and can ensure your coverage satisfies contract specifications — including issuing certificates of insurance quickly when your bid is accepted.",
  },
  {
    question: "How much does business insurance cost for a Springfield company?",
    answer:
      "Costs vary widely based on your industry, revenue, number of employees, claims history, and coverage limits. A solo consultant in Springfield might pay $500–$900/year for a BOP, while a construction contractor with employees could pay $8,000–$20,000+ annually depending on payroll and the types of projects they work. Healthcare businesses have unique malpractice and cyber costs. The best way to know is to get quotes — we compare 30+ carriers to find you the most competitive rate for your specific business.",
  },
  {
    question:
      "My Springfield restaurant serves alcohol — what coverage do I need?",
    answer:
      "Restaurants and bars in Springfield that serve alcohol are subject to the Illinois Dram Shop Act, which creates liability if an intoxicated patron causes injury or property damage after leaving your establishment. You need liquor liability insurance — either as a standalone policy or as an endorsement. Beyond that, most Springfield restaurants benefit from a BOP (general liability + commercial property), workers' comp for all employees, and equipment breakdown coverage for kitchen equipment. If you have a food truck or deliver catering, commercial auto is also required.",
  },
  {
    question:
      "Are healthcare businesses near Memorial Health or St. John's Hospital considered high-risk for insurance?",
    answer:
      "Healthcare businesses carry elevated insurance risk due to malpractice exposure, strict data privacy requirements under HIPAA, and the physical demands on employees. Medical offices, clinics, home health agencies, and allied health providers near Memorial Health System and HSHS St. John's typically need professional liability (malpractice), general liability, cyber liability for HIPAA-related data breach exposure, and workers' comp. Some carriers specialize in healthcare business insurance, and we work with several that understand the Springfield medical community's needs.",
  },
  {
    question: "What is a BOP and does my Springfield small business qualify?",
    answer:
      "A Business Owner's Policy (BOP) bundles general liability insurance and commercial property insurance into a single, discounted policy. It's designed for small to mid-size businesses and is typically more affordable than purchasing the coverages separately. Many BOPs include business interruption coverage. Most Springfield retail shops, offices, and service businesses qualify. However, higher-risk industries like construction, manufacturing, or businesses above certain revenue thresholds may need standalone policies. We'll let you know which structure makes the most sense for your situation.",
  },
  {
    question:
      "How quickly can I get a certificate of insurance for a Springfield contract or lease?",
    answer:
      "For straightforward business types — retail, consulting, small service businesses — we can often bind coverage and issue a certificate of insurance the same day you apply. If you have an urgent contract requirement from the State of Illinois or a commercial landlord in Springfield, let us know upfront and we'll prioritize your application. More complex businesses, higher-risk industries, or policies requiring underwriter review may take 1–3 business days. We also handle additional insured endorsements that most government and commercial contracts require.",
  },
];

function SpringfieldBusinessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Springfield Business Insurance FAQ
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Common questions from Springfield, IL business owners about
            commercial insurance — from government contracts to restaurant
            coverage.
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

function BusinessInsuranceSpringfieldPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              Business Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Business Insurance in{" "}
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 leading-relaxed">
              Springfield is more than the state capital — it's a city of
              government contractors, healthcare systems, downtown small
              businesses, and a growing construction sector. Every one of them
              needs commercial coverage built for their specific risks.
            </p>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Kover King is an independent insurance agency serving Springfield
              businesses. We compare 30+ commercial carriers to find you the
              right coverage at the right price — with local agents who
              understand Illinois regulations and Springfield's business
              community.
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

      {/* Springfield Business Insurance Facts */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Business Insurance Facts
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Springfield's unique position as Illinois' state capital shapes
              its business landscape — and its commercial insurance needs.
              Here's what Springfield businesses should know.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {springfieldFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                    {fact.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {fact.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Coverage for Springfield Businesses
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              From a solo government contractor to a multi-location restaurant
              group, we build policy packages around your specific industry,
              size, and risk exposure.
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
          <div className="mt-10 text-center">
            <QuoteDialog defaultInsuranceType="Business">
              <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                Get a Free Coverage Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </QuoteDialog>
          </div>
        </div>
      </section>

      {/* Springfield Industries We Insure */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Industries We Insure
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We work with businesses across every sector of the Springfield
              economy — from government contractors in the Wabash corridor to
              food service on South Grand.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map(({ icon: Icon, name, description }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                  {name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-text-secondary text-sm mt-8">
            Don't see your industry listed?{" "}
            <Link
              to="/contact"
              className="text-primary-500 hover:underline font-medium"
            >
              Contact us
            </Link>{" "}
            — we cover virtually every business type in Springfield.
          </p>
        </div>
      </section>

      {/* Why Choose Kover King */}
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
                  <div className="text-3xl font-extrabold text-white">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-sm text-white/90">
                    Dedicated local agent for ongoing support and annual reviews
                  </div>
                </div>
              </div>
              <QuoteDialog defaultInsuranceType="Business">
                <button className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-primary-500 hover:bg-cream font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                  Get a Springfield Business Quote
                  <ArrowRight className="w-4 h-4" />
                </button>
              </QuoteDialog>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                Why Springfield Businesses Choose Kover King
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                Running a business in Springfield is complicated enough. Let us
                handle the insurance — we'll compare carriers, explain your
                options, and make sure you're properly protected.
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
              in the state. Here's what Springfield businesses are required to
              carry — and what's strongly recommended to protect your operation.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Required */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  Legally Required in Illinois
                </h3>
              </div>
              <div className="space-y-4">
                {ilRequirements
                  .filter((r) => r.required)
                  .map((item) => (
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
                {ilRequirements
                  .filter((r) => !r.required)
                  .map((item) => (
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
                    <span className="font-bold">
                      Not sure what applies to your Springfield business?
                    </span>{" "}
                    Our agents will walk through your specific situation,
                    confirm you meet Illinois requirements, and identify any
                    coverage gaps that could expose you to serious liability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Springfield Business Insurance FAQ */}
      <SpringfieldBusinessFAQ />

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Protect Your Springfield Business Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            One conversation. 30+ carriers compared. Coverage built for your
            Springfield business.
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
          <p className="text-white/60 text-sm mt-6">
            Serving Springfield, Chatham, Rochester, Sherman, Auburn, and all
            of Sangamon County.
          </p>
        </div>
      </section>
    </div>
  );
}
