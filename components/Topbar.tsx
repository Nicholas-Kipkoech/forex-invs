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
    <header className="w-full bg-slate-900 shadow-sm border-b border-slate-800 py-3 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          NexTrade Inc
        </Link>
        {email && (
          <div className="text-sm text-gray-400 truncate max-w-xs text-right">
            {email}
          </div>
        )}
      </div>
    </header>
  );
}
