import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitContact, submitQuote } from "~/lib/actions";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title:
          "Contact Kover King Insurance | Springfield IL | (217) 960-8997",
      },
      {
        name: "description",
        content:
          "Contact Kover King Insurance for free insurance quotes. Call (217) 960-8997 or visit our Springfield, IL office.",
      },
    ],
  }),
  component: ContactPage,
});

// ─── Sub-components ──────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success" | "error";

function InputField({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text-primary mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitContact({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
        },
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
        <p className="text-text-secondary mb-6">
          Thanks for reaching out. We'll get back to you within one business
          day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-primary-500 font-semibold hover:underline text-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <InputField label="Full Name" id="contact-name" required>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="Jane Smith"
          value={form.name}
          onChange={set("name")}
          className={inputClass}
        />
      </InputField>

      <InputField label="Email Address" id="contact-email" required>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="jane@email.com"
          value={form.email}
          onChange={set("email")}
          className={inputClass}
        />
      </InputField>

      <InputField label="Phone Number" id="contact-phone">
        <input
          id="contact-phone"
          type="tel"
          placeholder="(217) 555-0100"
          value={form.phone}
          onChange={set("phone")}
          className={inputClass}
        />
      </InputField>

      <InputField label="Message" id="contact-message" required>
        <textarea
          id="contact-message"
          required
          rows={5}
          placeholder="How can we help you?"
          value={form.message}
          onChange={set("message")}
          className={`${inputClass} resize-none`}
        />
      </InputField>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

const INSURANCE_TYPES = [
  "Auto",
  "Home",
  "Business",
  "Life",
  "Landlord",
  "Duplex",
  "Other",
];

function QuoteForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    insurance_type: "",
    address: "",
    city: "",
    state: "IL",
    zip: "",
    details: "",
  });

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitQuote({
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          insurance_type: form.insurance_type,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || "IL",
          zip: form.zip || undefined,
          details: form.details || undefined,
        },
      });
      setStatus("success");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        insurance_type: "",
        address: "",
        city: "",
        state: "IL",
        zip: "",
        details: "",
      });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
          Quote Request Received!
        </h3>
        <p className="text-text-secondary mb-6">
          We'll compare rates from 30+ carriers and follow up within one
          business day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-primary-500 font-semibold hover:underline text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Something went wrong. Please try again or call us at (217) 960-8997.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="First Name" id="quote-first" required>
          <input
            id="quote-first"
            type="text"
            required
            placeholder="Jane"
            value={form.first_name}
            onChange={set("first_name")}
            className={inputClass}
          />
        </InputField>
        <InputField label="Last Name" id="quote-last" required>
          <input
            id="quote-last"
            type="text"
            required
            placeholder="Smith"
            value={form.last_name}
            onChange={set("last_name")}
            className={inputClass}
          />
        </InputField>
      </div>

      <InputField label="Email Address" id="quote-email" required>
        <input
          id="quote-email"
          type="email"
          required
          placeholder="jane@email.com"
          value={form.email}
          onChange={set("email")}
          className={inputClass}
        />
      </InputField>

      <InputField label="Phone Number" id="quote-phone" required>
        <input
          id="quote-phone"
          type="tel"
          required
          placeholder="(217) 555-0100"
          value={form.phone}
          onChange={set("phone")}
          className={inputClass}
        />
      </InputField>

      <InputField label="Insurance Type" id="quote-type" required>
        <select
          id="quote-type"
          required
          value={form.insurance_type}
          onChange={set("insurance_type")}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>
            Select insurance type…
          </option>
          {INSURANCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t} Insurance
            </option>
          ))}
        </select>
      </InputField>

      <InputField label="Street Address" id="quote-address">
        <input
          id="quote-address"
          type="text"
          placeholder="123 Main St"
          value={form.address}
          onChange={set("address")}
          className={inputClass}
        />
      </InputField>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <InputField label="City" id="quote-city">
            <input
              id="quote-city"
              type="text"
              placeholder="Springfield"
              value={form.city}
              onChange={set("city")}
              className={inputClass}
            />
          </InputField>
        </div>
        <div>
          <InputField label="State" id="quote-state">
            <input
              id="quote-state"
              type="text"
              placeholder="IL"
              value={form.state}
              onChange={set("state")}
              maxLength={2}
              className={inputClass}
            />
          </InputField>
        </div>
        <div>
          <InputField label="ZIP Code" id="quote-zip">
            <input
              id="quote-zip"
              type="text"
              placeholder="62701"
              value={form.zip}
              onChange={set("zip")}
              maxLength={10}
              className={inputClass}
            />
          </InputField>
        </div>
      </div>

      <InputField label="Additional Details" id="quote-details">
        <textarea
          id="quote-details"
          rows={4}
          placeholder="Tell us anything that might help us find the best coverage for you…"
          value={form.details}
          onChange={set("details")}
          className={`${inputClass} resize-none`}
        />
      </InputField>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Request My Free Quote
          </>
        )}
      </button>

      <p className="text-xs text-text-muted text-center">
        No obligation. We'll compare 30+ carriers and contact you within one
        business day.
      </p>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "quote">("quote");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-surface border-b border-gray-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cream text-primary-500 font-semibold text-sm px-4 py-2 rounded-full mb-5">
              <Phone className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
              Let's Talk Insurance
            </h1>
            <p className="text-text-secondary text-lg">
              Call us, email us, or fill out the form. We're here to help you
              find the right coverage at the right price — no pressure, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <a
                    href="tel:+12179608997"
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Phone className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                        Phone
                      </div>
                      <div className="text-text-primary font-semibold">
                        (217) 960-8997
                      </div>
                      <div className="text-xs text-text-muted">Click to call</div>
                    </div>
                  </a>

                  <a
                    href="mailto:info@koverking.com"
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Mail className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                        Email
                      </div>
                      <div className="text-text-primary font-semibold">
                        info@koverking.com
                      </div>
                      <div className="text-xs text-text-muted">
                        We reply within 1 business day
                      </div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                        Office
                      </div>
                      <div className="text-text-primary font-semibold">
                        Springfield, IL 62701
                      </div>
                      <div className="text-xs text-text-muted">
                        Serving Sangamon County & Central Illinois
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">
                        Office Hours
                      </div>
                      <div className="text-text-primary font-semibold">
                        Mon – Fri: 9:00 AM – 5:00 PM
                      </div>
                      <div className="text-xs text-text-muted">
                        Central Time · Closed weekends & holidays
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-cream h-52 flex flex-col items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary-400 mb-2" />
                  <p className="text-primary-600 font-semibold text-sm">
                    Springfield, IL 62701
                  </p>
                  <p className="text-primary-400 text-xs mt-1">
                    Sangamon County, Central Illinois
                  </p>
                </div>
                <div className="p-4">
                  <a
                    href="https://maps.google.com/?q=Springfield+IL+62701"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-primary-500 font-semibold text-sm hover:underline py-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Forms */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab("quote")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === "quote"
                        ? "text-primary-500 bg-cream border-b-2 border-primary-500"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Request a Free Quote
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === "contact"
                        ? "text-primary-500 bg-cream border-b-2 border-primary-500"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send a Message
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-6 sm:p-8">
                  {activeTab === "quote" ? <QuoteForm /> : <ContactForm />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
