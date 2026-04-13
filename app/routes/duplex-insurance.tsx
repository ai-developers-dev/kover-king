import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Building2,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  Umbrella,
  BadgeCheck,
  ChevronDown,
  Users,
  Wrench,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/duplex-insurance")({
  head: () => ({
    meta: [
      {
        title:
          "Duplex Insurance Springfield IL | Multi-Family Coverage | Kover King",
      },
      {
        name: "description",
        content:
          "Duplex and multi-family insurance in Springfield IL. Owner-occupied or investment — compare rates from 30+ carriers. Free quotes — call (217) 960-8997.",
      },
      {
        property: "og:title",
        content:
          "Duplex Insurance Springfield IL | Multi-Family Coverage | Kover King",
      },
      {
        property: "og:description",
        content:
          "Duplex and multi-family insurance in Springfield IL. Owner-occupied or investment — compare rates from 30+ carriers. Free quotes — call (217) 960-8997.",
      },
    ],
  }),
  component: DuplexInsurancePage,
});

const coverageTypes = [
  {
    icon: Building2,
    title: "Dwelling Coverage",
    description:
      "Protects both units of your duplex structure — walls, roof, foundation, built-in systems — against covered perils like fire, wind, hail, and lightning.",
    highlight: "Both Units Covered",
  },
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Covers injuries to tenants, guests, or visitors on the property. Pays for medical expenses, legal fees, and settlements if you're found responsible.",
    highlight: "Legal Protection",
  },
  {
    icon: DollarSign,
    title: "Loss of Rental Income",
    description:
      "Covers lost rent from the rented unit if it becomes uninhabitable after a covered loss. Keeps your income stream protected while repairs are underway.",
    highlight: "Income Protection",
  },
  {
    icon: Home,
    title: "Other Structures",
    description:
      "Covers detached garages, sheds, fences, and other structures on the duplex property that aren't attached to the main building.",
    highlight: "Full Property",
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
    stat: "Owner-Occupied & Investment",
    label: "Both Types Covered",
  },
  {
    icon: Umbrella,
    stat: "30 Years",
    label: "Experience",
  },
];

