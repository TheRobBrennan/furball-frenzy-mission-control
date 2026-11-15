import type { Metadata } from "next";
import { Geist, Geist_Mono, Overpass } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import BackToTop from "@/components/BackToTop";
import LegalLinks from "@/components/LegalLinks";
import PromoSplash from "@/components/PromoSplash";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Space Apps Charlotte's site is set in Overpass, the Zamboni skin uses the same face.
const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Furball Frenzy: Mission Control",
  description:
    "A space mission design game starring the Polish elephants and their furball crew, built for the 2026 NASA Space Apps Challenge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-binder="closed"
      data-binder-first=""
      className={`${geistSans.variable} ${geistMono.variable} ${overpass.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        {children}
        <LegalLinks />
        <AnalyticsConsent />
        <PromoSplash />
        <BackToTop />
      </body>
    </html>
  );
}
