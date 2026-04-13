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
  Users,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/landlord-insurance")({
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
    ],
  }),
  component: LandlordInsurancePage,
});

const coverageTypes = [
  {
    icon: Home,
    title: "Dwelling Coverage",
    description:
      "Protects the physical structure of your rental property — walls, roof, and built-in fixtures — against covered perils like fire, wind, hail, and vandalism.",
    highlight: "Structure Protection",
  },
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Covers legal fees and settlements if a tenant or visitor is injured on your property and files a lawsuit against you as the property owner.",
    highlight: "Legal Protection",
  },
  {
    icon: DollarSign,
    title: "Loss of Rental Income",
    description:
      "Reimburses lost rent if your rental property becomes uninhabitable after a covered loss — such as a fire or major storm — while repairs are underway.",
    highlight: "Income Protection",
  },
  {
    icon: Wrench,
    title: "Personal Property (Landlord)",
    description:
      "Covers appliances, tools, lawn equipment, and other items you own and provide to tenants as part of the rental. Does not cover tenants' personal belongings.",
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

const landlordVsHomeowners = [
  {
    topic: "Who It Covers",
    landlord: "Owner of a rental property (not living there)",
    homeowners: "Owner-occupant living in the home",
  },
  {
    topic: "Loss of Rent",
    landlord: "Included — reimburses lost rental income",
    homeowners: "Not included (ALE covers owner's temp housing instead)",
  },
  {
    topic: "Liability Limits",
    landlord: "Typically higher — more exposure as a landlord",
    homeowners: "Standard limits for personal use",
  },
  {
    topic: "Personal Property",
    landlord: "Covers only landlord-owned items (appliances, tools)",
    homeowners: "Covers all household belongings",
  },
  {
    topic: "Tenant Belongings",
    landlord: "Not covered — tenants need renters insurance",
    homeowners: "N/A (owner-occupied)",
  },
];

const rateFactors = [
  {
    title: "Property Type",
    description:
      "Single-family rentals, multi-unit buildings, and condos are each rated differently. More units generally means more exposure and higher premiums.",
  },
  {
    title: "Property Age & Condition",
    description:
      "Older properties with aging roofs, electrical panels, or plumbing systems carry higher risk and cost more to insure. Upgrades can lower your rate.",
  },
  {
    title: "Number of Units",
    description:
      "A duplex or four-unit building carries different risk than a single-family rental. Carriers price multi-unit properties on a per-unit basis.",
  },
  {
    title: "Location & Neighborhood",
    description:
      "Crime rates, proximity to fire stations, and flood zone status all factor into your landlord insurance premium in the Springfield area.",
  },
  {
    title: "Claims History",
    description:
      "Prior claims on the property — even by previous owners — can increase rates. Multiple recent claims may limit carrier options.",
  },
  {
    title: "Tenant Screening Practices",
    description:
      "Some carriers consider whether you conduct background checks and credit screening on tenants as part of their underwriting process.",
  },
  {
    title: "Short-Term vs. Long-Term Rental",
    description:
      "Short-term rentals (Airbnb, VRBO) carry significantly higher risk than long-term leases and require specialized coverage not found in standard landlord policies.",
  },
  {
    title: "Deductible Amount",
    description:
      "A higher deductible lowers your premium. Many landlords opt for higher deductibles since rental properties are less likely to have frequent small claims.",
  },
];

const faqItems = [
  {
    question: "Do I need landlord insurance if I already have a homeowners policy?",
    answer:
      "Yes. A standard homeowners policy is designed for owner-occupied homes and will not cover losses when the property is rented out to tenants. If you rent out your home — even temporarily — you need a landlord insurance policy (also called a dwelling fire policy). Using a homeowners policy on a rental property can result in a denied claim.",
  },
  {
    question: "Does landlord insurance cover tenant damage?",
    answer:
      "It depends on the cause. Landlord insurance covers accidental or sudden damage from covered perils like fire or windstorm. Intentional damage by a tenant is generally excluded. Some carriers offer a tenant vandalism endorsement. Gradual damage from tenant neglect (like unreported water leaks) is also typically excluded. A security deposit and thorough move-in/move-out inspections remain your best protection against tenant-caused damage.",
  },
  {
    question: "What is loss of rental income coverage?",
    answer:
      "Loss of rental income (also called fair rental value coverage) reimburses you for the rent you would have collected if your property becomes uninhabitable after a covered loss — such as a fire or severe storm damage. Coverage typically continues until the property is repaired and habitable again, subject to the policy's time limit. This is one of the key coverages that separates landlord policies from homeowners policies.",
  },
  {
    question: "Do my tenants need renters insurance?",
    answer:
      "Yes — and many landlords now require it as a condition of the lease. Your landlord policy does not cover your tenants' personal belongings or provide them with liability protection. Renters insurance is affordable (typically $10–$20/month) and protects tenants from losses to their clothing, electronics, furniture, and more. Requiring renters insurance also reduces the likelihood that tenants will file claims against your landlord policy for their own losses.",
  },
  {
    question: "How much landlord insurance do I need?",
    answer:
      "Your dwelling coverage should be based on the cost to rebuild the structure from the ground up — not the market value or what you paid for the property. Liability limits of at least $300,000–$500,000 are common for landlords; many add a personal umbrella policy on top for additional protection. Loss of rental income coverage should reflect your actual monthly rent multiplied by a reasonable repair timeline (often 12 months). We'll help you arrive at the right numbers.",
  },
  {
    question: "Does landlord insurance cover natural disasters?",
    answer:
      "Standard landlord policies cover many common weather-related perils: wind, hail, lightning, and fire. They do not cover floods or earthquakes — those require separate policies. In Springfield, flood coverage through the National Flood Insurance Program (NFIP) or a private flood carrier may be worth considering depending on your property's location relative to the Sangamon River and its tributaries.",
  },
  {
    question: "Can I insure multiple rental properties on one policy?",
    answer:
      "Yes. If you own multiple rental properties, a portfolio or blanket landlord policy can cover them all under one policy, often at a better rate than insuring each property separately. This simplifies your coverage management and can reduce total premium. We work with carriers that specialize in multi-property landlord coverage throughout Central Illinois.",
  },
  {
    question: "What about short-term rental (Airbnb) coverage?",
    answer:
      "Standard landlord policies are designed for long-term leases and typically exclude or severely limit coverage for short-term rentals. If you rent your property on Airbnb, VRBO, or similar platforms, you need a specialized short-term rental policy or endorsement. Airbnb's Host Protection Insurance provides some coverage, but it has significant gaps. We can help you find a policy that properly covers your short-term rental activity.",
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

function LandlordInsurancePage() {
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
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Your rental property is an investment — protect it with the right
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

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Landlord Insurance Covers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A landlord insurance policy is built specifically for rental
              properties — combining the protections that matter most to property
              owners.
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

      {/* Landlord vs Homeowners Insurance */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Landlord vs. Homeowners Insurance
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Using the wrong policy on a rental property can leave you with a
              denied claim. Here's how landlord and homeowners coverage differ.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
            <div className="grid grid-cols-3 bg-primary-500 text-white text-sm font-semibold px-6 py-3">
              <div>Coverage Area</div>
              <div className="text-center">Landlord Policy</div>
              <div className="text-center">Homeowners Policy</div>
            </div>
            {landlordVsHomeowners.map((row, i) => (
              <div
                key={row.topic}
                className={`grid grid-cols-3 px-6 py-4 text-sm gap-4 ${
                  i % 2 === 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <div className="font-semibold text-text-primary">{row.topic}</div>
                <div className="text-text-secondary text-center">{row.landlord}</div>
                <div className="text-text-secondary text-center">{row.homeowners}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Tenants Need Their Own Renters Insurance
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Your landlord policy protects your property and your liability — not
                  your tenants' belongings. If a fire destroys your tenant's furniture,
                  electronics, and clothing, your policy won't pay for it. Requiring
                  renters insurance as a lease condition protects your tenants and
                  reduces the likelihood they'll look to you for reimbursement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Affects Your Landlord Insurance Rate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Affects Your Landlord Insurance Rate
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Carriers evaluate several factors specific to rental properties when
              calculating your premium. Here's what matters most.
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

      {/* FAQ Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Landlord Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Answers to the questions Springfield landlords ask us most.
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
              Serving Landlords Across Central Illinois
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From Springfield rentals to investment properties throughout
              Sangamon County and beyond, we've got you covered.
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
            Protect Your Springfield Rental Property Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Don't leave your investment unprotected. Get a free landlord
            insurance quote from 30+ carriers in minutes.
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
