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
  Snowflake,
  CloudRain,
  Tag,
  Percent,
  Users,
  GraduationCap,
  Shield,
} from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/auto-insurance-springfield-il")({
  head: () => ({
    meta: [
      {
        title:
          "Auto Insurance Springfield IL | Compare Car Insurance Rates | Kover King",
      },
      {
        name: "description",
        content:
          "Compare Springfield IL auto insurance from 30+ carriers. Save on liability, collision & comprehensive coverage. Free quotes — call (217) 960-8997.",
      },
      {
        name: "keywords",
        content:
          "auto insurance Springfield IL, car insurance Springfield, cheap car insurance Springfield Illinois, liability insurance Springfield IL",
      },
      {
        property: "og:title",
        content:
          "Auto Insurance Springfield IL | Compare Car Insurance Rates | Kover King",
      },
      {
        property: "og:description",
        content:
          "Compare Springfield IL auto insurance from 30+ carriers. Save on liability, collision & comprehensive coverage. Free quotes — call (217) 960-8997.",
      },
    ],
  }),
  component: AutoInsuranceSpringfieldILPage,
});

const springfieldFacts = [
  {
    label: "Illinois Minimum Liability",
    value: "25/50/20",
    sub: "bodily injury & property damage",
    note: "State-mandated floor — most Springfield drivers need higher limits to protect their assets.",
  },
  {
    label: "Avg. Springfield Annual Premium",
    value: "~$1,340",
    sub: "vs. ~$1,260 Illinois statewide avg.",
    note: "Sangamon County's mix of urban commuting and rural highway driving pushes rates slightly above the state average.",
  },
  {
    label: "Illinois Uninsured Driver Rate",
    value: "~13%",
    sub: "of drivers carry no coverage",
    note: "Roughly 1 in 8 drivers on I-55, I-72, and Springfield surface streets is uninsured — making UM/UIM coverage essential.",
  },
  {
    label: "Top Central IL Claim Types",
    value: "3 of 4",
    sub: "claims involve weather or wildlife",
    note: "Deer collisions peak Oct–Dec in Sangamon County; spring hailstorms and winter ice are perennial claim drivers.",
  },
];

const coverageCards = [
  {
    icon: ShieldCheck,
    title: "Liability Coverage",
    highlight: "Required by Illinois Law",
    description:
      "Pays for injuries and property damage you cause to others in an at-fault accident. Illinois minimums (25/50/20) are a legal floor — a single serious crash can far exceed them. We'll show you how much better protection costs per month.",
  },
  {
    icon: Car,
    title: "Collision Coverage",
    highlight: "Vehicle Repair Protection",
    description:
      "Covers damage to your own vehicle after a crash with another car, a guardrail, or a pothole — regardless of fault. Required by most lenders and leasing companies, and worth carrying on any vehicle you couldn't afford to replace out of pocket.",
  },
  {
    icon: AlertTriangle,
    title: "Comprehensive Coverage",
    highlight: "Non-Collision Events",
    description:
      "Protects against hail, deer strikes, flooding, fire, theft, and vandalism. In Central Illinois, where spring hailstorms and Sangamon County deer crossings are a fact of life, comprehensive is one of the most-used coverages we write.",
  },
  {
    icon: UserX,
    title: "Uninsured / Underinsured Motorist",
    highlight: "Critical in Springfield",
    description:
      "With roughly 13% of Illinois drivers uninsured, UM/UIM coverage is your safety net when the at-fault driver can't pay your bills. It covers your medical expenses, lost wages, and passenger injuries when the other driver has no — or too little — coverage.",
  },
];

