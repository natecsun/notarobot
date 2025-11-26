"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Upload, Image as ImageIcon, Loader2, CheckCircle, Download, AlertCircle, Shield, Eye, MapPin, EyeOff, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function PhotoSecurityPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    original_url?: string;
    sanitized_url?: string;
    sanitized_base64?: string;
    detected_items: string[];
    modifications_made: string[];
    safety_score: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<{ type: 'visitor' | 'pro', credits?: number, hasPhotoPurchase?: boolean }>({ type: 'visitor' });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits, subscription_tier')
          .eq('id', user.id)
          .single();
        
        const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'enterprise';
        setUserStatus({ 
          type: isPro ? 'pro' : 'visitor', 
          credits: profile?.credits || 0,
          hasPhotoPurchase: isPro
        });
      } else {
        setUserStatus({ type: 'visitor' });
      }
    };
    checkStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please upload an image file (JPG, PNG, etc.)");
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB");
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    // Check if user can process
    if (userStatus.type === 'visitor') {
      setShowPayment(true);
      return;
    }

    if (userStatus.type === 'pro' && (userStatus.credits || 0) < 5) {
      setError("Insufficient credits. Photo security requires 5 credits.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/photo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        // Update credits optimistically
        if (userStatus.type === 'pro' && userStatus.credits) {
          setUserStatus(prev => ({ ...prev, credits: (prev.credits || 0) - 5 }));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOneTimePurchase = async () => {
    setPaymentLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'photo_security',
          returnUrl: window.location.href
        })
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Unable to process payment');
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const downloadImage = () => {
    if (result?.sanitized_base64) {
      const link = document.createElement('a');
      link.href = result.sanitized_base64;
      link.download = `secure_${file?.name || 'photo'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const dragHandler = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setResult(null);
        setError(null);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setError("Please drop an image file");
      }
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-full shadow-sm">
            <div className={`w-2 h-2 rounded-full ${userStatus.type === 'pro' ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className="text-sm font-medium text-gray-100">
              {userStatus.type === 'pro'
                ? `Pro Member (${userStatus.credits} Credits)`
                : 'Pay Per Use'}
            </span>
          </div>
        </div>

        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono mb-4"
          >
            <Shield className="w-3 h-3" /> NEW SERVICE — ANTI-SURVEILLANCE TECH
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
          >
            Anti AI Spy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            AI can now geo-locate you from the tiniest background clues in your photos. 
            Street signs, power lines, vegetation, architecture — all traceable. We neutralize these threats.
          </motion.p>
        </div>

        {/* Warning Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-red-400">Why You Need This</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                  <span>AI models like GeoGuessr bots can identify locations from power line styles, vegetation patterns, and road markings</span>
                </div>
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                  <span>Reflections in windows and glasses can reveal your exact position and surroundings</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                  <span>Metadata and visual cues combined can pinpoint your home, workplace, or daily routes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative overflow-hidden
                ${file ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50'}
              `}
              onDragOver={dragHandler}
              onDragEnter={dragHandler}
              onDragLeave={dragHandler}
              onDrop={dropHandler}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Upload photo"
                title="Upload photo"
              />

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Drop your photo here</h3>
                    <p className="text-sm text-gray-500">JPG, PNG, WEBP • Max 10MB</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    {preview && (
                      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 text-white text-xs font-mono rounded">
                          ORIGINAL — UNSAFE
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-red-400">{file.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="relative z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change Photo
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full mt-6 py-8 text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing... (30-60 seconds)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5" />
                  <span>Secure My Photo</span>
                </div>
              )}
            </Button>

            {/* Processing steps indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="text-gray-400">Uploading image...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Loader2 className="w-3 h-3 text-orange-400 animate-spin" />
                    </div>
                    <span className="text-gray-300">Analyzing for location markers...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    </div>
                    <span>Applying AI image modifications...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    </div>
                    <span>Generating secured photo...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pricing info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              {userStatus.type === 'pro' ? (
                <span>Uses 5 credits per photo</span>
              ) : (
                <span>$3.99 per photo or included with Pro subscription</span>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-zinc-800 bg-green-500/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-green-500 font-bold">
                        <CheckCircle className="w-5 h-5" /> Photo Secured
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                        <Shield className="w-4 h-4" /> Safety Score: {result.safety_score}%
                      </div>
                    </div>

                    {/* Secured Image Preview */}
                    {result.sanitized_base64 && (
                      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
                        <img 
                          src={result.sanitized_base64} 
                          alt="Secured" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/80 text-white text-xs font-mono rounded">
                          SECURED — SAFE TO SHARE
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={downloadImage}
                      className="w-full bg-green-600 hover:bg-green-500"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Secured Photo
                    </Button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Detected Items */}
                    <div>
                      <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Location Markers Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.detected_items.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Modifications Made */}
                    <div>
                      <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Security Modifications</h4>
                      <ul className="space-y-2">
                        {result.modifications_made.map((mod, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {mod}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/70 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-100 mb-2">Waiting for Photo</h3>
                  <p className="text-sm max-w-xs mx-auto text-gray-500">Upload your photo on the left to see AI-detected location markers and receive a secured version.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowPayment(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Secure Your Photo</h3>
                  <p className="text-gray-400">Protect your location privacy from AI surveillance</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">One-Time Purchase</span>
                      <span className="text-2xl font-bold">$3.99</span>
                    </div>
                    <p className="text-sm text-gray-400">Process this single photo</p>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                      onClick={handleOneTimePurchase}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      Pay $3.99
                    </Button>
                  </div>

                  <div className="text-center text-gray-500 text-sm">or</div>

                  <Link href="/pricing" className="block">
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-accent">Pro Subscription</span>
                        <span className="text-xl font-bold text-accent">$29/mo</span>
                      </div>
                      <p className="text-sm text-gray-400">Unlimited photo security + all other services</p>
                    </div>
                  </Link>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
