"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full"></div>

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <h2 className="text-4xl font-bold text-center text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400 text-center mt-2 mb-6">
          Access your crypto trading dashboard securely
        </p>

        {err && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg mb-4 text-center">
            {err}
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition"
              placeholder="you@domain.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex justify-between items-center mt-5 text-sm">
          <span className="text-gray-500 cursor-pointer hover:text-gray-300 transition">
            Forgot password?
          </span>
          <Link href="/register" className="text-white hover:underline">
            Create account
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-7 py-6 text-lg rounded-xl bg-white text-black hover:bg-gray-100 shadow-md transition-all"
        >
          {loading ? "Signing in..." : "Access Dashboard"}
        </Button>

        {/* Trust Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          🔒 Secure & regulated crypto trading platform
        </div>
      </motion.form>
    </div>
  );
}
