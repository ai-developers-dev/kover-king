import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Users,
  MapPin,
  Star,
  Heart,
  CheckCircle,
  Phone,
  ArrowRight,
  Building2,
  Award,
  Handshake,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About Kover King Insurance | Springfield IL Insurance Agency",
      },
      {
        name: "description",
        content:
          "Learn about Kover King Insurance — Springfield's trusted independent agency with over 30 years of experience serving Central Illinois.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Shield,
    title: "Independence",
    description:
      "As an independent agency, we work for you — not the insurance companies. We have no obligation to push any single carrier, which means we always shop the market to find the best coverage at the best price.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "We live and work in Sangamon County. We understand the unique risks facing Central Illinois homeowners, drivers, farmers, and business owners in a way that national chains simply cannot match.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every policy we write starts with listening. We take the time to understand your life, your assets, and your goals before recommending coverage. Your protection is personal — and we treat it that way.",
  },
  {
    icon: Building2,
    title: "Comprehensive Coverage",
    description:
      "From a single renter's policy to a complex commercial portfolio, we offer the full spectrum of insurance products. One relationship, one agency, every coverage you need.",
  },
];

const serviceAreas = [
  "Springfield",
  "Chatham",
  "Rochester",
  "Sherman",
  "Williamsville",
  "Auburn",
  "Riverton",
  "Leland Grove",
  "Jerome",
  "Jacksonville",
  "Decatur",
  "Champaign",
  "Lincoln",
  "Taylorville",
  "Pawnee",
  "Virden",
];

const stats = [
  { value: "30+", label: "Years of Experience" },
  { value: "30+", label: "Top-Rated Carriers" },
  { value: "1000s", label: "Families Protected" },
  { value: "100%", label: "Independent & Local" },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-surface border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              Springfield, Illinois
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
              About Kover King Insurance
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              For over three decades, Kover King Insurance has been Springfield's
              go-to independent insurance agency — putting people over policies
              and community over commissions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-5">
                <Award className="w-4 h-4" />
                Our Story
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-6 leading-tight">
                Rooted in Springfield. Built on Trust.
              </h2>
              <div className="space-y-5 text-text-secondary leading-relaxed">
                <p>
                  Kover King Insurance was founded right here in Springfield,
                  Illinois — and we've never left. For over 30 years, we've
                  helped Central Illinois families, homeowners, renters,
                  landlords, and businesses find the right coverage at rates that
                  make sense.
                </p>
                <p>
                  As a truly independent agency, we're not tied to any single
                  insurance company. We partner with more than 30 of the nation's
                  top-rated carriers — including nationally recognized names and
                  regional specialists who understand the Midwest — so we can
                  always shop the market on your behalf and deliver real choices.
                </p>
                <p>
                  Sangamon County has its own rhythm: its weather, its roads, its
                  neighborhoods, its industries. We know the difference between a
                  Chatham subdivision and a Rochester farm, between a downtown
                  Springfield storefront and a Jerome duplex. That local knowledge
                  shapes every recommendation we make.
                </p>
                <p>
                  Our promise is simple: honest advice, fair prices, and an agent
                  who picks up the phone when you need them most — especially at
                  claim time.
                </p>
              </div>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
                <div className="space-y-6">
                  {[
                    {
                      icon: CheckCircle,
                      text: "Independent — not captive to any single carrier",
                    },
                    {
                      icon: CheckCircle,
                      text: "Access to 30+ top-rated insurance companies",
                    },
                    {
                      icon: CheckCircle,
                      text: "Over 30 years serving Sangamon County",
                    },
                    {
                      icon: CheckCircle,
                      text: "Auto, Home, Business, Life, Landlord & more",
                    },
                    {
                      icon: CheckCircle,
                      text: "Personalized service — not an 800 number",
                    },
                    {
                      icon: CheckCircle,
                      text: "Claims advocacy when you need it most",
                    },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-text-primary font-medium">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-primary-500 fill-primary-500"
                        />
                      ))}
                    </div>
                    <span className="text-text-secondary text-sm font-medium">
                      Trusted by thousands of Central Illinois families
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary-500 text-white rounded-2xl px-5 py-3 shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] font-bold text-center">
                <div className="text-2xl font-extrabold">30+</div>
                <div className="text-xs">Years Local</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <Handshake className="w-4 h-4" />
              What We Stand For
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-text-secondary text-lg">
              Everything we do at Kover King Insurance flows from these four
              commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all duration-200"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center shrink-0">
                    <value.icon className="w-7 h-7 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-5">
                <MapPin className="w-4 h-4" />
                Where We Serve
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-5">
                Proudly Serving Central Illinois
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 text-lg">
                Our roots are in Springfield and Sangamon County, but our reach
                extends across Central Illinois. Wherever you live, we can
                help you find the right coverage.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
              >
                Get Your Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <div className="flex flex-wrap gap-3">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="bg-cream text-primary-500 border border-primary-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-50 transition-colors"
                  >
                    {area}, IL
                  </span>
                ))}
              </div>
              <p className="text-sm text-text-muted mt-5">
                Serving all of Sangamon County and the surrounding Central
                Illinois region. Don't see your city? Give us a call — we
                likely serve your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-5">
            Ready to Work with a Local Agent Who Knows You?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
            Call us today or fill out our quick quote form. We'll compare rates
            from 30+ carriers and find the right fit for your life and your
            budget — no pressure, no jargon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+12179608997"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-500 hover:bg-primary-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
            >
              <Phone className="w-5 h-5" />
              (217) 960-8997
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Request a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
