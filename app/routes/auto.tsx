import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  ShieldCheck,
  AlertTriangle,
  UserX,
  CheckCircle2,
  MapPin,
  TrendingDown,
  Phone,
  Star,
  ArrowRight,
  Clock,
  ChevronDown,
  FileText,
  Activity,
  Gauge,
  CreditCard,
  Route as RouteIcon,
  Sliders,
  Tag,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/auto")({
  head: () => ({
    meta: [
      {
        title:
          "Auto Insurance Springfield IL | Compare Car Insurance Rates | Kover King",
      },
      {
        name: "description",
        content:
          "Compare car insurance rates from 30+ carriers in Springfield, IL. Average savings of $600/year. Liability, collision, comprehensive coverage.",
      },
      {
        property: "og:title",
        content:
          "Auto Insurance Springfield IL | Compare Car Insurance Rates | Kover King",
      },
      {
        property: "og:description",
        content:
          "Compare car insurance rates from 30+ carriers in Springfield, IL. Average savings of $600/year. Liability, collision, comprehensive coverage.",
      },
    ],
  }),
  component: AutoPage,
});

const coverageTypes = [
  {
    icon: ShieldCheck,
    title: "Liability Coverage",
    description:
      "Required by Illinois law, liability coverage protects you if you're at fault in an accident. It pays for the other party's medical bills and property damage so you're not personally responsible.",
    highlight: "State Required",
  },
  {
    icon: Car,
    title: "Collision Coverage",
    description:
      "Covers repairs to your vehicle after a collision with another car or object, regardless of fault. Essential for newer vehicles or financed/leased cars.",
    highlight: "Vehicle Protection",
  },
  {
    icon: AlertTriangle,
    title: "Comprehensive Coverage",
    description:
      "Protects against non-collision damage: theft, vandalism, weather events, hitting an animal, and more. Pairs with collision for full vehicle protection.",
    highlight: "Non-Collision Events",
  },
  {
    icon: UserX,
    title: "Uninsured Motorist",
    description:
      "Illinois has a significant rate of uninsured drivers. This coverage protects you and your passengers if you're hit by someone who has no insurance or insufficient coverage.",
    highlight: "Critical in Illinois",
  },
];

const whyChoosePoints = [
  "Access to 30+ top-rated insurance carriers in one call",
  "Independent agents work for you, not the insurance company",
  "Average savings of $600/year compared to single-carrier shopping",
  "Quick side-by-side rate comparisons tailored to your situation",
  "Local Springfield agents who know Illinois roads and regulations",
  "Policy review and claims support throughout your coverage period",
];

const serviceAreas = [
  "Springfield",
  "Chatham",
  "Rochester",
  "Sherman",
  "Leland Grove",
  "Auburn",
  "Pawnee",
  "Riverton",
  "Williamsville",
  "Sangamon County",
  "Menard County",
  "Logan County",
];

const rateFactors = [
  {
    icon: Activity,
    title: "Driving Record & Claims History",
    description:
      "Accidents, speeding tickets, and DUIs all raise your rate. A clean record for 3–5 years typically qualifies you for safe-driver discounts.",
  },
  {
    icon: Gauge,
    title: "Age & Experience",
    description:
      "Teen drivers (16–24) pay the highest premiums due to risk statistics. Rates generally drop significantly after age 25 with a clean history.",
  },
  {
    icon: Car,
    title: "Vehicle Type",
    description:
      "Safety ratings, repair costs, and theft rates all factor in. A sports car or luxury SUV costs more to insure than an economy sedan with top safety scores.",
  },
  {
    icon: CreditCard,
    title: "Credit Score",
    description:
      "Illinois allows insurers to use credit-based insurance scores. Improving your credit can meaningfully lower your premium across multiple carriers.",
  },
  {
    icon: RouteIcon,
    title: "Annual Mileage & Commute",
    description:
      "The more you drive, the greater your exposure to accidents. Low-mileage drivers often qualify for usage-based or pay-per-mile programs.",
  },
  {
    icon: Sliders,
    title: "Coverage Levels & Deductibles",
    description:
      "Higher deductibles lower your premium. Dropping collision on an older paid-off vehicle can save hundreds per year — we'll help you decide what makes sense.",
  },
  {
    icon: Tag,
    title: "Available Discounts",
    description:
      "Multi-car, good student, bundling home + auto, safe driver telematics, anti-theft devices, and more. We stack every discount you qualify for.",
  },
  {
    icon: FileText,
    title: "Prior Insurance & Lapses",
    description:
      "Continuous coverage history is rewarded. A lapse in coverage — even a short one — signals risk to carriers and raises rates. Stay covered, even between cars.",
  },
];

