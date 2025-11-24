"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user?.id) {
      await fetch("/api/create-investor", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ user_id: data.user.id, name, email, phone }),
      });

      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registration", name, email, phone }),
      });
    }

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* GLASS GLOW BACKDROPS */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/5 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full"></div>

      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white">Join OKX Traders</h2>
          <p className="text-gray-400 text-sm mt-2">
            Start trading crypto today — deposit USDT or BTC instantly.
          </p>
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@domain.com"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Phone Number</label>
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={setPhone}
              containerClass="mt-1"
              inputClass="!w-full !h-[50px] !bg-gray-800 !border !border-gray-700 !text-white !rounded-lg !pl-14 focus:!border-white focus:!ring-1 outline-none transition"
              buttonClass="!bg-gray-700 !border-gray-700 !rounded-l-lg"
              dropdownClass="!bg-gray-900 !text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition"
              required
            />
          </div>
        </div>

        {/* CTA BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-6 text-lg rounded-xl bg-white text-black hover:bg-gray-100 shadow-md transition-all"
        >
          {loading ? "Creating account..." : "Create Account →"}
        </Button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>

        {/* TRUST BADGE */}
        <div className="text-center text-xs text-gray-500 mt-4">
          🔐 Secure & regulated crypto trading platform
        </div>
      </motion.form>
    </div>
  );
}
