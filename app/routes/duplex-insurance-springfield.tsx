import { createFileRoute } from "@tanstack/react-router";
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
  CloudRain,
  AlertTriangle,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/duplex-insurance-springfield")({
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
      {
        name: "keywords",
        content:
          "duplex insurance Springfield IL, multi-family insurance Springfield, landlord insurance Springfield Illinois, owner-occupied duplex insurance, investment property insurance Springfield",
      },
    ],
  }),
  component: DuplexInsuranceSpringfieldPage,
});

const coverageTypes = [
  {
    icon: Building2,
    title: "Dwelling Coverage",
    description:
      "Protects the full duplex structure — both units, shared walls, roof, foundation, and built-in systems — against fire, wind, hail, and other covered perils common in Springfield.",
    highlight: "Both Units Covered",
  },
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Covers injuries to tenants, guests, or visitors on your property. Pays medical expenses, legal fees, and settlements if you're found responsible as the Springfield property owner.",
    highlight: "Legal Protection",
  },
  {
    icon: DollarSign,
    title: "Loss of Rental Income",
    description:
      "Covers lost rent from either unit if it becomes uninhabitable after a covered loss. Keeps your Springfield rental income stream protected while repairs are completed.",
    highlight: "Income Protection",
  },
  {
    icon: Home,
    title: "Other Structures",
    description:
      "Covers detached garages, sheds, fences, and outbuildings common on Springfield duplex lots — structures not attached to the main building.",
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
    label: "Local Experience",
  },
];

const springfieldRisks = [
  {
    icon: CloudRain,
    title: "Severe Weather Across Both Units",
    description:
      "Central Illinois sees hail, high winds, ice storms, and tornado threats — all of which can damage both units of a duplex simultaneously. One storm can mean two repair jobs and two displaced households.",
  },
  {
    icon: Users,
    title: "Multi-Tenant Liability Exposure",
    description:
      "With two households sharing your property, the liability risk is greater than a single-family home. Slip-and-fall incidents, shared staircase injuries, and common-area accidents all fall back on you as the owner.",
  },
  {
    icon: Wrench,
    title: "Older Construction Throughout Springfield",
    description:
      "Many of Springfield's most popular duplex neighborhoods feature homes built in the mid-20th century. Older wiring, aging plumbing, and roofs past their useful life mean higher risk — and higher scrutiny from carriers.",
  },
  {
    icon: AlertTriangle,
    title: "Illinois Landlord-Tenant Law Requirements",
    description:
      "Illinois law creates specific obligations for rental property owners. Habitability standards, security deposit rules, and tenant rights create liability exposures your policy must adequately address.",
  },
];

const savingsTips = [
  {
    title: "Require Renters Insurance from Tenants",
    description:
      "Some carriers view tenant renters insurance favorably. It also shifts liability back to the tenant when they or their guests cause damage or injury.",
  },
  {
    title: "Update Roof, Wiring, or Plumbing",
    description:
      "Upgrading aging systems — especially knob-and-tube wiring or galvanized pipes common in older Springfield duplexes — can meaningfully lower your premium.",
  },
  {
    title: "Bundle with Your Auto Policy",
    description:
      "If you live in one unit, bundling your duplex and auto policies through the same carrier can reduce both premiums by 10–20%.",
  },
  {
    title: "Raise Your Deductible",
    description:
      "Choosing a higher deductible lowers your annual premium. This works well if you have reserves to cover minor repairs without filing a claim.",
  },
  {
    title: "Install Security and Safety Features",
    description:
      "Central station alarm systems, deadbolts, smoke detectors, and fire extinguishers can qualify your Springfield duplex for safety discounts.",
  },
  {
    title: "Shop at Renewal — Every Year",
    description:
      "Carrier pricing changes annually. The best rate you got two years ago may not be the best rate today. We re-shop all 30+ carriers at renewal so you're never overpaying.",
  },
];

