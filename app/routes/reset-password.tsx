import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { resetPassword } from "~/lib/auth-actions";
import { Crown, CheckCircle, AlertCircle, Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Your Password | Kover King Insurance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

const inputClass =
  "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const submit = async () => {
    setError("");
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const res = await resetPassword({ data: { token, password } });
      if (res.success) {
        setDone(true);
        setTimeout(() => navigate({ to: "/login" as "/" }), 2500);
      } else {
        setError(res.error || "Could not reset your password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-cream" />
          </div>
          <span className="font-heading text-xl font-bold text-text-primary">
            Kover <span className="text-primary-500">King</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-text-primary mb-2">
                Password updated
              </h1>
              <p className="text-text-secondary text-sm">
                You've been signed out everywhere. Redirecting you to log in...
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-extrabold text-text-primary mb-1">
                Set a new password
              </h1>
              <p className="text-text-secondary text-sm mb-6">
                At least 10 characters, including a letter and a number.
              </p>

              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      className={inputClass}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <button
                  onClick={submit}
                  disabled={busy || !token || !password || !confirm}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
