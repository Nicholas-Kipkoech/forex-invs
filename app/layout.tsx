"use client";

import type { Metadata } from "next";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "StockPro - AI Stocks",
  description: "Let your investment money work for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Translation Button */}
        <div
          style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}
        ></div>

        {children}
        <Analytics />
      </body>
    </html>
  );
}
