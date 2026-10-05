"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  Check,
  BarChart3,
  Layers,
  Landmark,
  Gem,
  Activity,
  Bitcoin,
  Moon,
} from "lucide-react";
import { CATEGORIES, type MarketCategory } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";
import type { PriceData } from "@/lib/types";

/* -------------------- shared: click-outside -------------------- */

function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

const CATEGORY_ICONS: Record<string, any> = {
  stocks: BarChart3,
  funds: Layers,
  bonds: Landmark,
  commodities: Gem,
  indices: Activity,
  crypto: Bitcoin,
  shariah: Moon,
};

const COLOR_MAP: Record<
  string,
  { text: string; bg: string; border: string; ring: string }
> = {
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    ring: "focus:ring-emerald-500/30",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    ring: "focus:ring-cyan-500/30",
  },
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    ring: "focus:ring-amber-500/30",
  },
  yellow: {
    text: "text-yellow-400",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    ring: "focus:ring-yellow-500/30",
  },
  purple: {
    text: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    ring: "focus:ring-purple-500/30",
  },
  orange: {
    text: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
    ring: "focus:ring-orange-500/30",
  },
  teal: {
    text: "text-teal-400",
    bg: "bg-teal-500/15",
    border: "border-teal-500/30",
    ring: "focus:ring-teal-500/30",
  },
};

/* ============================================================
   CategoryDropdown
   ============================================================ */

interface CategoryDropdownProps {
  value: string;
  onChange: (key: string) => void;
}

export function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef: RefObject<HTMLDivElement | any> = useRef<HTMLDivElement>(null);
  useOnClickOutside(rootRef, () => setOpen(false));

  const current = CATEGORIES[value];
  const CurrentIcon = CATEGORY_ICONS[value] ?? BarChart3;
  const colors = COLOR_MAP[current?.color ?? "emerald"];

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-white outline-none focus:ring-2 ${colors.ring}`}
      >
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-lg ${colors.bg}`}
        >
          <CurrentIcon className={`h-3.5 w-3.5 ${colors.text}`} />
        </span>
        <span className="font-medium">{current?.label ?? "Select"}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b0f18]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1.5 max-h-80 overflow-y-auto">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const Icon = CATEGORY_ICONS[key] ?? BarChart3;
              const c = COLOR_MAP[cat.color];
              const active = key === value;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    active ? c.bg : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-lg ${c.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${c.text}`} />
                  </span>
                  <span className="flex-1">
                    <div
                      className={`text-sm font-medium ${active ? c.text : "text-white"}`}
                    >
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {cat.list.length} instruments
                    </div>
                  </span>
                  {active && <Check className={`h-4 w-4 ${c.text}`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SymbolDropdown
   ============================================================ */

interface SymbolDropdownProps {
  category: string;
  value: string;
  onChange: (id: string) => void;
  prices: PriceData;
  basePrices: PriceData;
}

export function SymbolDropdown({
  category,
  value,
  onChange,
  prices,
  basePrices,
}: SymbolDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef: RefObject<HTMLDivElement | any> = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(rootRef, () => setOpen(false));

  const cat: MarketCategory | undefined = CATEGORIES[category];
  const colors = COLOR_MAP[cat?.color ?? "emerald"];

  const filtered = useMemo(() => {
    const list = cat?.list ?? [];
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(
      (s) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [cat, query]);

  const currentMeta = cat?.list.find((s) => s.id === value);

  useEffect(() => {
    if (open) {
      setQuery("");
      // focus after the panel mounts
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 pl-3 pr-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all outline-none focus:ring-2 ${colors.ring} min-w-[190px]`}
      >
        <span className="flex flex-col items-start text-left leading-tight">
          <span className="text-sm font-semibold text-white font-mono">
            {value}
          </span>
          <span className="text-[11px] text-gray-500 truncate max-w-[140px]">
            {currentMeta?.name ?? "Select a symbol"}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0b0f18]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10">
            <Search className="h-4 w-4 text-gray-500 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cat?.label.toLowerCase() ?? "symbols"}...`}
              className="bg-transparent outline-none text-sm text-white placeholder:text-gray-600 w-full"
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <div className="text-center text-xs text-gray-500 py-6">
                No symbols match "{query}"
              </div>
            )}
            {filtered.map((s) => {
              const price = prices[s.id];
              const base = basePrices[s.id];
              const change = base ? ((price - base) / base) * 100 : 0;
              const active = s.id === value;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    active ? colors.bg : "hover:bg-white/5"
                  }`}
                >
                  <span className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold font-mono ${active ? colors.text : "text-white"}`}
                      >
                        {s.id}
                      </span>
                      {active && (
                        <Check className={`h-3.5 w-3.5 ${colors.text}`} />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {s.name}
                    </div>
                  </span>
                  {typeof price === "number" && (
                    <span className="text-right shrink-0">
                      <div className="text-xs font-mono text-white">
                        {formatMoney(price)}
                      </div>
                      <div
                        className={`text-[10.5px] font-mono ${
                          change >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </div>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
