import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VibeLogger } from "@/components/VibeLogger";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotARobot.com",
  description: "Your shield against the AI revolution. Detect, Sanitize, and Verify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-black antialiased text-white")}>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <VibeLogger />
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-5191EBXXM8"} />
      </body>
    </html>
  );
}
