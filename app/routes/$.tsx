import { createFileRoute } from "@tanstack/react-router";
import { Search, Home, Phone, ArrowLeft } from "lucide-react";
import { QuoteDialog } from "~/components/quote-dialog";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page Not Found | Kover King Insurance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-primary-500" />
        </div>

        <h1 className="font-heading text-4xl font-extrabold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
          Let us help you find what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
          >
            <Home className="w-4 h-4" />
            Go Home
          </a>
          <QuoteDialog>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
              Get a Free Quote
            </button>
          </QuoteDialog>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-gray-100">
          <h2 className="font-heading font-bold text-text-primary mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <a
              href="/auto"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              Auto Insurance
            </a>
            <a
              href="/home-insurance"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              Home Insurance
            </a>
            <a
              href="/business"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              Business Insurance
            </a>
            <a
              href="/life"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              Life Insurance
            </a>
            <a
              href="/contact"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="text-text-secondary hover:text-primary-500 transition-colors"
            >
              About Us
            </a>
          </div>
        </div>

        <p className="text-text-muted text-sm mt-6">
          Need help? Call us at{" "}
          <a
            href="tel:+12179608997"
            className="text-primary-500 font-semibold hover:underline"
          >
            (217) 960-8997
          </a>
        </p>
      </div>
    </div>
  );
}
