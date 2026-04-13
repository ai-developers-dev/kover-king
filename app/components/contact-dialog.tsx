import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { submitContact } from "~/lib/actions";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

export function ContactDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

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
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(reset, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-500" />
            Send Us a Message
          </DialogTitle>
          <DialogDescription>
            Have a question? We'll get back to you within one business day.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                Message Sent!
              </h3>
              <p className="text-text-secondary text-sm mb-5">
                Thanks for reaching out. We'll get back to you within one
                business day.
              </p>
              <button
                onClick={reset}
                className="text-primary-500 font-semibold hover:underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Please try again or call us directly.
                </div>
              )}

              <div>
                <label
                  htmlFor="c-name"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={set("name")}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="c-email"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  placeholder="jane@email.com"
                  value={form.email}
                  onChange={set("email")}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="c-phone"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="c-phone"
                  type="tel"
                  placeholder="(217) 555-0100"
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="c-message"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="c-message"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={set("message")}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
