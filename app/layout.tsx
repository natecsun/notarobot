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
  title: "NotARobot.com - Prove You're Human | AI Detection & Resume Sanitizer",
  description: "Detect AI-generated content, sanitize your resume for ATS systems, and verify authentic profiles. Tools for humans in an AI world.",
  keywords: ["AI detection", "resume sanitizer", "fake profile detector", "ChatGPT detector", "ATS optimization", "human verification"],
  authors: [{ name: "NotARobot Team" }],
  creator: "NotARobot",
  publisher: "NotARobot",
  metadataBase: new URL("https://www.notarobot.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NotARobot.com - Prove You're Human",
    description: "Detect AI-generated content, sanitize your resume, and verify authentic profiles. Tools for humans in an AI world.",
    url: "https://www.notarobot.com",
    siteName: "NotARobot",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "NotARobot - Prove You're Human",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotARobot.com - Prove You're Human",
    description: "Detect AI-generated content, sanitize your resume, and verify authentic profiles.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
