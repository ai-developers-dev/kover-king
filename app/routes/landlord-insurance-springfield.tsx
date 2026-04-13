import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  ShieldCheck,
  DollarSign,
  Wrench,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  Umbrella,
  BadgeCheck,
  ChevronDown,
  Building2,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/landlord-insurance-springfield")({
  head: () => ({
    meta: [
      {
        title:
          "Landlord Insurance Springfield IL | Rental Property Coverage | Kover King",
      },
      {
        name: "description",
        content:
          "Protect your Springfield IL rental properties with landlord insurance from 30+ carriers. Dwelling, liability, loss of rent coverage. Free quotes — call (217) 960-8997.",
      },
      {
        property: "og:title",
        content:
          "Landlord Insurance Springfield IL | Rental Property Coverage | Kover King",
      },
      {
        property: "og:description",
        content:
          "Protect your Springfield IL rental properties with landlord insurance from 30+ carriers. Dwelling, liability, loss of rent coverage. Free quotes — call (217) 960-8997.",
      },
      {
        name: "keywords",
        content:
          "landlord insurance Springfield IL, rental property insurance Springfield, dwelling fire insurance Springfield Illinois, investment property insurance Springfield, rental income protection Illinois",
      },
    ],
  }),
  component: LandlordInsuranceSpringfieldPage,
});

const coverageTypes = [
  {
    icon: Home,
    title: "Dwelling Coverage",
    description:
      "Protects the structure of your Springfield rental — walls, roof, foundation, and built-in fixtures — against fire, wind, hail, vandalism, and other covered perils.",
    highlight: "Structure Protection",
  },
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Covers legal fees and settlements if a tenant or visitor is injured on your property. Illinois tenant law creates real exposure — adequate liability limits are essential.",
    highlight: "Legal Protection",
  },
  {
    icon: DollarSign,
    title: "Loss of Rental Income",
    description:
      "Reimburses lost rent when your Springfield rental becomes uninhabitable after a covered loss. Keeps your cash flow intact while repairs are underway.",
    highlight: "Income Protection",
  },
  {
    icon: Wrench,
    title: "Personal Property (Landlord)",
    description:
      "Covers appliances, tools, lawn equipment, and other landlord-owned items you provide to tenants. Does not cover tenants' personal belongings — they need renters insurance.",
    highlight: "Landlord Equipment",
  },
];

const coverageHighlights = [
  {
    icon: BadgeCheck,
    stat: "30+",
    label: "Carriers Compared",
  },
  {
    icon: Star,
    stat: "25%",
    label: "Bundle Savings",
  },
  {
    icon: Umbrella,
    stat: "30 Yrs",
    label: "Experience",
  },
];

const springfieldRisks = [
  {
    icon: AlertTriangle,
    title: "Tenant Damage & Liability",
    description:
      "Springfield landlords face real exposure from tenant-caused damage and injury claims. Illinois law heavily favors tenants, making adequate liability limits and proper documentation critical for every rental unit.",
  },
  {
    icon: Home,
    title: "Severe Weather — Tornado, Hail & Ice",
    description:
      "Central Illinois sits in tornado alley. Springfield sees frequent hailstorms, damaging ice storms, and occasional tornadoes that can cause significant structural damage to rental properties. Wind and hail coverage is non-negotiable here.",
  },
  {
    icon: Wrench,
    title: "Older Rental Properties",
    description:
      "Many Springfield rentals — especially near downtown and the medical district — are older homes with aging electrical panels, galvanized plumbing, and original roofs. Outdated systems increase claim frequency and can limit carrier options.",
  },
  {
    icon: Building2,
    title: "Vacancy Risk",
    description:
      "Between tenants, your property faces higher risk. Standard landlord policies may restrict or exclude coverage after 30–60 days of vacancy. If you anticipate extended vacancy, a vacancy endorsement or separate vacant property policy is essential.",
  },
  {
    icon: ShieldCheck,
    title: "Illinois Tenant Law Liability",
    description:
      "Illinois has strong tenant protection laws. Failure to maintain habitable conditions, security deposit disputes, and discrimination claims can all result in costly legal action. Robust liability coverage — plus an umbrella policy — is smart protection.",
  },
  {
    icon: DollarSign,
    title: "Flood & Water Damage",
    description:
      "Properties near the Sangamon River and its tributaries face flood risk not covered by standard landlord policies. Springfield has experienced significant flooding events. Separate flood coverage through the NFIP or private carriers may be warranted.",
  },
];