const faqItems = [
  {
    question: "What is the minimum auto insurance required in Illinois?",
    answer:
      "Illinois law requires all drivers to carry liability insurance with minimums of $25,000 per person / $50,000 per accident for bodily injury, and $20,000 for property damage. You must also carry uninsured motorist coverage of at least $25,000/$50,000. These are floor amounts — most agents, including ours, recommend higher limits to protect your assets in a serious accident.",
  },
  {
    question: "How can I lower my car insurance premium?",
    answer:
      "The most effective strategies are: raising your deductible, bundling auto with home or renters insurance, enrolling in a safe-driver telematics program, removing collision on older paid-off vehicles, maintaining a clean driving record, and improving your credit score over time. Our agents will review every discount available across 30+ carriers to find you the lowest legitimate rate.",
  },
  {
    question: "Do I need full coverage on an older car?",
    answer:
      "It depends on your car's current market value. A common rule of thumb: if the annual cost of collision + comprehensive coverage exceeds 10% of your car's value, it may not be worth carrying. For a 12-year-old vehicle worth $4,000, paying $600+/year for physical damage coverage often doesn't make financial sense. We can help you run the numbers.",
  },
  {
    question: "What happens if I'm hit by an uninsured driver?",
    answer:
      "Illinois has one of the higher rates of uninsured motorists in the country — estimated around 12–14% of drivers. If you're hit by an uninsured (or underinsured) driver, your uninsured/underinsured motorist coverage steps in to pay for your medical bills and lost wages. Without it, you'd have to sue the at-fault driver personally — often an uphill battle.",
  },
  {
    question: "How does filing a claim affect my rates?",
    answer:
      "It depends on the carrier, the type of claim, and your history. An at-fault accident typically raises rates for 3–5 years. Not-at-fault claims have less impact but can still trigger a review. Comprehensive claims (hail, theft) generally have minimal rate impact. If your repair cost is close to your deductible, it's often worth paying out of pocket to avoid a surcharge.",
  },
  {
    question: "Can I add my teen driver to my policy?",
    answer:
      "Yes — and in most cases it's significantly cheaper to add a teen to an existing family policy than to buy them a separate policy. We can shop carriers to find who rates teen drivers most favorably, match them to the safest vehicle on your policy, and apply good-student discounts (typically 5–15% off for a B average or better).",
  },
  {
    question: "What is gap insurance and do I need it?",
    answer:
      "Gap insurance covers the difference between what your car is worth (actual cash value) and what you still owe on your loan or lease if your vehicle is totaled. New cars can depreciate 15–20% the moment you drive off the lot, leaving you upside-down. If you financed or leased your vehicle within the last 2–3 years, gap coverage is usually worth adding — it's often very inexpensive.",
  },
  {
    question: "How quickly can I get coverage?",
    answer:
      "In most cases, same day. Once we identify the right policy and you approve the coverage details, your policy can be bound immediately with proof of insurance emailed to you within minutes. If you need coverage before you drive a newly purchased vehicle, call us and we can often have you covered within the hour.",
  },
];

function AutoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Car className="w-4 h-4" />
              Auto Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Auto Insurance in{" "}
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Compare car insurance rates from 30+ carriers in one place. Our
              independent agents find you the right coverage at the best price —
              no pressure, no runaround.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Auto">
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

      {/* Savings Callout Banner */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-white text-center">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">$600</div>
                <div className="text-sm font-medium opacity-90">
                  average annual savings
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">30+</div>
                <div className="text-sm font-medium opacity-90">
                  carriers compared
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">
                  30 yrs
                </div>
                <div className="text-sm font-medium opacity-90">
                  serving Central Illinois
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Auto Insurance Coverage Types
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every driver's needs are different. We'll help you choose the
              right combination of coverages for your vehicle, budget, and
              lifestyle.
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

      {/* Why Choose Kover King */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                Why Springfield Drivers Choose Kover King
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                As an independent agency, we're not tied to one carrier. That
                means we shop the entire market on your behalf to find coverage
                that truly fits.
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                Ready to Save on Car Insurance?
              </h3>
              <p className="text-text-secondary mb-6">
                Get a free, no-obligation quote in minutes. Our agents will
                compare rates from all our carriers and present you with the
                best options.
              </p>
              <div className="space-y-3">
                <QuoteDialog defaultInsuranceType="Auto">
                  <button className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] cursor-pointer">
                    Request a Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
                <a
                  href="tel:+12179608997"
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary-500 text-primary-500 font-semibold px-6 py-3.5 rounded-xl transition-all hover:bg-cream"
                >
                  <Phone className="w-4 h-4" />
                  Call (217) 960-8997
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Serving Central Illinois
            </h2>
            <p className="text-text-secondary">
              We provide auto insurance quotes across the Springfield metro area
              and beyond.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-1.5 bg-cream text-primary-500 font-medium px-4 py-2 rounded-full text-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illinois Auto Insurance Requirements */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <FileText className="w-4 h-4" />
              Illinois State Law
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Illinois Minimum Auto Insurance Requirements
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Illinois requires all registered vehicles to carry liability and
              uninsured motorist coverage. Here's exactly what the law mandates
              — and what our agents typically recommend instead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Bodily Injury */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                Bodily Injury Liability
              </span>
              <div className="mb-4">
                <div className="font-heading text-4xl font-extrabold text-primary-500 leading-none">
                  $25,000
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  per person injured
                </div>
              </div>
              <div className="mb-6">
                <div className="font-heading text-3xl font-extrabold text-primary-500 leading-none">
                  $50,000
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  per accident total
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed border-t border-gray-100 pt-4">
                Pays the other party's medical bills and lost wages when you're
                at fault. A single ER visit can exceed $25,000 — most agents
                recommend $100,000/$300,000 or higher.
              </p>
            </div>

            {/* Property Damage */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                Property Damage Liability
              </span>
              <div className="mb-6">
                <div className="font-heading text-4xl font-extrabold text-primary-500 leading-none">
                  $20,000
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  per accident
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed border-t border-gray-100 pt-4">
                Covers damage you cause to other people's vehicles or property.
                With new vehicles averaging over $40,000, the state minimum
                often falls short. We recommend at least $100,000.
              </p>
            </div>

            {/* Uninsured Motorist */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                Uninsured Motorist
              </span>
              <div className="mb-4">
                <div className="font-heading text-4xl font-extrabold text-primary-500 leading-none">
                  $25,000
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  per person
                </div>
              </div>
              <div className="mb-6">
                <div className="font-heading text-3xl font-extrabold text-primary-500 leading-none">
                  $50,000
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  per accident
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed border-t border-gray-100 pt-4">
                Required in Illinois and critical — an estimated 12–14% of
                Illinois drivers are uninsured. This protects you and your
                passengers when the at-fault driver has no coverage.
              </p>
            </div>
          </div>

          <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary mb-1">
                State minimums are a starting point, not a finish line.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Illinois minimums were last updated in 2009 and don't reflect
                today's medical costs or vehicle values. If you cause a serious
                accident and your coverage runs out, you're personally liable
                for the rest. Our agents will show you how affordable better
                coverage can be — often just a few dollars more per month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Affects Your Auto Insurance Rate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Activity className="w-4 h-4" />
              Rate Factors
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              What Affects Your Auto Insurance Rate?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Insurance pricing can feel like a black box. Here's exactly what
              carriers look at — and how our agents use that knowledge to find
              you the best rate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rateFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                    {factor.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auto Insurance FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4" />
              Common Questions
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Auto Insurance FAQs
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Straight answers to the questions Springfield drivers ask us most.
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-cream/40 transition-colors"
                  >
                    <span className="font-heading font-bold text-text-primary text-base leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-text-secondary leading-relaxed text-sm border-t border-gray-100 pt-4">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-text-secondary mb-4">
              Have a question not covered here? Our agents are happy to talk
              through your specific situation.
            </p>
            <a
              href="tel:+12179608997"
              className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 font-semibold px-6 py-3 rounded-xl transition-all hover:bg-cream"
            >
              <Phone className="w-4 h-4" />
              Call (217) 960-8997
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Start Saving on Auto Insurance Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of Springfield drivers who trust Kover King to find
            them the best rates.
          </p>
          <QuoteDialog defaultInsuranceType="Auto">
            <button className="inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Get Your Free Auto Quote
              <ArrowRight className="w-5 h-5" />
            </button>
          </QuoteDialog>
        </div>
      </section>
    </div>
  );
}
