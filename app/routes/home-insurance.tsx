import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Package,
  ShieldCheck,
  BedDouble,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  Umbrella,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/home-insurance")({
  head: () => ({
    meta: [
      {
        title:
          "Home Insurance Springfield IL | Homeowners Insurance Quotes | Kover King",
      },
      {
        name: "description",
        content:
          "Protect your Springfield home with dwelling, liability, and personal property coverage from 30+ carriers.",
      },
      {
        property: "og:title",
        content:
          "Home Insurance Springfield IL | Homeowners Insurance Quotes | Kover King",
      },
      {
        property: "og:description",
        content:
          "Protect your Springfield home with dwelling, liability, and personal property coverage from 30+ carriers.",
      },
    ],
  }),
  component: HomeInsurancePage,
});

const coverageTypes = [
  {
    icon: Home,
    title: "Dwelling Coverage",
    description:
      "Protects the physical structure of your home — walls, roof, built-in appliances — against covered perils like fire, wind, hail, and lightning.",
    highlight: "Structure Protection",
  },
  {
    icon: Package,
    title: "Personal Property",
    description:
      "Covers your belongings: furniture, electronics, clothing, and more. Replacement cost coverage ensures you're paid what it costs to replace items today, not their depreciated value.",
    highlight: "Your Belongings",
  },
  {
    icon: ShieldCheck,
    title: "Liability Coverage",
    description:
      "Protects you if someone is injured on your property or if you accidentally cause damage to someone else's property. Covers legal fees and settlements.",
    highlight: "Legal Protection",
  },
  {
    icon: BedDouble,
    title: "Additional Living Expenses",
    description:
      "If your home becomes uninhabitable after a covered loss, ALE pays for hotel stays, restaurant meals, and other costs while your home is being repaired.",
    highlight: "Temporary Housing",
  },
];

const whyChoosePoints = [
  "Compare homeowners rates from 30+ top-rated carriers",
  "Bundling with auto insurance can save up to 25% on both policies",
  "Coverage for all Springfield-area home types: single family, condo, rental",
  "Replacement cost vs. actual cash value — we explain the difference clearly",
  "Optional endorsements: flood, earthquake, jewelry, home business",
  "Local agents who understand Central Illinois weather and property values",
];

const neighborhoods = [
  "Leland Grove",
  "Chatham",
  "Rochester",
  "Sherman",
  "Jerome",
  "Riverton",
  "Williamsville",
  "Auburn",
  "Pawnee",
  "Sangamon County",
  "Menard County",
  "Morgan County",
];

const coverageHighlights = [
  {
    icon: BadgeCheck,
    stat: "30+",
    label: "Carriers Compared",
  },
  {
    icon: Star,
    stat: "A+",
    label: "Rated Carriers",
  },
  {
    icon: Umbrella,
    stat: "25%",
    label: "Bundle Savings",
  },
];

const policyTypes = [
  {
    code: "HO-3",
    name: "Special Form",
    audience: "Single-family homeowners",
    dwelling: "Open peril",
    property: "Named peril",
    badge: "Most Common",
    badgeColor: "bg-primary-500 text-white",
  },
  {
    code: "HO-5",
    name: "Comprehensive",
    audience: "Single-family homeowners",
    dwelling: "Open peril",
    property: "Open peril",
    badge: "Broadest Coverage",
    badgeColor: "bg-green-600 text-white",
  },
  {
    code: "HO-6",
    name: "Condo",
    audience: "Condo unit owners",
    dwelling: "Walls-in only",
    property: "Named peril",
    badge: "Condo Owners",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    code: "HO-4",
    name: "Renters",
    audience: "Tenants / renters",
    dwelling: "No dwelling coverage",
    property: "Named peril",
    badge: "Renters",
    badgeColor: "bg-gray-500 text-white",
  },
];

const rateFactors = [
  {
    title: "Home Age & Construction",
    description:
      "Older homes can cost more to insure due to outdated materials and systems. Frame vs. brick construction also impacts rates.",
  },
  {
    title: "Roof Age & Material",
    description:
      "A major rating factor in Central Illinois. New architectural shingles earn the best rates; roofs over 15–20 years old can trigger surcharges or exclusions.",
  },
  {
    title: "Distance to Fire Station",
    description:
      "Homes closer to a staffed fire station and fire hydrant receive lower rates. Rural properties can pay significantly more.",
  },
  {
    title: "Prior Claims History",
    description:
      "Claims on your current property — even by the previous owner — can raise rates. Multiple claims in 3 years often increase premiums sharply.",
  },
  {
    title: "Credit-Based Insurance Score",
    description:
      "Most carriers in Illinois use a credit-based score (not your credit score) to help predict future claims. Higher scores generally mean lower premiums.",
  },
  {
    title: "Deductible Amount",
    description:
      "Choosing a higher deductible ($1,000–$2,500) lowers your premium. Some policies have a separate wind/hail deductible — common in tornado-prone Springfield.",
  },
  {
    title: "Springfield-Specific Risks",
    description:
      "Tornado and severe storm exposure in Central Illinois is a pricing factor. Older Springfield neighborhoods with knob-and-tube wiring may face surcharges or require upgrades.",
  },
  {
    title: "Available Discounts",
    description:
      "New roof, security system, smoke detectors, claims-free history, and bundling home + auto can each reduce your premium. Ask us what you qualify for.",
  },
];

