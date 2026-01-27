"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErr("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErr(error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErr("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[180px] rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full relative z-10">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center text-white space-y-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Professional Investment Platform</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Investment Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Access your portfolio, track performance, and manage your investments
              with our secure, professional trading platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Shield className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-sm font-semibold text-white">Bank-Level Security</div>
              <div className="text-xs text-gray-400 mt-1">Your funds are protected</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Lock className="h-6 w-6 text-cyan-400 mb-2" />
              <div className="text-sm font-semibold text-white">Regulated Platform</div>
              <div className="text-xs text-gray-400 mt-1">Fully compliant & secure</div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.form
          onSubmit={handleLogin}
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
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-sm text-gray-400">
                Access your investment portfolio
              </p>
            </div>

            {err && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg mb-6 text-center"
              >
                {err}
              </motion.div>
            )}

            {/* Input Fields */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="you@example.com"
                  required
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Links */}
            <div className="flex justify-between items-center mt-6 text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition">
                <input type="checkbox" className="rounded border-white/20" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-6 text-lg rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Access Dashboard
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                  Create Account
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
                  <Lock className="h-4 w-4" />
                  <span>Encrypted</span>
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
