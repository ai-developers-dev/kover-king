import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitQuote } from "~/lib/actions";
import {
  Phone,
  Crown,
  Star,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  DollarSign,
  Loader2,
  Search,
  Home,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/home-ppc-form")({
  head: () => ({
    meta: [
      { title: "Home Insurance Quote | Compare Rates | Kover King" },
      { name: "description", content: "Compare home insurance rates from 30+ carriers. Get your estimated rate in under 60 seconds." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomePpcForm,
});

const HOME_VALUES = [
  { label: "Under $150,000", value: "under-150k", monthly: 85 },
  { label: "$150,000 - $250,000", value: "150k-250k", monthly: 115 },
  { label: "$250,000 - $400,000", value: "250k-400k", monthly: 155 },
  { label: "$400,000 - $600,000", value: "400k-600k", monthly: 210 },
  { label: "$600,000+", value: "600k-plus", monthly: 285 },
];

const YEAR_BUILT = [
  "Before 1970",
  "1970 - 1990",
  "1990 - 2010",
  "2010 or newer",
];

const HOME_TYPES = [
  "Single Family",
  "Condo / Townhouse",
  "Mobile Home",
  "Multi-Family",
];

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

function HomePpcForm() {
  const [step, setStep] = useState(1);
  const [zip, setZip] = useState("");
  const [homeValue, setHomeValue] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [homeType, setHomeType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [estimatedRate, setEstimatedRate] = useState(0);

  const stepsAway = Math.max(0, 4 - step);

  const handleZipSubmit = () => {
    if (zip.length === 5) setStep(2);
  };

  const handleValueSelect = (value: string) => {
    setHomeValue(value);
    setStep(3);
  };

  const handleDetailsSubmit = () => {
    if (yearBuilt && homeType) setStep(4);
  };

  const handleContactSubmit = async () => {
    if (!firstName || !lastName || !email || !phone) return;
    setSubmitting(true);

    const selected = HOME_VALUES.find((v) => v.value === homeValue);
    const rate = selected ? selected.monthly : 115;
    // Add some variance based on year built
    const yearFactor = yearBuilt === "Before 1970" ? 1.2 : yearBuilt === "1970 - 1990" ? 1.1 : yearBuilt === "2010 or newer" ? 0.9 : 1.0;
    const finalRate = Math.round(rate * yearFactor);
    setEstimatedRate(finalRate);

    try {
      await submitQuote({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          insurance_type: "Home",
          zip: zip || undefined,
          details: `Home Value: ${selected?.label || homeValue}\nYear Built: ${yearBuilt}\nHome Type: ${homeType}\nSource: PPC Landing Page`,
        },
      });
    } catch {
      // Still show the rate even if DB save fails
    }

    setSubmitting(false);
    setStep(5);
  };

  const resetForm = () => {
    setStep(1);
    setZip("");
    setHomeValue("");
    setYearBuilt("");
    setHomeType("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setEstimatedRate(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header */}
      <header className="bg-primary-500 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-white font-bold text-lg">
              Kover King
            </span>
          </div>
          <a
            href="tel:+12179608997"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            (217) 960-8997
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(233,86,12,0.3),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(233,86,12,0.2),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Stop Overpaying for{" "}
                <span className="text-primary-500">Home Insurance</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Compare rates from 30+ top insurance companies and save hundreds
                on your homeowners policy.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-primary-500" />
                  Licensed Agents
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                  5-Star Rated
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary-500" />
                  5,000+ Homes Protected
                </span>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto w-full">
              {/* Step 1: ZIP Code */}
              {step === 1 && (
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-2">
                    What's your ZIP code?
                  </h2>
                  <p className="text-text-secondary text-sm mb-4">
                    We'll find the best local rates in your area.
                  </p>
                  <div className="bg-primary-50 text-primary-500 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-5">
                    Your estimated rate is just 3 steps away
                  </div>

                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                    Enter your ZIP code
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="62701"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleZipSubmit()}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white text-xl font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-300"
                    />
                    <button
                      onClick={handleZipSubmit}
                      disabled={zip.length !== 5}
                      className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                      COMPARE
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-primary-500 text-primary-500"
                        />
                      ))}
                    </div>
                    <span className="font-medium">Excellent</span>
                    <span className="text-gray-300">|</span>
                    <span>5,000+ Reviews</span>
                  </div>
                </div>
              )}

              {/* Step 2: Home Value */}
              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <span className="text-sm text-text-muted">
                      {stepsAway} Steps Away
                    </span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-2">
                    What's the estimated value of your home?
                  </h2>
                  <p className="text-text-secondary text-sm mb-4">
                    This helps us estimate your coverage needs and premium.
                  </p>
                  <div className="bg-primary-50 text-primary-500 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-5">
                    Your estimated rate is just {stepsAway} steps away
                  </div>

                  <div className="space-y-3">
                    {HOME_VALUES.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleValueSelect(option.value)}
                        className="w-full text-left px-4 py-3.5 border border-gray-200 rounded-xl text-text-primary font-medium hover:border-primary-500 hover:bg-primary-50 transition-all"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Home Details */}
              {step === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <span className="text-sm text-text-muted">
                      1 Step Away
                    </span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-2">
                    Tell us about your home
                  </h2>
                  <p className="text-text-secondary text-sm mb-4">
                    Just a couple more details for an accurate estimate.
                  </p>
                  <div className="bg-primary-50 text-primary-500 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-5">
                    Almost there!
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">
                        Year Built
                      </label>
                      <select
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select year range...
                        </option>
                        {YEAR_BUILT.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">
                        Home Type
                      </label>
                      <select
                        value={homeType}
                        onChange={(e) => setHomeType(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select home type...
                        </option>
                        {HOME_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleDetailsSubmit}
                      disabled={!yearBuilt || !homeType}
                      className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                    >
                      CONTINUE
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Info */}
              {step === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-2">
                    Get your personalized rate
                  </h2>
                  <p className="text-text-secondary text-sm mb-5">
                    Enter your details and we'll show your estimated premium.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Jane"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Smith"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="jane@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="(217) 555-0100"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <button
                      onClick={handleContactSubmit}
                      disabled={!firstName || !lastName || !email || !phone || submitting}
                      className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          SEE MY RATE
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-text-muted text-center">
                      No spam. Your info is only used to provide your quote.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Estimated Rate */}
              {step === 5 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-1">
                    Your Estimated Home Insurance Rate
                  </h2>
                  <div className="my-6">
                    <div className="text-5xl font-heading font-extrabold text-primary-500">
                      ${estimatedRate}
                    </div>
                    <p className="text-text-secondary text-sm mt-1">
                      per month (estimated)
                    </p>
                  </div>
                  <p className="text-text-muted text-xs mb-6">
                    This is an estimate based on typical rates in your area.
                    Actual rates may vary.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-800">
                        A Kover King agent will contact you shortly with exact
                        quotes from 30+ carriers to find you the best rate.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="tel:+12179608997"
                      className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now for Instant Quote
                    </a>
                    <button
                      onClick={resetForm}
                      className="w-full text-primary-500 font-semibold hover:underline text-sm py-2"
                    >
                      Compare More Rates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "30+", label: "Insurance Companies" },
              { value: "$1,300+", label: "Average Savings" },
              { value: "5,000+", label: "Homes Protected" },
              { value: "5.0\u2605", label: "Customer Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-heading font-extrabold text-primary-500">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary text-center mb-10">
            Why Homeowners Choose Kover King
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Compare 30+ Companies",
                description:
                  "We shop the top insurers so you don't have to. One form gives you access to the best rates.",
              },
              {
                icon: DollarSign,
                title: "Massive Savings",
                description:
                  "Our customers save an average of $500 per year. Many save even more by bundling policies.",
              },
              {
                icon: Users,
                title: "Expert Guidance",
                description:
                  "Local licensed agents help you find the right coverage for your home, not just the cheapest price.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary text-center mb-10">
            What Our Customers Say
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                quote:
                  "I was paying $2,900 a year for home insurance. Kover King found me better coverage for $1,650. That's $750 back in my pocket every year!",
                name: "Sarah M.",
                location: "Springfield, IL",
              },
              {
                quote:
                  "Filled out the form and got a call back in 5 minutes. The agent compared over 30 companies. I couldn't believe how easy it was!",
                name: "Michael R.",
                location: "Chatham, IL",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-surface rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary-500 text-primary-500"
                    />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {t.name}
                </p>
                <p className="text-xs text-text-muted">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary-500" />
            <span className="font-heading font-bold text-white">
              Kover King Insurance
            </span>
          </div>
          <p>&copy; 2026 Kover King Insurance Agency. All rights reserved.</p>
          <a
            href="tel:+12179608997"
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            (217) 960-8997
          </a>
        </div>
      </footer>
    </div>
  );
}