const savingsTips = [
  {
    title: "Bundle Policies",
    description:
      "Insuring your rental property with the same carrier as your primary home or auto policy typically saves 10–25%. Kover King shops bundles across 30+ carriers to find the best combined rate.",
  },
  {
    title: "Require Renters Insurance",
    description:
      "Making renters insurance a lease condition reduces your exposure and can lower your premium with some carriers. It costs tenants just $10–$20/month and shifts responsibility for their belongings to their own policy.",
  },
  {
    title: "Upgrade Key Systems",
    description:
      "Updating a dated roof, electrical panel, or plumbing system can meaningfully reduce your premium. Document all upgrades and provide them to us at quoting — carriers reward lower-risk properties.",
  },
  {
    title: "Raise Your Deductible",
    description:
      "Landlords with cash reserves often benefit from a higher deductible. Opting for a $2,500 or $5,000 deductible instead of $1,000 can reduce annual premium significantly — and rental properties tend to have fewer small claims.",
  },
  {
    title: "Screen Tenants Carefully",
    description:
      "Some carriers factor tenant screening practices into underwriting. Background checks, credit screening, and prior landlord references reduce your risk profile and may improve your rate.",
  },
  {
    title: "Multi-Property Discounts",
    description:
      "Own more than one rental in Springfield or Central Illinois? A portfolio policy covering all your properties under one carrier often beats insuring each property separately — and simplifies your renewals.",
  },
];

const faqItems = [
  {
    question:
      "Do I need a separate policy for my Springfield rental, or does my homeowners insurance cover it?",
    answer:
      "You need a separate landlord insurance policy (also called a dwelling fire policy). Standard homeowners insurance is designed for owner-occupied homes. The moment you rent your property to a tenant, your homeowners coverage is typically void for losses related to the rental use. Using a homeowners policy on a rental property is one of the most common mistakes Springfield landlords make — and it leads to denied claims.",
  },
  {
    question:
      "How does Illinois tenant law affect my landlord insurance needs?",
    answer:
      "Illinois has strong tenant protections under the Residential Landlord and Tenant Act, enforced even more strictly in jurisdictions like Springfield. Landlords can face liability for failure to maintain habitable conditions, improper security deposit handling, and wrongful eviction claims. A landlord policy provides general liability coverage, but for full protection against legal action, consider higher limits — at least $500,000 — or add a personal umbrella policy on top.",
  },
  {
    question:
      "My Springfield rental is near the Sangamon River. Do I need flood insurance?",
    answer:
      "Standard landlord policies exclude flood damage entirely. If your rental property is in or near a FEMA-designated flood zone — particularly properties near the Sangamon River — flood coverage is strongly recommended. You can purchase it through the National Flood Insurance Program (NFIP) or private flood carriers, which often offer higher limits and faster claims. We can check your property's flood zone status and quote flood coverage alongside your landlord policy.",
  },
  {
    question:
      "What coverage do I need for a rental near UIS or the medical district?",
    answer:
      "Properties rented to university students or healthcare workers near HSHS St. John's or Memorial Medical Center tend to have higher turnover and occupancy density. Student rentals in particular carry higher wear-and-tear risk. A landlord policy with solid dwelling coverage, liability limits of at least $300,000–$500,000, and a tenant vandalism endorsement is a strong starting point. We'll tailor coverage based on your specific property and tenant profile.",
  },
  {
    question: "Does landlord insurance cover tornado or hail damage in Springfield?",
    answer:
      "Yes — wind, hail, and tornado damage are standard covered perils on most landlord (dwelling fire) policies. Springfield sits in a region with significant tornado and severe hail exposure, so making sure your dwelling coverage accurately reflects current rebuild costs is critical. After a major hailstorm or tornado, many landlords discover they are underinsured because their coverage hasn't kept up with rising construction costs. We review replacement cost estimates at every renewal.",
  },
  {
    question: "Can I insure multiple Springfield rental properties on one policy?",
    answer:
      "Yes. If you own a portfolio of rentals — whether single-family homes, duplexes, or small multi-unit buildings across Springfield — a blanket or portfolio landlord policy can cover them all under one policy and one renewal date. This simplifies management and often comes with a multi-property discount. We work with carriers that specialize in multi-property landlord coverage throughout Sangamon County and Central Illinois.",
  },
];

