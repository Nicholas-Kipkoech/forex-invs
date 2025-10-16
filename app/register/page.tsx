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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState(""); // phone number

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
      // Create investor in your DB
      await fetch("/api/create-investor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id: data.user.id, name, email, phone }),
      });

      // Send notification email
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "registration",
          name,
          email,
          phone,
        }),
      });
    }

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6">
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-lg p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-700">
            Create Your Account
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Start growing your capital today
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 outline-none text-gray-800 placeholder-gray-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              type="email"
              className="w-full border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 outline-none text-gray-800 placeholder-gray-400 transition"
              required
            />
          </div>
          <label className="block text-sm text-slate-600">Phone Number</label>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={setPhone}
            inputClass="w-full border border-slate-300 rounded-md px-3 py-2"
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              className="w-full border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 outline-none text-gray-800 placeholder-gray-400 transition"
              required
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full text-white py-2 text-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
