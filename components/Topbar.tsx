// components/Topbar.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Topbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
  }, []);

  return (
    <header className="w-full bg-white shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href={"/"} className="font-bold text-emerald-700">
          NexTrade Inc
        </Link>
        <div className="text-sm text-slate-500">{email}</div>
      </div>
    </header>
  );
}
