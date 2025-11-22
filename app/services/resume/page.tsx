"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle } from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ analysis: string; rewritten_text: string } | null>(null);
  const [tier, setTier] = useState<'free' | 'paid'>('free');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Reset previous results
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tier", tier);

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <Link href="/">
                <Button variant="ghost" className="gap-2 pl-0">
                <ArrowLeft className="w-4 h-4" /> Back to Home
                </Button>
            </Link>
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button 
                    onClick={() => setTier('free')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${tier === 'free' ? 'bg-white dark:bg-black shadow text-black dark:text-white font-bold' : 'text-gray-500'}`}
                >
                    Free
                </button>
                <button 
                    onClick={() => setTier('paid')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${tier === 'paid' ? 'bg-accent text-black font-bold shadow' : 'text-gray-500'}`}
                >
                    Pro
                </button>
            </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Resume Sanitizer</h1>
        <p className="text-gray-500 mb-12">
          Upload your resume PDF. We will analyze the text patterns, sentence structures, and vocabulary to detect "AI-speak" and suggest more human alternatives.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:bg-zinc-900/50 transition-colors relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                {file ? file.name : "Drop your resume here"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">Supports PDF (Max 5MB)</p>
              <Button variant={file ? "outline" : "default"} className="pointer-events-none">
                {file ? "Change File" : "Select File"}
              </Button>
            </div>

            {file && (
              <div className="mt-4">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isUploading} 
                  className="w-full py-6 text-lg gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" /> Humanize My Resume
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-2 mb-4 text-green-500 font-bold">
                    <CheckCircle className="w-5 h-5" /> Analysis Complete
                 </div>
                 
                 <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-yellow-600 mb-1">AI Detection Analysis</h4>
                    <p className="text-sm italic text-yellow-700 dark:text-yellow-400">"{result.analysis}"</p>
                 </div>

                 <div>
                    <h4 className="font-bold mb-2 flex items-center justify-between">
                       <span>Humanized Version</span>
                       <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Optimized</span>
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-serif leading-relaxed bg-zinc-50 dark:bg-black/20 p-4 rounded border border-zinc-200 dark:border-zinc-800 h-[400px] overflow-y-auto">
                       {result.rewritten_text}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-8 text-center min-h-[300px]">
                 <FileText className="w-12 h-12 mb-4 opacity-20" />
                 <p>Upload a file to see the magic happen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
