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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-emerald-100"
      >
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          Sign in to access your investment dashboard
        </p>

        {err && (
          <div className="text-sm text-rose-600 mb-3 bg-rose-50 p-2 rounded-md">
            {err}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 text-sm">
          <span className="text-slate-500 cursor-not-allowed">
            Forgot password?
          </span>
          <Link href="/register" className="text-emerald-600 hover:underline">
            Create account
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </motion.form>
    </div>
  );
}
