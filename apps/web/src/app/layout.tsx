import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import MissionNav from "@/components/MissionNav";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        <MissionNav />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
