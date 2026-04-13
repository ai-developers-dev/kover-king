import { createFileRoute } from "@tanstack/react-router";
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
  CloudLightning,
  Droplets,
  Wind,
  Snowflake,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/home-insurance-springfield-il")({
  head: () => ({
    meta: [
      {
        title:
          "Home Insurance Springfield IL | Compare Homeowners Rates | Kover King",
      },
      {
        name: "description",
        content:
          "Compare Springfield IL homeowners insurance from 30+ carriers. Save up to 40% on dwelling, liability & personal property coverage. Free quotes — call (217) 960-8997.",
      },
      {
        property: "og:title",
        content:
          "Home Insurance Springfield IL | Compare Homeowners Rates | Kover King",
      },
      {
        property: "og:description",
        content:
          "Compare Springfield IL homeowners insurance from 30+ carriers. Save up to 40% on dwelling, liability & personal property coverage. Free quotes — call (217) 960-8997.",
      },
      {
        name: "keywords",
        content:
          "home insurance Springfield IL, homeowners insurance Springfield Illinois, Springfield IL home insurance quotes, cheap home insurance Springfield, Springfield homeowners insurance rates, Sangamon County home insurance, Springfield IL dwelling coverage",
      },
    ],
  }),
  component: HomeInsuranceSpringfieldILPage,
});

const statsBar = [
  { icon: BadgeCheck, stat: "30+", label: "Carriers Compared" },
  { icon: Star, stat: "Up to 40%", label: "Potential Savings" },
  { icon: Umbrella, stat: "Local", label: "Springfield Agents" },
];

const coverageCards = [
  {
    icon: Home,
    title: "Dwelling Coverage",
    highlight: "Structure Protection",
    description:
      "Covers the structure of your Springfield home — walls, roof, attached garage, and built-in systems — against covered perils like fire, wind, hail, and tornado damage.",
  },
  {
    icon: Package,
    title: "Personal Property",
    highlight: "Your Belongings",
    description:
      "Protects furniture, electronics, clothing, and valuables inside your home. Replacement cost coverage pays today's prices, not the depreciated value of older items.",
  },
  {
    icon: ShieldCheck,
    title: "Liability Coverage",
    highlight: "Legal Protection",
    description:
      "If a guest is injured on your property or you accidentally damage a neighbor's fence during a storm, liability coverage pays legal fees and settlements up to your policy limit.",
  },
  {
    icon: BedDouble,
    title: "Additional Living Expenses",
    highlight: "Temporary Housing",
    description:
      "If a tornado or severe storm makes your home uninhabitable, ALE covers hotel stays, meals, and other costs while your home is repaired — so your family stays comfortable.",
  },
];

const springfieldRisks = [
  {
    icon: Wind,
    title: "Tornado & Severe Storm Corridor",
    description:
      "Springfield sits squarely in the tornado corridor of Central Illinois. The region regularly experiences tornado warnings, large hail, and straight-line winds exceeding 80 mph. Adequate dwelling and personal property limits — plus a separate wind/hail deductible you can afford — are essential.",
  },
  {
    icon: CloudLightning,
    title: "Older Homes & Outdated Systems",
    description:
      "Many of Springfield's most desirable neighborhoods — including historic districts near the Lincoln Home and downtown — feature homes built in the early-to-mid 1900s. Knob-and-tube wiring, galvanized plumbing, and aging HVAC systems are common and can trigger carrier surcharges, exclusions, or require upgrades before coverage is issued.",
  },
  {
    icon: Droplets,
    title: "Basement Flooding & Sewer Backup",
    description:
      "Homes near Lake Springfield, Sugar Creek, and the Sangamon River floodplain face elevated risk of water intrusion. Even properties outside mapped flood zones can experience basement flooding from heavy rainfall. Sewer backup endorsements and NFIP or private flood policies are strongly recommended.",
  },
  {
    icon: Snowflake,
    title: "Ice Storms & Winter Tree Damage",
    description:
      "Central Illinois winters bring significant ice storm risk. Ice accumulation on mature trees — common in Leland Grove, Washington Park, and older Springfield neighborhoods — can topple limbs onto roofs, vehicles, and fences. Standard policies cover sudden tree-fall damage; damage from gradual decay is excluded.",
  },
];

