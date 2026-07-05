"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  KeyRound,
  Copy,
  ExternalLink,
} from "lucide-react";

const DEMO_EMAIL = "admin@vave.com";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSent(false);
    setResetLink(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email exists in either demo account or registered users
    const isDemoEmail = normalizedEmail === DEMO_EMAIL;
    const registered = getRegisteredUsersFromStorage();
    const isRegistered = registered.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (isDemoEmail || isRegistered) {
      // Found the user — simulate sending a reset link
      const token = `reset_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const simulatedLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;
      setResetLink(simulatedLink);
      setResetSent(true);
    } else {
      // For security, don't reveal whether the email exists
      setResetSent(true);
      setResetLink(null);
    }
  };

  const copyToClipboard = async () => {
    if (resetLink) {
      try {
        await navigator.clipboard.writeText(resetLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = resetLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Show loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl text-white shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vave HRM</h1>
              <p className="text-orange-100 text-sm">Enterprise HRMS Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Forgot Your<br />
            <span className="text-orange-200">Password?</span>
          </h2>

          <p className="text-orange-100/80 text-base leading-relaxed max-w-md">
            No worries. Enter your email and we&apos;ll send you a password reset link to get back into your account.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { label: "Quick & Secure", desc: "Password reset in seconds" },
              { label: "Account Recovery", desc: "Regain access to your tenant" },
              { label: "Data Protected", desc: "End-to-end encrypted process" },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-200" />
                <div>
                  <p className="text-white text-sm font-semibold">{feat.label}</p>
                  <p className="text-orange-200/70 text-xs">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-orange-500/20">
              V
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Vave HRM</h1>
              <p className="text-xs text-slate-500">Enterprise HRMS</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
              <p className="text-sm text-slate-500 mt-1">
                {resetSent
                  ? "Check your inbox for the reset link"
                  : "Enter your email to receive a reset link"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-sm text-rose-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Reset Sent Success */}
            {resetSent ? (
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Reset link sent!</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link.
                        Please check your inbox and follow the instructions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo: Show the simulated reset link if account was found */}
                {resetLink && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Demo Mode — Simulated Reset Link
                    </p>
                    <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-600 break-all">
                      <span className="flex-1 truncate">{resetLink}</span>
                      <button
                        onClick={copyToClipboard}
                        className="shrink-0 p-1 rounded-md hover:bg-orange-100 text-slate-400 hover:text-orange-600 transition"
                        title="Copy link"
                      >
                        {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      This is a simulated link for demo purposes only
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setResetSent(false);
                      setResetLink(null);
                      setEmail("");
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 py-2.5 rounded-xl font-semibold text-sm text-white transition shadow-md shadow-orange-500/20"
                  >
                    Send another reset link
                  </button>

                  <Link
                    href="/login"
                    className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2 transition flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-400 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 py-2.5 rounded-xl font-semibold text-sm text-white transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-slate-500 hover:text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            &copy; {new Date().getFullYear()} Vave HRM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Helper to read registered users from localStorage (not from context for simplicity) */
function getRegisteredUsersFromStorage(): { name: string; email: string }[] {
  try {
    const raw = localStorage.getItem("vave_registered_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
