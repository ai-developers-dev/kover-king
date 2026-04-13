import { Link } from "@tanstack/react-router";
import { Crown, Phone, Mail, MapPin, Clock, Lock } from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

const insuranceLinks = [
  { label: "Auto Insurance", to: "/auto" },
  { label: "Home Insurance", to: "/home-insurance" },
  { label: "Business Insurance", to: "/business" },
  { label: "Life Insurance", to: "/life" },
] as const;

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
] as const;

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
];

export function Footer() {
  return (
    <footer className="bg-text-primary text-gray-400">
      {/* CTA Strip */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-heading text-lg font-semibold">
            Ready to save on insurance? Get your free quote today.
          </p>
          <div className="flex gap-3">
            <QuoteDialog>
              <button className="px-6 py-2.5 bg-white text-primary-500 font-semibold rounded-xl text-sm hover:bg-cream transition-colors cursor-pointer">
                Get a Quote
              </button>
            </QuoteDialog>
            <a
              href="tel:+12179608997"
              className="px-6 py-2.5 border-2 border-white text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-cream" />
              </div>
              <span className="font-heading text-lg font-bold text-white">
                Kover <span className="text-primary-500">King</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Springfield, Illinois' trusted independent insurance agency. Over
              30 years of experience comparing rates from 30+ top-rated carriers.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+12179608997"
                className="flex items-center gap-3 hover:text-primary-500 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                (217) 960-8997
              </a>
              <a
                href="mailto:info@koverking.com"
                className="flex items-center gap-3 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                info@koverking.com
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                Springfield, IL 62701
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                Mon–Fri: 9:00 AM – 5:00 PM
              </div>
            </div>
          </div>

          {/* Insurance Links */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">
              Insurance
            </h3>
            <ul className="space-y-3 text-sm">
              {insuranceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/landlord-insurance"
                  className="hover:text-primary-500 transition-colors"
                >
                  Landlord Insurance
                </Link>
              </li>
              <li>
                <Link
                  to="/duplex-insurance"
                  className="hover:text-primary-500 transition-colors"
                >
                  Duplex Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Springfield IL */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-4 text-sm uppercase tracking-wider">
              Springfield IL
            </h3>
            <ul className="space-y-3 text-sm mb-6">
              <li>
                <Link
                  to="/home-insurance-springfield-il"
                  className="hover:text-primary-500 transition-colors"
                >
                  Home Insurance Springfield
                </Link>
              </li>
              <li>
                <Link
                  to="/auto-insurance-springfield-il"
                  className="hover:text-primary-500 transition-colors"
                >
                  Auto Insurance Springfield
                </Link>
              </li>
              <li>
                <Link
                  to="/business-insurance-springfield-il"
                  className="hover:text-primary-500 transition-colors"
                >
                  Business Insurance Springfield
                </Link>
              </li>
              <li>
                <Link
                  to="/life-insurance-springfield-il"
                  className="hover:text-primary-500 transition-colors"
                >
                  Life Insurance Springfield
                </Link>
              </li>
              <li>
                <Link
                  to="/landlord-insurance-springfield"
                  className="hover:text-primary-500 transition-colors"
                >
                  Landlord Insurance Springfield
                </Link>
              </li>
              <li>
                <Link
                  to="/duplex-insurance-springfield"
                  className="hover:text-primary-500 transition-colors"
                >
                  Duplex Insurance Springfield
                </Link>
              </li>
            </ul>
            <p className="text-xs text-gray-600 italic">
              Serving all of Sangamon County and Central Illinois
            </p>
            <p className="text-xs text-gray-600 mt-3">
              Serving all of Sangamon County and Central Illinois
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>&copy; 2026 Kover King Insurance Agency. All rights reserved.</p>
          <Link
            to="/admin"
            className="flex items-center gap-1 hover:text-gray-400 transition-colors"
          >
            <Lock className="w-3 h-3" />
            Admin Login
          </Link>
        </div>
      </div>

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "InsuranceAgency",
            name: "Kover King Insurance",
            description:
              "Independent insurance agency in Springfield, IL. Compare auto, home, business & life insurance rates from 30+ carriers.",
            telephone: "+1-217-960-8997",
            email: "info@koverking.com",
            url: "https://koverking.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Springfield",
              addressRegion: "IL",
              postalCode: "62701",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 39.7817,
              longitude: -89.6501,
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "09:00",
              closes: "17:00",
            },
            areaServed: [
              "Springfield, IL",
              "Chatham, IL",
              "Rochester, IL",
              "Sherman, IL",
              "Williamsville, IL",
              "Auburn, IL",
              "Riverton, IL",
              "Leland Grove, IL",
              "Jerome, IL",
              "Jacksonville, IL",
              "Decatur, IL",
              "Champaign, IL",
              "Sangamon County, IL",
            ],
            priceRange: "$$",
          }),
        }}
      />
    </footer>
  );
}
