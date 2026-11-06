
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { validateEmail, sanitizeInput } from "@/lib/utils";

import {
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setSuccess(null);

    // Validation
    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const sanitizedName = sanitizeInput(name.trim());
      const sanitizedEmail = email.trim().toLowerCase();

      // 1. Create Supabase authentication account.
      // 2. Database trigger automatically creates investor record.
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: sanitizedEmail,
          password,
          options: {
            data: {
              name: sanitizedName,
              phone: phone.trim() || null,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error("Unable to create your account.");
      }

      // Send notification without blocking registration.
      void fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "registration",
          name: sanitizedName,
          email: sanitizedEmail,
          phone: phone || undefined,
        }),
      }).catch((notificationError) => {
        console.error("Notification error:", notificationError);
      });

      // Email confirmation may be enabled in Supabase.
      if (!data.session) {
        setSuccess(
          "Your account has been created. Please check your email to verify your account."
        );

        setLoading(false);
        return;
      }

      // A session exists, so send the user to the dashboard.
      router.replace("/dashboard");
      router.refresh();

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-6xl w-full relative z-10">

        {/* Left section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center text-white space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Star className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">
                Welcome to our platform
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Investment Journey
              </span>
            </h1>

            <p className="text-gray-400 text-lg mt-6 leading-relaxed max-w-lg">
              Create your account to access your personal investor
              dashboard and manage your account in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Personal investor dashboard",
              "Portfolio and account tracking",
              "Secure account authentication",
              "Access to account activity",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>

                <span className="text-gray-300">{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Shield className="w-5 h-5 text-emerald-400" />
            Secure account registration
          </div>
        </motion.div>

        {/* Registration form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-5">
                <TrendingUp className="w-8 h-8 text-slate-950" />
              </div>

              <h2 className="text-3xl font-bold text-white">
                Create Account
              </h2>

              <p className="text-gray-400 mt-2 text-sm">
                Register to get started
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                {success}
                <div className="mt-3">
                  <Link
                    href="/login"
                    className="underline font-semibold"
                  >
                    Go to login
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading || !!success}
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={loading || !!success}
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>

                <PhoneInput
                  country="ke"
                  value={phone}
                  onChange={setPhone}
                  disabled={loading || !!success}
                  containerClass="!w-full"
                  inputClass="!w-full !h-12 !bg-white/5 !border !border-white/10 !text-white !rounded-xl !pl-14"
                  buttonClass="!bg-white/5 !border-white/10 !rounded-l-xl"
                  dropdownClass="!bg-slate-900 !text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={6}
                    disabled={loading || !!success}
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-gray-400">
                <input
                  type="checkbox"
                  required
                  disabled={loading || !!success}
                  className="mt-1 accent-emerald-500"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/legal"
                    className="text-emerald-400 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal"
                    className="text-emerald-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>.
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !!success}
                className="w-full h-13 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold text-base disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Login */}
            <div className="mt-7 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-400 font-semibold hover:text-emerald-300"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-7 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              Your account information is protected.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
