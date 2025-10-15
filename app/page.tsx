"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ForexLandingPage() {
  useEffect(() => {
    // Load TradingView widget script dynamically
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "OANDA:EURUSD",
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    document.getElementById("tradingview-widget")?.appendChild(script);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50 dark:from-emerald-950 dark:via-gray-950 dark:to-black text-foreground">
      {/* Hero Section */}
      <section className="text-center py-28 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fadeIn">
          Grow Your Capital with Expert Forex Management
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
          Earn <span className="font-semibold">10–20% monthly returns</span>{" "}
          with proven manual and automated strategies. Transparency, control,
          and performance you can trust.
        </p>
        <Button
          size="lg"
          className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          Get Started
        </Button>
      </section>

      {/* TradingView Live Chart */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">
          Live Market Overview
        </h2>
        <p className="text-muted-foreground mb-8">
          Stay updated with real-time forex movements directly from TradingView.
        </p>
        <div
          id="tradingview-widget"
          className="rounded-xl overflow-hidden border shadow-md h-[500px]"
        />
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Investing made simple. You retain control over your funds — we handle
          the trading with expertise and precision.
        </p>
        <div className="grid md:grid-cols-4 gap-8 text-left">
          {[
            {
              step: "1",
              title: "Fund Your Account",
              desc: "Open or fund your trading account (or deposit via BTC).",
            },
            {
              step: "2",
              title: "Connect to Our System",
              desc: "We link your account to our hybrid manual + AI trading system.",
            },
            {
              step: "3",
              title: "Track Live Results",
              desc: "View real-time profit growth directly in your trading dashboard.",
            },
            {
              step: "4",
              title: "Withdraw Anytime",
              desc: "Funds remain under your control — no lock-in period.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="text-emerald-600 text-3xl font-bold mb-3">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6 text-emerald-700">
            Investment Plans
          </h2>
          <p className="text-muted-foreground mb-12">
            Choose a plan that fits your goals — designed for steady, managed
            growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                deposit: "$100",
                return: "10–12%",
                risk: "Low",
                fee: "20%",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                name: "Growth",
                deposit: "$500",
                return: "15–18%",
                risk: "Moderate",
                fee: "25%",
                color: "bg-yellow-100 text-yellow-700",
              },
              {
                name: "Premium",
                deposit: "$1,000+",
                return: "20%+",
                risk: "Balanced",
                fee: "30%",
                color: "bg-blue-100 text-blue-700",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="p-8 rounded-2xl border bg-background shadow-sm hover:shadow-xl transition-transform hover:-translate-y-2"
              >
                <h3 className="text-2xl font-semibold mb-3 text-emerald-700">
                  {plan.name}
                </h3>
                <div className="mb-4 text-sm leading-relaxed">
                  <p>
                    💵 Minimum Deposit:{" "}
                    <span className="font-medium">{plan.deposit}</span>
                  </p>
                  <p>
                    📈 Monthly Return:{" "}
                    <span className="font-medium">{plan.return}</span>
                  </p>
                  <p>
                    ⚖️ Risk Level:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${plan.color}`}
                    >
                      {plan.risk}
                    </span>
                  </p>
                  <p>
                    💼 Management Fee:{" "}
                    <span className="font-medium">{plan.fee} of profit</span>
                  </p>
                </div>
                <Button className="w-full mt-6 font-semibold hover:scale-105 transition-transform">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-6 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-8">
          Have questions or ready to start investing? Reach out to us.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button variant="outline" className="hover:bg-emerald-50">
            WhatsApp
          </Button>
          <Button variant="outline" className="hover:bg-emerald-50">
            Telegram
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Send Email
          </Button>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Forex Managed Investments. All rights
        reserved.
      </footer>
    </main>
  );
}
