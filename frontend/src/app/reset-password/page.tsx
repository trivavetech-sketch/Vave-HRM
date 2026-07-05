"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

const DEMO_EMAIL = "admin@vave.com";
const REGISTERED_USERS_KEY = "vave_registered_users";

// ── Helpers ──

function getRegisteredUsers(): { name: string; email: string; password: string; registeredAt: string }[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: { name: string; email: string; password: string; registeredAt: string }[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

// ── Inner component that uses useSearchParams (must be wrapped in Suspense) ──

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate token on mount
  const isValidToken = token && token.startsWith("reset_");
  const decodedEmail = email ? decodeURIComponent(email).toLowerCase().trim() : "";
  const isDemoAccount = decodedEmail === DEMO_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);

    if (isDemoAccount) {
      setError("The demo account password cannot be changed. Please use a registered account.");
      return;
    }

    // Update password for registered user
    const users = getRegisteredUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === decodedEmail);
    if (idx === -1) {
      setError("Account not found. The reset link may have expired.");
      return;
    }

    users[idx].password = newPassword;
    saveRegisteredUsers(users);

    setSuccess("Password reset successfully! Redirecting to sign in...");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl text-white shadow-lg">V</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vave HRM</h1>
              <p className="text-orange-100 text-sm">Enterprise HRMS Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Create a New<br />
            <span className="text-orange-200">Password</span>
          </h2>
          <p className="text-orange-100/80 text-base leading-relaxed max-w-md">
            Choose a strong password that you haven&apos;t used before. Make it at least 6 characters.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { label: "Secure Recovery", desc: "Token-verified password reset" },
              { label: "Instant Update", desc: "New password takes effect immediately" },
              { label: "Back to Work", desc: "Sign in with your new password" },
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-orange-500/20">V</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Vave HRM</h1>
              <p className="text-xs text-slate-500">Enterprise HRMS</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm">
            {/* Invalid or missing token */}
            {!isValidToken || !email ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
                <p className="text-sm text-slate-500 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition shadow-md shadow-orange-500/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Request New Reset Link
                </Link>
                <div className="mt-4">
                  <Link href="/login" className="text-xs text-slate-500 hover:text-slate-700 transition">
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Set New Password</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    For <span className="font-semibold text-slate-700">{decodedEmail}</span>
                  </p>
                </div>

                {/* Error/Success */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-sm text-rose-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-sm text-emerald-700">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {isDemoAccount && !success ? (
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Demo Account</p>
                        <p className="text-xs text-amber-700 mt-1">
                          The demo account (<strong>{DEMO_EMAIL}</strong>) has a fixed password and cannot be changed.
                          Use a registered account to test password reset, or go back to sign in with <strong>password123</strong>.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to sign in
                    </Link>
                  </div>
                ) : !success && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          placeholder="Min. 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-400 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-400 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
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
                          Resetting password...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </button>
                  </form>
                )}

                {!success && !isDemoAccount && (
                  <div className="mt-5 text-center">
                    <Link
                      href="/login"
                      className="text-xs text-slate-500 hover:text-slate-700 transition inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to sign in
                    </Link>
                  </div>
                )}
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

// ── Wrapper with Suspense (required by useSearchParams) ──

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
