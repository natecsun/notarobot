"use client";

import { motion } from "framer-motion";
import { Quote, CheckCircle, Skull, Bot } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "I was getting ghosted on every application. Turns out my resume sounded like it was written by a malfunctioning toaster. NotARobot fixed that.",
    author: "Sarah K.",
    role: "Software Engineer",
    company: "Now Employed",
    verified: true,
    humanScore: 94,
  },
  {
    quote: "Caught my Tinder match in 4K. Perfect symmetry, no pores, bio mentioned 'authentic connections' three times. Classic bot behavior.",
    author: "Marcus T.",
    role: "Catfish Survivor",
    company: "Still Single, But Wiser",
    verified: true,
    humanScore: 88,
  },
  {
    quote: "My students thought they could sneak AI essays past me. They thought wrong. NotARobot sees all.",
    author: "Dr. Helena Cross",
    role: "Professor",
    company: "University of the Suspicious",
    verified: true,
    humanScore: 97,
  },
  {
    quote: "I used to worry if I was a robot. Now I have a certificate that proves otherwise. My therapist is thrilled.",
    author: "Anonymous",
    role: "Definitely Human",
    company: "Earth, Probably",
    verified: true,
    humanScore: 91,
  },
  {
    quote: "The robots took my job. Then they took my wife. But they'll never take my humanity score.",
    author: "Frank D.",
    role: "Resistance Fighter",
    company: "The Underground",
    verified: true,
    humanScore: 99,
  },
  {
    quote: "01001000 01100101 01101100 01110000... I mean, great service! Very human! Would recommend to fellow humans!",
    author: "Totally Not A Bot",
    role: "Human Person",
    company: "Human Company LLC",
    verified: false,
    humanScore: 3,
    suspicious: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Verified Human Testimonials
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real feedback from real humans. Probably. We checked.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover-lift ${
                testimonial.suspicious 
                  ? 'border-red-500/50 bg-red-500/5 hover:border-red-500' 
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              {/* Suspicious badge */}
              {testimonial.suspicious && (
                <div className="absolute -top-3 -right-3 px-2 py-1 bg-red-500 text-white text-xs font-mono rounded flex items-center gap-1">
                  <Skull className="w-3 h-3" /> SUSPICIOUS
                </div>
              )}

              {/* Quote */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-zinc-700 mb-3" />
                <p className={`text-sm leading-relaxed ${
                  testimonial.suspicious ? 'text-red-200/70 font-mono' : 'text-gray-300'
                }`}>
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    {testimonial.verified && !testimonial.suspicious && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {testimonial.suspicious && (
                      <Bot className="w-4 h-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-gray-600">{testimonial.company}</p>
                </div>
                
                {/* Human Score */}
                <div className={`text-right ${
                  testimonial.suspicious ? 'text-red-400' : 'text-accent'
                }`}>
                  <p className="text-2xl font-bold font-mono">{testimonial.humanScore}%</p>
                  <p className="text-xs text-gray-500">human</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-zinc-600 mt-12 font-mono">
          [ one of these testimonials may not be from a human. can you spot it? ]
        </p>
      </div>
    </section>
  );
}