const rateFactors = [
  {
    title: "Owner-Occupied vs. Full Investment",
    description:
      "Living in one unit can qualify you for more favorable rates and policy types. Full investment duplexes require landlord or commercial policies with different pricing.",
  },
  {
    title: "Age and Construction of the Building",
    description:
      "Older duplexes with outdated wiring, plumbing, or roofing cost more to insure. Brick construction typically earns lower rates than wood-frame buildings.",
  },
  {
    title: "Number of Claims on Property",
    description:
      "Prior claims on the property — even from previous owners — can increase your premium. Multiple claims in a short window can trigger surcharges or non-renewal.",
  },
  {
    title: "Rental Income Amount",
    description:
      "Higher rental income means more loss of rents exposure. Carriers factor in the rental income when calculating loss of rents and liability limits.",
  },
  {
    title: "Location and Neighborhood Risk",
    description:
      "Crime rates, proximity to fire stations, and local weather exposure all factor into your rate. Springfield neighborhoods vary significantly in these risk factors.",
  },
  {
    title: "Condition of Roof, Plumbing, Electrical",
    description:
      "Updated systems earn the best rates. Roofs over 15–20 years old, knob-and-tube wiring, or galvanized pipes can trigger surcharges or coverage restrictions.",
  },
  {
    title: "Whether Tenants Have Renters Insurance",
    description:
      "Requiring tenants to carry renters insurance can reduce your liability exposure. Some carriers view this favorably when calculating your premium.",
  },
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

const faqItems = [
  {
    question: "Can I use my homeowners policy for a duplex?",
    answer:
      "Not always. A standard homeowners policy (HO-3) is designed for a single-family, owner-occupied residence. If you rent out any portion of your duplex — even just one unit — you've introduced a landlord exposure that most homeowners policies don't cover or will exclude. You may need a hybrid owner-occupied policy with a landlord endorsement, or a separate landlord/dwelling fire policy. We'll make sure you have the right policy for your specific situation.",
  },
  {
    question: "How is duplex insurance different from landlord insurance?",
    answer:
      "Landlord insurance (also called a dwelling fire policy or DP-3) is designed for non-owner-occupied rental properties. Duplex insurance can refer to either a landlord policy or a hybrid homeowners policy depending on whether you live in one of the units. The key differences are coverage for your personal property, liability structure, and loss of rents provisions. Owner-occupied duplexes typically get broader personal property coverage than pure investment properties.",
  },
  {
    question: "What if I live in one unit and rent the other?",
    answer:
      "This is the most common duplex scenario — and the most important to get right. You may qualify for a homeowners policy with a landlord endorsement, or you may need a separate dwelling fire policy for the rental unit alongside a standard homeowners policy for your unit. Some carriers offer a single hybrid policy covering both units under one premium. We'll compare your options and find the most cost-effective coverage that doesn't leave gaps.",
  },
  {
    question: "Does duplex insurance cover both units?",
    answer:
      "Yes — the dwelling coverage in a duplex policy protects the entire structure, which includes both units. However, the policy type and what's covered inside each unit varies. Your personal property (if you live in one unit) is covered under your homeowners-style coverage. Your tenant's personal belongings are NOT covered — they need their own renters insurance policy. Liability coverage protects you as the property owner, not the tenant.",
  },
  {
    question: "How much does duplex insurance cost in Springfield?",
    answer:
      "Duplex insurance in Springfield, IL typically ranges from $1,200 to $2,800 per year depending on the property's value, age, condition, whether it's owner-occupied or fully rented, and the coverage limits you choose. Owner-occupied duplexes generally cost less than fully rented investment properties. The best way to know your exact cost is to get a free comparison quote — we'll shop 30+ carriers and find your best rate.",
  },
  {
    question: "What happens if my tenant causes damage?",
    answer:
      "If your tenant intentionally causes damage, most landlord and duplex policies cover tenant-caused damage under your dwelling coverage (subject to your deductible). However, you would need to pursue the tenant for reimbursement. Accidental tenant damage — like a bathtub overflow or kitchen fire — is typically covered. This is also why requiring renters insurance for your tenants is smart: their liability coverage can pay you back for damage they cause.",
  },
  {
    question: "Do I need separate policies for each unit?",
    answer:
      "No — in most cases, a single duplex or dwelling fire policy covers the entire structure and both units under one policy. You don't need two separate policies. However, if you live in one unit, you may want a combined policy that includes homeowners-style coverage for your personal belongings and ALE (additional living expenses) in addition to the landlord coverage for the rental unit.",
  },
  {
    question: "Can I bundle duplex insurance with my auto policy?",
    answer:
      "Yes, in many cases you can bundle your duplex insurance with your auto policy through the same carrier and qualify for a multi-policy discount. However, not all carriers offer bundle discounts on landlord/investment properties the way they do on owner-occupied homeowners policies. We'll check bundling options when we shop your duplex insurance to make sure you get the best overall rate across all your policies.",
  },
];

function DuplexInsurancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4" />
              Duplex Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Duplex Insurance in{" "}
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Owner-occupied or fully rented — insuring a duplex is more complex
              than a standard home policy. We'll compare rates from 30+ carriers
              and make sure you have the right coverage for your specific
              situation.
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
              What Your Duplex Insurance Covers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A duplex policy is built to protect the full structure, your
              rental income, and your liability as a property owner — whether
              you live there or not.
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

      {/* Owner-Occupied vs Investment Duplex */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Owner-Occupied vs. Investment Duplex
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              How you use your duplex determines what kind of policy you need.
              Getting this wrong can leave you with a denied claim.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Owner-Occupied */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-1">
                    You Live There
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Owner-Occupied Duplex
                  </h3>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                You live in one unit and rent the other. This is the most common
                duplex scenario — and the most misunderstood from an insurance
                standpoint.
              </p>
              <ul className="space-y-3">
                {[
                  "May qualify for a homeowners policy with a landlord endorsement",
                  "Hybrid policies cover your personal property AND the rental unit",
                  "Additional living expenses covered if you're displaced",
                  "Liability covers both your unit and the rental unit",
                  "Often more affordable than a full investment property policy",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Investment */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-1">
                    Both Units Rented
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Full Investment Duplex
                  </h3>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                Both units are rented — you don't live on the property. This is
                a purely investment property and requires a landlord or
                commercial-style policy.
              </p>
              <ul className="space-y-3">
                {[
                  "Requires a dwelling fire (DP-3) or landlord policy",
                  "No personal property coverage for the owner",
                  "Loss of rents covers income from both units",
                  "Liability limits should reflect both tenants' exposure",
                  "Vacancy clauses apply if either unit sits empty 60+ days",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Warning callout */}
          <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                  Why a Standard Homeowners Policy Is NOT Enough for a Duplex
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  A standard HO-3 homeowners policy is designed for an
                  owner-occupied, single-family home. The moment you rent out any
                  portion of your duplex, you've changed the risk profile in ways
                  that can void your coverage or result in a denied claim.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Landlord Liability Gap",
                      detail:
                        "Standard homeowners policies often exclude landlord-tenant liability. A tenant injury on your property could be uncovered.",
                    },
                    {
                      title: "No Loss of Rents",
                      detail:
                        "If your rental unit is damaged and uninhabitable, a standard homeowners policy won't reimburse you for the lost rental income.",
                    },
                    {
                      title: "Material Misrepresentation",
                      detail:
                        "If you have an HO-3 and your insurer discovers you're renting a unit, they can deny your claim or cancel your policy entirely.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 bg-cream rounded-xl p-4"
                    >
                      <Wrench className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-primary text-sm">
                          {item.title}
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Affects Your Duplex Insurance Rate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Affects Your Duplex Insurance Rate
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Carriers weigh several factors when pricing duplex coverage. Here's
              what matters most — and where you have room to lower your premium.
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

      {/* Duplex Insurance FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Duplex Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Answers to the questions Springfield duplex owners ask us most.
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

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Serving Springfield and Surrounding Areas
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

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Get the Right Duplex Coverage Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Don't risk a denied claim with the wrong policy. Get a free duplex
            insurance quote and we'll make sure you're properly covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Home">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get a Free Duplex Quote
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
