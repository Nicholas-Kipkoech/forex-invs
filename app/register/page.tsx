"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { validateEmail, sanitizeInput } from "@/lib/utils";
import { TrendingUp, Shield, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email.trim());

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: { data: { name: sanitizedName } },
      });

      if (error) {
        setError(error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (data.user?.id) {
        // Create investor record
        const investorResponse = await fetch("/api/create-investor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: data.user.id,
            name: sanitizedName,
            email: sanitizedEmail,
            phone: phone || undefined,
          }),
        });

        if (!investorResponse.ok) {
          const investorError = await investorResponse.json();
          console.error("Error creating investor:", investorError);
          // Don't fail registration if investor creation fails
        }

        // Send notification (non-blocking)
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "registration",
            name: sanitizedName,
            email: sanitizedEmail,
            phone: phone || undefined,
          }),
        }).catch((err) => {
          console.error("Error sending notification:", err);
          // Non-blocking error
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[180px] rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full relative z-10">
        {/* Left side - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center text-white space-y-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <Star className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Start Your Investment Journey</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Join Thousands of
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Successful Investors
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Create your account and start building your portfolio today. Access professional
              trading tools, copy trading, and expert insights.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {[
              "Professional trading platform with MT5",
              "Copy trading from top-performing traders",
              "Ultra-low spreads and fast payouts",
              "Bank-level security and regulation",
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Registration Form */}
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4">
                <TrendingUp className="h-8 w-8 text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-sm text-gray-400">
                Start investing in minutes
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg mb-6 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* INPUTS */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Phone Number
                </label>
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={setPhone}
                  containerClass="mt-1"
                  inputClass="!w-full !h-[50px] !bg-white/5 !border !border-white/10 !text-white !rounded-xl !pl-14 focus:!border-emerald-500/50 focus:!ring-2 focus:!ring-emerald-500/20 outline-none transition-all"
                  buttonClass="!bg-white/10 !border-white/10 !rounded-l-xl"
                  dropdownClass="!bg-slate-800 !text-white !border-white/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-6">
              <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-white/20" required />
                <span>
                  I agree to the{" "}
                  <Link href="/legal" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* CTA BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-6 text-lg rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            {/* LOGIN LINK */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Regulated</span>
                </div>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
