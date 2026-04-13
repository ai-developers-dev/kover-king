import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Car,
  Home,
  Briefcase,
  Heart,
  Phone,
  CheckCircle,
  Star,
  ChevronDown,
  Building,
  Users,
  Crown,
  ArrowRight,
  MapPin,
  Zap,
  UserCheck,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title:
          "Kover King Insurance | Springfield IL Insurance Agency | (217) 960-8997",
      },
      {
        name: "description",
        content:
          "Independent insurance agency in Springfield, IL. Compare auto, home, business & life insurance rates from 30+ carriers. Serving Central Illinois for over 30 years.",
      },
      {
        property: "og:title",
        content:
          "Kover King Insurance | Springfield IL Insurance Agency | (217) 960-8997",
      },
      {
        property: "og:description",
        content:
          "Independent insurance agency in Springfield, IL. Compare auto, home, business & life insurance rates from 30+ carriers. Serving Central Illinois for over 30 years.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
});

const services = [
  {
    icon: Car,
    title: "Auto Insurance",
    description:
      "Protect your vehicle with comprehensive coverage. We compare rates from 30+ carriers to find you the best deal on car insurance.",
    href: "/auto",
  },
  {
    icon: Home,
    title: "Home Insurance",
    description:
      "Safeguard your home and belongings. Our agents find you the right homeowners coverage at the right price.",
    href: "/home-insurance",
  },
  {
    icon: Briefcase,
    title: "Business Insurance",
    description:
      "Keep your business protected with general liability, commercial property, and workers comp coverage tailored to your needs.",
    href: "/business",
  },
  {
    icon: Heart,
    title: "Life Insurance",
    description:
      "Secure your family's financial future with term or whole life insurance. We help you choose the right policy.",
    href: "/life",
  },
  {
    icon: Building,
    title: "Landlord Insurance",
    description:
      "Specialized coverage for rental property owners. Protect your investment from liability, damage, and lost rental income.",
    href: "/landlord-insurance",
  },
  {
    icon: Shield,
    title: "Duplex Insurance",
    description:
      "Tailored insurance solutions for duplex owners — whether you live in one unit or rent both, we have you covered.",
    href: "/duplex-insurance",
  },
];

const stats = [
  { value: "30+", label: "Years of Experience" },
  { value: "30+", label: "Insurance Companies" },
  { value: "10K+", label: "Happy Clients" },
  { value: "98%", label: "Customer Satisfaction" },
];

const steps = [
  {
    number: "1",
    icon: UserCheck,
    title: "Tell Us About You",
    description:
      "Share a few details about your coverage needs — takes less than 2 minutes.",
  },
  {
    number: "2",
    icon: Zap,
    title: "Compare Rates",
    description:
      "We instantly compare quotes from 30+ top-rated insurance carriers on your behalf.",
  },
  {
    number: "3",
    icon: FileCheck,
    title: "Choose Your Plan",
    description:
      "Our local agents walk you through the best options with zero pressure.",
  },
  {
    number: "4",
    icon: ShieldCheck,
    title: "Get Protected",
    description:
      "Get covered the same day. We handle all the paperwork so you don't have to.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Springfield, IL",
    rating: 5,
    text: "Kover King saved me over $400 a year on my auto and home bundle. The agents are incredibly knowledgeable and never pushy. I recommend them to everyone I know!",
  },
  {
    name: "James T.",
    location: "Chatham, IL",
    rating: 5,
    text: "After filing a claim, I was blown away by how smoothly everything went. They advocated for me every step of the way. Truly a local agency that cares.",
  },
  {
    name: "Linda K.",
    location: "Rochester, IL",
    rating: 5,
    text: "I've been with Kover King for over 12 years. They always find me the best rates and make renewals completely hassle-free. Wouldn't go anywhere else.",
  },
];

