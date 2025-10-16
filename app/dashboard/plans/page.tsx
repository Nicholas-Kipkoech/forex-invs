"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$100",
    roi: "10–12% / month",
    risk: "Low",
    features: [
      "Basic trading strategies",
      "Monthly performance report",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$500",
    roi: "15–18% / month",
    risk: "Balanced",
    features: [
      "Advanced trading strategies",
      "Weekly performance report",
      "Priority support",
      "Portfolio insights",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: "$1,000+",
    roi: "20%+ / month",
    risk: "High",
    features: [
      "Professional trading strategies",
      "Daily performance report",
      "Dedicated account manager",
      "AI-powered insights",
      "VIP support",
    ],
  },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6 sm:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-emerald-700">
          Investment Plans
        </h1>
        <p className="text-slate-600 mt-2">
          Choose a plan that suits your investment goals.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.05 }}
            className={`relative flex flex-col rounded-3xl shadow-lg p-6 border transition-colors duration-300 ${
              plan.recommended
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white border-emerald-100"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 right-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                Recommended
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-xl font-extrabold mb-2">{plan.price}</p>
            <p className="text-sm mb-4">
              ROI: <span className="font-semibold">{plan.roi}</span> | Risk:{" "}
              <span className="font-semibold">{plan.risk}</span>
            </p>

            <ul className="flex-1 mb-6 space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">•</span>{" "}
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full ${
                plan.recommended
                  ? "bg-white text-emerald-600 hover:bg-white/90"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {selectedPlan === plan.name ? "Selected" : "Select Plan"}
            </Button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-12 text-center bg-emerald-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-emerald-700">
            You selected the {selectedPlan} plan!
          </h3>
          <p className="text-slate-600 mt-2">
            Proceed to deposit funds to activate this plan.
          </p>
          <Button
            onClick={() => alert(`Redirecting to deposit for ${selectedPlan}`)}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Deposit Now
          </Button>
        </div>
      )}
    </div>
  );
}