const drivingRisks = [
  {
    icon: Snowflake,
    title: "Winter Ice on I-55 & City Streets",
    description:
      "Springfield averages 18–22 inches of snow per year, and the stretch of I-55 through Sangamon County is notorious for black ice in January and February. Multi-car pileups on I-55 near Chatham Road and the Springfield exits spike claim volume every winter.",
  },
  {
    icon: Activity,
    title: "Deer Crossings in Sangamon County",
    description:
      "Sangamon County ranks among the higher-risk Illinois counties for deer-vehicle collisions. Collisions peak between October and December, especially at dusk and dawn along rural corridors connecting Springfield to Rochester, Chatham, and Auburn.",
  },
  {
    icon: AlertTriangle,
    title: "Construction Zones on I-72",
    description:
      "IDOT's ongoing I-72 corridor work between Springfield and Decatur creates frequent lane shifts, reduced speeds, and stop-and-go congestion. Rear-end collisions in construction zones carry elevated liability because penalties — and repair costs — are higher.",
  },
  {
    icon: CloudRain,
    title: "Spring Flooding on Low-Lying Roads",
    description:
      "The Sangamon River floodplain affects several Springfield-area roads and underpasses during heavy spring rains. Flood-damaged vehicles are covered under comprehensive — not collision — making this an important distinction when reviewing your policy.",
  },
  {
    icon: Car,
    title: "High-Traffic Corridors",
    description:
      "Dirksen Parkway, Veterans Parkway, and Wabash Avenue handle the highest daily traffic volumes in Springfield. Intersection accidents, aggressive merges at the I-55/I-72 interchange, and congestion near White Oaks Mall generate significant claim activity year-round.",
  },
  {
    icon: MapPin,
    title: "Route 66 Tourism Traffic",
    description:
      "Historic Route 66 runs through Springfield, drawing out-of-state visitors unfamiliar with local roads, particularly around downtown and the Lincoln sites. Mixed traffic patterns on Old Route 66 increase the risk of low-speed collisions and parking lot incidents.",
  },
];

const discounts = [
  {
    icon: Shield,
    title: "Good Driver Discount",
    description:
      "Three or more years without an at-fault accident or moving violation typically unlocks the largest single discount available — often 10–20% depending on the carrier.",
  },
  {
    icon: Car,
    title: "Multi-Vehicle Discount",
    description:
      "Insuring two or more vehicles on the same policy generates meaningful savings. Springfield households with multiple drivers or vehicles should always bundle — splitting vehicles across carriers almost always costs more.",
  },
  {
    icon: ShieldCheck,
    title: "Home + Auto Bundle",
    description:
      "Combining your homeowners or renters insurance with your auto policy is one of the fastest ways to lower both premiums. We compare bundle packages across carriers to maximize total savings.",
  },
  {
    icon: GraduationCap,
    title: "Good Student Discount",
    description:
      "Full-time students with a B average (3.0 GPA) or better qualify for discounts at most carriers — typically 5–15% off. Applies through age 25 at many companies, covering UIS students and recent grads.",
  },
  {
    icon: Star,
    title: "Military & Veterans Discount",
    description:
      "Active duty military, veterans, and qualifying family members receive preferential rates at several carriers we work with. Springfield's proximity to Camp Lincoln and a strong veteran community makes this a frequently-used discount.",
  },
  {
    icon: TrendingDown,
    title: "Low Mileage / Telematics",
    description:
      "Driving fewer than 7,500 miles per year, or enrolling in a usage-based program, can cut premiums significantly. If you work from home or have a short Springfield commute, you may be leaving money on the table with a standard mileage rating.",
  },
  {
    icon: Percent,
    title: "Paid-in-Full & Paperless",
    description:
      "Paying your six-month or annual premium upfront eliminates installment fees and often triggers an additional discount. Going paperless adds a small but easy saving that stacks with other discounts.",
  },
  {
    icon: Users,
    title: "Loyalty & Prior Insurance",
    description:
      "Continuous coverage history — even with a different carrier — signals low risk and unlocks loyalty pricing. Shopping at renewal with an existing policy in force will always yield better rates than shopping after a lapse.",
  },
];

const serviceAreas = [
  "Springfield",
  "Chatham",
  "Rochester",
  "Sherman",
  "Leland Grove",
  "Riverton",
  "Williamsville",
  "Pawnee",
  "Auburn",
  "Virden",
  "Taylorville",
  "Lincoln",
  "Sangamon County",
  "Menard County",
  "Logan County",
  "Christian County",
];