const savingsTips = [
  {
    title: "Bundle Home + Auto",
    tip: "Combining your homeowners and auto policies with the same carrier is typically the single biggest discount available — often 15–25% on both. We'll find you the best bundle rate across 30+ carriers.",
  },
  {
    title: "New or Updated Roof",
    tip: "A roof replaced within the last 5–10 years using impact-resistant shingles can earn meaningful premium credits and may unlock better coverage terms. If your roof is nearing 15 years, proactive replacement often pays for itself in savings.",
  },
  {
    title: "Upgrade Electrical & Plumbing",
    tip: "Replacing knob-and-tube wiring or galvanized pipes in older Springfield homes can reduce your premium, expand your carrier options, and eliminate surcharges that some older-home owners pay without realizing it.",
  },
  {
    title: "Install a Security System",
    tip: "A monitored burglar alarm and smoke/CO detectors earn discounts with most carriers. Some also offer credits for smart home devices that detect water leaks — particularly valuable for homes near flood-prone areas.",
  },
  {
    title: "Raise Your Deductible Strategically",
    tip: "Increasing your standard deductible from $500 to $1,000 or $2,500 lowers your premium noticeably. Many Springfield-area policies now include a separate wind/hail deductible — make sure yours is set at a level you can comfortably cover out of pocket after a storm.",
  },
  {
    title: "Maintain a Claims-Free History",
    tip: "Filing small claims often costs more in long-term premium increases than the claim pays out. We'll help you understand when it makes sense to file versus self-insure a minor loss, keeping your record clean and your rates low.",
  },
];

const neighborhoods = [
  "Leland Grove",
  "Washington Park",
  "Lake Springfield",
  "Iles Park",
  "Pasfield",
  "Laurel Park",
  "Meadowbrook",
  "Jerome",
  "Sherman",
  "Chatham",
  "Rochester",
  "Williamsville",
  "Riverton",
  "Auburn",
  "Pawnee",
  "Sangamon County",
];

const faqItems = [
  {
    question:
      "How much does homeowners insurance cost in Springfield, IL?",
    answer:
      "Springfield homeowners typically pay between $1,100 and $1,900 per year for a standard HO-3 policy on a single-family home, though rates vary widely based on your home's age, construction, location, and coverage limits. Older homes in historic Springfield neighborhoods with outdated electrical or plumbing systems tend to cost more to insure. The best way to know your actual rate is to compare quotes from multiple carriers — which is exactly what we do for you.",
  },
  {
    question:
      "Do I need flood insurance if I live near Lake Springfield or Sugar Creek?",
    answer:
      "Possibly, yes. Flood insurance is NOT included in any standard homeowners policy — it must be purchased separately through the National Flood Insurance Program (NFIP) or a private flood carrier. Homes near Lake Springfield, Sugar Creek, and the Sangamon River are at elevated risk, but flooding has also affected properties well outside mapped flood zones during heavy rain events. We recommend checking your property's FEMA flood zone status and discussing whether a flood policy makes sense for your address.",
  },
  {
    question:
      "My Springfield home was built in the 1920s. Will I have trouble getting insurance?",
    answer:
      "Older Springfield homes can be insured — but some carriers will require inspections, impose surcharges, or exclude certain systems before binding coverage. The most common issues are knob-and-tube or aluminum wiring, galvanized or cast-iron plumbing, and aging roofs. If your home has been updated — even partially — we can often find competitive rates by matching you with carriers who specialize in older homes. We'll tell you upfront what may need to be addressed.",
  },
  {
    question:
      "Does my home insurance cover tornado damage in Springfield?",
    answer:
      "Yes — tornado and windstorm damage to your dwelling is covered under standard HO-3 and HO-5 policies. However, many Central Illinois policies now include a separate wind/hail deductible (often 1–2% of your dwelling coverage limit) that applies specifically to wind and hail claims. That means on a $250,000 home, your out-of-pocket cost before insurance kicks in for a tornado claim could be $2,500–$5,000. We'll make sure you understand your deductible structure before you buy.",
  },
  {
    question:
      "What does sewer backup coverage cost, and do Springfield homeowners really need it?",
    answer:
      "Sewer backup (also called water and sewer backup or drain backup) coverage is typically available as an endorsement for $50–$150 per year — a small cost relative to the damage a backed-up sewer or drain can cause. For Springfield homeowners with basements, particularly in older neighborhoods with aging municipal sewer infrastructure, this endorsement is strongly recommended. A single sewer backup claim can easily reach $10,000–$30,000 in cleanup and repair costs.",
  },
  {
    question:
      "Can I save money by insuring my Springfield home and car together?",
    answer:
      "Yes — bundling your home and auto insurance is one of the most effective ways to reduce both premiums. Most carriers offer 15–25% discounts when you combine policies, and some extend the discount to umbrella or life insurance as well. Because we compare 30+ carriers, we'll find you the best bundle combination — not just the best home rate in isolation — so you save on your total insurance spend.",
  },
];

function HomeInsuranceSpringfieldILPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              Springfield, IL — Local Home Insurance
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Homeowners Insurance in{" "}
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Springfield homes face real risks — tornadoes, severe hail,
              basement flooding, and the unique challenges of older historic
              neighborhoods. We compare 30+ carriers to find you the right
              coverage at the best rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Home">
                <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                  Get My Free Springfield Quote
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
            {statsBar.map(({ icon: Icon, stat, label }) => (
              <div key={label} className="flex flex-col items-center py-2">
                <Icon className="w-6 h-6 text-white mb-1" />
                <div className="text-2xl font-extrabold text-white">{stat}</div>
                <div className="text-xs text-white/80 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Springfield Home Insurance Facts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                Springfield IL Home Insurance Facts
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Understanding the local landscape helps you buy the right
                coverage — not just the cheapest policy.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4 bg-surface rounded-2xl p-5">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">
                      Median Home Value ~$155,000
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Springfield home values run well below the Illinois
                      statewide median, which means competitive insurance
                      premiums — but it also means making sure your dwelling
                      limit reflects rebuild cost, not market value. Rebuild
                      costs in Central Illinois often exceed market value for
                      older properties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-surface rounded-2xl p-5">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <Wind className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">
                      Tornado Alley — Serious Storm Exposure
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Springfield and Sangamon County sit in one of the most
                      active severe weather corridors in the Midwest. The area
                      averages multiple tornado warnings per season, with hail
                      events large enough to total roofs occurring several times
                      per decade.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-surface rounded-2xl p-5">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">
                      Flood Zones Near Lake Springfield & Sugar Creek
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      FEMA flood zone maps cover portions of the Lake
                      Springfield area, Sugar Creek corridor, and land
                      adjacent to the Sangamon River. Flood events have also
                      impacted areas outside designated zones. Standard home
                      policies exclude flood — a separate policy is required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-surface rounded-2xl p-5">
                  <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">
                      Historic Neighborhoods & Older Homes
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Springfield's rich history means many of its most sought-
                      after neighborhoods — Iles Park, Pasfield, Laurel Park —
                      are filled with homes from the 1910s through 1950s.
                      These homes often carry hidden insurance risks including
                      outdated wiring, aging plumbing, and plaster-and-lath
                      construction that costs more to restore after a loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick facts sidebar */}
            <div className="bg-surface rounded-2xl p-8 border border-gray-100">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-6">
                Quick Reference: Springfield Home Insurance
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Typical Annual Premium",
                    value: "$1,100 – $1,900",
                  },
                  {
                    label: "Median Home Value",
                    value: "~$155,000",
                  },
                  {
                    label: "Tornado Risk",
                    value: "High (Central IL corridor)",
                  },
                  {
                    label: "Flood Policy Required?",
                    value: "Separate — not in standard policy",
                  },
                  {
                    label: "Common Older Home Issues",
                    value: "Knob-and-tube wiring, galvanized pipes",
                  },
                  {
                    label: "Wind/Hail Deductible",
                    value: "Often 1–2% of dwelling limit",
                  },
                  {
                    label: "Carriers We Compare",
                    value: "30+",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-text-secondary text-sm">{label}</span>
                    <span className="font-semibold text-text-primary text-sm text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <QuoteDialog defaultInsuranceType="Home">
                  <button className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] cursor-pointer">
                    Get My Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage for Springfield Homes */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Coverage Built for Springfield Homeowners
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A standard homeowners policy combines several protections into one
              package. Here's what matters most for Springfield homes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-2 py-1 rounded-full mb-3">
                    {card.highlight}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Exclusions callout */}
          <div className="mt-10 bg-white rounded-2xl p-8 border border-primary-100 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
              Important: What Standard Policies Don't Cover in Springfield
            </h3>
            <p className="text-text-secondary text-sm mb-5">
              Every HO-3 and HO-5 policy excludes certain perils regardless of
              how broad the coverage form is. These are the gaps Springfield
              homeowners most commonly overlook:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Flood Damage",
                  detail:
                    "Requires a separate NFIP or private flood policy. Homes near Lake Springfield and Sugar Creek are particularly exposed.",
                },
                {
                  name: "Sewer & Drain Backup",
                  detail:
                    "Water backing up through drains is excluded. An endorsement adds this coverage for $50–$150/year — essential for Springfield basements.",
                },
                {
                  name: "Gradual Deterioration",
                  detail:
                    "Damage from long-term wear, rust, rot, or neglect is not covered. Only sudden and accidental losses qualify.",
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

      {/* Springfield-Specific Risks */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Why Springfield Homeowners Need the Right Coverage
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Living in Central Illinois means facing weather and property risks
              that other parts of the country simply don't deal with. Here's
              what every Springfield homeowner should plan for.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {springfieldRisks.map((risk) => {
              const Icon = risk.icon;
              return (
                <div
                  key={risk.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                        {risk.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Neighborhood callout */}
          <div className="mt-10 bg-cream rounded-2xl p-8">
            <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
              Neighborhood-Specific Considerations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Leland Grove
                </p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Established neighborhood with many mid-century homes and
                  mature trees. Ice storm and windstorm tree-fall is a common
                  claim driver. Verify your policy covers tree removal and
                  roof repair.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Washington Park Area
                </p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Older housing stock with higher incidence of outdated
                  electrical systems. Some carriers require electrical
                  inspections or upgrades before issuing full coverage.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Lake Springfield Area
                </p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Proximity to Lake Springfield and its tributaries creates
                  flood risk. FEMA flood zone maps may or may not reflect your
                  actual risk — we recommend reviewing your address specifically
                  before declining flood coverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Save */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              How to Save on Home Insurance in Springfield
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Springfield homeowners have real opportunities to reduce premiums
              without sacrificing coverage. Here's where the savings are.
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
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary-500 rounded-2xl p-8 text-center">
            <h3 className="font-heading text-2xl font-extrabold text-white mb-3">
              Let Us Find Every Discount You Qualify For
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Most homeowners are leaving money on the table. A 10-minute
              conversation is all it takes to compare options and identify
              savings across 30+ carriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QuoteDialog defaultInsuranceType="Home">
                <button className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                  See My Savings Options
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
        </div>
      </section>

      {/* Neighborhoods Served */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Springfield Neighborhoods We Serve
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From historic Springfield neighborhoods to surrounding Sangamon
              County communities — we insure homes across the entire capital
              region.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {neighborhoods.map((area) => (
              <div
                key={area}
                className="flex items-center gap-1.5 bg-surface text-primary-500 font-medium px-4 py-2 rounded-full text-sm shadow-sm border border-primary-100"
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
              Springfield Home Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary">
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
              Have a question we didn't cover? We're happy to help.
            </p>
            <QuoteDialog defaultInsuranceType="Home">
              <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_12px_35px_-8px_rgba(233,86,12,0.5)] hover:-translate-y-0.5 cursor-pointer">
                Talk to a Springfield Agent
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
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Don't wait for the next tornado season to find out if you're
            underinsured. Get a free homeowners insurance comparison from
            30+ carriers — in minutes.
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
