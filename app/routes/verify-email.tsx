import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { verifyEmailToken } from "~/lib/auth-actions";
import { Crown, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Confirm Your Email | Kover King Insurance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [state, setState] = useState<"working" | "ok" | "bad">("working");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState("bad");
      setMessage("This link is missing its confirmation code.");
      return;
    }
    verifyEmailToken({ data: { token } })
      .then((res) => {
        if (res.success) {
          setState("ok");
        } else {
          setState("bad");
          setMessage(res.error || "This link is invalid or has expired.");
        }
      })
      .catch(() => {
        setState("bad");
        setMessage("Something went wrong confirming your email.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-cream" />
          </div>
          <span className="font-heading text-xl font-bold text-text-primary">
            Kover <span className="text-primary-500">King</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {state === "working" && (
            <>
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
              <h1 className="font-heading text-xl font-bold text-text-primary">
                Confirming your email...
              </h1>
            </>
          )}
          {state === "ok" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-text-primary mb-2">
                Email confirmed
              </h1>
              <p className="text-text-secondary text-sm mb-6">
                Your account is active. You can now log in to view your policies,
                ID cards, and billing.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Log In
              </Link>
            </>
          )}
          {state === "bad" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-text-primary mb-2">
                Couldn't confirm
              </h1>
              <p className="text-text-secondary text-sm mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Back to Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
