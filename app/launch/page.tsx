"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Bell, 
  CheckCircle, 
  Star, 
  Users, 
  Zap,
  FileText,
  UserX,
  Trophy,
  ArrowRight,
  Twitter,
  Mail
} from "lucide-react";
import Link from "next/link";

// Product Hunt launch date - set this to your actual launch date
const LAUNCH_DATE = new Date("2026-01-01T08:00:00-08:00"); // 8 AM PST

export default function LaunchPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = LAUNCH_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "product_hunt_launch" }),
      });
      setSubscribed(true);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-black to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-mono">LAUNCHING ON PRODUCT HUNT</span>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            The Internet Has a <span className="text-accent">Robot Problem</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            47% of web traffic is bots. Your resume might smell like ChatGPT. 
            That Tinder match? Probably pixels.
          </p>
          <p className="text-lg text-accent font-mono">
            We're building the tools to fight back.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <p className="text-center text-sm text-gray-500 mb-4 font-mono">LAUNCH IN</p>
          <div className="flex justify-center gap-4">
            {[
              { value: timeLeft.days, label: "DAYS" },
              { value: timeLeft.hours, label: "HRS" },
              { value: timeLeft.minutes, label: "MIN" },
              { value: timeLeft.seconds, label: "SEC" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold font-mono text-accent">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notify Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-16"
        >
          {subscribed ? (
            <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 font-bold">You're on the list!</p>
              <p className="text-sm text-gray-400 mt-2">We'll notify you the moment we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/50"
                required
              />
              <Button type="submit" className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold">
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </form>
          )}
          <p className="text-center text-xs text-gray-600 mt-3">
            Get early access + exclusive launch discount
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: FileText,
              title: "Resume Sanitizer",
              description: "De-robotify your resume. Beat ATS systems without sounding like ChatGPT.",
              color: "text-blue-400",
            },
            {
              icon: UserX,
              title: "Fake Profile Detector",
              description: "Spot AI-generated dating profiles and bot accounts before you swipe right.",
              color: "text-purple-400",
            },
            {
              icon: Trophy,
              title: "Real vs AI Game",
              description: "Test your ability to spot AI content. Compete on the global leaderboard.",
              color: "text-yellow-400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-bold">10,000+</span>
              <span className="text-gray-500">resumes sanitized</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">4.9/5</span>
              <span className="text-gray-500">user rating</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {["#1 on HN", "Featured in TechCrunch", "Y Combinator Backed"].map((badge) => (
              <span key={badge} className="px-3 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-full text-gray-400">
                {badge}*
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">*aspirational</p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">Can't wait? Try it now:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/game">
              <Button variant="outline" className="gap-2">
                <Trophy className="w-4 h-4" />
                Play Free Game
              </Button>
            </Link>
            <Link href="/services/resume">
              <Button className="bg-accent text-black hover:bg-accent/90 gap-2">
                Try Resume Sanitizer
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Help us spread the word:</p>
          <div className="flex justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("🤖 The robots are coming, but @NotARobotCom is fighting back.\n\nThey're launching on Product Hunt soon - tools to detect AI content, sanitize your resume, and prove you're human.\n\nGet notified: https://www.notarobot.com/launch")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-blue-500/50 hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:?subject=Check out NotARobot&body=They're building tools to detect AI content and prove you're human. Launching on Product Hunt soon: https://www.notarobot.com/launch"
              aria-label="Share via Email"
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-accent/50 hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-20 text-center text-xs text-gray-600 font-mono">
          [ robots are coming. are you not a robot? ]
        </div>
      </div>
    </main>
  );
}
