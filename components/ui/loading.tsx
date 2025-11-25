"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, Scan, ShieldAlert, Fingerprint, Eye } from "lucide-react";

const LOADING_MESSAGES = [
  { text: "Scanning for robotic behavior patterns...", icon: Scan },
  { text: "Checking if you blink at normal intervals...", icon: Eye },
  { text: "Analyzing your keyboard hesitation patterns...", icon: Fingerprint },
  { text: "Confirming blood type is not 10W-40...", icon: ShieldAlert },
  { text: "Verifying you have existential dread...", icon: Bot },
  { text: "Counting the neurons... this may take a while...", icon: Cpu },
  { text: "Asking the void if you're human...", icon: Bot },
  { text: "Consulting the ancient CAPTCHA scrolls...", icon: Scan },
  { text: "Measuring your soul's electromagnetic signature...", icon: ShieldAlert },
  { text: "Checking if your dreams are in RGB or CMYK...", icon: Eye },
];

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  showMessage?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  showMessage = true,
  className = "" 
}: LoadingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    if (!showMessage) return;
    
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [showMessage]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const CurrentIcon = LOADING_MESSAGES[messageIndex].icon;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Animated robot icon */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} rounded-full border-2 border-accent/30 border-t-accent`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-8 h-8"} text-accent animate-pulse`} />
        </div>
      </div>

      {/* Loading message */}
      {showMessage && (
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-gray-400 font-mono"
          >
            <CurrentIcon className="w-4 h-4 text-accent/50" />
            <span>{LOADING_MESSAGES[messageIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Full page loading state
export function LoadingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <LoadingSpinner size="lg" />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="mt-12 text-xs text-zinc-700 font-mono text-center"
      >
        [ if this takes too long, you might actually be a robot ]
      </motion.p>
    </div>
  );
}

// Inline loading for buttons/forms
export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 bg-current rounded-full"
        />
      ))}
    </span>
  );
}
