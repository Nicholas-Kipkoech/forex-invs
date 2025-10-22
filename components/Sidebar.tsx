// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Wallet, BarChart3, User } from "lucide-react";

export default function Sidebar() {
  const path = usePathname();

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
    { href: "/dashboard/demo", label: "Demo", icon: BarChart3 },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="bg-[#0B0E13] text-gray-300 rounded-2xl shadow-lg p-4 flex flex-col justify-between min-h-[90vh] border border-[#1B1F2A]">
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = path === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400"
                  : "hover:bg-[#121823] text-gray-400 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-emerald-400"
                    : "text-gray-500 group-hover:text-white"
                }`}
              />
              <span className="font-medium text-sm">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 w-[3px] h-full bg-emerald-500 rounded-r-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="text-xs text-gray-500 text-center pt-4 border-t border-[#1B1F2A]">
        <p className="text-gray-600">v1.0 • StockAI</p>
        <p className="text-gray-500 mt-1">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </aside>
  );
}
