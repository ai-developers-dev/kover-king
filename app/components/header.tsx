import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Crown, ChevronDown } from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

const insuranceDropdown = [
  { label: "Auto Insurance", to: "/auto" },
  { label: "Home Insurance", to: "/home-insurance" },
  { label: "Business Insurance", to: "/business" },
  { label: "Life Insurance", to: "/life" },
  { label: "Landlord Insurance", to: "/landlord-insurance" },
  { label: "Duplex Insurance", to: "/duplex-insurance" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-cream" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-lg font-bold text-text-primary">
                Kover <span className="text-primary-500">King</span>
              </span>
              <span className="text-[10px] text-text-muted tracking-wide uppercase">
                Insurance Agency
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors"
            >
              Contact
            </Link>

            {/* Insurance Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">
                Insurance
                <ChevronDown className="w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-52 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  {insuranceDropdown.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-2.5 text-sm text-text-secondary hover:text-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </div>

            {/* Phone */}
            <a
              href="tel:+12179608997"
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (217) 960-8997
            </a>

            {/* CTA */}
            <QuoteDialog>
              <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] hover:shadow-[0_8px_30px_-4px_rgba(233,86,12,0.5)] cursor-pointer">
                Get a Quote
              </button>
            </QuoteDialog>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-primary-500"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 border-t border-gray-100">
            <div className="flex flex-col gap-1 pt-4">
              <Link
                to="/"
                className="px-4 py-3 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-3 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-3 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
              <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Insurance
              </div>
              {insuranceDropdown.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-6 py-3 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="tel:+12179608997"
                className="mx-4 mt-2 px-5 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-xl text-center"
              >
                Call Us Now
              </a>
              <QuoteDialog>
                <button
                  className="mx-4 mt-2 px-5 py-3 bg-primary-500 text-white font-semibold rounded-xl text-center shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)] cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a Quote
                </button>
              </QuoteDialog>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
