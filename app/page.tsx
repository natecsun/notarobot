"use client"

import { Button } from "@/components/ui/button";
import { FileSearch, UserX, GraduationCap, Trophy, Play, ArrowRight, Zap, Skull, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { EmailCapture } from "@/components/EmailCapture";
import { useState, useEffect } from "react";

const ROTATING_TAGLINES = [
  "Robots have no fingerprints.",
  "Your resume smells like a chatbot.",
  "Trust no one. Verify everyone.",
  "The machines are already here.",
  "We use AI to fight AI. Ironic.",
  "Blood type: definitely not 10W-40.",
];

export default function Home() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % ROTATING_TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
         {/* Glitch overlay effect */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/20 blur-[120px] rounded-full" />
           <div className="absolute top-1/4 right-0 w-px h-32 bg-accent/30 glitch-line" />
           <div className="absolute bottom-1/3 left-10 w-px h-24 bg-accent/20 glitch-line" style={{ animationDelay: '1s' }} />
         </div>
         
         <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Warning Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono mb-8 glitch-text"
              role="status"
              aria-live="polite"
            >
               <AlertTriangle className="w-3 h-3 animate-pulse" aria-hidden="true" /> 
               <span className="hidden sm:inline">THREAT LEVEL:</span> ELEVATED — AI INFILTRATION DETECTED
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
            >
               Prove You're Not <br /> 
               <span className="text-accent glitch-text">One of Them.</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-8 mb-10"
            >
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-mono">
                <span className="text-gray-600">&gt;</span> {ROTATING_TAGLINES[taglineIndex]}
                <span className="animate-pulse">_</span>
              </p>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base text-gray-500 mb-10 max-w-xl mx-auto"
            >
               Detect deepfakes. Sanitize robotic text. Expose fake profiles. 
               Your toolkit for surviving the Dead Internet Era.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col md:flex-row gap-4 justify-center items-center"
            >
               <Link href="/game">
                  <Button size="lg" className="h-12 px-8 text-base bg-accent text-black hover:bg-accent/90 font-bold w-full md:w-auto focus-ring group">
                     <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" aria-hidden="true" /> Prove Your Humanity
                  </Button>
               </Link>
               <Link href="/services/resume">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base border-zinc-700 hover:bg-zinc-900 hover:border-accent/50 text-gray-300 w-full md:w-auto focus-ring">
                     <Skull className="w-4 h-4 mr-2 opacity-50" /> De-Robotify My Resume
                  </Button>
               </Link>
            </motion.div>
            
            {/* Trust but verify */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 text-xs text-gray-600 font-mono"
            >
              [ we use AI to fight AI — the irony is not lost on us ]
            </motion.p>
         </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Bento Grid Features */}
      <section className="py-24 px-6 bg-zinc-950">
         <div className="max-w-6xl mx-auto">
            <div className="mb-12 flex items-center justify-between">
               <div>
                 <h2 className="text-3xl font-bold tracking-tight">Defense Arsenal</h2>
                 <p className="text-gray-500 text-sm mt-1">Tools for the resistance</p>
               </div>
               <div className="text-right">
                 <p className="text-gray-600 text-xs font-mono">SYS_STATUS: OPERATIONAL</p>
                 <p className="text-accent text-xs font-mono animate-pulse">● LIVE</p>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 auto-rows-[250px]">
               {/* Resume Card - Large */}
               <Link href="/services/resume" className="md:col-span-2 row-span-2 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-accent/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <FileSearch className="w-64 h-64" />
                  </div>
                  <div className="absolute top-4 right-4 px-2 py-1 bg-accent/10 border border-accent/20 rounded text-accent text-xs font-mono">
                    MOST POPULAR
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                           <FileSearch className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Resume Sanitizer</h3>
                        <p className="text-gray-400 max-w-md">Your resume reeks of ChatGPT. Recruiters can smell it. We'll scrub the robotic stench and make you sound like a real human who actually worked at those jobs.</p>
                        <p className="text-gray-600 text-sm mt-3 font-mono">" Your CV has a 73% chance of being flagged as AI-generated. "</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-mono text-accent group-hover:gap-4 transition-all">
                        FIX IT NOW <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
               </Link>

               {/* Profile Spotter */}
               <Link href="/services/profile" className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                     <UserX className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Catfish Detector</h3>
                  <p className="text-sm text-gray-400">That Tinder match has symmetrical eyes, perfect skin, and a bio written by GPT-4. Red flags. We'll confirm your suspicions.</p>
               </Link>

               {/* Essay Integrity */}
               <Link href="/services/essay" className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-green-500/50 transition-all duration-300">
                   <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                     <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">Essay Integrity</h3>
                  <p className="text-sm text-gray-400">Did your student actually write this? Stylometric analysis doesn't lie. (Unlike your students.)</p>
               </Link>
            </div>
         </div>
      </section>

      {/* Social Proof / Leaderboard Teaser */}
      <section className="py-24 border-t border-zinc-900">
         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
               {/* Scan lines effect */}
               <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] pointer-events-none" />
               
               <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                     <Trophy className="text-yellow-500" /> Hall of Humanity
                  </h2>
                  <p className="text-gray-400 mb-2 max-w-lg">
                     Join the verified humans competing to prove their sentience. 
                     Top scorers get bragging rights and existential validation.
                  </p>
                  <p className="text-gray-600 text-sm font-mono mb-6">
                     "I think, therefore I score." — Probably Descartes
                  </p>
                  <div className="flex gap-4">
                     <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-black flex items-center justify-center text-xs">🧠</div>
                        ))}
                     </div>
                     <span className="text-sm text-gray-500 flex items-center">+2.4k humans verified today</span>
                  </div>
               </div>
               <Link href="/leaderboard">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 border-none relative z-10 group">
                     <span className="group-hover:hidden">View Leaderboard</span>
                     <span className="hidden group-hover:inline">Prove You're Human</span>
                  </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Email Capture / Waitlist */}
      <div id="waitlist">
        <EmailCapture />
      </div>
    </main>
  );
}
