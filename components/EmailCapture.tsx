"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, AlertTriangle, Loader2, Shield } from "lucide-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus("loading");
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list. Stay vigilant.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. The robots may be interfering.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Connection failed. Check if you're still human.");
    }
  };

  return (
    <section className="py-24 px-6 border-t border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-accent" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Join the Resistance
          </h2>
          
          <p className="text-gray-400 mb-2 max-w-lg mx-auto">
            Get early access to new detection tools, insider intel on AI threats, 
            and exclusive content. No spam — we're not robots.
          </p>
          
          <p className="text-xs text-zinc-600 font-mono mb-8">
            [ unsubscribe anytime. we respect human autonomy. ]
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="human@example.com"
                className="w-full h-12 pl-11 pr-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                disabled={status === "loading" || status === "success"}
              />
            </div>
            
            <Button
              type="submit"
              disabled={status === "loading" || status === "success" || !email}
              className="h-12 px-6 bg-accent text-black hover:bg-accent/90 font-bold disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enlisted
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </form>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 flex items-center justify-center gap-2 text-sm ${
                  status === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> No spam
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Unsubscribe anytime
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Human-verified
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
