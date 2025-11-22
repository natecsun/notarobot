import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function EssayPage() {
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

        <div className="relative">
           <textarea 
             className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
             placeholder="Paste essay text here..."
             defaultValue="In conclusion, it is evident that the socio-economic factors contributing to the decline of the Roman Empire were multifaceted. Firstly, the inflation of the currency..."
           />
           <div className="absolute bottom-4 right-4">
              <Button size="sm" variant="ghost" className="text-gray-500">Clear</Button>
           </div>
        </div>

        <div className="flex justify-between items-center mt-6">
           <div className="flex gap-4 text-sm text-gray-500">
              <span>Words: 324</span>
              <span>Char: 1,892</span>
           </div>
           <Button className="gap-2 px-8">
              <Search className="w-4 h-4" /> Analyze Text
           </Button>
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
