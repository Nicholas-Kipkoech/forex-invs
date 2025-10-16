// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/deposit", label: "Deposit" },
    { href: "/dashboard/demo", label: "Demo" },
    { href: "/dashboard/profile", label: "Profile" },
  ];
  return (
    <nav className="bg-white rounded-lg shadow p-4 space-y-2">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`block px-3 py-2 rounded ${
            path === it.href
              ? "bg-emerald-600 text-white"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