const springfieldNeighborhoods = [
  "Downtown Springfield",
  "Iles Park",
  "Carpenter Park",
  "Laurel / Allen Park",
  "Ridgely",
  "South Side Springfield",
  "North End",
  "West Side",
  "Leland Grove",
  "Chatham",
  "Rochester",
  "Sherman",
  "Jerome",
  "Riverton",
  "Sangamon County",
];

const faqItems = [
  {
    question: "Do I need special insurance for a Springfield duplex?",
    answer:
      "Yes — a standard homeowners policy (HO-3) is not designed for a duplex with a rental unit. Once you rent out any portion of your duplex, you've introduced landlord liability, loss of rents exposure, and tenant-related risks that most HO-3 policies exclude or limit. Springfield duplex owners typically need either a hybrid owner-occupied landlord policy or a dwelling fire (DP-3) policy, depending on whether you live in one of the units.",
  },
  {
    question: "What does duplex insurance cost in Springfield, IL?",
    answer:
      "Duplex insurance in Springfield, IL typically ranges from $1,200 to $2,800 per year. Your exact rate depends on the property's age and condition, whether it's owner-occupied or fully rented, the replacement cost of the structure, and which carrier you're placed with. Older Springfield duplexes with outdated systems or aging roofs may fall at the higher end of that range. We compare 30+ carriers to find your lowest qualifying rate.",
  },
  {
    question:
      "I live in one unit and rent the other — what policy do I need?",
    answer:
      "This is the most common scenario for Springfield duplex owners, and the most important to get right. You may qualify for a homeowners policy with a landlord endorsement (covering both your unit and the rental), or you may need a dwelling fire policy for the rental side alongside standard homeowners coverage for your unit. Some carriers offer a single hybrid policy that handles both. We'll compare your options and find the structure that covers everything without duplication.",
  },
  {
    question:
      "Are older Springfield duplexes harder to insure?",
    answer:
      "They can be. Many duplexes in Springfield's established neighborhoods — Iles Park, Carpenter Park, the North End — were built in the 1940s through 1970s. Carriers scrutinize roof age, wiring type (knob-and-tube is a red flag), plumbing material, and overall condition. Updated systems get the best rates and the broadest coverage. If your duplex has aging infrastructure, we'll identify which carriers are most competitive for your situation and what updates would lower your premium most.",
  },
  {
    question:
      "What happens if a tenant is injured in a shared area of my duplex?",
    answer:
      "Shared staircases, entryways, yards, and driveways are landlord liability hot spots. If a tenant or their guest is injured in a shared common area and you're found negligent, your duplex liability coverage pays for their medical expenses, legal defense, and any settlement. Illinois landlord-tenant law can make property owners liable even for conditions they didn't directly create, which is why adequate liability limits — typically $300,000 or more — are essential for Springfield duplex owners.",
  },
  {
    question:
      "Does my duplex insurance cover damage caused by a tenant?",
    answer:
      "Yes, in most cases. Accidental tenant-caused damage — a kitchen fire, a bathtub overflow that damages both units — is typically covered under your dwelling coverage, subject to your deductible. Intentional damage by a tenant is a more complex claim but is often covered under a properly structured landlord or DP-3 policy. This is also why requiring your tenants to carry renters insurance is smart: their liability coverage can step in to reimburse you for damage they cause.",
  },
];

