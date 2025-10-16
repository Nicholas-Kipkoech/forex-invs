// app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    // subscribe to auth changes (optional)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-6 px-4 py-6">
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
        <main className="lg:col-span-5">{children}</main>
      </div>
    </div>
  );
}
