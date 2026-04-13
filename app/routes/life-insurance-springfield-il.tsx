import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  TrendingUp,
  CheckCircle2,
  Phone,
  ArrowRight,
  PiggyBank,
  ShieldCheck,
  DollarSign,
  ChevronDown,
  MapPin,
  GraduationCap,
  Home,
  Clock,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/life-insurance-springfield-il")({
  head: () => ({
    meta: [
      {
        title:
          "Life Insurance Springfield IL | Term & Whole Life Quotes | Kover King",
      },
      {
        name: "description",
        content:
          "Compare Springfield IL life insurance from 30+ carriers. Term life, whole life, universal & final expense policies. Free quotes — call (217) 960-8997.",
      },
      {
        property: "og:title",
        content:
          "Life Insurance Springfield IL | Term & Whole Life Quotes | Kover King",
      },
      {
        property: "og:description",
        content:
          "Compare Springfield IL life insurance from 30+ carriers. Term life, whole life, universal & final expense policies. Free quotes — call (217) 960-8997.",
      },
      {
        name: "keywords",
        content:
          "life insurance Springfield IL, term life insurance Springfield Illinois, whole life insurance Springfield, final expense insurance Springfield IL, life insurance quotes Springfield",
      },
    ],
  }),
  component: LifeSpringfieldPage,
});

