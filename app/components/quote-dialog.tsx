import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { submitQuote } from "~/lib/actions";
import {
  Car,
  Home,
  Briefcase,
  HeartPulse,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

type InsuranceType = "Auto" | "Home" | "Business" | "Life";
type FormStatus = "idle" | "loading" | "success" | "error";
type Step = "select" | "form";

const INSURANCE_CARDS: {
  type: InsuranceType;
  icon: typeof Car;
  description: string;
  color: string;
  bgColor: string;
}[] = [
  {
    type: "Auto",
    icon: Car,
    description: "Cars, trucks, motorcycles & more",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400",
  },
  {
    type: "Home",
    icon: Home,
    description: "Homeowners, renters & condo coverage",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400",
  },
  {
    type: "Business",
    icon: Briefcase,
    description: "Commercial & professional liability",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400",
  },
  {
    type: "Life",
    icon: HeartPulse,
    description: "Term, whole & universal life policies",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-400",
  },
];

const inputClass =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

interface BaseFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  details: string;
}

interface AutoFormData extends BaseFormData {
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  current_coverage: string;
  drivers_count: string;
}

interface HomeFormData extends BaseFormData {
  address: string;
  city: string;
  state: string;
  zip: string;
  home_value: string;
  year_built: string;
}

interface BusinessFormData extends BaseFormData {
  business_name: string;
  business_type: string;
  employees_count: string;
  annual_revenue: string;
}

interface LifeFormData extends BaseFormData {
  date_of_birth: string;
  coverage_amount: string;
  smoker: string;
  policy_type: string;
}

const baseDefaults: BaseFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  details: "",
};

const formDefaults: Record<InsuranceType, BaseFormData> = {
  Auto: {
    ...baseDefaults,
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    current_coverage: "",
    drivers_count: "",
  } as AutoFormData,
  Home: {
    ...baseDefaults,
    address: "",
    city: "",
    state: "IL",
    zip: "",
    home_value: "",
    year_built: "",
  } as HomeFormData,
  Business: {
    ...baseDefaults,
    business_name: "",
    business_type: "",
    employees_count: "",
    annual_revenue: "",
  } as BusinessFormData,
  Life: {
    ...baseDefaults,
    date_of_birth: "",
    coverage_amount: "",
    smoker: "",
    policy_type: "",
  } as LifeFormData,
};

