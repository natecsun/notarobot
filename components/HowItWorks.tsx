"use client";

import { Upload, ScanSearch, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload Evidence",
    description: "Submit resumes, profiles, or essays. We support PDF, text, and image formats for analysis.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    icon: ScanSearch,
    title: "AI Forensics",
    description: "Our multi-model engine (Llama 3 + Vision) scans for GAN artifacts, perplexity patterns, and robotic phrasing.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    icon: ShieldCheck,
    title: "Verify Humanity",
    description: "Get a detailed report. Sanitize your content to bypass AI detectors or flag fake profiles instantly.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden border-y border-zinc-900">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Defense in 3 Steps
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We use advanced adversarial AI to fight malicious AI. It's fire fighting fire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl border ${step.border} bg-zinc-900/50 hover:bg-zinc-900 transition-colors group`}
            >
              <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                {step.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 -right-4 w-8 h-[2px] bg-gradient-to-r from-zinc-800 to-transparent z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
