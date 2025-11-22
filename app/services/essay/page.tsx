"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search, AlertTriangle, Loader2, CheckCircle } from "lucide-react";

export default function EssayPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ ai_probability: number; verdict: string; analysis: string[]; highlight_sections?: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (!text || text.length < 50) return;

    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch("/api/essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
        alert("Something went wrong.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
           <h1 className="text-4xl font-bold">Essay Integrity Check</h1>
           <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold border border-accent/20">BETA</span>
        </div>
        
        <p className="text-gray-500 mb-8">
          Paste the text below to check for AI-generation markers, perplexity scores, and burstiness patterns common in LLMs.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Input Area */}
            <div>
                <div className="relative">
                   <textarea 
                     className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                     placeholder="Paste essay text here..."
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                   />
                   <div className="absolute bottom-4 right-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-500 hover:text-white"
                        onClick={() => { setText(""); setResult(null); }}
                      >
                        Clear
                      </Button>
                   </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                   <div className="flex gap-4 text-sm text-gray-500">
                      <span>Words: {text.split(/\s+/).filter(w => w.length > 0).length}</span>
                      <span>Char: {text.length}</span>
                   </div>
                   <Button 
                        className="gap-2 px-8" 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || text.length < 50}
                   >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                   </Button>
                </div>
            </div>

            {/* Results Area */}
            <div className="space-y-4">
                {result ? (
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 h-full">
                     <div className={`text-center p-4 rounded-lg mb-6 border ${
                         result.ai_probability > 70 ? 'bg-red-500/10 border-red-500 text-red-500' : 
                         result.ai_probability < 30 ? 'bg-green-500/10 border-green-500 text-green-500' : 
                         'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                     }`}>
                         <h2 className="text-3xl font-bold mb-1">{result.verdict}</h2>
                         <p className="font-mono text-sm">AI PROBABILITY: {result.ai_probability}%</p>
                     </div>

                     <div className="space-y-4">
                         <div>
                            <h3 className="font-bold text-gray-400 mb-2 text-sm uppercase tracking-wider">Analysis</h3>
                            <ul className="space-y-2">
                                {result.analysis?.map((point, i) => (
                                    <li key={i} className="flex gap-2 text-sm bg-black/20 p-2 rounded">
                                        <AlertTriangle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                         </div>

                         {result.highlight_sections && result.highlight_sections.length > 0 && (
                             <div>
                                <h3 className="font-bold text-gray-400 mb-2 text-sm uppercase tracking-wider">Suspicious Patterns</h3>
                                <div className="space-y-2">
                                    {result.highlight_sections.map((section, i) => (
                                        <div key={i} className="text-sm p-3 bg-red-500/5 border-l-2 border-red-500 italic text-gray-400">
                                            "{section}"
                                        </div>
                                    ))}
                                </div>
                             </div>
                         )}
                     </div>
                  </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 p-8 text-center min-h-[400px]">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p>Results will appear here.</p>
                   </div>
                )}
            </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
           <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
           <div>
              <h4 className="font-bold text-yellow-500 text-sm">Disclaimer</h4>
              <p className="text-xs text-yellow-200/70 mt-1">
                 AI detection is probabilistic, not deterministic. This tool should be used as an indicator, not absolute proof. 
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