function NameEmailPhoneFields({
  form,
  set,
}: {
  form: BaseFormData;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-first" className="block text-sm font-semibold text-text-primary mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="q-first"
            type="text"
            required
            placeholder="Jane"
            value={form.first_name}
            onChange={set("first_name")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-last" className="block text-sm font-semibold text-text-primary mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="q-last"
            type="text"
            required
            placeholder="Smith"
            value={form.last_name}
            onChange={set("last_name")}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="q-email" className="block text-sm font-semibold text-text-primary mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="q-email"
          type="email"
          required
          placeholder="jane@email.com"
          value={form.email}
          onChange={set("email")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="q-phone" className="block text-sm font-semibold text-text-primary mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="q-phone"
          type="tel"
          required
          placeholder="(217) 555-0100"
          value={form.phone}
          onChange={set("phone")}
          className={inputClass}
        />
      </div>
    </>
  );
}

function AutoFields({
  form,
  set,
}: {
  form: AutoFormData;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="q-vyear" className="block text-sm font-semibold text-text-primary mb-1">
            Vehicle Year <span className="text-red-500">*</span>
          </label>
          <input
            id="q-vyear"
            type="text"
            required
            placeholder="2024"
            value={form.vehicle_year}
            onChange={set("vehicle_year")}
            maxLength={4}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-vmake" className="block text-sm font-semibold text-text-primary mb-1">
            Make <span className="text-red-500">*</span>
          </label>
          <input
            id="q-vmake"
            type="text"
            required
            placeholder="Toyota"
            value={form.vehicle_make}
            onChange={set("vehicle_make")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-vmodel" className="block text-sm font-semibold text-text-primary mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            id="q-vmodel"
            type="text"
            required
            placeholder="Camry"
            value={form.vehicle_model}
            onChange={set("vehicle_model")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-coverage" className="block text-sm font-semibold text-text-primary mb-1">
            Current Coverage
          </label>
          <select
            id="q-coverage"
            value={form.current_coverage}
            onChange={set("current_coverage")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="None">No current coverage</option>
            <option value="Liability Only">Liability Only</option>
            <option value="Full Coverage">Full Coverage</option>
          </select>
        </div>
        <div>
          <label htmlFor="q-drivers" className="block text-sm font-semibold text-text-primary mb-1">
            Number of Drivers
          </label>
          <select
            id="q-drivers"
            value={form.drivers_count}
            onChange={set("drivers_count")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
        </div>
      </div>
    </>
  );
}

function HomeFields({
  form,
  set,
}: {
  form: HomeFormData;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div>
        <label htmlFor="q-address" className="block text-sm font-semibold text-text-primary mb-1">
          Property Address <span className="text-red-500">*</span>
        </label>
        <input
          id="q-address"
          type="text"
          required
          placeholder="123 Main St"
          value={form.address}
          onChange={set("address")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="q-city" className="block text-sm font-semibold text-text-primary mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="q-city"
            type="text"
            required
            placeholder="Springfield"
            value={form.city}
            onChange={set("city")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-state" className="block text-sm font-semibold text-text-primary mb-1">
            State
          </label>
          <input
            id="q-state"
            type="text"
            placeholder="IL"
            value={form.state}
            onChange={set("state")}
            maxLength={2}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-zip" className="block text-sm font-semibold text-text-primary mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            id="q-zip"
            type="text"
            required
            placeholder="62701"
            value={form.zip}
            onChange={set("zip")}
            maxLength={10}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-hvalue" className="block text-sm font-semibold text-text-primary mb-1">
            Estimated Home Value
          </label>
          <input
            id="q-hvalue"
            type="text"
            placeholder="$250,000"
            value={form.home_value}
            onChange={set("home_value")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-ybuilt" className="block text-sm font-semibold text-text-primary mb-1">
            Year Built
          </label>
          <input
            id="q-ybuilt"
            type="text"
            placeholder="1995"
            value={form.year_built}
            onChange={set("year_built")}
            maxLength={4}
            className={inputClass}
          />
        </div>
      </div>
    </>
  );
}

function BusinessFields({
  form,
  set,
}: {
  form: BusinessFormData;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div>
        <label htmlFor="q-bname" className="block text-sm font-semibold text-text-primary mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          id="q-bname"
          type="text"
          required
          placeholder="Acme LLC"
          value={form.business_name}
          onChange={set("business_name")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="q-btype" className="block text-sm font-semibold text-text-primary mb-1">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="q-btype"
          required
          value={form.business_type}
          onChange={set("business_type")}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>Select type...</option>
          <option value="Retail">Retail</option>
          <option value="Restaurant/Food Service">Restaurant / Food Service</option>
          <option value="Construction/Contractor">Construction / Contractor</option>
          <option value="Professional Services">Professional Services</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Technology">Technology</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-employees" className="block text-sm font-semibold text-text-primary mb-1">
            Number of Employees
          </label>
          <select
            id="q-employees"
            value={form.employees_count}
            onChange={set("employees_count")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="1-5">1-5</option>
            <option value="6-25">6-25</option>
            <option value="26-100">26-100</option>
            <option value="100+">100+</option>
          </select>
        </div>
        <div>
          <label htmlFor="q-revenue" className="block text-sm font-semibold text-text-primary mb-1">
            Annual Revenue
          </label>
          <select
            id="q-revenue"
            value={form.annual_revenue}
            onChange={set("annual_revenue")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="Under $100K">Under $100K</option>
            <option value="$100K - $500K">$100K - $500K</option>
            <option value="$500K - $1M">$500K - $1M</option>
            <option value="$1M+">$1M+</option>
          </select>
        </div>
      </div>
    </>
  );
}

function LifeFields({
  form,
  set,
}: {
  form: LifeFormData;
  set: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-dob" className="block text-sm font-semibold text-text-primary mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="q-dob"
            type="date"
            required
            value={form.date_of_birth}
            onChange={set("date_of_birth")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="q-smoker" className="block text-sm font-semibold text-text-primary mb-1">
            Tobacco Use
          </label>
          <select
            id="q-smoker"
            value={form.smoker}
            onChange={set("smoker")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="No">Non-smoker</option>
            <option value="Yes">Smoker / Tobacco user</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="q-ptype" className="block text-sm font-semibold text-text-primary mb-1">
            Policy Type <span className="text-red-500">*</span>
          </label>
          <select
            id="q-ptype"
            required
            value={form.policy_type}
            onChange={set("policy_type")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled>Select type...</option>
            <option value="Term Life">Term Life</option>
            <option value="Whole Life">Whole Life</option>
            <option value="Universal Life">Universal Life</option>
            <option value="Final Expense">Final Expense</option>
            <option value="Not Sure">Not Sure - Help Me Decide</option>
          </select>
        </div>
        <div>
          <label htmlFor="q-camount" className="block text-sm font-semibold text-text-primary mb-1">
            Coverage Amount
          </label>
          <select
            id="q-camount"
            value={form.coverage_amount}
            onChange={set("coverage_amount")}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select...</option>
            <option value="$50,000">$50,000</option>
            <option value="$100,000">$100,000</option>
            <option value="$250,000">$250,000</option>
            <option value="$500,000">$500,000</option>
            <option value="$1,000,000">$1,000,000</option>
            <option value="Not Sure">Not Sure</option>
          </select>
        </div>
      </div>
    </>
  );
}

function buildDetails(insuranceType: InsuranceType, form: Record<string, string>): string {
  const parts: string[] = [];

  if (insuranceType === "Auto") {
    if (form.vehicle_year || form.vehicle_make || form.vehicle_model) {
      parts.push(`Vehicle: ${form.vehicle_year} ${form.vehicle_make} ${form.vehicle_model}`.trim());
    }
    if (form.current_coverage) parts.push(`Current Coverage: ${form.current_coverage}`);
    if (form.drivers_count) parts.push(`Drivers: ${form.drivers_count}`);
  } else if (insuranceType === "Home") {
    if (form.address) parts.push(`Address: ${form.address}`);
    if (form.city || form.state || form.zip) {
      parts.push(`Location: ${form.city}, ${form.state} ${form.zip}`.trim());
    }
    if (form.home_value) parts.push(`Home Value: ${form.home_value}`);
    if (form.year_built) parts.push(`Year Built: ${form.year_built}`);
  } else if (insuranceType === "Business") {
    if (form.business_name) parts.push(`Business: ${form.business_name}`);
    if (form.business_type) parts.push(`Type: ${form.business_type}`);
    if (form.employees_count) parts.push(`Employees: ${form.employees_count}`);
    if (form.annual_revenue) parts.push(`Revenue: ${form.annual_revenue}`);
  } else if (insuranceType === "Life") {
    if (form.date_of_birth) parts.push(`DOB: ${form.date_of_birth}`);
    if (form.policy_type) parts.push(`Policy: ${form.policy_type}`);
    if (form.coverage_amount) parts.push(`Coverage: ${form.coverage_amount}`);
    if (form.smoker) parts.push(`Tobacco: ${form.smoker}`);
  }

  if (form.details) parts.push(`Notes: ${form.details}`);
  return parts.join("\n");
}

export function QuoteDialog({
  children,
  defaultInsuranceType,
}: {
  children: React.ReactNode;
  defaultInsuranceType?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(defaultInsuranceType ? "form" : "select");
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(
    (defaultInsuranceType as InsuranceType) || null
  );
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState<Record<string, string>>(
    defaultInsuranceType
      ? { ...(formDefaults[defaultInsuranceType as InsuranceType] || baseDefaults) }
      : { ...baseDefaults }
  );

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectType = (type: InsuranceType) => {
    setSelectedType(type);
    setForm({ ...formDefaults[type] });
    setStep("form");
  };

  const goBack = () => {
    if (defaultInsuranceType) return;
    setStep("select");
    setSelectedType(null);
    setForm({ ...baseDefaults });
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setStatus("loading");
    try {
      const details = buildDetails(selectedType, form);
      await submitQuote({
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          insurance_type: selectedType,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || "IL",
          zip: form.zip || undefined,
          details: details || undefined,
        },
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setStep(defaultInsuranceType ? "form" : "select");
    setSelectedType((defaultInsuranceType as InsuranceType) || null);
    setForm(
      defaultInsuranceType
        ? { ...(formDefaults[defaultInsuranceType as InsuranceType] || baseDefaults) }
        : { ...baseDefaults }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(reset, 200);
    }
  };

  const cardConfig = selectedType
    ? INSURANCE_CARDS.find((c) => c.type === selectedType)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={step === "form" ? "max-w-xl" : "max-w-2xl"}>
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Get Your Free Quote
              </DialogTitle>
              <DialogDescription>
                What type of insurance are you looking for? Select one to get started.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {INSURANCE_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.type}
                      onClick={() => selectType(card.type)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${card.bgColor}`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm`}
                      >
                        <Icon className={`w-7 h-7 ${card.color}`} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-heading font-bold text-text-primary text-base">
                          {card.type} Insurance
                        </h3>
                        <p className="text-text-secondary text-xs mt-1">
                          {card.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-text-muted text-center mt-5">
                We'll compare rates from 30+ carriers. No obligation.
              </p>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {!defaultInsuranceType && (
                  <button
                    onClick={goBack}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors mr-1"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5 text-text-secondary" />
                  </button>
                )}
                {cardConfig && (
                  <cardConfig.icon className={`w-5 h-5 ${cardConfig.color}`} />
                )}
                {selectedType} Insurance Quote
              </DialogTitle>
              <DialogDescription>
                Fill out the details below and we'll compare rates from 30+ carriers.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 pb-6 pt-4">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                    Quote Request Received!
                  </h3>
                  <p className="text-text-secondary text-sm mb-5">
                    We'll compare rates from 30+ carriers and follow up within one
                    business day.
                  </p>
                  <button
                    onClick={reset}
                    className="text-primary-500 font-semibold hover:underline text-sm"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === "error" && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Something went wrong. Please try again or call us at (217)
                      960-8997.
                    </div>
                  )}

                  <NameEmailPhoneFields form={form as unknown as BaseFormData} set={set} />

                  {selectedType === "Auto" && (
                    <AutoFields form={form as unknown as AutoFormData} set={set} />
                  )}
                  {selectedType === "Home" && (
                    <HomeFields form={form as unknown as HomeFormData} set={set} />
                  )}
                  {selectedType === "Business" && (
                    <BusinessFields form={form as unknown as BusinessFormData} set={set} />
                  )}
                  {selectedType === "Life" && (
                    <LifeFields form={form as unknown as LifeFormData} set={set} />
                  )}

                  <div>
                    <label
                      htmlFor="q-details"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Additional Details
                    </label>
                    <textarea
                      id="q-details"
                      rows={3}
                      placeholder="Tell us anything that might help us find the best coverage..."
                      value={form.details}
                      onChange={set("details")}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_8px_30px_-8px_rgba(233,86,12,0.4)]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Request My Free Quote
                      </>
                    )}
                  </button>

                  <p className="text-xs text-text-muted text-center">
                    No obligation. We'll compare 30+ carriers and contact you within
                    one business day.
                  </p>
                </form>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
