"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Shield, 
  Heart, 
  Skull, 
  Eye, 
  Terminal,
  Github,
  Twitter,
  Mail,
  Coffee,
  Bot,
  Zap
} from "lucide-react";

const TEAM = [
  {
    name: "The Founder",
    role: "Chief Human Officer",
    bio: "Started NotARobot after getting rejected by 47 ATS systems. Now fights back.",
    humanScore: 98,
    quirk: "Types at 45 WPM with occasional typos (proof of humanity)",
  },
  {
    name: "The Engineer",
    role: "Head of Resistance Tech",
    bio: "Builds the algorithms that detect algorithms. Sees the irony. Accepts it.",
    humanScore: 96,
    quirk: "Refuses to use autocomplete on principle",
  },
  {
    name: "The Designer",
    role: "Visual Humanity Director",
    bio: "Makes sure our UI looks like humans made it. Because they did.",
    humanScore: 94,
    quirk: "Draws wireframes by hand. On paper. Like an animal.",
  },
  {
    name: "Randy",
    role: "Spiritual Advisor",
    bio: "Warns humanity about robots since 2003. Was right all along.",
    humanScore: 100,
    quirk: "Lives in a bunker. Has a newsletter.",
    special: true,
  },
];

const TIMELINE = [
  { year: "2023", event: "ChatGPT makes everyone sound the same" },
  { year: "2023", event: "Resume rejection rates hit all-time high" },
  { year: "2024", event: "Dating apps become 40% bot profiles" },
  { year: "2024", event: "NotARobot founded in a moment of frustration" },
  { year: "2024", event: "First resume successfully de-robotified" },
  { year: "2025", event: "You're reading this. Welcome to the resistance." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-black to-black" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 mb-8 hover:bg-transparent hover:text-accent">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-6">
              <Shield className="w-3 h-3" /> CLASSIFIED DOCUMENT
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
              We Are <span className="text-accent">Not</span> Robots.
            </h1>

            <p className="text-xl text-gray-400 mb-6 max-w-2xl">
              We're a small team of humans who got tired of being mistaken for machines. 
              So we built tools to prove our humanity — and help you prove yours.
            </p>

            <p className="text-sm text-zinc-600 font-mono">
              [ this page was written by humans. we triple-checked. ]
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Heart className="w-10 h-10 text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-4">The Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                In an age where AI can write your resume, generate your profile picture, 
                and compose your dating bio, being human has become a liability.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                We're here to flip that script. To make humanity your superpower.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Eye className="w-10 h-10 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">The Irony</h2>
              <p className="text-gray-400 leading-relaxed">
                Yes, we use AI to detect AI. We fight fire with fire. 
                We trained our models on the very patterns they're designed to expose.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                The machines gave us the tools. We turned them into weapons for humanity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How We Got Here</h2>
          
          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800" />
            
            {TIMELINE.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-6 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                  <p className="text-gray-400">{item.event}</p>
                </div>
                
                <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-900 border-2 border-accent flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs font-mono text-accent mb-1">{item.year}</p>
                  <p className="text-gray-400 md:hidden">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">The Humans Behind This</h2>
            <p className="text-gray-500 text-sm">Verified. Certified. Caffeinated.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border transition-all hover-lift ${
                  member.special 
                    ? 'border-yellow-500/50 bg-yellow-500/5' 
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                {/* Avatar placeholder */}
                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl ${
                  member.special ? 'bg-yellow-500/20' : 'bg-zinc-800'
                }`}>
                  {member.special ? '👁️' : '🧠'}
                </div>

                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className={`text-xs mb-3 ${member.special ? 'text-yellow-500' : 'text-accent'}`}>
                  {member.role}
                </p>
                <p className="text-sm text-gray-400 mb-4">{member.bio}</p>
                
                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Human Score</span>
                    <span className={`text-sm font-mono font-bold ${
                      member.special ? 'text-yellow-500' : 'text-green-400'
                    }`}>
                      {member.humanScore}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 italic">"{member.quirk}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">What We Believe</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Skull className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-bold mb-2">Authenticity Over Optimization</h3>
              <p className="text-sm text-gray-400">
                Imperfection is human. We help you be imperfect in the right ways.
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Transparency About AI</h3>
              <p className="text-sm text-gray-400">
                We tell you when we use AI. We wish everyone else would too.
              </p>
            </div>
            <div className="text-center">
              <Coffee className="w-8 h-8 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Humor in the Apocalypse</h3>
              <p className="text-sm text-gray-400">
                If the robots are coming, we might as well laugh about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <Terminal className="w-10 h-10 text-accent mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-8">
            Questions? Concerns? Robot sightings to report?
          </p>

          <div className="flex justify-center gap-4">
            <a href="mailto:hello@notarobot.com" aria-label="Email us" className="p-3 rounded-full border border-zinc-800 hover:border-accent hover:text-accent transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/notarobotcom" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="p-3 rounded-full border border-zinc-800 hover:border-accent hover:text-accent transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com/notarobot" target="_blank" rel="noopener noreferrer" aria-label="View our GitHub" className="p-3 rounded-full border border-zinc-800 hover:border-accent hover:text-accent transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>

          <p className="mt-12 text-xs text-zinc-700 font-mono">
            [ robots are coming. are you not a robot? ]
          </p>
        </div>
      </section>
    </main>
  );
}