const faqItems = [
  {
    question: "What does homeowners insurance NOT cover?",
    answer:
      "Standard home insurance policies typically exclude floods, earthquakes, sewer/drain backup, normal wear and tear, and intentional damage. In Springfield, flood coverage through the National Flood Insurance Program (NFIP) and sewer backup endorsements are two of the most commonly overlooked gaps. We'll make sure you know exactly what your policy does and doesn't cover.",
  },
  {
    question: "Do I need flood insurance in Springfield, IL?",
    answer:
      "Possibly. While much of Springfield is not in a high-risk flood zone, the Sangamon River and its tributaries have caused flooding in several neighborhoods — including areas that weren't mapped as flood zones. We recommend reviewing your property's flood zone status. Flood insurance is purchased separately through the NFIP or private carriers and is not included in any standard home policy.",
  },
  {
    question: "How much dwelling coverage do I need?",
    answer:
      "Your dwelling coverage should be based on the cost to rebuild your home from the ground up — not its market value or purchase price. Rebuild costs include labor, materials, debris removal, and code upgrades. We use replacement cost estimators to help you arrive at the right number so you're not underinsured after a total loss.",
  },
  {
    question:
      "What is the difference between replacement cost and actual cash value?",
    answer:
      "Replacement cost (RCV) pays what it actually costs to replace your damaged property with new items of similar kind and quality — no depreciation deducted. Actual cash value (ACV) pays the depreciated value, meaning older items are worth less at claim time. RCV coverage costs more upfront but can mean tens of thousands more in your pocket after a major claim.",
  },
  {
    question: "Will my rate go up if I file a claim?",
    answer:
      "It depends on the claim type, amount, and your carrier. Many insurers will increase your premium at renewal after a paid claim, and some may non-renew your policy after multiple claims. Filing small claims (under $2,000–$3,000) often costs you more in premium increases than the claim pays out. We can help you decide when it makes sense to file vs. pay out of pocket.",
  },
  {
    question: "What is an umbrella policy and do I need one?",
    answer:
      "A personal umbrella policy provides an extra layer of liability coverage — typically $1 million or more — that sits on top of your home and auto insurance. It kicks in once your underlying liability limits are exhausted. If you own a home, have significant assets, or have a trampoline, pool, or dog, an umbrella is worth serious consideration. They're surprisingly affordable, often $150–$300/year for $1 million in coverage.",
  },
  {
    question: "How do I lower my home insurance premium?",
    answer:
      "The most effective ways: bundle with your auto policy (save up to 25%), replace an aging roof, install a monitored security system or smart smoke detectors, raise your deductible, and maintain a claims-free history. In Springfield, some carriers also offer discounts for homes with updated electrical, plumbing, or HVAC systems. We'll identify every discount you qualify for when we shop your policy.",
  },
  {
    question: "Does home insurance cover my home-based business?",
    answer:
      "Generally, no. A standard homeowners policy provides very limited (or zero) coverage for business equipment, business liability, and business income losses that occur at your home. If you run a business from your home — even part-time — you likely need a home business endorsement or a separate business owners policy (BOP). This is a commonly overlooked gap we check for every client.",
  },
];

function HomeInsurancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Home className="w-4 h-4" />
              Home Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Home Insurance in{" "}
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Your home is your most valuable asset. We'll help you protect it
              with the right homeowners insurance from 30+ top-rated carriers —
              at a price that fits your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Home">
                <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                  Get My Free Quote
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

      {/* Stats Bar */}
      <section className="bg-primary-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/30">
            {coverageHighlights.map(({ icon: Icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center py-2">
                <Icon className="w-6 h-6 text-white mb-1" />
                <div className="text-2xl font-extrabold text-white">{stat}</div>
                <div className="text-xs text-white/80 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Your Home Insurance Covers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A standard homeowners policy combines several coverages into one
              comprehensive package. Here's what protects you and your family.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageTypes.map((coverage) => {
              const Icon = coverage.icon;
              return (
                <div
                  key={coverage.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-3">
                    {coverage.highlight}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    {coverage.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {coverage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Neighborhoods Served */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Neighborhoods We Serve
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From historic Springfield neighborhoods to the surrounding
              communities of Sangamon County, we've got you covered.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {neighborhoods.map((area) => (
              <div
                key={area}
                className="flex items-center gap-1.5 bg-white text-primary-500 font-medium px-4 py-2 rounded-full text-sm shadow-sm border border-primary-100"
              >
                <MapPin className="w-3.5 h-3.5 text-primary-500" />
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                Why Homeowners Trust Kover King
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                Shopping for homeowners insurance on your own means calling
                company after company. We do that work for you — comparing
                30+ carriers in a single conversation.
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
            <div className="bg-surface rounded-2xl p-8 border border-gray-100">
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-1">
                  Bundle &amp; Save
                </h3>
                <p className="text-text-secondary text-sm">
                  Combine your home and auto insurance with the same carrier and
                  save up to 25% on both policies. Ask about our multi-policy
                  discount options.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Get Your Home Insurance Quote
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  A quick 10-minute call is all it takes. We'll compare rates
                  and find you the best value for your home.
                </p>
                <QuoteDialog defaultInsuranceType="Home">
                  <button className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] cursor-pointer">
                    Request a Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Understanding Your Home Insurance Policy */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Understanding Your Home Insurance Policy
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Not all homeowners policies are the same. The policy form
              determines how broadly your home and belongings are covered.
              Here's what the major forms mean in plain English.
            </p>
          </div>

          {/* Open peril vs named peril explainer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-3">
                Open Peril
              </span>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                What is "Open Peril" coverage?
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Open peril (also called "all-risk") means your property is
                covered for any cause of loss that isn't specifically excluded
                in the policy. This is the broadest protection — if a peril
                isn't listed as an exclusion, you're covered. Easier to use at
                claim time.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-3">
                Named Peril
              </span>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                What is "Named Peril" coverage?
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Named peril coverage only protects you against causes of loss
                specifically listed in the policy — such as fire, theft,
                windstorm, and vandalism. If the cause of your damage isn't on
                the list, the claim is denied. More restrictive, but often
                lower premium.
              </p>
            </div>
          </div>

          {/* Policy type comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {policyTypes.map((policy) => (
              <div
                key={policy.code}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading text-2xl font-extrabold text-text-primary">
                      {policy.code}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${policy.badgeColor}`}
                    >
                      {policy.badge}
                    </span>
                  </div>
                  <p className="font-semibold text-text-primary text-sm mb-1">
                    {policy.name}
                  </p>
                  <p className="text-text-secondary text-xs mb-4">
                    {policy.audience}
                  </p>
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">Dwelling</span>
                      <span className="font-medium text-text-primary">
                        {policy.dwelling}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">
                        Personal Property
                      </span>
                      <span className="font-medium text-text-primary">
                        {policy.property}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Common exclusions callout */}
          <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
              Common Exclusions — Even on Open-Peril Policies
            </h3>
            <p className="text-text-secondary text-sm mb-5">
              Every standard homeowners policy — regardless of form — excludes
              certain perils. These require separate policies or endorsements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Floods",
                  detail:
                    "Requires a separate NFIP or private flood policy. No standard home policy covers rising water.",
                },
                {
                  name: "Earthquakes",
                  detail:
                    "Separate earthquake policy or endorsement needed. Rare in Illinois but not unheard of.",
                },
                {
                  name: "Sewer / Drain Backup",
                  detail:
                    "Water backing up through drains or sewers is excluded. An affordable endorsement adds this coverage back.",
                },
              ].map((excl) => (
                <div
                  key={excl.name}
                  className="flex items-start gap-3 bg-cream rounded-xl p-4"
                >
                  <ShieldCheck className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {excl.name}
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      {excl.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Affects Your Home Insurance Rate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Affects Your Home Insurance Rate in Springfield
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Carriers use dozens of factors to calculate your premium. Here are
              the ones that matter most — and where you have room to save.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rateFactors.map((factor) => (
              <div
                key={factor.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                  {factor.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Insurance FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Home Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Answers to the questions Springfield homeowners ask us most.
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-heading font-bold text-text-primary text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary-500 shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-text-secondary mb-4">
              Have a question we didn't answer?
            </p>
            <QuoteDialog defaultInsuranceType="Home">
              <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                Talk to a Local Agent
                <ArrowRight className="w-5 h-5" />
              </button>
            </QuoteDialog>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Protect Your Springfield Home Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Don't leave your biggest investment unprotected. Get a free
            homeowners insurance quote in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Home">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get a Free Home Quote
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
