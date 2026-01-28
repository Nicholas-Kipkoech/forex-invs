"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Wallet,
  BarChart3,
  User,
  Menu,
  X,
  Copy,
  History,
  Settings,
  Calculator,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/copy-trading", label: "Copy Trading", icon: Copy },
    // { href: "/dashboard/transactions", label: "Transactions", icon: History },
    { href: "/dashboard/tools", label: "Trading Tools", icon: Calculator },
    { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/support", label: "Support", icon: HelpCircle },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Hamburger (Mobile Only) */}
      <button
        className="md:hidden fixed top-5 left-4 z-50 p-2 bg-[#0A0F1E] text-gray-300 rounded-lg border border-[#1B2340]"
        onClick={() => setOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-[250px] p-4 border-r border-[#1B2340] flex flex-col justify-between bg-[#0A0F1E]"
            >
              <div>
                <button
                  className="mb-6 text-gray-400 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <X size={24} />
                </button>

                <nav className="space-y-2">
                  {items.map((item) => {
                    const isActive = path === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-[#00A6FF]/20 to-[#00A6FF]/10 text-[#00A6FF]"
                            : "hover:bg-[#121823] text-gray-400 hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-[#00A6FF]"
                              : "text-gray-500 group-hover:text-white"
                          }`}
                        />
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 w-[3px] h-full bg-[#00A6FF] rounded-r-md"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="text-xs text-gray-500 text-center pt-4 border-t border-[#1B2340]">
                <p className="text-gray-600">v1.0 • Afroxen</p>
                <p className="text-gray-500 mt-1">
                  © {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex bg-[#0A0F1E] text-gray-300 shadow-lg p-4 flex-col justify-between h-screen border border-[#1B2340] w-[260px]">
        <nav className="space-y-2 overflow-y-auto flex-1">
          {items.map((item) => {
            const isActive = path === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#00A6FF]/20 to-[#00A6FF]/10 text-[#00A6FF]"
                    : "hover:bg-[#121823] text-gray-400 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-[#00A6FF]"
                      : "text-gray-500 group-hover:text-white"
                  }`}
                />
                <span className="font-medium text-sm">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 w-[3px] h-full bg-[#00A6FF] rounded-r-md"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="text-xs text-gray-500 text-center pt-4 border-t border-[#1B2340]">
          <p className="text-gray-600">v1.0 • Afroxen</p>
          <p className="text-gray-500 mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </aside>
    </>
  );
}
