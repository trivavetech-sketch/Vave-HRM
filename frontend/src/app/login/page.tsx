"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

const DEMO_CREDENTIALS = {
  email: "admin@vave.com",
  password: "password123",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 500);
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  // Show loading while checking auth state
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

  // Don't render form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
        {/* Decorative elements */}
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
            Streamline Your<br />
            <span className="text-orange-200">Workforce Management</span>
          </h2>

          <p className="text-orange-100/80 text-base leading-relaxed max-w-md">
            Multi-tenant HRMS with employee directory, geofenced attendance, automated payroll, and ATS recruitment pipelines.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { label: "Multi-Tenant SaaS", desc: "Schema-per-tenant isolation" },
              { label: "Real-time Attendance", desc: "GPS, Face ID, Biometric" },
              { label: "Automated Payroll", desc: "Tax-compliant salary runs" },
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

      {/* Right Panel — Login Form */}
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
                <LogIn className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your tenant dashboard</p>
            </div>

            {/* Error/Success Messages */}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@vave.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 py-2.5 rounded-xl font-semibold text-sm text-white transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-orange-600 transition inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  Forgot password?
                </Link>
              </div>
            </form>

            {/* Demo Credentials Hint */}
            <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">Demo Credentials</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-mono">admin@vave.com</span>
                <span className="text-slate-300">/</span>
                <span className="font-mono">password123</span>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-[10px] bg-white border border-orange-200 hover:border-orange-400 text-orange-600 font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Autofill credentials
              </button>
            </div>
            {/* Register Link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-orange-600 font-semibold hover:text-orange-700 transition">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            &copy; {new Date().getFullYear()} Vave HRM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