const faqs = [
  {
    question: "How much does insurance cost in Springfield, IL?",
    answer:
      "Insurance costs vary based on your specific situation — your driving record, home value, credit score, and coverage needs all play a role. Because we work with 30+ carriers, we can often find rates significantly lower than going direct to a single insurer. The best way to know is to get a free quote, which takes just a few minutes.",
  },
  {
    question: "What types of insurance does Kover King offer?",
    answer:
      "We offer a full range of personal and commercial insurance products including auto, home, renters, life, business, landlord, duplex, and umbrella insurance. As an independent agency, we represent dozens of carriers so we can match you with the right coverage at the best price.",
  },
  {
    question: "Can I bundle multiple policies to save money?",
    answer:
      "Absolutely. Bundling your auto and home insurance — or adding life or umbrella policies — can save you up to 25% on your premiums. Our agents will walk you through all available bundle discounts during your free quote consultation.",
  },
  {
    question: "What do I do if I need to file a claim?",
    answer:
      "Call our office at (217) 960-8997 and we'll guide you through the claims process step by step. As your independent agent, we advocate on your behalf with the insurance carrier and help make sure your claim is handled quickly and fairly.",
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
  "Sangamon County",
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-text-primary">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 text-base leading-relaxed text-text-secondary">
          {answer}
        </div>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: text content */}
            <div>
              {/* Pill badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-primary-600">
                <Shield className="h-4 w-4 text-primary-500" />
                Trusted Local Insurance Agency
              </div>

              <h1 className="font-heading text-5xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
                Your Trusted{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Springfield</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-0 right-0 h-3 rounded-sm bg-primary-500 opacity-20"
                  />
                </span>{" "}
                <br className="hidden sm:block" />
                Insurance{" "}
                <span className="border-b-4 border-primary-500">Agency</span>
              </h1>

              <p className="mt-6 text-xl leading-relaxed text-text-secondary">
                We shop{" "}
                <strong className="font-semibold text-text-primary">
                  30+ carriers
                </strong>{" "}
                so you don't have to. Get better coverage at a lower price —
                backed by local agents who've been protecting Central Illinois
                families for over{" "}
                <strong className="font-semibold text-text-primary">
                  30 years
                </strong>
                .
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <QuoteDialog>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(233,86,12,0.5)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer">
                    Get a Free Quote
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </QuoteDialog>
                <a
                  href="tel:+12179608997"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-500 bg-transparent px-8 py-4 text-base font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <Phone className="h-5 w-5" />
                  (217) 960-8997
                </a>
              </div>

              {/* Trust indicators row */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-8">
                {[
                  { icon: Building, label: "30+ Insurance Companies" },
                  { icon: Crown, label: "30 Years Experience" },
                  { icon: MapPin, label: "Local & Personal Service" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm font-medium text-text-secondary"
                  >
                    <Icon className="h-4 w-4 text-primary-500" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image placeholder / visual card */}
            <div className="relative">
              {/* Decorative background blob */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl bg-primary-50 opacity-60"
              />
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)]">
                {/* Image placeholder — swap <img> here when photo is ready */}
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-50 to-cream">
                  <div className="text-center">
                    <Shield className="mx-auto h-20 w-20 text-primary-500 opacity-30" />
                    <p className="mt-3 text-sm font-medium text-text-muted">
                      Agency Photo
                    </p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-lg">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary-500 text-primary-500"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    5-Star Rated Agency
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Insurance Partners ── */}
      <section className="bg-surface py-12 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Insurance Partners
          </p>
          <h2 className="font-heading text-2xl font-bold text-text-primary mt-2">
            We Compare Rates From 30+ Top Carriers
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
          <div className="logo-scroll-track flex items-center gap-16 w-max">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-16 shrink-0">
                {[
                  { src: "/logos/Progressive-logo-removebg-preview.png", alt: "Progressive" },
                  { src: "/logos/Travelers-logo-removebg-preview.png", alt: "Travelers" },
                  { src: "/logos/erie-logo-removebg-preview.png", alt: "Erie Insurance" },
                  { src: "/logos/safeco-logo-removebg-preview.png", alt: "Safeco" },
                  { src: "/logos/auto-owners-logo-removebg-preview.png", alt: "Auto-Owners" },
                  { src: "/logos/NationalGeneralLogo-removebg-preview.png", alt: "National General" },
                  { src: "/logos/MadisonMutual-removebg-preview.png", alt: "Madison Mutual" },
                  { src: "/logos/bristol-west-logo-removebg-preview.png", alt: "Bristol West" },
                  { src: "/logos/openly-logo-removebg-preview.png", alt: "Openly" },
                  { src: "/logos/hippo-logo-removebg-preview.png", alt: "Hippo" },
                  { src: "/logos/branch-logo-removebg-preview.png", alt: "Branch" },
                  { src: "/logos/universal-properites-logo-removebg-preview.png", alt: "Universal Property" },
                ].map((logo) => (
                  <img
                    key={`${setIndex}-${logo.alt}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-10 w-auto max-w-[140px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-sm"
              >
                <p className="font-heading text-4xl font-extrabold text-primary-500 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-center text-sm font-medium text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Coverage Options
            </p>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
              Complete Coverage for{" "}
              <span className="border-b-4 border-primary-500">Every Need</span>
            </h2>
            <p className="mt-4 text-xl text-text-secondary">
              From your first car to your family home and business — we have the
              right coverage waiting for you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors duration-200 group-hover:bg-primary-500 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <Link
                    to={service.href as "/"}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trusted Partner Section ── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">
            {/* Left: CTA card */}
            <div className="relative overflow-hidden rounded-3xl bg-primary-500 p-10 text-white shadow-[0_20px_60px_-15px_rgba(233,86,12,0.3)]">
              {/* Decorative circles */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white opacity-10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-600 opacity-40"
              />

              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Phone className="h-7 w-7 text-white" />
                </div>

                <h3 className="font-heading text-3xl font-bold">
                  Talk to a Local Agent
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-white/80">
                  Ready to find better rates? Our licensed agents are standing
                  by to compare quotes from top carriers — at no cost to you.
                </p>

                <div className="mt-8 space-y-4">
                  <a
                    href="tel:+12179608997"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-semibold text-primary-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Phone className="h-5 w-5" />
                    (217) 960-8997
                  </a>
                  <QuoteDialog>
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/50 px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer">
                      Get a Free Quote Online
                    </button>
                  </QuoteDialog>
                </div>

                <div className="mt-8 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-white text-white opacity-90"
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-medium text-white/80">
                    5-star rated by Springfield clients
                  </span>
                </div>
              </div>
            </div>

            {/* Right: content */}
            <div className="mt-14 lg:mt-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
                Why Kover King
              </p>
              <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
                Your Trusted Local{" "}
                <span className="border-b-4 border-primary-500">
                  Insurance Partner
                </span>
              </h2>
              <p className="mt-4 text-xl text-text-secondary">
                Unlike captive agents who only sell one company's products, we
                work for <em>you</em> — comparing dozens of carriers to get you
                the best coverage at the lowest rate.
              </p>

              <ul className="mt-10 space-y-5">
                {[
                  "Access to 30+ top-rated insurance carriers",
                  "Over 30 years serving Central Illinois families",
                  "Free, no-obligation quotes with zero pressure",
                  "Licensed local agents who know your community",
                  "Bundle discounts saving you up to 25%",
                  "All coverage types under one roof",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-primary-500" />
                    <span className="text-base font-medium text-text-primary">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Simple Process
            </p>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
              How It <span className="border-b-4 border-primary-500">Works</span>
            </h2>
            <p className="mt-4 text-xl text-text-secondary">
              Getting better insurance doesn't have to be complicated. Here's
              how easy it is with Kover King.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex flex-col">
                  {/* Connector line for lg */}
                  {step.number !== "4" && (
                    <div
                      aria-hidden="true"
                      className="absolute top-7 left-[calc(50%+28px)] right-[-calc(50%-28px)] hidden h-px bg-primary-100 lg:block"
                    />
                  )}
                  <div className="flex flex-col items-center text-center">
                    {/* Step circle */}
                    <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                      <Icon className="h-7 w-7 text-primary-500" />
                      <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <QuoteDialog>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-10 py-4 text-base font-semibold text-white shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(233,86,12,0.5)] cursor-pointer">
                Start Your Free Quote
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuoteDialog>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Client Reviews
            </p>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
              What Our{" "}
              <span className="border-b-4 border-primary-500">Clients Say</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary-500 text-primary-500"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-base leading-relaxed text-text-secondary">
                  "{t.text}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Common Questions
            </p>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
              Frequently Asked{" "}
              <span className="border-b-4 border-primary-500">Questions</span>
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Areas ── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
              Coverage Area
            </p>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-text-primary sm:text-5xl">
              Serving{" "}
              <span className="border-b-4 border-primary-500">
                Central Illinois
              </span>
            </h2>
            <p className="mt-4 text-xl text-text-secondary">
              Kover King Insurance proudly serves homeowners, drivers, and
              businesses across the greater Springfield area and beyond.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition-all duration-200 hover:border-primary-500 hover:shadow-md cursor-default"
              >
                <MapPin className="h-3.5 w-3.5 text-primary-500" />
                {area}
              </span>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't see your city?{" "}
            <a
              href="tel:+12179608997"
              className="font-semibold text-primary-500 underline underline-offset-2 hover:text-primary-600"
            >
              Call us — we likely cover your area.
            </a>
          </p>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <Shield className="h-8 w-8 text-primary-500" />
          </div>

          <h2 className="font-heading text-4xl font-extrabold text-text-primary sm:text-5xl">
            Ready to Save on Insurance?
          </h2>
          <p className="mt-5 text-xl text-text-secondary">
            Join thousands of Central Illinois families who trust Kover King to
            find them better coverage at lower rates. Your free quote takes less
            than 5 minutes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <QuoteDialog>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-10 py-4 text-base font-semibold text-white shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(233,86,12,0.5)] cursor-pointer">
                Get Your Free Quote
                <ArrowRight className="h-5 w-5" />
              </button>
            </QuoteDialog>
            <a
              href="tel:+12179608997"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-500 bg-transparent px-10 py-4 text-base font-semibold text-primary-500 transition-all duration-200 hover:bg-primary-50 hover:-translate-y-0.5"
            >
              <Phone className="h-5 w-5" />
              Call (217) 960-8997
            </a>
          </div>

          <p className="mt-6 text-sm text-text-muted">
            No obligation. No spam. Just honest quotes from local experts.
          </p>
        </div>
      </section>
    </div>
  );
}
