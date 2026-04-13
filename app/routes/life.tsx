import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  TrendingUp,
  RefreshCcw,
  CheckCircle2,
  Phone,
  ArrowRight,
  Users,
  PiggyBank,
  ShieldCheck,
  BadgeCheck,
  Clock,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/life")({
  head: () => ({
    meta: [
      {
        title:
          "Life Insurance Springfield IL | Term & Whole Life Quotes | Kover King",
      },
      {
        name: "description",
        content:
          "Term life, whole life, and universal life insurance in Springfield, IL. Protect your family's financial future.",
      },
      {
        property: "og:title",
        content:
          "Life Insurance Springfield IL | Term & Whole Life Quotes | Kover King",
      },
      {
        property: "og:description",
        content:
          "Term life, whole life, and universal life insurance in Springfield, IL. Protect your family's financial future.",
      },
    ],
  }),
  component: LifePage,
});

const planTypes = [
  {
    icon: Clock,
    title: "Term Life Insurance",
    badge: "Most Popular",
    badgeColor: "bg-primary-500 text-white",
    description:
      "Provides coverage for a set period — 10, 20, or 30 years. If you pass away during the term, your beneficiaries receive the death benefit. It's the most affordable way to get substantial coverage.",
    bestFor: "Young families, mortgage protection, income replacement",
    features: [
      "Lowest premium for highest coverage amount",
      "10, 15, 20, or 30-year term options",
      "Level premiums — rate locked for full term",
      "Convertible to permanent policy at term end",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Whole Life Insurance",
    badge: "Lifelong Coverage",
    badgeColor: "bg-cream text-primary-500",
    description:
      "Permanent coverage that lasts your entire lifetime, with a guaranteed death benefit and a cash value component that grows tax-deferred over time.",
    bestFor: "Estate planning, final expenses, lifelong dependents",
    features: [
      "Coverage that never expires",
      "Builds guaranteed cash value over time",
      "Tax-deferred cash value growth",
      "Can borrow against cash value if needed",
    ],
  },
  {
    icon: TrendingUp,
    title: "Universal Life Insurance",
    badge: "Flexible",
    badgeColor: "bg-cream text-primary-500",
    description:
      "A flexible permanent life insurance with adjustable premiums and death benefits. The cash value earns interest based on market rates, offering growth potential with lifelong protection.",
    bestFor: "Those wanting flexibility, long-term wealth accumulation",
    features: [
      "Adjustable premium payments",
      "Flexible death benefit amount",
      "Cash value tied to interest rates",
      "Potential for greater growth than whole life",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Family Income Replacement",
    description:
      "Replace your income so your family can maintain their standard of living, cover bills, and plan for the future if the unexpected happens.",
  },
  {
    icon: DollarSign,
    title: "Mortgage & Debt Protection",
    description:
      "Ensure your family doesn't lose their home. Life insurance can pay off your mortgage, eliminating that financial burden during an already difficult time.",
  },
  {
    icon: PiggyBank,
    title: "College Funding",
    description:
      "Use permanent life insurance as part of a long-term college savings strategy, or ensure a term policy covers your children's education years.",
  },
  {
    icon: BadgeCheck,
    title: "Final Expense Coverage",
    description:
      "Funeral and burial costs can exceed $15,000. A life insurance policy ensures your family isn't burdened with these expenses during their time of grief.",
  },
  {
    icon: RefreshCcw,
    title: "Business Succession",
    description:
      "Key person insurance and buy-sell agreements funded by life insurance protect your business partners and ensure smooth ownership transitions.",
  },
  {
    icon: TrendingUp,
    title: "Wealth Transfer",
    description:
      "Life insurance death benefits pass to beneficiaries income-tax-free, making it a powerful tool for transferring wealth across generations.",
  },
];

const comparisonRows = [
  {
    label: "Coverage Duration",
    term: "10–30 years",
    whole: "Lifetime",
    universal: "Lifetime",
  },
  {
    label: "Premium Cost",
    term: "Lowest",
    whole: "Highest",
    universal: "Moderate",
  },
  {
    label: "Cash Value",
    term: "None",
    whole: "Guaranteed growth",
    universal: "Market-based growth",
  },
  {
    label: "Premium Flexibility",
    term: "Fixed",
    whole: "Fixed",
    universal: "Flexible",
  },
  {
    label: "Best For",
    term: "Young families / mortgage",
    whole: "Estate planning / legacy",
    universal: "Flexibility seekers",
  },
  {
    label: "Typical Term",
    term: "10 / 20 / 30 yr",
    whole: "Lifetime",
    universal: "Lifetime",
  },
];

const faqs = [
  {
    question: "How much does life insurance cost?",
    answer:
      "Term life insurance for a healthy 30-year-old can start as low as $15–$25/month for a $500,000 policy. Rates vary based on age, health, coverage amount, and policy type. The younger and healthier you are when you apply, the lower your locked-in premium. Waiting just one year can increase your rate by 8–10%.",
  },
  {
    question: "Can I get life insurance with a pre-existing condition?",
    answer:
      "Yes — many carriers offer coverage even with conditions like diabetes, high blood pressure, or a history of cancer. Rates may be higher, and some policies may exclude certain conditions. We work with 30+ carriers to find the best options for your specific health history, including no-exam policies that may be a good fit.",
  },
  {
    question: "What is the difference between term and whole life insurance?",
    answer:
      "Term life covers you for a set period (10, 20, or 30 years) and pays a death benefit only if you pass away during that term — it's the most affordable option. Whole life covers you for your entire lifetime and includes a cash value component that grows tax-deferred over time. Whole life premiums are significantly higher, but the policy never expires.",
  },
  {
    question: "Do I need a medical exam to get life insurance?",
    answer:
      "Not always. Many carriers now offer simplified issue and guaranteed issue policies that require only a health questionnaire, no blood draw or physical exam required. These are ideal for people who want fast approval or have health concerns. Fully underwritten policies (with an exam) typically offer the lowest rates for healthy applicants.",
  },
  {
    question: "When should I buy life insurance?",
    answer:
      "The best time is as early as possible — ideally in your 20s or 30s when you're young and healthy. Key life events that signal it's time to buy: getting married, having children, buying a home, or starting a business. Rates increase 8–10% for every year you wait, so locking in coverage early can save thousands over the life of a policy.",
  },
  {
    question: "Can I have multiple life insurance policies?",
    answer:
      "Yes. Many people carry multiple policies — for example, a large term policy for income replacement plus a smaller whole life policy for final expenses or legacy planning. You can also layer term policies (a 30-year policy plus a 20-year policy) to match coverage to your changing needs over time.",
  },
  {
    question: "What happens if I outlive my term life policy?",
    answer:
      "If you outlive your term, the coverage simply ends and no benefit is paid. You have options: let the policy expire if you no longer need coverage, renew on a year-by-year basis (at higher rates), or convert to a permanent policy before the term ends — many term policies include a conversion rider that lets you do this without a new medical exam.",
  },
  {
    question: "How do I choose a beneficiary?",
    answer:
      "Your beneficiary is the person (or entity) who receives the death benefit. Most people name a spouse, children, or a trust. You can name multiple beneficiaries and assign percentages. Keep your beneficiary designation up to date after major life events like marriage, divorce, or the birth of a child — the designation on file with the insurer overrides your will.",
  },
];

function LifePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              Life Insurance — Springfield, IL
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Life Insurance in{" "}
              <span className="text-primary-500">Springfield, IL</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Protect your family's financial future with the right life
              insurance policy. We'll compare term, whole, and universal life
              options from 30+ carriers to find the coverage that fits your
              life.
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
          </div>
        </div>
      </section>

      {/* Plan Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Life Insurance Plans We Offer
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every family's needs and financial situation is different. We help
              you choose the right type of coverage and the right amount — no
              guesswork required.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {planTypes.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.title}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-surface p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${plan.badgeColor}`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                        Best For
                      </span>
                      <p className="text-sm text-text-secondary mt-1">
                        {plan.bestFor}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
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

      {/* Benefits Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Why Life Insurance Matters
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Life insurance isn't just about death — it's about ensuring your
              loved ones can live the life you've planned for them, no matter
              what happens.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
                How Much Life Insurance Do You Need?
              </h2>
              <p className="text-text-secondary text-lg mb-6">
                A common rule of thumb is 10–12 times your annual income, but
                your actual needs depend on your debts, dependents, income, and
                goals. Our agents walk you through the calculation.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "No-pressure consultation — we educate, you decide",
                  "Compare rates from 30+ A-rated life insurance carriers",
                  "Term quotes often available same day",
                  "Permanent policy analysis and illustrations provided",
                  "Help choosing beneficiaries and structuring your policy",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-500 rounded-2xl p-8 text-white">
              <Heart className="w-10 h-10 text-white mb-4" />
              <h3 className="font-heading text-2xl font-bold mb-2">
                Protect What Matters Most
              </h3>
              <p className="text-white/80 mb-6">
                A 20-year term policy for a healthy 35-year-old can start at
                under $25/month. Don't wait — rates increase with age and health
                changes.
              </p>
              <div className="space-y-3">
                <QuoteDialog defaultInsuranceType="Life">
                  <button className="flex items-center justify-center gap-2 w-full bg-white text-primary-500 hover:bg-cream font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                    Get My Free Life Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
                <a
                  href="tel:+12179608997"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all border border-white/30"
                >
                  <Phone className="w-4 h-4" />
                  Call (217) 960-8997
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Term vs. Whole vs. Universal Comparison */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Term vs. Whole vs. Universal Life
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Not sure which policy type is right for you? Here's a side-by-side
              breakdown of the three main types of life insurance.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="bg-primary-500 text-white">
                  <th className="text-left px-6 py-4 font-heading font-bold text-base w-1/4">
                    Feature
                  </th>
                  <th className="px-6 py-4 font-heading font-bold text-base text-center">
                    Term Life
                  </th>
                  <th className="px-6 py-4 font-heading font-bold text-base text-center">
                    Whole Life
                  </th>
                  <th className="px-6 py-4 font-heading font-bold text-base text-center">
                    Universal Life
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-surface"}
                  >
                    <td className="px-6 py-4 font-semibold text-text-primary">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-center text-text-secondary">
                      {row.term}
                    </td>
                    <td className="px-6 py-4 text-center text-text-secondary">
                      {row.whole}
                    </td>
                    <td className="px-6 py-4 text-center text-text-secondary">
                      {row.universal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {[
              { label: "Term Life", key: "term" as const, badge: "Most Popular" },
              { label: "Whole Life", key: "whole" as const, badge: "Lifelong" },
              { label: "Universal Life", key: "universal" as const, badge: "Flexible" },
            ].map((col) => (
              <div
                key={col.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-primary-500 px-5 py-3 flex items-center justify-between">
                  <span className="font-heading font-bold text-white text-lg">
                    {col.label}
                  </span>
                  <span className="text-xs bg-white/20 text-white font-semibold px-3 py-1 rounded-full">
                    {col.badge}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {comparisonRows.map((row) => (
                    <div key={row.label} className="px-5 py-3 flex justify-between gap-4">
                      <span className="text-sm font-semibold text-text-primary shrink-0">
                        {row.label}
                      </span>
                      <span className="text-sm text-text-secondary text-right">
                        {row[col.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIME Method */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              How Much Life Insurance Do You Need?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              The <span className="font-bold text-primary-500">DIME Method</span> is
              a simple framework financial advisors use to calculate the right
              coverage amount for your family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* DIME breakdown */}
            <div className="space-y-4">
              {[
                {
                  letter: "D",
                  label: "Debt",
                  description:
                    "Add up all outstanding debts — car loans, student loans, credit cards, personal loans. Your family shouldn't inherit your debt.",
                  example: "$45,000",
                },
                {
                  letter: "I",
                  label: "Income",
                  description:
                    "Multiply your annual income by the number of years your family needs support — typically 10–15 years.",
                  example: "$75,000 × 12 yrs = $900,000",
                },
                {
                  letter: "M",
                  label: "Mortgage",
                  description:
                    "Include your remaining mortgage balance so your family can stay in their home without financial strain.",
                  example: "$220,000",
                },
                {
                  letter: "E",
                  label: "Education",
                  description:
                    "Estimate college costs per child. Public university runs $100K–$150K; private can exceed $250K per child.",
                  example: "2 kids × $150,000 = $300,000",
                },
              ].map((item) => (
                <div
                  key={item.letter}
                  className="flex gap-4 bg-surface rounded-2xl p-5 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
                    <span className="font-heading font-extrabold text-white text-xl">
                      {item.letter}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-heading font-bold text-text-primary text-base">
                        {item.label}
                      </h3>
                      <span className="text-xs font-semibold text-primary-500 bg-cream px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.example}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="bg-primary-500 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-1">
                      Springfield Family Example Total
                    </p>
                    <p className="font-heading font-extrabold text-2xl">
                      $1,465,000 recommended coverage
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-white/30 shrink-0" />
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
                  Factors That Can Reduce Your Need
                </h3>
                <ul className="space-y-3">
                  {[
                    "Existing savings and investments (401k, IRA, emergency fund)",
                    "Spouse's income and earning potential",
                    "Social Security survivor benefits for your children",
                    "Employer-provided group life insurance (usually 1–2× salary)",
                    "Other assets that could be liquidated if needed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cream rounded-2xl p-6 border border-primary-500/20">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Act Now — Rates Rise Every Year
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  Life insurance premiums increase approximately{" "}
                  <span className="font-bold text-primary-500">8–10% for every year of age</span>{" "}
                  you wait. A policy you lock in at 30 could cost 40–50% less over 20 years
                  than the same policy purchased at 35.
                </p>
                <QuoteDialog defaultInsuranceType="Life">
                  <button className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all w-full cursor-pointer">
                    Lock In Your Rate Today
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </QuoteDialog>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                  Not Sure Where to Start?
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Our licensed agents will walk you through the DIME calculation
                  for free — no commitment required. We'll show you exactly what
                  coverage makes sense for your family's situation and budget.
                </p>
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
              Life Insurance FAQ
            </h2>
            <p className="text-lg text-text-secondary">
              Answers to the questions we hear most often from Springfield
              families shopping for life insurance.
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
              Still have questions? Our Springfield agents are here to help.
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
            Your Family's Financial Future Starts Here
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get a free life insurance quote today. No obligation, no pressure —
            just honest guidance from your local Springfield insurance experts.
          </p>
          <QuoteDialog defaultInsuranceType="Life">
            <button className="inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Get a Free Life Insurance Quote
              <ArrowRight className="w-5 h-5" />
            </button>
          </QuoteDialog>
        </div>
      </section>
    </div>
  );
}
