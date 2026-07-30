import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  loginUser,
  registerCustomer,
  requestPasswordReset,
  resendVerification,
} from "~/lib/auth-actions";
import { loginAdmin } from "~/lib/actions";
import {
  Crown,
  Loader2,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// Unified login. One page for everyone — we look the account up and route by
// role, so nobody has to pick "am I an admin or a customer?".
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In | Kover King Insurance" },
      {
        name: "description",
        content:
          "Log in to your Kover King account to view policies, ID cards, and pay your bill.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

type Mode = "login" | "register" | "forgot";

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder-gray-400";
const labelClass = "block text-sm font-semibold text-text-primary mb-1.5";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setNotice("");
    setNeedsVerify(false);
  };

  const handleLogin = async () => {
    setBusy(true);
    setError("");
    setNeedsVerify(false);
    try {
      const res = await loginUser({ data: { email, password } });
      if (res.success) {
        sessionStorage.setItem("kk-token", res.token);
        // Admins also need the legacy key the dashboard already reads.
        if (res.user.role !== "customer") {
          sessionStorage.setItem("admin-token", res.token);
        }
        navigate({ to: res.redirect as "/" });
        return;
      }
      // Fall back to the legacy admin login so an admin seeded before the
      // unified table existed can still get in.
      const adminRes = await loginAdmin({
        data: { username: email, password },
      });
      if (adminRes.success) {
        sessionStorage.setItem("admin-token", adminRes.token);
        sessionStorage.setItem("kk-token", adminRes.token);
        navigate({ to: "/admin/dashboard" as "/" });
        return;
      }
      if ("needsVerification" in res && res.needsVerification) {
        setNeedsVerify(true);
      }
      setError(res.error || "Invalid email or password.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  const handleRegister = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await registerCustomer({
        data: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
        },
      });
      if (res.success) {
        setNotice(
          "Account created. Check your email for a confirmation link to activate it."
        );
        setMode("login");
        setPassword("");
      } else {
        setError(res.error || "Could not create your account.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  const handleForgot = async () => {
    setBusy(true);
    setError("");
    try {
      await requestPasswordReset({ data: { email } });
      // Always the same message — never reveals whether the account exists.
      setNotice(
        "If an account exists for that email, we've sent a password reset link."
      );
      setMode("login");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  const handleResend = async () => {
    setBusy(true);
    await resendVerification({ data: { email } }).catch(() => {});
    setNotice("If that account needs confirmation, we've sent a new link.");
    setNeedsVerify(false);
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
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
            <h1 className="font-heading text-2xl font-extrabold text-text-primary mb-1">
              {mode === "login"
                ? "Log in to your account"
                : mode === "register"
                  ? "Create your account"
                  : "Reset your password"}
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              {mode === "login"
                ? "Access your policies, ID cards, and billing."
                : mode === "register"
                  ? "Manage your policies and pay your bill online."
                  : "We'll email you a link to set a new password."}
            </p>

            {notice && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-green-50 border border-green-200 p-3.5">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{notice}</p>
              </div>
            )}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                  {needsVerify && (
                    <button
                      onClick={handleResend}
                      className="mt-1 text-xs font-semibold text-red-700 underline"
                    >
                      Resend confirmation email
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputClass}
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputClass}
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Phone <span className="font-normal text-text-muted">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="(217) 555-0100"
                    />
                  </div>
                </>
              )}

              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && mode === "login") handleLogin();
                      }}
                      className={`${inputClass} pl-10`}
                      placeholder={
                        mode === "register" ? "At least 10 characters" : "••••••••"
                      }
                      autoComplete={
                        mode === "register" ? "new-password" : "current-password"
                      }
                    />
                  </div>
                  {mode === "register" && (
                    <p className="mt-1.5 text-xs text-text-muted">
                      At least 10 characters, including a letter and a number.
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={
                  mode === "login"
                    ? handleLogin
                    : mode === "register"
                      ? handleRegister
                      : handleForgot
                }
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-colors"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : mode === "login" ? (
                  "Log In"
                ) : mode === "register" ? (
                  "Create Account"
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm">
              {mode === "login" && (
                <>
                  <button
                    onClick={() => switchMode("forgot")}
                    className="text-primary-500 font-semibold hover:underline"
                  >
                    Forgot your password?
                  </button>
                  <p className="mt-3 text-text-secondary">
                    New customer?{" "}
                    <button
                      onClick={() => switchMode("register")}
                      className="text-primary-500 font-semibold hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </>
              )}
              {mode !== "login" && (
                <button
                  onClick={() => switchMode("login")}
                  className="inline-flex items-center gap-1.5 text-primary-500 font-semibold hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to log in
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-text-muted">
            Need help? Call{" "}
            <a href="tel:+12179608997" className="text-primary-500 font-semibold">
              (217) 960-8997
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
