"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LegalPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Header Section */}
      <section className="bg-emerald-700 text-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Legal & Risk Disclosure
          </motion.h1>
          <motion.p
            className="text-emerald-100 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Please review the following terms, policies, and risk warnings
            carefully before using our services.
          </motion.p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 space-y-12 text-gray-700">
          {/* Terms of Use */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              1. Terms of Use
            </h2>
            <p className="mb-4">
              By accessing and using this platform, you agree to abide by our
              terms, conditions, and policies. You confirm that you are of legal
              age and authorized to engage in trading and investment activities
              under the laws of your jurisdiction.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of our services after updates constitutes acceptance of the
              revised terms.
            </p>
          </div>

          {/* Risk Disclosure */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              2. Risk Disclosure
            </h2>
            <p className="mb-4">
              Trading in foreign exchange (Forex), cryptocurrencies, or any
              leveraged product involves significant risk and may not be
              suitable for all investors. You may lose some or all of your
              invested capital.
            </p>
            <p className="mb-4">
              Past performance does not guarantee future results. You should
              carefully consider your investment objectives, level of
              experience, and risk tolerance before engaging in any trading
              activity.
            </p>
            <p>
              This platform does not provide investment, tax, or legal advice.
              All decisions are made at your own discretion.
            </p>
          </div>

          {/* Privacy & Data Protection */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              3. Privacy & Data Protection
            </h2>
            <p className="mb-4">
              We value your privacy. All personal and financial data is stored
              securely and used solely for service delivery, compliance, and
              verification purposes.
            </p>
            <p>
              We implement strict{" "}
              <span className="font-medium text-emerald-700">
                Anti-Money Laundering (AML)
              </span>{" "}
              and{" "}
              <span className="font-medium text-emerald-700">
                Know Your Customer (KYC)
              </span>{" "}
              procedures to ensure the integrity of our operations and protect
              against fraudulent activity.
            </p>
          </div>

          {/* Compliance Statement */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              4. Compliance Statement
            </h2>
            <p className="mb-4">
              We operate in accordance with applicable international standards
              for financial services. All client funds are processed through
              secure, verified channels. We strive to maintain full transparency
              in reporting, record keeping, and withdrawal procedures.
            </p>
            <p>
              We are committed to maintaining ethical business practices and
              following all relevant laws in the regions where we operate.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              5. Contact & Support
            </h2>
            <p className="mb-4">
              For any legal inquiries, compliance concerns, or general support,
              please reach out to our team:
            </p>
            <ul className="space-y-2">
              <li>
                📧 Email:{" "}
                <a
                  href="mailto:Afroxenmanage@gmail.com"
                  className="text-emerald-700 hover:underline"
                >
                  Afroxenmanage@gmail.com
                </a>
              </li>
              <li>📅 Support Hours: Monday – Friday, 9:00 AM – 6:00 PM</li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="text-sm text-gray-500 pt-6 border-t">
            <p>
              © {new Date().getFullYear()} FX PRO INVESTMENTS. All rights
              reserved. This document is for informational purposes only and
              does not constitute financial advice.
            </p>
            <p className="mt-2">
              <Link
                href="/"
                className="text-emerald-700 hover:underline transition"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
