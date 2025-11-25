"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Skull, AlertTriangle, Brain, Bot, UserCheck } from "lucide-react";
import Link from "next/link";

// A/B Test Variants for the homepage hero
// Track which variant converts better using analytics

interface HeroProps {
  variant?: "A" | "B" | "C";
}

// Variant A: Fear-based (Original - "Prove You're Not One of Them")
export function HeroVariantA() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = [
    "Robots have no fingerprints.",
    "Your resume smells like a chatbot.",
    "Trust no one. Verify everyone.",
    "The machines are already here.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-black to-black" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono mb-6">
            <AlertTriangle className="w-3 h-3" />
            THREAT LEVEL: ELEVATED
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Prove You're <span className="text-accent">Not One of Them</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            The robots are infiltrating. Your resume, your dating matches, your online interactions — 
            all compromised. We give you the tools to fight back.
          </p>

          <p className="text-sm text-accent font-mono mb-8 h-6">
            {taglines[taglineIndex]}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services/resume">
              <Button size="lg" className="h-14 px-8 bg-accent text-black hover:bg-accent/90 font-bold">
                Sanitize My Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/game">
              <Button size="lg" variant="outline" className="h-14 px-8">
                Test My Detection Skills
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Variant B: Benefit-focused (Positive framing)
export function HeroVariantB() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-black to-black" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono mb-6">
            <UserCheck className="w-3 h-3" />
            VERIFIED HUMAN TOOLS
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Stand Out as <span className="text-green-400">Authentically Human</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            In a world drowning in AI content, authenticity is your superpower. 
            Get hired faster, date smarter, and communicate with confidence.
          </p>

          <div className="flex gap-8 justify-center mb-8 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span>5x more callbacks</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% bot-free matches</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services/resume">
              <Button size="lg" className="h-14 px-8 bg-green-500 text-black hover:bg-green-600 font-bold">
                Humanize My Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/game">
              <Button size="lg" variant="outline" className="h-14 px-8 border-green-500/30 hover:bg-green-500/10">
                Play the Detection Game
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Variant C: Curiosity/Problem-focused
export function HeroVariantC() {
  const stats = [
    { number: "47%", label: "of web traffic is bots" },
    { number: "75%", label: "of resumes rejected by ATS" },
    { number: "20%", label: "of dating profiles are fake" },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-black to-black" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono mb-6">
            <Brain className="w-3 h-3" />
            DID YOU KNOW?
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Your Resume Might <span className="text-purple-400">Smell Like AI</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            And that's probably why you're not getting callbacks. Recruiters can tell. 
            ATS systems can tell. We can fix that.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-purple-400 font-mono">{stat.number}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services/resume">
              <Button size="lg" className="h-14 px-8 bg-purple-500 text-white hover:bg-purple-600 font-bold">
                Check My Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/blog/how-to-spot-ai-generated-resume">
              <Button size="lg" variant="outline" className="h-14 px-8 border-purple-500/30 hover:bg-purple-500/10">
                Learn the Signs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// A/B Test wrapper - randomly assigns variant on first visit
export function HeroABTest() {
  const [variant, setVariant] = useState<"A" | "B" | "C">("A");

  useEffect(() => {
    // Check for existing assignment in localStorage
    const stored = localStorage.getItem("hero_variant");
    if (stored && ["A", "B", "C"].includes(stored)) {
      setVariant(stored as "A" | "B" | "C");
    } else {
      // Randomly assign variant
      const variants: ("A" | "B" | "C")[] = ["A", "B", "C"];
      const random = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem("hero_variant", random);
      setVariant(random);
      
      // Track variant assignment (would connect to analytics)
      console.log(`[A/B Test] Assigned hero variant: ${random}`);
    }
  }, []);

  switch (variant) {
    case "A":
      return <HeroVariantA />;
    case "B":
      return <HeroVariantB />;
    case "C":
      return <HeroVariantC />;
    default:
      return <HeroVariantA />;
  }
}