function DuplexInsuranceSpringfieldPage() {
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
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Protecting multi-family investments across Springfield's
              established neighborhoods. Whether you live in one unit or rent
              both, we compare 30+ carriers to find the right coverage at the
              right price.
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

      {/* Springfield Duplex Market */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <MapPin className="w-4 h-4" />
                Springfield Duplex Market
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-5">
                Why Duplexes Are Popular in Springfield
              </h2>
              <p className="text-text-secondary leading-relaxed mb-5">
                Springfield's housing stock includes a significant number of
                duplexes concentrated in the city's older, established
                neighborhoods — many built during the mid-20th century when
                two-unit construction was a common investment strategy. Areas
                like Iles Park, Carpenter Park, Laurel/Allen Park, and the North
                End have high concentrations of duplex properties that remain
                attractive to both owner-occupants and investors.
              </p>
              <p className="text-text-secondary leading-relaxed mb-5">
                For owner-occupants, a Springfield duplex offers the ability to
                offset mortgage costs with rental income from the second unit —
                a strategy that's especially effective given Springfield's
                consistent rental demand driven by state government employment,
                healthcare, and education sectors.
              </p>
              <p className="text-text-secondary leading-relaxed">
                For investors, Springfield duplexes represent accessible entry
                points into multi-family real estate, with rental rates that
                support positive cash flow in many neighborhoods. Either way,
                the insurance requirements for a duplex are meaningfully
                different from a single-family home — and getting them wrong can
                be costly.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Building2,
                  title: "Established Neighborhoods",
                  detail:
                    "Iles Park, Carpenter Park, Laurel/Allen Park, and the North End have the highest duplex concentrations in Springfield.",
                },
                {
                  icon: Users,
                  title: "Owner-Occupant Friendly",
                  detail:
                    "Many Springfield duplex owners live in one unit and rent the other — offsetting housing costs while building equity.",
                },
                {
                  icon: DollarSign,
                  title: "Strong Rental Demand",
                  detail:
                    "State government, healthcare, and education employment keeps Springfield's rental market consistently active year-round.",
                },
                {
                  icon: Home,
                  title: "Investor Opportunity",
                  detail:
                    "Springfield duplexes offer accessible entry into multi-family investing with rental rates that support positive cash flow.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Coverage for Springfield Duplexes
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A properly structured duplex policy covers the full structure, your
              rental income, and your liability as a Springfield property owner
              — whether you live there or not.
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
              How you use your Springfield duplex determines what kind of policy
              you need. Getting this wrong can mean a denied claim when it
              matters most.
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
                Springfield duplex setup — and the most frequently
                under-insured.
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
                a purely investment property requiring a landlord or
                dwelling fire policy.
              </p>
              <ul className="space-y-3">
                {[
                  "Requires a dwelling fire (DP-3) or dedicated landlord policy",
                  "No personal property coverage for the owner",
                  "Loss of rents covers income from both units if uninhabitable",
                  "Liability limits should reflect exposure from both tenants",
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
                  Why a Standard Homeowners Policy Is Not Enough for a Springfield Duplex
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  A standard HO-3 homeowners policy is built for a
                  single-family, owner-occupied home. The moment you rent out
                  any portion of your Springfield duplex, you've changed the
                  risk profile in ways that can void your coverage or result in
                  a denied claim.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Landlord Liability Gap",
                      detail:
                        "Standard homeowners policies often exclude landlord-tenant liability. A tenant injury on your Springfield property could be entirely uncovered.",
                    },
                    {
                      title: "No Loss of Rents",
                      detail:
                        "If your rental unit is damaged and uninhabitable, a standard HO-3 won't reimburse you for the lost rent while repairs are underway.",
                    },
                    {
                      title: "Policy Cancellation Risk",
                      detail:
                        "If your insurer discovers you're renting a unit under an HO-3, they can deny your claim or cancel your policy on grounds of material misrepresentation.",
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

      {/* Springfield Duplex Risks */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Risks Specific to Springfield Duplex Owners
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Springfield's climate, housing stock, and legal environment create
              risks that every duplex owner needs to account for in their
              coverage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {springfieldRisks.map((risk) => {
              const Icon = risk.icon;
              return (
                <div
                  key={risk.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
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

      {/* How to Save */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              How to Save on Duplex Insurance in Springfield
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Several factors are within your control. Here's where Springfield
              duplex owners most commonly find savings.
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Serving Springfield Neighborhoods and Surrounding Communities
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From Springfield's historic duplex-dense neighborhoods to the
              surrounding suburbs and Sangamon County communities — we cover it all.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {springfieldNeighborhoods.map((area) => (
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

      {/* FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Duplex Insurance FAQ
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

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Get the Right Duplex Coverage in Springfield
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Don't risk a denied claim with the wrong policy. We'll compare 30+
            carriers and make sure your Springfield duplex is properly covered
            — whether you live there or rent both units.
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
