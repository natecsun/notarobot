"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Code, ExternalLink, Shield } from "lucide-react";

export default function BadgePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<"light" | "dark">("dark");
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium");

  const sizes = {
    small: { width: 120, height: 40 },
    medium: { width: 180, height: 50 },
    large: { width: 240, height: 65 },
  };

  const badgeUrl = `https://www.notarobot.com/api/badge?style=${selectedStyle}&size=${selectedSize}`;
  const verifyUrl = "https://www.notarobot.com/verify/YOUR_ID";

  const embedCodes = {
    html: `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeUrl}" alt="NotARobot Verified Human" width="${sizes[selectedSize].width}" height="${sizes[selectedSize].height}" />
</a>`,
    markdown: `[![NotARobot Verified Human](${badgeUrl})](${verifyUrl})`,
    bbcode: `[url=${verifyUrl}][img]${badgeUrl}[/img][/url]`,
  };

  const handleCopy = (type: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <Link href="/">
          <Button variant="ghost" className="gap-2 pl-0 mb-8 hover:bg-transparent hover:text-accent">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Certified Human Badge
            </h1>
          </div>
          
          <p className="text-gray-400 mb-8 max-w-2xl">
            Display your NotARobot verification on your website, LinkedIn, resume, or portfolio. 
            Show the world you're certified human.
          </p>
        </motion.div>

        {/* Badge Preview */}
        <div className="mb-12">
          <h2 className="text-lg font-bold mb-4">Preview</h2>
          <div className={`p-12 rounded-2xl border ${selectedStyle === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} flex items-center justify-center`}>
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                selectedStyle === 'dark' 
                  ? 'bg-black border-accent/30 text-white' 
                  : 'bg-white border-green-500/30 text-black'
              }`}
              style={{ 
                width: sizes[selectedSize].width, 
                height: sizes[selectedSize].height,
                fontSize: selectedSize === 'small' ? '10px' : selectedSize === 'medium' ? '12px' : '14px'
              }}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                selectedStyle === 'dark' ? 'bg-green-500' : 'bg-green-500'
              }`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <div className="font-bold leading-tight">Verified Human</div>
                <div className={`text-xs ${selectedStyle === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  notarobot.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Style</h3>
            <div className="flex gap-2">
              <Button
                variant={selectedStyle === 'dark' ? 'default' : 'outline'}
                onClick={() => setSelectedStyle('dark')}
                className="flex-1"
              >
                Dark
              </Button>
              <Button
                variant={selectedStyle === 'light' ? 'default' : 'outline'}
                onClick={() => setSelectedStyle('light')}
                className="flex-1"
              >
                Light
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Size</h3>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                  className="flex-1 capitalize"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Embed Codes */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold">Embed Code</h2>
          
          {Object.entries(embedCodes).map(([type, code]) => (
            <div key={type} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950">
                <span className="text-sm font-mono text-gray-400 uppercase">{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(type, code)}
                  className="gap-2"
                >
                  {copied === type ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            How to Use
          </h3>
          <ol className="space-y-3 text-sm text-gray-400">
            <li>1. <strong>Get Verified</strong> — Complete a resume analysis with a score above 85%</li>
            <li>2. <strong>Get Your Badge URL</strong> — Your unique verification ID will be in your dashboard</li>
            <li>3. <strong>Replace YOUR_ID</strong> — Update the embed code with your actual verification ID</li>
            <li>4. <strong>Add to Your Site</strong> — Paste the code into your website, LinkedIn summary, or portfolio</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Don't have a verification yet?</p>
          <Link href="/services/resume">
            <Button className="bg-accent text-black hover:bg-accent/90">
              Get Verified Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