const springfieldAreas = [
  "Downtown Springfield",
  "Medical District",
  "UIS Campus Area",
  "Old Town Springfield",
  "Leland Grove",
  "Grandview",
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
];

function LandlordInsuranceSpringfieldPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4" />
              Landlord Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Landlord Insurance in{" "}
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Springfield's rental market is strong — state government, two major
              hospitals, and UIS keep demand high. Protect your investment with
              landlord insurance from 30+ top-rated carriers. Dwelling coverage,
              liability protection, and loss of rental income in one policy.
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

      {/* Springfield Rental Market Overview */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-4 h-4" />
                Springfield Rental Market
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-6">
                A Strong Market Worth Protecting
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Springfield's rental market benefits from a uniquely stable
                demand base: state government employment, HSHS St. John's
                Hospital, Memorial Medical Center, and the University of
                Illinois Springfield generate consistent year-round demand for
                rental housing — insulating landlords from the vacancy spikes
                common in other mid-size Illinois cities.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                The rental stock is diverse — from single-family homes in
                established neighborhoods to duplexes and small multi-units near
                the medical district and UIS campus. Average monthly rents in
                Springfield range from roughly $750 for a one-bedroom to $1,200+
                for a larger single-family rental, giving landlords meaningful
                income worth protecting with loss-of-rent coverage.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Popular rental neighborhoods include areas near downtown
                Springfield, the medical district along Sixth Street, the UIS
                campus on the city's east side, and established residential
                pockets like Grandview and Old Town. Each area carries its own
                risk profile — and we tailor coverage accordingly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  stat: "$750–$1,200+",
                  label: "Avg. Monthly Rent",
                  sub: "per unit in Springfield",
                },
                {
                  stat: "~40%",
                  label: "Renter Households",
                  sub: "in Springfield, IL",
                },
                {
                  stat: "State Gov't",
                  label: "Anchor Employer",
                  sub: "stable rental demand",
                },
                {
                  stat: "2 Major",
                  label: "Hospitals Nearby",
                  sub: "St. John's & Memorial",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
                >
                  <div className="text-2xl font-extrabold text-primary-500 mb-1">
                    {item.stat}
                  </div>
                  <div className="font-heading font-bold text-text-primary text-sm mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-text-secondary">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Landlord Insurance Covers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A landlord policy is built specifically for rental properties —
              combining the protections Springfield property owners need most.
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

      {/* Springfield Landlord Risks */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Risks Springfield Landlords Face
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Owning rental property in Central Illinois comes with specific
              exposures. Understanding your risks helps you build the right
              coverage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {springfieldRisks.map((risk) => {
              const Icon = risk.icon;
              return (
                <div
                  key={risk.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    {risk.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {risk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Save on Landlord Insurance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              How to Save on Landlord Insurance in Springfield
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              As an independent agency, we shop your coverage across 30+ carriers.
              Here are the strategies that consistently reduce premium for
              Springfield landlords.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsTips.map((tip) => (
              <div
                key={tip.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                  {tip.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Springfield Areas Served */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Springfield Areas We Serve
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From rentals near the Capitol to properties throughout Sangamon
              County, we cover landlords across the greater Springfield area.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {springfieldAreas.map((area) => (
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Landlord Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Answers to the questions Springfield rental property owners ask us
              most.
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
            Protect Your Springfield Rental Property Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Don't leave your investment unprotected. Get a free landlord
            insurance quote from 30+ carriers in minutes — from a local
            Springfield agent who knows the Central Illinois market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Home">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get a Free Landlord Quote
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
