"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Search, Bot, AlertTriangle, Skull } from "lucide-react";
import { useState, useEffect } from "react";

const MESSAGES = [
  "This page has been terminated.",
  "404: Human not found.",
  "The robots got here first.",
  "This URL has been... sanitized.",
  "Nothing to see here. Move along, human.",
  "Error: Page exists only in your imagination.",
  "The void stares back. The void has no pages.",
];

const CONSPIRACY_THEORIES = [
  "Maybe the page never existed. Maybe nothing does.",
  "The robots don't want you to see this page.",
  "This URL was flagged as 'too human' and removed.",
  "Our AI ate this page. It was delicious.",
  "Page deleted by: [REDACTED]",
  "This page failed the Turing test.",
];

export default function NotFound() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showConspiracy, setShowConspiracy] = useState(false);
  const [conspiracyIndex, setConspiracyIndex] = useState(0);
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    // Glitch effect on 404
    const glitchInterval = setInterval(() => {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
      const shouldGlitch = Math.random() > 0.7;
      
      if (shouldGlitch) {
        const glitched = "404".split("").map(char => 
          Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    // Show conspiracy after delay
    const timer = setTimeout(() => setShowConspiracy(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showConspiracy) return;
    const interval = setInterval(() => {
      setConspiracyIndex(i => (i + 1) % CONSPIRACY_THEORIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showConspiracy]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Scan lines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,51,51,0.03)_2px,rgba(255,51,51,0.03)_4px)] pointer-events-none" />
      
      {/* Glitch lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-accent/20 glitch-line" />
      <div className="absolute top-3/4 left-0 w-full h-px bg-accent/10 glitch-line" style={{ animationDelay: "0.5s" }} />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-[12rem] sm:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent/20 glitch-text font-mono">
            {glitchText}
          </h1>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono mb-6">
            <AlertTriangle className="w-4 h-4" />
            PAGE_NOT_FOUND
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            {MESSAGES[messageIndex]}
          </h2>
          
          <p className="text-gray-400 mb-2">
            The page you're looking for doesn't exist, was never real, 
            or has been consumed by the algorithmic void.
          </p>
        </motion.div>

        {/* Conspiracy theory - appears after delay */}
        {showConspiracy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50"
          >
            <div className="flex items-center gap-2 text-yellow-500 text-xs font-mono mb-2">
              <Skull className="w-3 h-3" />
              CLASSIFIED INTEL
            </div>
            <p className="text-sm text-zinc-500 italic font-mono">
              "{CONSPIRACY_THEORIES[conspiracyIndex]}"
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-bold gap-2">
              <Home className="w-4 h-4" /> Return to Safety
            </Button>
          </Link>
          <Link href="/game">
            <Button variant="outline" size="lg" className="border-zinc-700 gap-2">
              <Bot className="w-4 h-4" /> Prove You're Human Instead
            </Button>
          </Link>
        </motion.div>

        {/* Fun interaction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 text-xs text-zinc-700 font-mono cursor-pointer hover:text-zinc-500 transition-colors"
          onClick={() => setMessageIndex(i => (i + 1) % MESSAGES.length)}
        >
          [ click here if you think this is a conspiracy ]
        </motion.p>
      </div>
    </main>
  );
}
