"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    id?: string;
    analysis: string;
    rewritten_text: string;
    human_score?: number;
    ai_probability?: number;
    verdict?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<{ type: 'visitor' | 'pro', credits?: number, visitorUsage?: number }>({ type: 'visitor' });
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
        setUserStatus({ type: 'pro', credits: profile?.credits || 0 });
      } else {
        // Check visitor cookie client-side or just assume visitor for now
        // Note: Actual enforcement is on backend, this is just for UI
        const match = document.cookie.match(new RegExp('(^| )visitor_usage=([^;]+)'));
        const usage = match ? parseInt(match[2]) : 0;
        setUserStatus({ type: 'visitor', visitorUsage: usage });
      }
    };
    checkStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        // Update local status optimistically
        if (userStatus.type === 'pro' && userStatus.credits) {
          setUserStatus(prev => ({ ...prev, credits: (prev.credits || 0) - 1 }));
        } else if (userStatus.type === 'visitor') {
          setUserStatus(prev => ({ ...prev, visitorUsage: (prev.visitorUsage || 0) + 1 }));
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.rewritten_text) {
      navigator.clipboard.writeText(result.rewritten_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!result?.id) return;

    setShareLoading(true);
    try {
      const supabase = createClient();
      // Make public
      const { error } = await supabase
        .from('saved_results')
        .update({ is_public: true })
        .eq('id', result.id);

      if (error) throw error;

      // Copy link
      const url = `${window.location.origin}/verify/${result.id}`;
      navigator.clipboard.writeText(url);
      alert("Verification link copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate share link. Please try again.");
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow-sm">
            <div className={`w-2 h-2 rounded-full ${userStatus.type === 'pro' ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="text-sm font-medium">
              {userStatus.type === 'pro'
                ? `Pro Member (${userStatus.credits} Credits)`
                : `Visitor Mode (${Math.max(0, 2 - (userStatus.visitorUsage || 0))} uses left)`}
            </span>
          </div>
        </div>

        <div className="text-center mb-16 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
          >
            Resume Sanitizer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Transform your resume from "AI-generated" to "Human-crafted". We remove the buzzwords and restore the authenticity.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative overflow-hidden
                ${file ? 'border-primary/50 bg-primary/5' : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
            `}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Drop your resume PDF here</h3>
                    <p className="text-sm text-gray-500">Max file size: 5MB</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{file.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button variant="outline" size="sm" className="relative z-20">
                      Change File
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
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleAnalyze}
              disabled={!file || isUploading}
              className="w-full mt-6 py-8 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Resume...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Humanize My Resume</span>
                </div>
              )}
            </Button>
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
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold">
                        <CheckCircle className="w-5 h-5" /> Analysis Complete
                      </div>
                      {result.human_score && result.human_score > 85 && (
                        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                          <CheckCircle className="w-4 h-4" /> NotARobot Verified™
                        </div>
                      )}
                    </div>

                    {/* Score Card */}
                    {result.human_score !== undefined && (
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                          <div className="text-sm text-gray-500 mb-1">Human Score</div>
                          <div className={`text-3xl font-bold ${result.human_score > 80 ? 'text-green-500' : result.human_score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {result.human_score}%
                          </div>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                          <div className="text-sm text-gray-500 mb-1">AI Probability</div>
                          <div className="text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                            {result.ai_probability}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Share Button */}
                    {result.id && result.human_score && result.human_score > 85 && (
                      <div className="mb-6">
                        <Button
                          onClick={handleShare}
                          disabled={shareLoading}
                          className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                        >
                          {shareLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                          Share Verification Certificate
                        </Button>
                      </div>
                    )}

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2">AI Detection Analysis</h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 italic leading-relaxed">"{result.analysis}"</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">Humanized Version</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="gap-2 text-xs"
                      >
                        {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Text"}
                      </Button>
                    </div>
                    <div className="bg-zinc-50 dark:bg-black/40 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-[500px] overflow-y-auto font-serif leading-relaxed text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap text-sm shadow-inner">
                      {result.rewritten_text}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Waiting for Resume</h3>
                  <p className="text-sm max-w-xs mx-auto">Upload your resume on the left to see the AI analysis and humanized version here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