const policyTypes = [
  {
    icon: Clock,
    title: "Term Life Insurance",
    badge: "Most Popular",
    badgeColor: "bg-primary-500 text-white",
    description:
      "Fixed coverage for 10, 20, or 30 years — the most affordable way to protect your Springfield family during the years they need it most.",
    bestFor: "Young families, mortgage protection, income replacement",
    features: [
      "Lowest premium for highest coverage amount",
      "10, 15, 20, or 30-year term options",
      "Premiums locked for the full term",
      "Convertible to permanent policy at term end",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Whole Life Insurance",
    badge: "Lifelong Coverage",
    badgeColor: "bg-cream text-primary-500",
    description:
      "Permanent protection that lasts your entire lifetime, with a guaranteed death benefit and tax-deferred cash value that grows over time.",
    bestFor: "Estate planning, final expenses, lifelong dependents",
    features: [
      "Coverage that never expires",
      "Builds guaranteed cash value",
      "Tax-deferred cash value growth",
      "Borrow against cash value if needed",
    ],
  },
  {
    icon: TrendingUp,
    title: "Universal Life Insurance",
    badge: "Flexible",
    badgeColor: "bg-cream text-primary-500",
    description:
      "Flexible permanent coverage with adjustable premiums and interest-linked cash value growth — ideal for long-term planning.",
    bestFor: "Flexibility seekers, long-term wealth accumulation",
    features: [
      "Adjustable premium payments",
      "Flexible death benefit amount",
      "Cash value tied to interest rates",
      "Potential for greater growth than whole life",
    ],
  },
  {
    icon: Heart,
    title: "Final Expense Insurance",
    badge: "Simplified Issue",
    badgeColor: "bg-cream text-primary-500",
    description:
      "Smaller whole life policies designed to cover funeral, burial, and end-of-life costs so your loved ones aren't left with the bill.",
    bestFor: "Adults 50+, budget-conscious applicants, no-exam coverage",
    features: [
      "Coverage from $5,000 to $25,000",
      "No medical exam required",
      "Approval often within 24–48 hours",
      "Premiums never increase",
    ],
  },
];

const localReasons = [
  {
    icon: DollarSign,
    title: "Protect Springfield's Median Income",
    description:
      "The median household income in Springfield is approximately $54,000. A 20-year term policy at 10–12× income — around $540,000–$650,000 — ensures your family maintains their standard of living if you're gone.",
  },
  {
    icon: Home,
    title: "Mortgage Protection for Springfield Homes",
    description:
      "With Springfield's median home price around $145,000–$165,000, a term policy can cover your mortgage balance and keep your family in their home without financial stress.",
  },
  {
    icon: GraduationCap,
    title: "College Planning — UIS, LLCC & U of I",
    description:
      "Springfield families sending kids to UIS, Lincoln Land Community College, or the University of Illinois at Urbana-Champaign face real education costs. Life insurance ensures those plans stay on track.",
  },
  {
    icon: PiggyBank,
    title: "Springfield's Cost of Living Advantage",
    description:
      "Springfield's cost of living runs roughly 10–15% below the national average — meaning your insurance dollar goes further here, and coverage is more affordable than in larger Illinois cities.",
  },
];

const coverageGuide = [
  {
    label: "Median Income Replacement",
    detail: "$54,000 × 10 years",
    value: "$540,000",
  },
  {
    label: "Average Springfield Mortgage Payoff",
    detail: "Median home ~$155,000",
    value: "$155,000",
  },
  {
    label: "Education — 2 Kids (UIS / LLCC)",
    detail: "$25,000–$80,000 per child",
    value: "$160,000",
  },
  {
    label: "Outstanding Debt (auto, cards, loans)",
    detail: "National average",
    value: "$50,000",
  },
  {
    label: "Final Expenses",
    detail: "Funeral, burial, medical",
    value: "$15,000",
  },
];

const pricingExamples = [
  { profile: "Healthy 25-year-old, 20-yr term", coverage: "$500,000", rate: "~$18/mo" },
  { profile: "Healthy 35-year-old, 20-yr term", coverage: "$500,000", rate: "~$25/mo" },
  { profile: "Healthy 45-year-old, 20-yr term", coverage: "$500,000", rate: "~$55/mo" },
  { profile: "Healthy 55-year-old, 10-yr term", coverage: "$250,000", rate: "~$70/mo" },
  { profile: "Final expense, age 65, no exam", coverage: "$15,000", rate: "~$60/mo" },
];

const faqs = [
  {
    question: "How much does life insurance cost for Springfield, IL residents?",
    answer:
      "Rates in Springfield are determined by your age, health, coverage amount, and policy type — not your location. A healthy 35-year-old can secure a $500,000, 20-year term policy for approximately $25/month. Given Springfield's lower cost of living, many families find quality coverage well within their budget. Our agents compare 30+ carriers to find your best rate.",
  },
  {
    question: "What's the right amount of life insurance for a Springfield family?",
    answer:
      "A common rule of thumb is 10–12× your annual income. For a Springfield household earning $54,000, that's roughly $540,000–$650,000. Add your mortgage balance (~$155,000 for a typical Springfield home), any outstanding debt, and estimated education costs for your children (UIS tuition runs around $10,000–$14,000/year in-state). Our agents walk you through a free needs analysis.",
  },
  {
    question: "Are there no-exam life insurance options available in Springfield?",
    answer:
      "Yes. Many carriers offer simplified issue policies that require only a health questionnaire — no blood draw or physical exam. These are available through Kover King and are ideal if you want fast approval or have health concerns. Coverage can often be approved within 24–48 hours. Fully underwritten policies (with an exam) typically offer lower rates for healthy applicants.",
  },
  {
    question: "Can Springfield residents with pre-existing conditions get life insurance?",
    answer:
      "In most cases, yes. Conditions like type 2 diabetes, controlled high blood pressure, or a history of cancer don't automatically disqualify you. Different carriers underwrite health conditions differently, which is why working with an independent agent who shops 30+ carriers matters. We find carriers who specialize in your specific health profile.",
  },
  {
    question: "Is final expense insurance a good option for Springfield seniors?",
    answer:
      "Final expense insurance is a popular choice for Springfield residents age 55 and older who want to cover funeral and burial costs without burdening their family. Policies typically range from $5,000 to $25,000, require no medical exam, and premiums never increase. Funerals in Springfield average $8,000–$12,000, and a final expense policy ensures that cost is covered.",
  },
  {
    question: "How do I choose between term and whole life insurance?",
    answer:
      "Term life is best for most Springfield families who need maximum coverage at the lowest cost during their prime earning and family-raising years. Whole life makes sense if you want lifelong coverage, are using it for estate planning, or want a savings component. Our agents will show you side-by-side quotes and explain the trade-offs with no pressure — you decide what fits your budget and goals.",
  },
];

function LifeSpringfieldPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              Life Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Life Insurance in{" "}
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Springfield families deserve life insurance coverage that fits
              their lives and their budget. We compare term life, whole life,
              universal, and final expense policies from 30+ A-rated carriers —
              so you get the right protection at the right price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Life">
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
            <p className="text-sm text-text-secondary mt-5">
              Local Springfield agents · No obligation · Quotes in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Why Springfield Families Need Life Insurance */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Why Springfield Families Need Life Insurance
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Life insurance isn't just a policy — it's a plan for your family's
              financial future. Here's what Springfield residents are protecting.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {localReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Policy Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Life Insurance Policies Available in Springfield
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We offer every major policy type so you can choose the coverage
              that fits your stage of life and financial goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {policyTypes.map((policy) => {
              const Icon = policy.icon;
              return (
                <div
                  key={policy.title}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="bg-surface p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${policy.badgeColor}`}
                      >
                        {policy.badge}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-text-primary mb-1.5">
                      {policy.title}
                    </h3>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                        Best For
                      </span>
                      <p className="text-xs text-text-secondary mt-1">
                        {policy.bestFor}
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {policy.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-text-secondary"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Much Coverage Do Springfield Families Need */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                How Much Coverage Do Springfield Families Need?
              </h2>
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                A quick rule of thumb: aim for{" "}
                <span className="font-bold text-primary-500">10–12× your annual income</span>.
                For a typical Springfield household earning around $54,000,
                that's $540,000–$650,000 in coverage. But your actual needs
                depend on your mortgage, debts, and education goals.
              </p>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                Here's how a typical Springfield family might break down their
                coverage needs:
              </p>

              <div className="space-y-3 mb-6">
                {coverageGuide.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 bg-white rounded-xl px-5 py-3.5 border border-gray-100 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {item.label}
                      </p>
                      <p className="text-xs text-text-secondary">{item.detail}</p>
                    </div>
                    <span className="text-sm font-bold text-primary-500 whitespace-nowrap">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-primary-500 rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">
                    Springfield Family Example Total
                  </p>
                  <p className="font-heading font-extrabold text-2xl">
                    ~$920,000 suggested coverage
                  </p>
                </div>
                <DollarSign className="w-9 h-9 text-white/30 shrink-0" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                  Local Schools That Factor Into Education Planning
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      school: "UIS (University of Illinois Springfield)",
                      cost: "~$10,500–$14,000/yr in-state",
                    },
                    {
                      school: "Lincoln Land Community College",
                      cost: "~$4,500–$6,000/yr",
                    },
                    {
                      school: "U of I Urbana-Champaign",
                      cost: "~$16,000–$20,000/yr in-state",
                    },
                  ].map((item) => (
                    <li key={item.school} className="flex items-start gap-3">
                      <GraduationCap className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {item.school}
                        </p>
                        <p className="text-xs text-text-secondary">{item.cost}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cream rounded-2xl p-6 border border-primary-500/20">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Every Year You Wait Costs More
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  Life insurance premiums rise approximately{" "}
                  <span className="font-bold text-primary-500">8–10% per year of age</span>.
                  A $500,000 policy purchased at 30 can cost $40–50% less over
                  20 years than the same policy bought at 35. Lock in your rate now.
                </p>
                <QuoteDialog defaultInsuranceType="Life">
                  <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all w-full cursor-pointer">
                    Get My Springfield Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Factors That May Reduce Coverage Needed
                </h3>
                <ul className="space-y-2">
                  {[
                    "Spouse's income and earning potential",
                    "Existing savings, 401(k), or investments",
                    "Employer-provided group life (usually 1–2× salary)",
                    "Social Security survivor benefits",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affordable Life Insurance — Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Affordable Life Insurance for Springfield Residents
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Life insurance is more affordable than most people expect. Below
              are sample monthly rates for healthy applicants — your actual rate
              depends on age, health, and coverage amount.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Pricing table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="bg-primary-500 px-6 py-4">
                <h3 className="font-heading font-bold text-white text-base">
                  Sample Monthly Rates — Healthy Applicants
                </h3>
              </div>
              <div className="bg-white divide-y divide-gray-100">
                {pricingExamples.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {row.profile}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {row.coverage} coverage
                      </p>
                    </div>
                    <span className="font-heading font-extrabold text-primary-500 text-lg whitespace-nowrap">
                      {row.rate}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-surface px-6 py-3">
                <p className="text-xs text-text-secondary">
                  * Sample rates only. Final rates depend on full underwriting.
                </p>
              </div>
            </div>

            {/* How to save */}
            <div className="space-y-5">
              <h3 className="font-heading text-xl font-bold text-text-primary">
                How Springfield Residents Can Save on Life Insurance
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "Buy younger — lock in a low rate",
                    detail:
                      "Premiums rise 8–10% per year of age. Buying at 30 vs. 35 can save hundreds per year.",
                  },
                  {
                    title: "Choose term life for pure protection",
                    detail:
                      "Term policies provide the highest coverage for the lowest monthly premium.",
                  },
                  {
                    title: "Maintain or improve your health",
                    detail:
                      "Nonsmokers save up to 50% over smokers. A healthy BMI and controlled blood pressure also reduce rates.",
                  },
                  {
                    title: "Pay annually instead of monthly",
                    detail:
                      "Many carriers offer a 3–5% discount when you pay your premium annually.",
                  },
                  {
                    title: "No-exam options for fast, affordable coverage",
                    detail:
                      "Simplified issue policies skip the medical exam and can be approved in 24–48 hours.",
                  },
                ].map((tip) => (
                  <li key={tip.title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {tip.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {tip.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-primary-500 rounded-2xl p-6 text-white">
                <Heart className="w-8 h-8 text-white mb-3" />
                <h4 className="font-heading font-bold text-lg mb-2">
                  Compare 30+ Carriers — Free
                </h4>
                <p className="text-white/80 text-sm mb-4">
                  Our independent agents shop across 30+ A-rated carriers to
                  find your lowest available rate. No cost, no obligation.
                </p>
                <div className="space-y-2">
                  <QuoteDialog defaultInsuranceType="Life">
                    <button className="flex items-center justify-center gap-2 w-full bg-white text-primary-500 hover:bg-cream font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer">
                      Get My Free Life Quote
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </QuoteDialog>
                  <a
                    href="tel:+12179608997"
                    className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/30 text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Call (217) 960-8997
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Life Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary">
              Common questions from Springfield residents shopping for life
              insurance coverage.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface transition-colors"
                  >
                    <span className="font-heading font-bold text-text-primary text-base leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-text-secondary text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-text-secondary mb-4">
              Have more questions? Our Springfield agents are ready to help.
            </p>
            <a
              href="tel:+12179608997"
              className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-cream"
            >
              <Phone className="w-5 h-5" />
              Call (217) 960-8997
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Protect Your Springfield Family Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get a free life insurance quote from local Springfield agents who
            know this community. No obligation, no pressure — just honest
            guidance and competitive rates from 30+ carriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Life">
              <button className="inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get a Free Life Insurance Quote
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
