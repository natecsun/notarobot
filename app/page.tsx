"use client"

import { Button } from "@/components/ui/button";
import { FileSearch, UserX, GraduationCap, Trophy, Play, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-8"
            >
               <Zap className="w-3 h-3" /> POWERED BY GROQ & LLAMA 3
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
            >
               The Human Defense <br /> Layer for the Web.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
               Detect deepfakes, sanitize AI-written text, and verify your humanity. 
               The definitive toolkit for surviving the Dead Internet.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col md:flex-row gap-4 justify-center items-center"
            >
               <Link href="/game">
                  <Button size="lg" className="h-12 px-8 text-base bg-accent text-black hover:bg-accent/90 font-bold w-full md:w-auto">
                     <Play className="w-4 h-4 mr-2" /> Play Real vs AI
                  </Button>
               </Link>
               <Link href="/services/resume">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base border-zinc-800 hover:bg-zinc-900 text-gray-300 w-full md:w-auto">
                     Sanitize Resume
                  </Button>
               </Link>
            </motion.div>
         </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6 bg-zinc-950">
         <div className="max-w-6xl mx-auto">
            <div className="mb-12 flex items-center justify-between">
               <h2 className="text-3xl font-bold tracking-tight">Intelligence Suite</h2>
               <p className="text-gray-500">v1.0.0 Stable</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 auto-rows-[250px]">
               {/* Resume Card - Large */}
               <Link href="/services/resume" className="md:col-span-2 row-span-2 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <FileSearch className="w-64 h-64" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                           <FileSearch className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Resume Sanitizer</h3>
                        <p className="text-gray-400 max-w-md">Recruiters are using AI to filter candidates. Fight back by humanizing your CV to bypass automated rejection and "AI smell" tests.</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-mono text-accent">
                        TRY NOW <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
               </Link>

               {/* Profile Spotter */}
               <Link href="/services/profile" className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                     <UserX className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fake Profile Spotter</h3>
                  <p className="text-sm text-gray-400">Detect GAN-generated faces and LLM bios on dating apps.</p>
               </Link>

               {/* Essay Integrity */}
               <Link href="/services/essay" className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all">
                   <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                     <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Essay Integrity</h3>
                  <p className="text-sm text-gray-400">Verify academic work against stylometric fingerprints.</p>
               </Link>
            </div>
         </div>
      </section>

      {/* Social Proof / Leaderboard Teaser */}
      <section className="py-24 border-t border-zinc-900">
         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                     <Trophy className="text-yellow-500" /> Hall of Humanity
                  </h2>
                  <p className="text-gray-400 mb-6 max-w-lg">
                     Join 10,000+ verified humans competing to prove their sentience. 
                     Top scorers get exclusive access to beta tools.
                  </p>
                  <div className="flex gap-4">
                     <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-black" />
                        ))}
                     </div>
                     <span className="text-sm text-gray-500 flex items-center">+2.4k joined today</span>
                  </div>
               </div>
               <Link href="/leaderboard">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 border-none">
                     View Leaderboard
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
