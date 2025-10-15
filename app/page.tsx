import React from "react";

export default function ForexLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-slate-50 text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="container mx-auto p-4 md:p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
            FX
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              FXProManage
            </h1>
            <p className="text-xs md:text-sm text-slate-500">
              Manual + Bot Forex Account Management
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-sm md:text-base">
          <a href="#how" className="hover:text-emerald-600 transition-colors">
            How it works
          </a>
          <a href="#plans" className="hover:text-emerald-600 transition-colors">
            Plans
          </a>
          <a
            href="#results"
            className="hover:text-emerald-600 transition-colors"
          >
            Results
          </a>
          <a
            href="#contact"
            className="hover:text-emerald-600 transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-800">
            Grow your capital{" "}
            <span className="text-emerald-600">consistently</span> with expert
            forex account management
          </h2>
          <p className="mt-4 text-slate-600 text-base md:text-lg">
            We deliver a blend of manual trading expertise and automated bot
            strategies to target
            <strong> 10–20% monthly returns</strong> while carefully managing
            risk.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all shadow-md"
            >
              Get Started
            </a>
            <a
              href="#how"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all"
            >
              How it works
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
            {[
              { label: "Avg Monthly", value: "10–20%" },
              { label: "Funding", value: "BTC or Broker" },
              { label: "Control", value: "Withdraw Anytime" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center"
              >
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-lg font-semibold text-slate-800">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="text-center">
            <div className="text-sm text-slate-500">
              Live sample (demo) performance
            </div>
            <div className="mt-3 flex flex-col items-center">
              <div className="text-5xl font-extrabold text-emerald-600">
                +15.2%
              </div>
              <div className="text-sm text-slate-500">Monthly (sample)</div>
            </div>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              We combine discretionary manual trades during high-probability
              setups with an always-on bot that captures micro-moves and refines
              entries.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="w-full px-5 py-2.5 rounded-md border hover:border-emerald-500 hover:text-emerald-600 transition-all">
                Request Live Proof
              </button>
              <button className="w-full px-5 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                Book a Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container mx-auto px-4 md:px-6 py-16">
        <h3 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          How it works
        </h3>
        <p className="text-slate-600 mt-2 text-center md:text-left max-w-2xl mx-auto md:mx-0">
          Simple steps to get started. You always keep control — funds remain in
          your account unless you prefer BTC transfer for convenience.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Fund", "Connect", "Trade", "Track"].map((step, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-emerald-500 font-semibold text-sm">
                Step {i + 1}
              </div>
              <h4 className="mt-2 font-semibold text-slate-800">{step}</h4>
              <p className="text-sm text-slate-600 mt-1">
                {i === 0
                  ? "Fund your broker account or send via BTC."
                  : i === 1
                  ? "Share investor access for management."
                  : i === 2
                  ? "Manual and bot trading for steady returns."
                  : "Track your performance anytime live."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="container mx-auto px-4 md:px-6 py-16 bg-gradient-to-b from-slate-50 to-white rounded-b-2xl"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          Ready to get started?
        </h3>
        <p className="text-slate-600 mt-2 text-center md:text-left">
          Fill the form or reach out directly via WhatsApp/Telegram.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <form className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-4">
            {[
              { label: "Full name", placeholder: "Jane Doe" },
              {
                label: "Email or WhatsApp",
                placeholder: "email or whatsapp number",
              },
              { label: "Investment amount", placeholder: "$500" },
            ].map((f, idx) => (
              <div key={idx}>
                <label className="text-sm text-slate-600">{f.label}</label>
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            <div>
              <label className="text-sm text-slate-600">Preferred method</label>
              <select className="mt-2 w-full rounded-md border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option>Fund broker (investor account)</option>
                <option>Send via BTC</option>
              </select>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all"
              >
                Submit
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-md border hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                WhatsApp
              </button>
            </div>
          </form>

          <div className="p-4 md:p-6">
            <h4 className="font-semibold text-slate-800">
              Prefer direct contact?
            </h4>
            <p className="text-sm text-slate-600 mt-2">
              WhatsApp: +254 7XX XXX XXX
            </p>
            <p className="text-sm text-slate-600 mt-2">Telegram: @yourhandle</p>
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <div className="text-sm text-slate-500">Next steps</div>
              <ol className="mt-2 text-sm text-slate-600 list-decimal list-inside space-y-1">
                <li>Choose a plan</li>
                <li>Fund your account or send BTC</li>
                <li>We start trading — you track results</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t py-6 bg-white text-center md:text-left">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>
            © {new Date().getFullYear()} FXProManage. All rights reserved.
          </div>
          <div className="max-w-md text-center md:text-right">
            Risk warning: Forex trading involves risk. Past performance is not
            indicative of future results.
          </div>
        </div>
      </footer>
    </main>
  );
}