const faqItems = [
  {
    question:
      "How much does auto insurance cost in Springfield, IL on average?",
    answer:
      "Springfield drivers pay roughly $1,340 per year on average for auto insurance — slightly above the statewide Illinois average of around $1,260. Several local factors push costs up: Sangamon County's above-average deer-collision rate, I-55 and I-72 highway accident data, and Springfield's mix of urban intersection traffic and rural road exposure. Your actual rate depends heavily on your driving record, vehicle, coverage levels, and which carriers we're able to compare for you. Many Springfield drivers who come to us as single-carrier customers find savings of $400–$700 per year.",
  },
  {
    question: "Is uninsured motorist coverage required in Illinois?",
    answer:
      "Yes. Illinois law requires all auto insurance policies to include uninsured motorist (UM) coverage at minimums of $25,000 per person and $50,000 per accident. You can waive underinsured motorist (UIM) coverage in writing, but our agents almost always recommend keeping it. With roughly 13% of Illinois drivers carrying no insurance, and many more carrying only state-minimum liability, UM/UIM is your protection when the at-fault driver can't cover your medical bills or vehicle repairs. It's one of the most affordable coverages you can add.",
  },
  {
    question:
      "Does my auto insurance cover deer collisions in Sangamon County?",
    answer:
      "Yes — but only if you carry comprehensive coverage. Hitting a deer is classified as a 'non-collision' event under most auto policies, which means collision coverage does NOT apply. Comprehensive coverage handles deer strikes, along with hail damage, flooding, fire, theft, and vandalism. Given Sangamon County's deer-collision rates — particularly in fall and early winter along rural roads connecting Springfield to Chatham, Rochester, and Auburn — comprehensive is strongly recommended for most local drivers.",
  },
  {
    question:
      "What should I do if I'm in an accident on I-55 or I-72 near Springfield?",
    answer:
      "First, move to safety if possible and call 911 — Illinois requires reporting accidents that result in injury or more than $1,500 in property damage. Document the scene with photos, collect the other driver's insurance information, and get contact info from any witnesses. Notify your insurance carrier as soon as possible — delays can complicate claims. If you're a Kover King client, call us directly and we'll help you navigate the claims process with your carrier. If the other driver is uninsured, your UM coverage will be critical.",
  },
  {
    question: "Can I get same-day auto insurance coverage in Springfield?",
    answer:
      "Yes. In most cases, we can bind a new auto policy the same day you call — sometimes within the hour. Once we identify the right carrier and coverage for your situation, your policy is issued immediately and proof of insurance is emailed to you within minutes. This is especially useful if you've just purchased a vehicle or are switching coverage at renewal. Call us at (217) 960-8997 and we'll get you covered quickly.",
  },
  {
    question: "Does my Springfield address affect my auto insurance rate?",
    answer:
      "Yes, your ZIP code is one of the factors carriers use to calculate your premium. Areas with higher claim frequency, theft rates, or traffic density are rated higher. Within the Springfield metro, ZIP codes on the east side near Dirksen Parkway and high-traffic commercial corridors may see slightly different rates than lower-density areas like Leland Grove or Chatham. As independent agents, we compare how each of our 30+ carriers rates your specific address — rates for the same driver can vary by hundreds of dollars depending on the carrier.",
  },
];

function AutoInsuranceSpringfieldILPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              Springfield, Illinois Auto Insurance
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-text-primary">
              Auto Insurance in{" "}
              <span className="text-primary-500">Springfield, Illinois</span>
            </h1>
            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Whether you're commuting on I-55, running errands on Veterans
              Parkway, or navigating the historic Route 66 corridor through
              downtown, Springfield drivers face real risks every day.
            </p>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Kover King compares rates from 30+ carriers to find you the right
              coverage for Central Illinois roads — at a price that makes sense
              for your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteDialog defaultInsuranceType="Auto">
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

      {/* Stats Banner */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-white text-center">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">30+</div>
                <div className="text-sm font-medium opacity-90">
                  carriers compared
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">
                  $600+
                </div>
                <div className="text-sm font-medium opacity-90">
                  avg. annual savings
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">
                  Same day
                </div>
                <div className="text-sm font-medium opacity-90">
                  coverage available
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold text-2xl leading-none">
                  Local
                </div>
                <div className="text-sm font-medium opacity-90">
                  Springfield agents
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Springfield IL Auto Insurance Facts */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <FileText className="w-4 h-4" />
              Local Insurance Facts
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield IL Auto Insurance: What You Should Know
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Understanding local data helps you make smarter coverage
              decisions. Here's what the numbers say about auto insurance in
              Sangamon County.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {springfieldFacts.map((fact) => (
              <div
                key={fact.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <span className="inline-block text-xs font-semibold text-primary-500 bg-cream px-3 py-1 rounded-full mb-4">
                  {fact.label}
                </span>
                <div className="font-heading text-3xl font-extrabold text-primary-500 leading-none mb-1">
                  {fact.value}
                </div>
                <div className="text-text-secondary text-sm mb-4">
                  {fact.sub}
                </div>
                <p className="text-text-secondary text-xs leading-relaxed border-t border-gray-100 pt-4">
                  {fact.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Auto Coverage Options for Springfield Drivers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every driver's situation is different. We'll build a policy that
              covers what matters for your vehicle, your family, and your
              Central Illinois commute.
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
        </div>
      </section>

      {/* Springfield Driving Risks */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4" />
              Local Risk Factors
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Springfield Driving Risks That Affect Your Coverage
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Springfield's geography, weather, and road network create specific
              risks that smart drivers insure against. Here's what drives claims
              in Sangamon County.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivingRisks.map((risk) => {
              const Icon = risk.icon;
              return (
                <div
                  key={risk.title}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-text-primary mb-2">
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

      {/* Springfield Area Discounts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Tag className="w-4 h-4" />
              Save More in Springfield
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Auto Insurance Discounts for Springfield Drivers
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Most drivers qualify for more discounts than they realize. Our
              agents stack every applicable discount across 30+ carriers to
              build your lowest legitimate rate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discounts.map((discount) => {
              const Icon = discount.icon;
              return (
                <div
                  key={discount.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                    {discount.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {discount.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary mb-1">
                Discounts vary by carrier — that's why comparison shopping matters.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                One carrier might offer a 15% good-driver discount while another
                gives 22% for the same record. As independent agents, we identify
                which carriers rate your specific profile most favorably — and stack
                every discount you qualify for to get to your lowest real-world rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
              Serving Springfield & Surrounding Communities
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We write auto insurance for drivers throughout Springfield, the
              greater Sangamon County area, and neighboring counties across
              Central Illinois.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-1.5 bg-white border border-gray-100 text-primary-500 font-medium px-4 py-2 rounded-full text-sm shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                {area}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Don't see your town?{" "}
              <a
                href="tel:+12179608997"
                className="text-primary-500 font-semibold hover:underline"
              >
                Call us at (217) 960-8997
              </a>{" "}
              — we write policies throughout Illinois.
            </p>
          </div>
        </div>
      </section>

      {/* Quote CTA Card */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-4">
                  Ready to Compare Springfield IL Auto Insurance Rates?
                </h2>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Our independent agents will compare rates from 30+ carriers,
                  apply every discount you qualify for, and present you with
                  options — no pressure, no hidden fees, no runaround. Most
                  quotes are ready in under 10 minutes.
                </p>
                <ul className="space-y-3">
                  {[
                    "Free, no-obligation rate comparison",
                    "Coverage effective same day in most cases",
                    "Local agents who know Springfield roads",
                    "Policy review and claims support included",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <QuoteDialog defaultInsuranceType="Auto">
                  <button className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-4 rounded-xl text-lg transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] cursor-pointer">
                    Get My Free Quote
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </QuoteDialog>
                <a
                  href="tel:+12179608997"
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary-500 text-primary-500 font-semibold px-6 py-4 rounded-xl text-lg transition-all hover:bg-cream"
                >
                  <Phone className="w-5 h-5" />
                  Call (217) 960-8997
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4" />
              Springfield-Specific Questions
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Auto Insurance FAQs for Springfield, IL Drivers
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Local questions get local answers. Here's what Springfield-area
              drivers ask us most.
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
              Have a question about your specific situation? Our Springfield
              agents are ready to help.
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
            Springfield Drivers: Get Your Free Auto Insurance Quote Today
          </h2>
          <p className="text-white/80 text-lg mb-2">
            Compare rates from 30+ carriers. Find the right coverage for
            Central Illinois roads.
          </p>
          <p className="text-white/70 text-base mb-8">
            I-55 · I-72 · Route 66 · Dirksen Pkwy · Veterans Pkwy · Sangamon County
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QuoteDialog defaultInsuranceType="Auto">
              <button className="inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-cream font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                Get My Free Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </QuoteDialog>
            <a
              href="tel:+12179608997"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-white/10"
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
